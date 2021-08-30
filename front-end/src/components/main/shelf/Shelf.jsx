import './Shelf.css';
import './ShelfQueries.css';
import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Products from './products/Products';

const Shelf = () => {
    const toggleMenu = useSelector(state => state.getToggleMenu);
    const location = useLocation();

    return (
        <main 
            className={`
                main-container 
                ${ toggleMenu ? 
                'main-display-full' 
                : 'main-display-half' }
            `}
        >
            <Switch>
                <Route component={Products} path={location.pathname} /> 
            </Switch>
        </main>
    );
}

export default Shelf;