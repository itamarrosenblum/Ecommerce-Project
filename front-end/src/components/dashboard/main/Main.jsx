import './Main.css';
import './MainQueries.css';
import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Products from './products/Products';

const Main = () => {
    const toggleMenu = useSelector(state => state.getToggleMenu);
    const location = useLocation();

    return (
        <Switch>
            <Route path={location.pathname}>
                <main className={`main-dash-container ${toggleMenu ? 'main-dash-full' : 'main-dash-half'}`}>
                    <Products />
                </main>
            </Route>
        </Switch>
    );
}

export default Main;