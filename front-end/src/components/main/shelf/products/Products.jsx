import './Products.css';
import './ProductQueries.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import { IoAddOutline, IoRemoveOutline } from 'react-icons/io5';
import AddModal from '../addModal/AddModal';

const Products = () => {
    const [categoryId, setCategoryId] = useState(0);
    const arr = useSelector(state => state.getProducts);
    const openCart = useSelector(state => state.getOpenCart);
    const objProductCart = useSelector(state => state.getProductCart);
    const searchStatus = useSelector(state => state.getSearchStatus);
    const addModalState = useSelector(state => state.getAddModalState);
    const disabledBg = useSelector(state => state.getDisabledBg);
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
                    dispatch({type: 'SET_SEARCH_STATUS', searchStatus: null});
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [location, dispatch, categoryId, axios]);

    const isValid = (id) => {
        const isProductAdded = objProductCart.find(e => e.id === id);

        if (!isProductAdded) {
            const found = arr.find(e => e.id === id);
            selectedProductHandler({
                quantity: 1,
                price: found.price,
                productId: found.id,
                shoppingCartId: openCart
            });
        }
    }

    const selectedProductHandler = async (obj) => { // Selected product
        try {
            await axios.post('http://localhost:3001/productCart', obj);

            dispatch({type: 'SET_REFETCH_CART', refetchCart: Math.random() * 2 });
        } catch (err) {
            console.error(err);
        }
    }

    const incrementProductCart = async (productId, request) => { // Change product amount
        try {
            await axios.put('http://localhost:3001/productCart', 
            {shoppingCartId: openCart, productId: productId, request: request});

            dispatch({type: 'SET_REFETCH_CART', refetchCart: Math.random() * 2 });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='products-container'>
            { searchStatus ? <div className='search-result-box'>
                <h3>Search results for: &quot;{searchStatus.searchWord}&quot; ({searchStatus.resultsNumber})</h3>
            </div> : null }
            <ul>
                {arr.map(e => {
                    return(
                        <li key={e.id}>
                            <div
                                className='card-description'
                                onClick={() => {
                                    const isProduct = arr.find(k => k.id === e.id);
                                    if (isProduct) {
                                        dispatch({type: 'SET_SELECTED_PRODUCT', selectedProduct: isProduct });
                                        dispatch({type: 'SET_ADD_MODAL_STATE', addModalState: true });
                                    }
                                }}
                            >
                                <div className='img-box'>
                                    <button 
                                        className='product-btn' 
                                        id={e.id}
                                    >
                                        <figure>
                                            <Image 
                                                cloudName='itamarrosenblum'
                                                publicId={e.img}
                                            />
                                            <figcaption>{e.name}</figcaption>
                                        </figure>
                                    </button>
                                </div>

                                <div className='price-box'>
                                    <p><span>&#36;</span>{e.price}</p>
                                </div>
                            </div>

                            <div className='btn-box'>
                               { objProductCart && objProductCart.find(x => x.id === e.id) ?
                                <div className='quantity-box'>
                                    <button
                                        onClick={() => incrementProductCart(e.id, 'reduce')}
                                    >
                                        <span><IoRemoveOutline /></span>
                                    </button>
                                    <div>
                                    {objProductCart.map(k => {
                                        return(
                                            <span key={k.id}>{k.id ===e.id ? k.productCart.quantity : null}</span>
                                           )
                                       })}
                                    </div>
                                    <button 
                                        onClick={() => incrementProductCart(e.id, 'increment')}
                                    >
                                    <span><IoAddOutline /></span>
                                    </button>
                                </div> 
                                :
                                <button className='add-cart-btn'
                                 onClick={() => {
                                    isValid(e.id);
                                }}
                                >
                                    Add to Cart
                                </button> }
                            </div>
                        </li>
                    );
                })}
            </ul>
            { addModalState ?
            <div>
                <AddModal />
            </div> : null }

            {disabledBg ? 
            <div className='disabled-bg'></div> 
            : null }
        </div>
    );
}

export default Products;