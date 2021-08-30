import './MenuBtn.css';
import './MenuBtnQueries.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';

const MenuBtn = () => {
    const toggleMenu = useSelector(state => state.getToggleMenu);
    const dispatch = useDispatch();

    return (
        <div className='menu-btn-box'>
            <button 
                className='menu-btn' 
                onClick={() => {
                    if (toggleMenu) {
                        dispatch({type: 'SET_TOGGLE_MENU', toggleMenu: false}) 
                    } else {
                        dispatch({type: 'SET_TOGGLE_MENU', toggleMenu: true});
                        dispatch({type: 'SET_DISABLED_BG', disabledBg: false });
                        dispatch({type: 'SET_DELETE_CART', deleteCart: false });
                    }
                }}
                >
                { toggleMenu ?
                <IoMenuOutline className='hamburger-icon' />
                : <IoCloseOutline className='hamburger-icon' /> }    
            </button>
        </div>
    );
}

export default MenuBtn;