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
            <header className='headr-main'>
                <nav 
                    className={`nav-main-container ${toggleMenu ? 'nav-full' : 'nav-half'}`}
                >
                    <div className='nav-logo-box-main'>
                        <div>
                            <MenuBtn />
                        </div>
                        
                        <div>
                            <h1 id='top'>Mazon <span><IoPowerSharp className='power-icon' />nline</span></h1>
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