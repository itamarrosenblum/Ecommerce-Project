const { Sequelize, Model, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize(
    'shoppingOnline', 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
})();

class User extends Model {} // Users table
User.init({
  userId: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  token: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  city: DataTypes.STRING,
  street: DataTypes.STRING,
  role: DataTypes.STRING,
}, { sequelize, modelName: 'user' });

class Category extends Model {} // Categories table
Category.init({
  name: DataTypes.STRING
}, { sequelize, modelName: 'category' });

class Product extends Model {} // Products table
Product.init({
  name: DataTypes.STRING,
  price: DataTypes.STRING,
  img: DataTypes.STRING,
}, { sequelize, modelName: 'product' });

Category.hasMany(Product , {
  foreignKey: 'categoryId'
});
Product.belongsTo(Category, {
  foreignKey: 'categoryId'
});

class ShoppingCart extends Model {} // Shopping Cart table
ShoppingCart.init({
}, { sequelize, modelName: 'shoppingCart' });

User.hasMany(ShoppingCart , {
  foreignKey: 'userId'
});
ShoppingCart.belongsTo(User, {
  foreignKey: 'userId'
});

class ProductCart extends Model {} // Product Cart table
ProductCart.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: DataTypes.INTEGER,
  price: DataTypes.STRING,
}, { sequelize, modelName: 'productCart' });

Product.belongsToMany(ShoppingCart, { 
  through: ProductCart
});
ShoppingCart.belongsToMany(Product, { 
  through: ProductCart
});

sequelize.sync()

class Order extends Model {} // Orders table
Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  city: DataTypes.STRING,
  street: DataTypes.STRING,
  deliveryDate: DataTypes.STRING,
  creditCardNumber: DataTypes.STRING
}, { sequelize, modelName: 'order' });

User.belongsToMany(ShoppingCart, { 
  through: Order,
  foreignKey: 'userId'
});
ShoppingCart.belongsToMany(User, { 
  through: Order
});

module.exports = { User, Category, Product, ShoppingCart, ProductCart, Order, Op, Model }