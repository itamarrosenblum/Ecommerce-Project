import './Nav.css';
import './NavQueries.css';
import React from 'react';
import { useSelector } from 'react-redux';
import { IoPowerSharp } from 'react-icons/io5';
import MenuBtn from './menuBtn/MenuBtn';
import Saerch from './search/Search';
import LogOutBtn from './logOutBtn/LogOutBtn';
import Categories from './categories/Categories';

const Nav = () => {
    const toggleMenu = useSelector(state => state.getToggleMenu);

    return (
        <header>
            <nav 
                className={`nav-container ${toggleMenu ? 'nav-full' : 'nav-half'}`}
            >
                <div className='nav-logo-box'>
                    <div>
                        <MenuBtn />
                    </div>
                    
                    <div>
                        <h1>Mazon <span><IoPowerSharp className='power-icon' />nline</span> <span>Dashboard</span></h1>
                        <LogOutBtn />
                   </div>
                </div>

                <div className='nav-utilities-box'>
                    <Saerch />
                </div>
                <Categories />
            </nav>
        </header>
    );
}

export default Nav;