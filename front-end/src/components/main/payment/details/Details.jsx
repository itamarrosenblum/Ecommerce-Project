import 'react-datepicker/dist/react-datepicker.css';
import './Details.css';
import './DetailsQueries.css'
import React, { useState, useEffect } from 'react';
import { IoHelpCircleOutline } from 'react-icons/io5';
import DatePicker from 'react-datepicker';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Details = () => {
    const history = useHistory();
    const dispatch = useDispatch()
    const [userDetails, setUserDetails] = useState();
    const [streetInp, setStreetInp] = useState('');
    const [cityInp, setCityInp] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [cityErrMsg, setCityErrMsg] = useState();
    const [streetErrMsg, setStreetErrMsg] = useState();
    const [dateErrMsg, setDateErrMsg] = useState();
    const [creditCardErrMsg, setCreditCardErrMsg] = useState();
    const cartSummery = useSelector(state => state.getCartSummery);
    const cartId = useSelector(state => state.getCartId);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [datesFull, setDatesFull] = useState([]);
    const [arrPdf, setArrPdf] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [shippingInfo, setShippingInfo] = useState('');
    const doc = new jsPDF('p', 'pt', 'a4');
    const axios = require('axios');

    useEffect(() => { // Fetch user shipping address
        (async () => {
            try {
                const res = await axios.post('http://localhost:3001/address', 
                {token: localStorage.getItem('token')});

                res.data.status === '200' && setUserDetails(res.data.data);
        } catch (err) {
            console.error(err);
        }
    })();
    }, [axios]);

    useEffect(() => { // Fetch busy dates
        (async () => {
            try {
                const res = await axios.get('http://localhost:3001/dates');

                setDatesFull(res.data.data);
        } catch (err) {
            console.error(err);
        }
    })();
    }, [axios]);

    const isValid = (e) => { // Form validation
        e.preventDefault();
        if(e.target.city.value) { // City name validation
            if (e.target.street.value) { // Street name Validation
                if (startDate) {
                    if (/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(e.target.creditCard.value)) { // Credit card valdation
                        sendOrder({
                            city: e.target.city.value,
                            street: e.target.street.value,
                            deliveryDate: new Date(startDate).toLocaleDateString(),
                            creditCardNumber: e.target.creditCard.value,
                            shoppingCartId: cartId,
                            token: localStorage.getItem('token')
                        });
                    }
                }
            }
        }
    }

    const sendOrder = async (obj) => { // Make an order function
        try {
            const res = await axios.post('http://localhost:3001/order',obj);

            if (res.data.status === '200') {
                setShippingInfo({city: obj.city, street: obj.street, deliveryDate: obj.deliveryDate});
                setOrderId(res.data.data.orderId);
                setModalSuccess(true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const receiptHandler = () => { // Create the receipt as PDF file
        doc.text('Mazon Online', 45, 30);
        doc.setFontSize(11);
        doc.text(`Bill to: ${localStorage.getItem('fname')} ${localStorage.getItem('lname')}`, 45, 50);
        doc.text(`Order number: ${orderId}`, 45, 70);
        doc.text(`Shipping Address: ${shippingInfo.city}, ${shippingInfo.street}`, 45, 90);
        doc.text(`Delivery Date: ${new Date(shippingInfo.deliveryDate).toLocaleDateString('en-GB')}`, 45, 110);
        doc.text(`${new Date().toLocaleDateString('en-GB')}`, 470, 30);
        doc.autoTable({
            theme: 'plain',
            startY: 120,
            head: [['Description', 'Quantity', 'Total Amount']],     
            body: [...arrPdf],
            foot: [
                [{ content: `Subtotal: $${subTotal}`, colSpan: 2, rowSpan: 2, styles: { halign: 'left' } }]
            ]
        });
        doc.save('Mazon-Online-Receipt.pdf');
    }

    useEffect(() => { // Set receipt details
     if (Array.isArray(cartSummery)) {
            const result = cartSummery.map(e => {
            return(
                [e.name, e.productCart.quantity, e.productCart.price]
            )});
            setArrPdf(result);

            const totalPrice = () => {
                let total = 0;
                cartSummery.forEach(e => {
                    total+= Number(e.productCart.price);
                  });
             return total.toFixed(2);
            }
            setSubTotal(totalPrice);
     }
    }, [cartSummery]);

    return (
        <div className='payment-container'>
            <div className='payment-header'>
                <h2>Billing Information</h2>
            </div>

            <form className='payment-form' onSubmit={isValid}>
                <div className='city-box'>
                    <label htmlFor='city'>City</label>
                    <input 
                        onDoubleClick={() => setCityInp(userDetails.city)}
                        onChange={(e) => {
                            setCityInp(e.target.value);
                            if (e.target.value === '') {
                                setCityErrMsg('Please enter your city name');
                            } else {
                                setCityErrMsg('');

                            }
                        }}
                        type='text' 
                        name='city' 
                        id='city' 
                        placeholder='Enter your city name'
                        value={cityInp}
                        autoComplete='off'
                    />
                    <div className='help-box'>
                        <span><IoHelpCircleOutline /></span>
                        <span>Double click on the 'City' field to get the defualt value</span>
                    </div>
                { cityErrMsg ? <span className='err-msg'>{cityErrMsg}</span> : null }
                </div>

                <div className='street-box'>
                    <label htmlFor='street'>Street</label>
                    <input 
                        onDoubleClick={() => setStreetInp(userDetails.street)}
                        onChange={(e) => {
                            setStreetInp(e.target.value);
                            if (e.target.value === '') {
                                setStreetErrMsg('Please enter your street address');
                            } else {
                                setStreetErrMsg('');
                            }
                        }}
                        type='street' 
                        name='street' 
                        id='street'
                        placeholder='Enter your street address'
                        value={streetInp}
                        autoComplete='off'
                    />
                    <div className='help-box'>
                        <span><IoHelpCircleOutline /></span>
                        <span>Double click on the 'Street' field to get the defualt value</span>
                    </div>
                    { streetErrMsg ? <span className='err-msg'>{streetErrMsg}</span> : null }
                </div>

                <div className='date-box'>
                    <label htmlFor='deliveryDate'>Delivery Date</label>
                        <DatePicker
                            excludeDates={datesFull.map(e=> {
                                return(new Date(e))
                            })}
                            dateFormat='dd/MM/yyyy'
                            wrapperClassName='datePicker'
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date);
                                if (date === null) {
                                    setDateErrMsg('Please pick a delivery date');
                                } else {
                                    setDateErrMsg('');
                                }
                            }}
                            minDate={new Date()}
                            placeholderText='Pick a delivery date'
                        />
                        { dateErrMsg ? <div><span className='err-msg'>{dateErrMsg}</span></div> : null }
                        <div className='help-box'>
                        <span><IoHelpCircleOutline /></span>
                        <span>Non-clickable dates are not available for delivery</span>
                    </div>
                </div>

                <div className='creditCard-box'>
                    <label htmlFor='creditCard'>Credit Card</label>
                    <input 
                        type='number' 
                        name='creditCard' 
                        id='creditCard' 
                        autoComplete='off'
                        placeholder='Enter your credit card number'
                        onChange={(e) => {
                            if (/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(e.target.value)) {
                                setCreditCardErrMsg('');
                            } else if (e.target.value === '') {
                                setCreditCardErrMsg('Please enter your credit card number');
                            } else {
                                setCreditCardErrMsg('Card number invalid');
                            }
                        }}
                    />
                    { creditCardErrMsg ? <div><span className='err-msg'>{creditCardErrMsg}</span></div> : null }
                </div>

                <div>
                    <button 
                        type='submit' 
                        className='order-btn'
                    >
                        Checkout
                    </button>
                </div>
            </form>

            { modalSuccess ?
            <div className='modal-success-container'>
                <div className='modal-success-box'>
                        <div className='modal-success'>
                        <div className='modal-success-top'>
                        
                        <h2>Thank you!</h2>
                            <h3>Your order was placed successfuly.</h3>
                            <p>Order number is: <span>{orderId}</span></p>
                        </div>

                        <div className='modal-success-bottom'>
                            <button 
                                onClick={receiptHandler}
                                className='download-btn'
                            >
                                    * Click here to download your receipt.
                            </button>

                            <button
                                className='btn-back'
                                onClick={() => { 
                                    dispatch({type: 'SET_REFETCH_CART', refetchCart: Math.random() * 2 });
                                    history.push('/');
                            }}
                            >
                                Back to shopping 
                            </button>
                        </div>
                    </div>
                </div>
            </div> : null }
        </div>
    );
}

export default Details;