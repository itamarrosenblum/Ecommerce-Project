import './Payment.css'
import './PaymentQueries.css';
import React from 'react';
import Nav from './nav/Nav';
import Cart from './cart/Cart';
import Details from './details/Details';

const Payment = () => {

    return (
        <div className='payment-wraper'>
            <Nav />
            <div className='payment-box'>
                <Cart />
                <Details />
            </div>
        </div>
    );
}

export default Payment;