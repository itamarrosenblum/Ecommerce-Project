import './logOutBtn.css'
import './logOutBtnQueries.css'
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IoPersonCircleOutline } from 'react-icons/io5';

const LogOutBtn = () => {
    const [fname, setFname] = useState('');
    const history = useHistory();
    const dispatch = useDispatch();

    const logOutHandler = () => { // Log out function
        dispatch({type: 'SET_SESSION', session: ''});
        localStorage.clear();
        history.push('/i/login');
    }

    useEffect(() => {
        setFname(localStorage.getItem('fname'));
    }, []);

    return (
        <ul className='settings-nav'> 
            <li className='dropdown'>
                <button className='drop-btn'>
                    <span><IoPersonCircleOutline /></span> Welcome {fname}
                </button>
        
                <div className='dropdown-content'>
                    <div className='dropdown-box'>
                        <button onClick={logOutHandler} className='btn-logout'>
                            Log out
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    );
}

export default LogOutBtn;