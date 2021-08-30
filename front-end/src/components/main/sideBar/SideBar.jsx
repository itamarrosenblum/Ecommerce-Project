import './SideBar.css';
import './SideBarQueries.css';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { IoTrashOutline } from 'react-icons/io5';
import ShoppingList from './shoppingList/ShoppingList';
import MenuBtn from './menuBtn/MenuBtn';
import LogOutBtn from './logOutBtn/LogOutBtn';
import CheckoutBtn from './checkoutBtn/CheckoutBtn';

const SideBar = () => {
    const toggleMenu = useSelector(state => state.getToggleMenu);
    const productCart = useSelector(state => state.getProductCart);
    const openCart = useSelector(state => state.getOpenCart);
    const deleteCart = useSelector(state => state.getDeleteCart);
    const dispatch = useDispatch();
    const axios = require('axios');

    const clearCart = async () => { // Remove all cart products
        try {
            await axios.delete('http://localhost:3001/productCart', 
            {data: {shoppingCartId: openCart, request: 'all'}});

            dispatch({type: 'SET_REFETCH_CART', refetchCart: Math.random() * 2});
            dispatch({type: 'SET_DELETE_CART', deleteCart: false });
            dispatch({type: 'SET_DISABLED_BG', disabledBg: false });
        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <aside 
            className={`sidebar-container 
            ${toggleMenu ? 'sidebar-hide' : 'sidebar-show'}`} 
        >
            <ul className='sidebar-first-nav'>
                <li><MenuBtn /></li>

                <li><LogOutBtn /></li>
            </ul>
            
            <div className='cart-box'>
                {deleteCart === false ? <div>
                 <div className='header-sidebar'>
                        <h3>Your Cart</h3>
                        { productCart.length > 0 ?
                        <button
                        onClick={() => {
                            dispatch({type: 'SET_DISABLED_BG', disabledBg: true });
                            dispatch({type: 'SET_DELETE_CART', deleteCart: true });
                        }}
                        >
                            <span><IoTrashOutline /></span>
                        </button>
                        : 
                        null }
                    </div>

                    <div className='cart-wraper'>
                        { productCart.length > 0 && <ShoppingList /> }

                        { productCart.length <= 0 && <div className='empty-box'>
                            <p>Your Cart is Empty ):</p>
                        </div>  }
                    </div>

                    <div className='action-box'>
                        <CheckoutBtn />
                    </div>
                </div> 
                : 
                <div className='delete-modal'>
                    <div className='header-sidebar'>
                        <h3>Confirm Deleting Cart</h3>
                    </div>

                    <div className='modal-wraper'>
                        <p>Are you sure?</p>
                        <p>You've chosen to delete the products from your cart.</p>
                        
                        <div className='btn-box'>
                            <button
                                onClick={() => {
                                    dispatch({type: 'SET_DISABLED_BG', disabledBg: false });
                                    dispatch({type: 'SET_DELETE_CART', deleteCart: false });
                                }}
                            >
                                <span>Cancel</span>
                            </button>

                            <button onClick={clearCart}>
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
                }
            </div>  
        </aside>
    );
}

export default SideBar;