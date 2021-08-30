import './Products.css';
import './ProductQueries.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Image } from 'cloudinary-react';

const Products = () => {
    const [categoryId, setCategoryId] = useState(0);
    const arr = useSelector(state => state.getProducts);
    const refetch = useSelector(state => state.getRefetch);
    const toggleMenu = useSelector(state => state.getToggleMenu);
    const dispatch = useDispatch();
    const location = useLocation();
    const axios = require('axios');

    useEffect(() => { // Fetch first category dynamically
        (async () => {
            try {
                const res = await axios.get('http://localhost:3001/category');

                setCategoryId(res.data.category.id);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [axios]);

    useEffect(() => { // Fetch category dynamically
        (async () => {
            try {
                const res = await axios.get(`http://localhost:3001/products/${location.id ? location.id : categoryId}`);

                const found = res.data.data.find (firstProduct => firstProduct);
                if(found) {
                    dispatch({type: 'SET_PRODUCT', product: found});
                    dispatch({type: 'SET_PRODUCTS', products: res.data.data});
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [location, dispatch, refetch, categoryId, axios]);

    const selectedProductHandler = (id) => { // Selected product for edit
        const found = arr.find(e => e.id === id);

        if (found) {
            dispatch({type: 'SET_PRODUCT', product: found});
            dispatch({type: 'SET_TOGGLE_EDIT', toggleEdit: true});
            dispatch({type: 'SET_TOGGLE_ADD', toggleAdd: false});
            dispatch({type: 'SET_TOGGLE_EDIT_CATEGORY', toggleEditCategory: false});
        }

        toggleMenu && dispatch({type: 'SET_TOGGLE_MENU', toggleMenu: false});
    }

    return (
        <div className='products-dash-container'>
            <ul>
                {arr.map(e => {
                    return(
                        <li key={e.id}>
                            <button 
                                className='product-btn' 
                                id={e.id}
                                onClick={() => selectedProductHandler(e.id)}
                            >
                                <figure>
                                    <Image 
                                        cloudName='itamarrosenblum'
                                        publicId={e.img}
                                    />
                                    <figcaption>{e.name}</figcaption>
                                </figure>
                            </button>
                            <p><span>&#36;</span>{e.price}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Products;