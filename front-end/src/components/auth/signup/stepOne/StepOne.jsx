import './StepOne.css';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoEyeOutline,  IoEyeOffOutline } from 'react-icons/io5';

const StepOne = () => {
    const [eyeIcon, setEyeIcon] = useState(<IoEyeOffOutline />);
    const [vrfEyeIcon, setVrfEyeIcon] = useState(<IoEyeOffOutline />);
    const [isPsw, setIsPsw] = useState(false);
    const [isVrfPsw, setIsVrfPsw] = useState(false);
    const psw = useRef(null);
    const vrfPsw = useRef(null);
    const stepsDataObj = useSelector(state => state.getRegisterStepsDataReducer);
    const errMsgObj = useSelector(state => state.getErrMsgRegisterReducer);

    useEffect(() => {
        if (psw.current.value && vrfPsw.current.value) {
            setIsPsw(true);
            setIsVrfPsw(true);
        }
    }, [psw, vrfPsw])

    return (
        <div className='container-step-one'>
            <div className='id-box'>
                <label htmlFor='id'>Id number</label>
                <input 
                    type='text' 
                    name='id' 
                    id='id' 
                    defaultValue={stepsDataObj.id}
                    placeholder='Id number (9 characters)'
                    maxLength='9'
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            errMsgObj.setErrMsgId('');
                        }
                    }}
                />
            </div>

            <div className='err-msg-box'>
                <span className='err-msg'>{errMsgObj.errMsgId}</span>
            </div>

            <div className='email-box'>
                <label htmlFor='email'>Email address</label>
                <input 
                    type='email' 
                    name='email' 
                    id='email' 
                    defaultValue={stepsDataObj.email}
                    placeholder='Email address'
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            errMsgObj.setErrMsgEmail('');
                        }
                    }}
                />
            </div>

            <div className='err-msg-box'>
                <span className='err-msg'>{errMsgObj.errMsgEmail}</span>
            </div>

            <div className='password-box'>
                <label htmlFor='password'>Password</label>
                <input 
                    type='password' 
                    name='password' 
                    defaultValue={stepsDataObj.password}
                    autoComplete='off'
                    id='password' 
                    placeholder='Password (6+ charaters)'
                    ref={psw}
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            errMsgObj.setErrMsgPsw('');
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

            <div className='err-msg-box'>
                <span className='err-msg'>{errMsgObj.errMsgPsw}</span>
            </div>

            <div className='verify-password-box'>
                <label htmlFor='verifyPassword'>Verify password</label>
                <input 
                    type='password' 
                    name='verifyPassword'
                    defaultValue={stepsDataObj.password}
                    autoComplete='off'
                    id='verifyPassword' 
                    placeholder='Verify password'
                    ref={vrfPsw}
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            errMsgObj.setErrMsgVrfPsw('');
                            setIsVrfPsw(true);
                        } else {
                            setIsVrfPsw(false);
                        }
                    }}
                />
                { isVrfPsw ? 
                    <button 
                        className='password-visibility-btn'
                        type='button' 
                        onClick={() => {
                            if (vrfPsw.current.type === 'password') {
                                vrfPsw.current.type = 'text';
                                setVrfEyeIcon(<IoEyeOutline />);
                            } else {
                                vrfPsw.current.type = 'password';
                                setVrfEyeIcon(<IoEyeOffOutline />);
                            }
                        }}
                    >
                        <span>{vrfEyeIcon}</span>
                    </button> : null }
            </div>

            <div className='err-msg-box'>
                <span className='err-msg'>{errMsgObj.errMsgVrfPsw}</span>
            </div>
        </div>
    );
}

export default StepOne;