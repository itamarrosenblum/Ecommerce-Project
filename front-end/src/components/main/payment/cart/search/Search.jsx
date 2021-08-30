import './Search.css';
import './SearchQuerties.css';
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Search = () => {
    const cartSummery = useSelector(state => state.getCartSummery);
    const searchInput = useRef(null);
    const dispatch = useDispatch();

    const searchHandler = (productName) => { // Fetch product by searched name
        const found = cartSummery.filter(e => e.name.toLowerCase().includes(productName.toLowerCase()))

        if (found.length > 0 && productName) {
            dispatch({type: 'SET_CART_SUMMERY', cartSummery: found});
        }

        if (!productName) {
            dispatch({type: 'SET_REFETCH_CART_SUMMERY', refetchCartSummery: Math.random() * 2});
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}className='payment-search-form' autoComplete='off'>
            <div className='search-box'>
                <input 
                    type='search' 
                    name='search' 
                    maxLength='50'
                    placeholder='Type to search a product'
                    ref={searchInput}
                    onChange={(e) => {
                        e.preventDefault();
                        searchHandler(e.target.value);
                    }}
                />
            </div>
        </form> 
    );
}

export default Search;