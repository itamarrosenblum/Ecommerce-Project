import './LogIn.css';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline, IoPowerSharp } from 'react-icons/io5';

const LogIn = () => {
    const [eyeIcon, setEyeIcon] = useState(<IoEyeOffOutline />);
    const [isPsw, setIsPsw] = useState(false);
    const [spinnerState, setSpinnerState] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [errMsgEmail, setErrMsgEmail] = useState('');
    const [errMsgPsw, setErrMsgPsw] = useState('');
    const [errMsgEmailBox, setErrMsgEmailBox] = useState(false);
    const [errMsgPswBox, setErrMsgPswBox] = useState(false);
    const [errMsgBox, setErrMsgBox] = useState(false);
    const psw = useRef(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const axios = require('axios');

    const isValid = (e) => { // Form validation
        e.preventDefault();

        if (/\S+@\S+\.\S+/.test(e.target.email.value)) {
            setErrMsgEmailBox(false);
            if (/.{6,}/.test(e.target.password.value)) {
                setErrMsgPswBox(false);
                connectAcc(e.target.email.value, e.target.password.value);
            } else {
                setErrMsgPswBox(true);
                setErrMsgPsw('Password must contain at least 6 characters');
            }
        } else {
            setErrMsgEmailBox(true);
            setErrMsgEmail('Please enter a valid email');
        }
    }

    const connectAcc = async (email, password) => { // Log in function
        try {
            setSpinnerState(true);
            const res = await axios.post('http://localhost:3001/session', 
            {email: email, password: password});
            setSpinnerState(false);

            if (res.data.status === '200') {
                setErrMsg('');
                setErrMsgBox(false);
                dispatch({type: 'SET_SESSION', session: res.data.role});
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userType', res.data.role);
                localStorage.setItem('fname', res.data.firstName);
                localStorage.setItem('lname', res.data.lastName);
                history.push('/');
            } else {
                setErrMsgBox(true);
                setErrMsg(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='login-container'>
            <div className='header-box'>
                <h1>Log in to <span>Mazon</span> <span><IoPowerSharp className='power-icon' />nline</span></h1>   
            </div>

            <form className='login-form' onSubmit={isValid}>
                <div className='email-box'>
                    <label htmlFor='email'>Email address</label>
                    <input 
                        type='email' 
                        name='email' 
                        id='email' 
                        placeholder='Email address'
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setErrMsg('');
                                setErrMsgBox(false);
                                setErrMsgEmailBox(false);              
                                setErrMsgBox(false);
                                setErrMsgEmail('');
                            }
                        }}
                    />
                </div>

                { errMsgEmailBox ?
                <div className='err-msg-box'>
                    <span className='err-msg'>{errMsgEmail}</span>
                </div> : null }

                <div className='password-box'>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type='password' 
                        name='password' 
                        id='password' 
                        className='password-input'
                        placeholder='Password'
                        autoComplete='off'
                        ref={psw}
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setErrMsgPswBox('');
                                setErrMsg('');
                                setErrMsgPswBox(false);
                                setErrMsgBox(false);
                                setIsPsw(true);
                            } else {
                                setIsPsw(false);
                            }
                        }}
                    />

                    { isPsw ? 
                    <button 
                        className='password-visibility-btn'
                        type='button' 
                        onClick={() => {
                            if (psw.current.type === 'password') {
                                psw.current.type = 'text';
                                setEyeIcon(<IoEyeOutline />);
                            } else {
                                psw.current.type = 'password';
                                setEyeIcon(<IoEyeOffOutline />);
                            }
                        }}
                    >
                        <span>{eyeIcon}</span>
                    </button> : null }
                </div>

                { errMsgPswBox ?
                <div className='err-msg-box'>
                    <span className='err-msg'>{errMsgPsw}</span>
                </div> : null }

                <span>
                    <button
                        type='button'
                        className='btn-link'
                        onClick={() => history.push('/i/forgot-password')}
                    >
                        Forgot Password?
                    </button>
                </span>

                <div className='btn-box'>
                    {spinnerState ?
                        <div className='spinner-box'>
                            <div className={`spinner ${spinnerState}`}>
                                <div className='bounce1'></div>
                                <div className='bounce2'></div>
                                <div className='bounce3'></div>
                            </div>
                        </div> 
                        : 
                        <button type='submit'>
                            Log in
                        </button>
                    }
                </div>

                { errMsgBox ?
                <div className='err-msg-box'>
                    <span className='err-msg'>{errMsg}</span>
                </div> : null }

                <div className='signup-box'>
                    <span>New to Mazon Online? </span> 
                    <button 
                        className='btn-link'
                        type='button' 
                        onClick={() => history.push('/i/signup')}
                    >
                        Create an Account
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LogIn;