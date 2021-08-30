import './SignUp.css';
import './SignUpQueries.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IoPowerSharp} from 'react-icons/io5';
import StepOne from './stepOne/StepOne';
import StepTwo from './stepTwo/StepTwo';

const SignUp = () => {
    const [obj, setObj] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [spinnerState, setSpinnerState] = useState(false);
    const [errMsgId, setErrMsgId] = useState('');
    const [errMsgEmail, setErrMsgEmail] = useState('');
    const [errMsgPsw, setErrMsgPsw] = useState('');
    const [errMsgVrfPsw, setErrMsgVrfPsw] = useState('');
    const [errMsgFname, setErrMsgFname] = useState('');
    const [errMsgLname, setErrMsgLname] = useState('');
    const [errMsgCity, setErrMsgCity] = useState('');
    const [errMsgStreet, setErrMsgStreet] = useState('');
    const history = useHistory();
    const dispatch = useDispatch();
    const axios = require('axios');

    const accountValid = (e) => { // First form validation
        e.preventDefault();
        setErrMsgFname('');

        if (e.target.id && e.target.id.value.length === 9) { // id validation
            if (/\S+@\S+\.\S+/.test(e.target.email.value)) { // email validation
                if (/.{6,}/.test(e.target.password.value)) { // password validation
                    if (e.target.password.value === e.target.verifyPassword.value) { // compare between two passwords
                        dispatch({
                            type: 'SET_REGISTER_STEPS_DATA', 
                            registerStepsData: {
                                id: e.target.id.value, 
                                email: e.target.email.value, 
                                password: e.target.password.value 
                            }
                        });
                        verifyData(e.target.id.value, e.target.email.value, e.target.password.value);
                        return;
                    } else {
                        setErrMsgVrfPsw('Password not match');
                    }
                } else {
                    setErrMsgPsw('Password must contain at least 6 characters');
                }
            } else {
                setErrMsgEmail('Please enter a valid email');
            }
        } else {
            setErrMsgId('Id number cotnain 9 characters');
        }
    }

    const personalValid = (e) => { // Second form validation
        e.preventDefault();
    
        if (e.target.fname && e.target.fname.value) { // first name validation
            if (e.target.lname.value) { // last name validation
                if (e.target.city.value) { // city validation
                    if (e.target.street.value) { // street validation
                        createAccount(e.target.fname.value, e.target.lname.value, e.target.city.value, e.target.street.value);
                        return;
                    } else {
                        setErrMsgStreet('Please enter your street');
                    }
                } else {
                    setErrMsgCity('Please select your city');
                }
            } else {
                setErrMsgLname('Please enter your last name');
            }
        } else {
            setErrMsgFname('Please enter your first name');
        }
    }

    const verifyData = async (id, email, password) => { // Verify new account function
        try {
            setSpinnerState(true);
            const res = await axios.post('http://localhost:3001/users', 
            {id: id, email: email});
            setSpinnerState(false);

            if (res.data.status === '200') {
                setObj({id: id, email: email, password: password});
                setActiveStep(1);
            } else if (res.data.status === '409' && res.data.data === 'Email already exist') {
                setErrMsgEmail(res.data.data);
            } else if (res.data.status === '409' && res.data.data === 'Id already exist') {
                setErrMsgId(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const createAccount = async (fname, lname, city, street) => { // Create new account function
        try {
            setSpinnerState(true);
            const res = await axios.post('http://localhost:3001/user', 
            {...obj, fname: fname, lname: lname, city: city, street: street});
            setSpinnerState(false);
            
            if (res.data.status === '200') {
                history.push('/i/login');
                dispatch({
                    type: 'SET_REGISTER_STEPS_DATA', 
                    registerStepsData: {
                        id: '', 
                        email: '', 
                        password: '' 
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    const getStepContent = (step) => { // Stepper handler function
        switch (step) {
            case 0:
                return <StepOne />;
            case 1:
                return <StepTwo />;
            default:
                return 'Something went wrong';
        }
    }

    useEffect(() => {
        dispatch({
            type: 'SET_ERR_MSG_REGISTER', 
            errMsgRegister: {
            errMsgId, setErrMsgId,
            errMsgEmail, setErrMsgEmail,
            errMsgPsw, setErrMsgPsw,
            errMsgVrfPsw, setErrMsgVrfPsw,
            errMsgFname, setErrMsgFname,
            errMsgLname, setErrMsgLname,
            errMsgCity, setErrMsgCity,
            errMsgStreet, setErrMsgStreet
        }});
    }, [dispatch, 
        errMsgId,
        errMsgEmail,
        errMsgPsw,
        errMsgVrfPsw,
        errMsgFname,
        errMsgLname,
        errMsgCity,
        errMsgStreet]);

    return (
        <div className='signup-container'>
            <div className='header-box'>
                <h1>Sign up to <span>Mazon</span> <span><IoPowerSharp className='power-icon' />nline</span></h1>   
            </div>

            <form 
                className='signup-form' 
                onSubmit={activeStep === 0 ? accountValid : personalValid}
            >
                { getStepContent(activeStep) }

                <div className='btn-box'>
                    { activeStep === 1 ?
                    <button 
                        className='back-btn'
                        type='button'
                        onClick={() => setActiveStep(0)}
                    >
                        Back
                    </button> : null }

                    { spinnerState ?
                    <div className='spinner-box'>
                        <div className={`spinner ${spinnerState}`}>
                            <div className='bounce1'></div>
                            <div className='bounce2'></div>
                            <div className='bounce3'></div>
                        </div>
                    </div> 
                    : 
                    <button 
                        className='progress-btn'
                        type='submit'
                    >
                        {activeStep === 0 ? 'Next' : 'Sign Up'}
                    </button> }
                </div>

                <div className='login-box'>
                    <span>Already Have an Account?</span> 
                    <button 
                        className='btn-link'
                        type='button' 
                        onClick={() => {
                            history.push('/i/login');
                            dispatch({type: 'SET_RESET_REGISTER_STEPS_DATA', registerStepsData: {}});
                        }}
                    >
                        Log in
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;