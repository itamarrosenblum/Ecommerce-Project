import './StepTwo.css';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const StepTwo = () => {
    const [selectColor, setSelectColor] = useState('grey');
    const stepsDataObj = useSelector(state=> state.getRegisterStepsDataReducer);
    const errMsgObj = useSelector(state=> state.getErrMsgRegisterReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        if (stepsDataObj.city) {
            setSelectColor('black');
        } else {
            setSelectColor('grey');
        }

    }, [stepsDataObj]);

    const stepsDataHandler = (targetName, data) => {
        dispatch({
            type: 'SET_REGISTER_STEPS_DATA', 
            registerStepsData: { [targetName]: data }
        });
    }

    return (
        <div className='container-step-two'>
            <div className='fname-box'>
                <label htmlFor='fname'>First name</label>
                <input 
                    type='text' 
                    name='fname' 
                    id='fname' 
                    defaultValue={stepsDataObj.fname}
                    placeholder='First name'
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            errMsgObj.setErrMsgFname('');
                        }
                        stepsDataHandler(e.target.name, e.target.value);
                    }}
                />
            </div>

            <div className='err-msg-box'>
                <span className='err-msg'>{errMsgObj.errMsgFname}</span>
            </div>

            <div className='lname-box'>
                <label htmlFor='lname'>Last name</label>
                <input 
                    type='text' 
                    name='lname' 
                    id='lname' 
                    defaultValue={stepsDataObj.lname}
                    placeholder='Last name'
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            errMsgObj.setErrMsgLname('');
                        }
                        stepsDataHandler(e.target.name, e.target.value);
                    }}
                />
            </div>

            <div className='err-msg-box'>
                <span className='err-msg'>{errMsgObj.errMsgLname}</span>
            </div>

            <div className='city-box'>
                <label htmlFor='city'>City</label>
                <select 
                    name='city'
                    id='city' 
                    defaultValue={stepsDataObj.city ? stepsDataObj.city : ''}
                    className={selectColor}
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            errMsgObj.setErrMsgCity('');
                        }
                        setSelectColor('black');
                        stepsDataHandler(e.target.name, e.target.value);
                    }}
                >
                    <option disabled hidden value=''>Select a City</option>
                    <option value='New York'>New York</option>
                    <option value='Los Angeles'>Los Angeles</option>
                    <option value='Chicago'>Chicago</option>
                    <option value='Houston'>Houston</option>
                    <option value='Phoenix'>Phoenix</option>
                    <option value='Philadelphia'>Philadelphia</option>
                    <option value='San Antonio'>San Antonio</option>
                    <option value='San Diego'>San Diego</option>
                    <option value='Dallas'>Dallas</option>
                    <option value='San Jose'>San Jose</option>
                </select>
            </div>

            <div className='err-msg-box'>
                <span className='err-msg'>{errMsgObj.errMsgCity}</span>
            </div>

            <div className='street-box'>
                <label htmlFor='street'>Street</label>
                <input 
                    type='text' 
                    name='street' 
                    id='street' 
                    defaultValue={stepsDataObj.street}
                    placeholder='Street'
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            errMsgObj.setErrMsgStreet('');
                        }
                        stepsDataHandler(e.target.name, e.target.value);
                    }}
                />
            </div>

            <div className='err-msg-box'>
                <span className='err-msg'>{errMsgObj.errMsgStreet}</span>
            </div>
        </div>
    );
}

export default StepTwo;