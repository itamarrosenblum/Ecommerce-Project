import './EditCategory.css';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const EditCategory = () => {
    const [spinnerState, setSpinnerState] = useState(false);
    const [errMsgCat, setErrMsgCat] = useState('');
    const [errMsgNewCat, setErrMsgNewCat] = useState('');
    const form = useRef();
    const inputNewCategory = useRef(null);
    const arrCategory = useSelector(state => state.getCategories);
    const dispatch = useDispatch();
    const axios = require('axios');

    const isValid = (e) => { // Form validation
        e.preventDefault();

        if (e.target.category.value) { // Category validation
            if (e.target.newCategory.value.length > 0) { // New Category validation
                if (/[a-zA-Z].{2,}/.test(e.target.newCategory.value)) {
                    editCategory(e.target.category.value, e.target.newCategory.value);
                } else {
                    setErrMsgNewCat('Please enter 3 or more letters');
                }
            } else {
                setErrMsgNewCat('Please enter the new category name');
            }
        } else {
            setErrMsgCat('Please select a category');
        }

    }

    const editCategory = async (currentCategoryName, newCategoryName) => { // Fetch the updated category
        try {
            setSpinnerState(true);
            const res = await axios.put('http://localhost:3001/category', 
            {currentCategoryName: currentCategoryName, newCategoryName: newCategoryName});
            setSpinnerState(false);
            
            if (res.data.status === '200') {
                dispatch({type: 'SET_REFETCH', refetch: Math.random() * 2});
                form.current.reset();
            } else {
                setErrMsgNewCat(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form 
            className='edit-category-form' 
            onSubmit={isValid} 
            autoComplete='off'
            ref={form}
        >
            <div className='category-box'>
                <label htmlFor='category'>Select a Category</label>
                    <select 
                        name='category' 
                        id='category'
                        defaultValue='' 
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setErrMsgCat('');
                            }
                        }}
                    >
                        <option 
                            disabled 
                            hidden 
                            value=''
                        >
                            Select a Category
                        </option>
                        {arrCategory.map(e => {   
                                return(
                                    <option 
                                        id={e.id} 
                                        value={e.name} 
                                        key={e.id}
                                    >
                                        {e.name}
                                    </option>
                                );
                            }
                        )}
                    </select>
                    <span className='err-msg'>{errMsgCat}</span>
            </div>

            <div className='category-name-box'>
                <label htmlFor='newCategory'>New Category Name</label>
                <input
                    type='text'
                    name='newCategory'
                    id='newCategory'
                    placeholder='New Category Name'
                    ref={inputNewCategory}
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            setErrMsgNewCat('');
                        }
                    }}
                />
                <span className='err-msg'>{errMsgNewCat}</span>
            </div>
                        
            <div className='btn-box'>
                {spinnerState ?
                    <div className='spinner-box'>
                        <div className={`spinner ${spinnerState}`}>
                            <div className='bounce1'></div>
                            <div className='bounce2'></div>
                            <div className='bounce3'></div>
                        </div>
                    </div> 
                    : <button type='submit' className='btn-edit'>
                        Save Changes
                    </button>
                }
            </div>
        </form>
    );
}

export default EditCategory;