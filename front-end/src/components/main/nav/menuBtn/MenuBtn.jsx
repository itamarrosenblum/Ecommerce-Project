import './MenuBtn.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoCartOutline } from 'react-icons/io5';
import { VscChevronLeft } from 'react-icons/vsc';


const MenuBtn = () => {
    const toggleMenu = useSelector(state => state.getToggleMenu);
    const objProductCart = useSelector(state => state.getProductCart);
    const dispatch = useDispatch();

    return (
        <>  
            <button 
                className='menu-btn' 
                onClick={() => toggleMenu ? 
                    dispatch({type: 'SET_TOGGLE_MENU', toggleMenu: false}) 
                    :
                    dispatch({type: 'SET_TOGGLE_MENU', toggleMenu: true})}
                >
                { toggleMenu ?
                <span className='hamburger-box'>
                    { objProductCart.length > 0 ?
                        <span className='product-counter'>  {objProductCart.length}
                        </span> : null }
                    <IoCartOutline className='cart-icon'/>
                </span>
                :
                <VscChevronLeft className='back-icon' /> }   

            
            </button>
        </>
    );
}

export default MenuBtn;