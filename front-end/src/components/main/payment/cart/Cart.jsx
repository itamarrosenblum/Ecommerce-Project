import './Cart.css';
import './CartQueries.css'
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'cloudinary-react';
import Search from './search/Search';

const Cart = () => {
    const [productNum, setProductNum] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const cartSummery = useSelector(state => state.getCartSummery);
    const refetch = useSelector(state => state.getRefetchCartSummery);
    const dispatch = useDispatch();
    const axios = require('axios');

    useEffect(() => { // Fetch cart
        (async () => {
            try {
                const res = await axios.post('http://localhost:3001/cart',
                {token: localStorage.getItem('token')});

                const totalPrice = () => {
                    let total = 0;
                    res.data.isCart.products.forEach(e => {
                        total+= Number(e.productCart.price);
                      });
                 return total.toFixed(2);
                }
                setProductNum(res.data.isCart.products.length);
                setSubTotal(totalPrice);
                dispatch({type: 'SET_CART_SUMMERY', cartSummery: res.data.isCart.products});
                dispatch({type: 'SET_CART_ID', cartId: res.data.isCart.id});
        } catch (err) {
            console.error(err);
        }
    })();
    }, [dispatch, refetch, axios]);

    return (
        <div className='payment-cart-container'>
                <h2>Cart Summary</h2>
            <Search />
            <div className='payment-cart-box'>
            <div className='cart-cntainer'>
                {cartSummery.map(e => {
                return(
                    <div key={e.id} className='product-card'>
                        <div className='img-data'>
                            <figure className='img-box'>
                                <Image 
                                    cloudName='itamarrosenblum'
                                    publicId={e.img} 
                                />
                            </figure>
                            <p>{e.name}</p>
                        </div>

                        <div className='right-box'>
                            <p>Total amount: <span>$</span>{e.productCart.price}</p>
                            <p>Quantity: {e.productCart.quantity}</p>
                        </div>
                    </div>
                );
                })}
            </div>

            <div className='total-price-box'>
                <p>Subtotal: <span>$</span>{subTotal}</p>
                <p>{productNum} Products</p>
            </div>
            </div>
        </div>
    );
}

export default Cart;