import './ForgotPsw.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5';

const ForgotPsw = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [spinnerState, setSpinnerState] = useState(false);
    const [errMsgEmail, setErrMsgEmail] = useState('');
    const history = useHistory();
    const axios = require('axios');

    const isValid = (e) => { // Form validation
        e.preventDefault();

        if (/\S+@\S+\.\S+/.test(e.target.email.value)) {
            resetPass(e.target.email.value);
        } else {
            setErrMsgEmail('Please enter a valid email');
        }
    }

    const resetPass = async (email) => { // Reset psw
        try {
            setSpinnerState(true);
            await axios.put('http://localhost:3001/session', {email: email});
            setSpinnerState(false);
            
            setEmailSent(true);
        } catch (err) {
            console.error(err);
        }
    }

    if (emailSent) {
        return(
            <div className='forgot-psw-container'>
                <div className='email-sent-box'>
                    <div className='logo-box'>
                        <h1><span>Mazon</span> <span><IoPowerSharp className='power-icon' />nline</span></h1>   
                    </div>

                    <h2>Thank you</h2>
                    <p>If your account is associated with this email address you will receive an email to reset your password.</p>
                    <button 
                        onClick={() => history.push('/i/login')}
                        className='btn-link'
                    >
                        Back to Log in
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='forgot-psw-container'>
            <div className='logo-box'>
                <h1>
                    <span>Mazon</span> <span><IoPowerSharp className='power-icon' />nline</span>
                </h1>   
            </div>

            <form className='reset-pass-form' onSubmit={isValid}>
                <div className='header-box'>
                    <h2>What's your email?</h2>
                    <p>Please verify your email for us. Once you do, we'll send instructions to reset your password.</p>
                </div>

                <div className='email-box'>
                    <label htmlFor='email'>Email address</label>
                    <input 
                        type='email' 
                        name='email' 
                        id='email' 
                        placeholder='Email address'
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setErrMsgEmail('');
                            }
                        }}
                    />
                    <span className='err-msg'>{errMsgEmail}</span>
                </div>

                <div className='btn-box'>
                    { spinnerState ?
                        <div className='spinner-box'>
                            <div className={`spinner ${spinnerState}`}>
                                <div className='bounce1'></div>
                                <div className='bounce2'></div>
                                <div className='bounce3'></div>
                            </div>
                        </div> 
                        : 
                        <button type='submit'>
                            Reset My Password
                        </button> }
                </div>

                <button 
                    type='button'
                    onClick={() => history.push('/i/login')}
                    className='btn-link'
                >
                    Back to Log in
                </button>
            </form>
        </div>
    );
}

export default ForgotPsw;