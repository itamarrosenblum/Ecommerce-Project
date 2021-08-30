import './CheckoutBtn.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CheckoutBtn = () => {
    const totalPrice = useSelector(state => state.getTotalPrice);
    const history = useHistory();

    return (
        <div className='sidebar-checkout-box'>
            <div>
                <span>Subtotal:</span>
                <span>
                    <span>$</span>{totalPrice}
                </span>
            </div>
            
            <div>
                <button
                    disabled={Number(totalPrice) > 0 ? false : true}
                    onClick={() => {
                        if (Number(totalPrice) > 0) {
                            history.push('/checkout');
                        }
                    }}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}

export default CheckoutBtn;