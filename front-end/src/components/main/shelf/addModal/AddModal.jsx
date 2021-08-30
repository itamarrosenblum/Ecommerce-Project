import React from 'react';
import './AddModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { IoAddOutline, IoRemoveOutline } from 'react-icons/io5';
import { Image } from 'cloudinary-react';

const AddModal = () => {
    const selectedProduct = useSelector(state => state.getSelectedProduct);
    const openCart = useSelector(state => state.getOpenCart);
    const arr = useSelector(state => state.getProducts);
    const objProductCart = useSelector(state => state.getProductCart);
    const dispatch = useDispatch();
    const axios = require('axios');

    const isValid = (id) => { // Form validation
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
        <div 
            className='add-modal-container' 
            onClick={(e) => {
                if (e.target.classList.contains('modal-wraper')) {
                    dispatch({type: 'SET_ADD_MODAL_STATE', addModalState: false });
                }
            }}
        >
            <div className='modal-wraper'>
                <div className='modal-content'>
                    <figure>
                        <Image 
                            cloudName='itamarrosenblum'
                            publicId={selectedProduct.img}
                        />
                        <figcaption>{selectedProduct.name}</figcaption>
                    </figure>

                    <div>
                        <p>{selectedProduct.price}</p>
                    </div>

                    <div className='btn-box'>
                        { objProductCart.find(x => x.id === selectedProduct.id) ?
                        <div className='quantity-box'>
                            <button
                                onClick={() => incrementProductCart(selectedProduct.id, 'reduce')}
                            >
                                <span><IoRemoveOutline /></span>
                            </button>
                            <div>
                            {objProductCart.map(k => {
                                return(
                                    <span key={k.id}>{k.id ===selectedProduct.id ? k.productCart.quantity : null}</span>
                                    )
                                })}
                            </div>
                            <button 
                                onClick={() => incrementProductCart(selectedProduct.id, 'increment')}
                            >
                            <span><IoAddOutline /></span>
                            </button>
                        </div> 
                        :
                        <button className='add-cart-btn'
                            onClick={() => {
                            isValid(selectedProduct.id);
                        }}
                        >
                            Add to Cart
                        </button> }
                    </div>
                    <button 
                    className='btn-close-modal'
                    onClick={() => {
                        dispatch({type: 'SET_ADD_MODAL_STATE', addModalState: false });
                    }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddModal;