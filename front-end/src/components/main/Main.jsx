import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import KeyContent from './keyContent/KeyContent';
import Payment from './payment/Payment';

const Main = () => {
    const dispatch = useDispatch();
    const refetchCart = useSelector(state => state.getRefetchCart);
    const axios = require('axios');

    useEffect(() => { // Fetch cart
        (async () => {
            try {
                const res = await axios.post('http://localhost:3001/cart', 
                {token: localStorage.getItem('token')});
                
                if (res.data.status === '409') {
                    const totalPrice = () => {
                        let total = 0;
                          if (res.data.isCart.products.length > 0) {
                            res.data.isCart.products.forEach(e => {
                                total+= Number(e.productCart.price);
                              });
                              return total.toFixed(2);
                          } else {
                            return total.toFixed(2);
                          }
                     
                    }
    
                    dispatch({type: 'SET_TOTAL_PRICE', totalPrice: totalPrice() });
                    dispatch({type: 'SET_OPEN_CART', openCart: res.data.isCart.id});
                    dispatch({type: 'SET_PRODUCT_CART', productCart: res.data.isCart.products});
                } else {
                    dispatch({type: 'SET_TOTAL_PRICE', totalPrice:  '0.00'});
                    dispatch({type: 'SET_OPEN_CART', openCart: res.data.cartId});
                    dispatch({type: 'SET_PRODUCT_CART', productCart: []});
                }
            
        } catch (err) {
            console.error(err);
        }
    })();
    }, [dispatch, refetchCart, axios]);
    
    return (
        <Router>
            <div>
                <Switch>
                    <Route component={Payment} path='/checkout' />
                    <Route component={KeyContent} path='/' />
                </Switch>
            </div>
        </Router>
    )
}

export default Main;