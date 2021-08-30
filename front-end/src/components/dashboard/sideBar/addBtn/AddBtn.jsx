import React from 'react';
import { useDispatch } from 'react-redux';

const AddBtn = () => {
    const dispatch = useDispatch();

    return (
        <button 
            className='add-btn' 
            onClick={() => 
                dispatch({type: 'SET_TOGGLE_ADD', toggleAdd: true})
                && dispatch({type: 'SET_TOGGLE_EDIT', toggleEdit: false})
                && dispatch({type: 'SET_TOGGLE_EDIT_CATEGORY', toggleEditCategory: false})}
        >
            Add Product
        </button>
    );
}

export default AddBtn;