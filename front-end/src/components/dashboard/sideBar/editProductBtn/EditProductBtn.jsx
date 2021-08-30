import React from 'react';
import { useDispatch } from 'react-redux';

const EditProductBtn = () => {
    const dispatch = useDispatch();

    return (
        <button 
            className='edit-product-btn' 
            onClick={() =>
                dispatch({type: 'SET_TOGGLE_ADD', toggleAdd: false}) 
                && dispatch({type: 'SET_TOGGLE_EDIT', toggleEdit: true}) 
                && dispatch({type: 'SET_TOGGLE_EDIT_CATEGORY', toggleEditCategory: false})}
        >
            Edit Product
        </button>
    );
}

export default EditProductBtn;