import './ShoppingList.css';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'cloudinary-react';
import { IoAddOutline, IoRemoveOutline, IoRemoveCircleOutline } from 'react-icons/io5';

const ShoppingList = () => {
    const [isQuantityBtn, setIsQuantityBtn] = useState(false);
    const objProductCart = useSelector(state => state.getProductCart);
    const openCart = useSelector(state =>state.getOpenCart);
    const dispatch = useDispatch();
    const axios = require('axios');

    const incrementProductCart = async (productId, request) => { // Change product amount
        try {
            await axios.put('http://localhost:3001/productCart', 
            {shoppingCartId: openCart, productId: productId, request: request});

            dispatch({type: 'SET_REFETCH_CART', refetchCart: Math.random() * 2 });
        } catch (err) {
            console.error(err);
        }
    }

    const removeProduct = async (productId) => { // Remove single product from cart
        try {
            await axios.delete('http://localhost:3001/productCart', 
            {data: {shoppingCartId: openCart, productId: productId, request: 'one'}});

            dispatch({type: 'SET_REFETCH_CART', refetchCart: Math.random() * 2 });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {objProductCart.map(e => {
                return(
                    <div className='sidebar-product-card' key={e.productCart.productId}>
                        <div>
                            <figure className='img-box'>
                                <Image 
                                    cloudName='itamarrosenblum'
                                    publicId={e.img} 
                                />
                            </figure>
                        </div>

                        <div className='middle-box'>
                            <div className='product-name-box'>
                                <h3>{e.name}</h3>
                            </div>

                            <div className='price-box'>
                                <p><span>$</span>{e.productCart.price}</p>
                            </div>
                        </div>

                        <div className='right-box'>
                            <div className='delete-box'>
                                <button 
                                onClick={() => removeProduct(e.productCart.productId)}
                                className='delete-btn'
                                >
                                    <span><IoRemoveCircleOutline /></span>
                                </button>
                            </div>

                            <div className='quantity-box'>
                                <div>
                                { isQuantityBtn === e.id ?
                                <button
                                className='quantity-action-btn'
                                onClick={() => incrementProductCart(e.id, 'reduce')}
                                >
                                    <span><IoRemoveOutline /></span>
                                </button> : null}

                                <div>
                                    <button 
                                    className='quantity-btn'
                                    onClick={() => {
                                        if (isQuantityBtn !== e.id) {
                                            setIsQuantityBtn(e.id)
                                        } else {
                                            setIsQuantityBtn(false)
                                        }
                                    }}
                                    >
                                        {e.productCart.quantity}
                                    </button>
                                </div>
                                
                                { isQuantityBtn === e.id ? 
                                <button 
                                className='quantity-action-btn'
                                onClick={() => incrementProductCart(e.id, 'increment')}
                                >
                                <span><IoAddOutline /></span>
                                </button> : null }
                                </div>
                            </div> 
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default ShoppingList;