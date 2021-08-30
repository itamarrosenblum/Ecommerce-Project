import './Categories.css';
import React, { useState, useEffect, useRef }  from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector,  useDispatch } from 'react-redux';
import { IoChevronUpOutline } from 'react-icons/io5';
import { IoChevronDownOutline } from 'react-icons/io5';

const Categories = () => {
    const [url, setUrl] = useState('');
    const [arrowIcon, setArrowIcon] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [btnColor, setBtnColor] = useState('darkblue');
    const ul = useRef(null);
    const arr = useSelector(state => state.getCategories);
    const dispatch = useDispatch();
    const history = useHistory();
    const axios = require('axios');

    useEffect(() => { // Fetch all categories
        (async () => {
            try {
                const res = await axios.get('http://localhost:3001/categories');

                const found = res.data.data.find(e => e);
                const category = found.name.replaceAll(' ', '-').toLowerCase();
                setUrl(category);
                dispatch({type: 'SET_CATEGORIES', categories: res.data.data});
            } catch (err) {
                console.error(err);
            }
        })();
    }, [dispatch, axios]);

    useEffect(() =>  { // First URL handler  
        window.history.replaceState(null, '', url);      
    },[history, url]);

    useEffect(() => {
        window.onpopstate = () => {
            dispatch({type: 'SET_SEARCH_STATUS', searchStatus: null });
            window.history.replaceState(null, '', url);
         }
    }, [dispatch, url]);

    return (
        <ul className='categories-nav' ref={ul}> 
            <li 
                className='dropdown' 
                onMouseLeave={() => {
                    setArrowIcon(false);
                    setIsHidden(true);
                    setBtnColor('darkblue');
                }}
            >
                <button 
                    className={`drop-btn ${btnColor}`}
                    
                    onMouseOver={() => {
                        setArrowIcon(<IoChevronUpOutline />);
                        setIsHidden(false);
                        setBtnColor('lightblue');
                    }}
                >
                        Categories <span>{arrowIcon ?  arrowIcon : <IoChevronDownOutline />}</span>
                </button>

                <div 
                    className='dropdown-content'
                    hidden={isHidden}
                >
                    <div className='dropdown-box'>
                    {arr.map(e => {
                        if (arr.find(e => e)) { 
                            return (
                                <div key={e.id}>
                                    <Link 
                                        exact='true' 
                                        to={{
                                            pathname: `/${e.name.replaceAll(' ', '-').toLowerCase()}`, 
                                            id: e.id
                                        }}
                                        onClick={() => {
                                            setArrowIcon(false);
                                            setIsHidden(true);
                                        }}
                                    >
                                        {e.name}
                                    </Link>
                                </div>
                            );
                        }

                        return (
                            <div key={e.id}>
                                <Link 
                                    to={{
                                        pathname: `/${e.name.replaceAll(' ', '-').toLowerCase()}`,
                                        id: e.id
                                    }}
                                >
                                    {e.name}
                                </Link>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </li>
        </ul>
    );
}

export default Categories;