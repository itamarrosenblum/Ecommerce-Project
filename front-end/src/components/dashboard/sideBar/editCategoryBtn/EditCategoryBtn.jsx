import React from 'react';
import { useDispatch } from 'react-redux';

const EditCategoryBtn = () => {
    const dispatch = useDispatch();

    return (
        <button 
            className='edit-category-btn' 
            onClick={() =>
                dispatch({type: 'SET_TOGGLE_ADD', toggleAdd: false}) 
                && dispatch({type: 'SET_TOGGLE_EDIT', toggleEdit: false}) 
                && dispatch({type: 'SET_TOGGLE_EDIT_CATEGORY', toggleEditCategory: true})
            }
        >
            Edit Category
        </button>
    );
}

export default EditCategoryBtn;