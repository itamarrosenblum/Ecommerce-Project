const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));

require('dotenv').config();
const { User, Category, Product, ShoppingCart, ProductCart, Order, Op, Model } = require('./database');
const { cloudinary } = require('./cloudinary');
const { sendMail } = require('./mailer');

app.use(async (req, res, next) => { // Main middleware
    try {
        const { id, email, password } = req.body;
        if (req.method === 'POST') { // Post requests
            if (req.path === '/session') {
                const isUser = await User.findOne({
                    attributes: [
                        'firstName',
                        'lastName',
                        'email', 
                        'token', 
                        'role'
                    ],
                    where: { email: email, password: password }
                });
                
                if (isUser) {
                    req.body.token = isUser.token;
                    req.body.role = isUser.role;
                    req.body.firstName = isUser.firstName;
                    req.body.lastName = isUser.lastName;
                    next();
                } else {
                    res.send({ status: '401', data: 'Incorrect email address or password' });
                }
            } else if (req.path === '/users') {
                const isEmail = await User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                });

                const isId = await User.findOne({
                    attributes: ['userId'],
                    where: { userId: id }
                });

                if (isEmail || isId) {
                    res.send({ status: '409', data: isEmail ? 'Email already exist' : 'Id already exist' });
                } else {
                    next();
                }
            } else if (req.path === '/user') {
                req.body.role = 'member';
                req.body.token = Math.random().toString(36).substr(2);
                next();
            } else if (req.path === '/product') {
                next();
            }  else if (req.path === '/stock') {
                    const isProduct = await Product.findAll({
                        attributes: ['id', 'name', 'price', 'img', 'categoryId'],
                        where: { name: { [Op.substring]: req.body.productName } }
                    });
                    
                    if (Array.isArray(isProduct) && isProduct.length > 0) {
                        req.body.result = isProduct;
                        next();
                    } else {
                        res.send({ status: '400', data: `Your search - '${req.body.productName}' - didn't match any product.` });
                    }
            } else if (req.path === '/category') {
                const isCategory = await Category.findOne({
                    attributes: ['name'],
                    where: { name: req.body.newCategory }
                });

                if (isCategory) {
                    res.send({ status: '400', data: `Category '${req.body.newCategory}' already exist` });
                } else {
                    next();
                }
            } else if (req.path === '/cart') {
                const isUser = await User.findOne({
                    attributes: ['userId'],
                    where: { token: req.body.token }
                });
                

                const isShoppingCart = await ShoppingCart.findAll({
                    attributes: ['id', 'userId'],
                    where: { userId: isUser.userId },
                    raw: true
                });

                const isOrder = await Order.findAll({
                    attributes: ['shoppingCartId', 'userId'],
                    where: { userId: isUser.userId },
                    raw: true
                }); 

               const foundOpenCart = isShoppingCart.find(({id: id1}) => !isOrder.some(({ shoppingCartId: id2 }) => id1 === id2));

               if (isShoppingCart.length === 0 || !foundOpenCart) {
                    req.body.userId = isUser.userId;
                    next();
                } else if (foundOpenCart) {
                    const isCart = await ShoppingCart.findAll({
                        attributes: ['id'],
                        where: { 
                            id: foundOpenCart.id 
                        },
                        include: {
                            attributes: ['id', 'img', 'name'],
                            model: Product
                        }
                    }); 

                    res.send({ status: '409', isCart: isCart[0] });
                }
            } else if (req.path === '/productCart') {
                next();
            } else if (req.path === '/currentSession') {
                const isUser = await User.findOne({
                    attributes: ['token', 'role', 'firstName', 'lastName'],
                    where: { token: req.body.token }
                });

                if (isUser) {
                    req.body.role = isUser.role
                    req.body.firstName = isUser.firstName
                    req.body.lastName = isUser.lastName
                    next()
                } else {
                    res.send({ status: '409', data: 'Something went wrong' });
                }
            } else if (req.path === '/address') { 
                const isUser = await User.findOne({
                    attributes: ['token', 'city', 'street'],
                    where: { token: req.body.token }
                });

                if (isUser) {
                    req.body.city = isUser.city
                    req.body.street = isUser.street
                    next();
                } else {
                    res.send({ status: '409', data: 'Something went wrong' });
                }
            } else if (req.path === '/order') {
                const isUser = await User.findOne({
                    attributes: ['token', 'userId'],
                    where: { token: req.body.token }
                });

                const isShoppingCart = await ShoppingCart.findOne({ 
                    attributes: ['id', 'userId'],  
                    where: {
                        id: req.body.shoppingCartId,
                        userId: isUser.userId
                    }
                });

                if (isUser && isShoppingCart) {
                    const placeOrder = await Order.create({
                        city: req.body.city,
                        street: req.body.street,
                        deliveryDate: req.body.deliveryDate,
                        creditCardNumber: req.body.creditCardNumber,
                        userId: isUser.userId,
                        shoppingCartId: req.body.shoppingCartId
                        });
                    req.body.orderId = placeOrder.toJSON().id
                    next()
                } else {
                    res.send({ status: '409', data: 'Something went wrong' });
                }
                
            }
        } else if (req.method === 'GET') { // Get requests
            next();
        } else if (req.method === 'PUT') { // Put requests
            if (req.path === '/category') {
                const { newCategoryName } = req.body;
                const isCategory = await Category.findOne({ where: { name: newCategoryName }});
        
                if (isCategory) {
                    res.send({ status: '409', data: `Category '${newCategoryName}' already exist` });
                } else {
                    next();
                }
            } else if (req.path === '/product') {
                next();
            } else if (req.path === '/session') {
                const isUser = await User.findOne({ where: { email: req.body.email }});

                if (isUser && isUser.role === 'member') {
                    const tempPass = Math.random().toString(36).substring(6);

                    isUser.password = tempPass;
                    await isUser.save();

                    req.body.fullName = `${isUser.firstName} ${isUser.lastName}`
                    req.body.password = tempPass;
                    next();
                } else {
                    res.send({ status: '400' });
                }
            } else if (req.path === '/productCart') {
                const { shoppingCartId, productId, request, price } = req.body;
                const isProductCart = await ProductCart.findOne({ where: { 
                    productId: productId,
                    shoppingCartId: shoppingCartId
                }});

                const isProduct = await Product.findOne({
                    attributes: ['id', 'price'],
                    where: { id: productId }
                });

                if (isProductCart && request === 'increment') {
                    isProductCart.quantity = isProductCart.quantity + 1
                    const result = isProductCart.quantity * isProduct.price;
                    isProductCart.price = result.toFixed(2);
                    await isProductCart.save();
                } else if (isProductCart && request === 'reduce') {
                    if (isProductCart.quantity > 1) {
                        isProductCart.quantity = isProductCart.quantity - 1
                        const result = isProductCart.quantity * isProduct.price;
                        isProductCart.price = result.toFixed(2);
                        await isProductCart.save();
                    } else if (isProductCart.quantity === 1) {
                        await isProductCart.destroy();
                    }
                }
                res.send({ status: '400' });
            }
        } else if (req.method === 'DELETE') { // Get requests
            if (req.path === '/productCart') {
                const {shoppingCartId, productId, request } = req.body;
                const isProductCart = await ProductCart.findAll({ where: { 
                    shoppingCartId: shoppingCartId,
                }});
                
                if (isProductCart.length > 0 && request === 'all') {
                    await ProductCart.destroy({
                        where: { 
                            shoppingCartId: shoppingCartId
                        }
                    });
                    next()
                } else if (isProductCart.length > 0 && request === 'one') {
                    await ProductCart.destroy({
                        where: { 
                            productId: productId,
                            shoppingCartId: shoppingCartId
                        }
                    });
                    next()
                } else {
                    res.send({ status: '400', data: 'No products found' });
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
});

app.post('/session', (req, res) => { // Log in request
    const { token, role, firstName, lastName } = req.body;
    res.send({ status: '200', token, role, firstName, lastName });
});

app.put('/session', (req, res) => { // Reset password request
    const {email, fullName, password} = req.body;
    sendMail(email, fullName, password);
    res.send({ status: '200' });
});

app.post('/currentSession', (req, res) => { // Reset password request
    const {token, role, firstName, lastName} = req.body;
    res.send({ status: '200', data: {token, role, firstName, lastName} });
});

app.post('/users', async (req, res) => { // Registration verfication
    res.send({ status: '200' });
});

app.post('/user', async (req, res) => { // Sign up request
    const { id, email, password, fname, lname, city, street, role, token } = req.body;

    await User.create({
        userId: id,
        email: email,
        password: password,
        firstName: fname,
        lastName: lname,
        city: city,
        street: street,
        role: role,
        token: token
      });

    res.send({ status: '200' });
});

app.get('/categories', async (req, res) => { // Send all categories
    try {
        const arr = await Category.findAll({
            attributes: ['id', 'name']
        });

        res.send({ status: '200', data: arr });
    } catch (err) {
        console.error(err);
    }
});

app.get('/dates', async (req, res) => { // Send busy dates
    try {
        const arrOrder = await Order.findAll({
            attributes: ['deliveryDate'],
            raw: true
        });

        function foundDates() {
            let arr = [];
            arrOrder.forEach(e => {
                arr.push(e.deliveryDate);
            });
            
            return arr.filter((a, index) =>
              arr.indexOf(a) === index &&
              arr.reduce((acc, b) => +(a === b) + acc, 0) >= 3
            );
          }

        res.send({ status: '200', data: foundDates() });
    } catch (err) {
        console.error(err);
    }
});

app.get('/category', async (req, res) => { // Get first category
    try {
        const arr = await Category.findOne({
            attributes: ['id', 'name']
        });

        res.send({ status: '200', category: arr });
    } catch (err) {
        console.error(err);
    }
});

app.post('/category', async (req, res) => { // Create new category
    try {

        const isCategory = await Category.create({ name: req.body.newCategory });

        const arr = await Category.findAll({
            attributes: ['id', 'name']
        });

        res.send({ status: '200', categories: arr, category: isCategory.id });
    } catch (err) {
        console.error(err);
    }
});

app.post('/product', async (req, res) => { // Add new product
    const { productName, category, price, img } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(
        img, { upload_preset: 'vacationProject' }
    );

    await Product.create({
        name: productName,
        categoryId: category,
        price: price,
        img: uploadResponse.public_id
    });

    res.send({ status: '200' });
});

app.put('/product', async (req, res) => { // Edit product
    try {
        const { id, name, categoryId, price, img } = req.body;
        const isProduct = await Product.findOne({where: {id: id}});

        if (isProduct) {
            const arrKey = Object.keys(req.body);
            const isCategory = categoryId ? await Category.findOne({where: {name: categoryId}}) : null;
            const uploadResponse = img ? await cloudinary.uploader.upload(img, { upload_preset: 'shoppingProject'}) : null;
            
            arrKey.forEach(key => {
                if (key === 'name') {
                    isProduct[key] = name;
                } else if (key === 'categoryId') {
                    isProduct[key] = isCategory.id
                } else if (key === 'price') {
                    isProduct[key] = price;
                } else if (key === 'img') {
                    isProduct.img = uploadResponse.public_id;
                }
            });
            await isProduct.save();
        }
        res.send({ status: '200' });
    } catch (err) {
        console.error(err);
    }
});

app.put('/category', async (req, res) => { // Edit category
    try {
        const { currentCategoryName, newCategoryName } = req.body;
        const isCategory = await Category.findOne({where: {name: currentCategoryName}});
        isCategory.name = newCategoryName
        await isCategory.save();

        res.send({ status: '200' });
    } catch (err) {
        console.error(err);
    }
});

app.get('/products/:categoryId', async (req, res) => { // Send product by id
    try {
        const arr = await Product.findAll({
            attributes: ['id', 'name', 'price', 'img', 'categoryId'],
            where: { categoryId: req.params.categoryId }
        });

        res.send({ status: '200', data: arr });
    } catch (err) {
        console.error(err);
    }
});

app.get('/statistics', async (req, res) => { // Send statistics
    try {
        const products = await Product.findAll({ attributes: ['id'] });
        const users = await User.findAll({ 
            attributes: ['role'],
            where: { role: { [Op.eq]: 'member' } }
        });
        const orders = await Order.findAll({ attributes: ['shoppingCartId'] });

        res.send({ 
            status: '200', 
            users: users ? users.length : 0, 
            orders: orders ? orders.length : 0,
            products: products ? products.length : 0 
        });
    } catch (err) {
        console.error(err);
    }
});

app.post('/stock', async (req, res) => { // Send searched products
    res.send({ status: '200', data: req.body.result });
});

app.post('/cart', async (req, res) => { // Send active cart
    try {
        const newCart = await ShoppingCart.create({ userId: req.body.userId });

        res.send({ status: '200', cartId: newCart.toJSON().id });
    } catch (err) {
        console.error(err);
    }
});

app.post('/productCart', async (req, res) => { // Add new product to cart
    try {
        const { quantity, price, productId, shoppingCartId } = req.body;
        await ProductCart.create({
            quantity: quantity,
            price: price,
            productId: productId,
            shoppingCartId: shoppingCartId
        });
        
        res.send({ status: '200' });
    } catch (err) {
        console.error(err);
    }
});

app.get('/productsCart', async (req, res) => { // Send active cart products
    try {
        const productCart = await productCart.findAll({ 
            attributes: ['id', 'quantity', 'price', 'productId', 'shoppingCartId'],
            where: { shoppingCartId: req.body.cartId }
        });

        res.send({ status: '200', arr: productCart });
    } catch (err) {
        console.error(err);
    }
});

app.put('/productCart', (req, res) => { // Add new product to cart
    res.send({ status: '200' });
});

app.post('/address', (req, res) => { // Send user shipping details
    const {city, street} = req.body;
    res.send({ status: '200', data: { city, street} });
});

app.post('/order', (req, res) => { // Set new order
    res.send({ status: '200', data: { orderId: req.body.orderId } });
});

app.delete('/productCart', (req, res) => { // Delete all products from cart
    res.send({ status: '200' });
});

app.listen(3001, () => {
    console.log('This server is listening to port 3001');
});