import './AddProduct.css';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoImageOutline } from 'react-icons/io5';
import { GrPowerReset } from 'react-icons/gr';

const AddProduct = () => {
    const [obj, setObj] = useState({});
    const [previewSource, setPreviewSource] = useState('');
    const [isSelect, setIsSelect] = useState(false);
    const [isInput, setIsInput] = useState(false);
    const [spinnerState, setSpinnerState] = useState(false);
    const [errMsgImg, setErrMsgImg] = useState('');
    const [errMsgProdName, setErrMsgProdName] = useState('');
    const [errMsgCat, setErrMsgCat] = useState('');
    const [errMsgNewCat, setErrMsgNewCat] = useState('');
    const [errMsgPrice, setErrMsgPrice] = useState('');
    const select = useRef(null);
    const form = useRef(null);
    const inputNewCategory = useRef(null);
    const arr = useSelector(state => state.getCategories);
    const dispatch = useDispatch();
    const axios = require('axios');

    const handleTextInputChange = (e) => { // Input text validation
        e.preventDefault();

        if (e.target.productName.value !== '') { // Product name validation
            obj.productName = e.target.productName.value;
        } else {
            setErrMsgProdName('Please enter the product name');
            delete obj.productName;
        }

        if (e.target.category.value) { // Category validation
            obj.categoryId = e.target.category.value;
        } else if (!e.target.category.value 
            && !/[a-zA-Z].{2,}/.test(e.target.newCategory.value 
            && e.target.newCategory.value.length === 0)) {
            setErrMsgCat('Please selecta a catagory');
            delete obj.categoryId;
        }

        if (e.target.newCategory.value.length > 0) { // New Category validation
            if (/[a-zA-Z].{2,}/.test(e.target.newCategory.value)) {
                obj.newCategory = e.target.newCategory.value;
            } else if (!/[a-zA-Z].{2,}/.test(e.target.newCategory.value) && !e.target.category.value) {
                setErrMsgNewCat('Please enter 3 or more letters');
                delete obj.newCategory;
            }
        } else if (e.target.newCategory.value.length === 0 && !e.target.category.value) {
            setErrMsgNewCat('Please enter the new category name');
            delete obj.newCategory;
        }
    
        if (e.target.price.value.length > 0) { // Price validation
            if (/^\d*\.?\d{2}$/.test(e.target.price.value)) {
                obj.price = e.target.price.value;
            } else {
                setErrMsgPrice('Please enter a decimal value');
                delete obj.price;
            }
        } else {
            setErrMsgPrice('Please enter the price');
            delete obj.price;
        }
        
        if (!e.target.img.value) { // Image validation
            setErrMsgImg('Please select an image');
        }

        return isValid();
    }
    

    const handleFileInputChange = (e) => { // Input file (img) validation
        if (e.target.files[0]) {
            if (/^.*\.(jpg|JPG|png|PNG|jpeg|JPEG)$/.test(e.target.files[0].name)) {
                e.target.setCustomValidity('');

                const file = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
        
                reader.onloadend = () => {
                   if (file) {
                    setErrMsgImg('');
                    obj.img = reader.result;
                    previewFile(file);
                   }
                }
                
                reader.onerror = () => {
                    console.error('Failed to generate the image');
                }    
            } else {
                delete obj.img;
                console.error('Supported file formats: JPG/JPEG and PNG');
            }
        }
    }

    const previewFile = (file) => { // Img preview function
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreviewSource(reader.result);
            }
        }
    }

    const isValid = () => { // Object validation function
        if (Object.keys(obj).length === 4) {
            if (obj.categoryId >= 0 && !obj.newCategory) {
                addNewProduct(
                    obj.productName,
                    obj.categoryId,
                    obj.price,
                    obj.img
                );
            } else if (obj.newCategory && !obj.categoryId) {
                createCategory(
                    obj.productName,
                    obj.newCategory,
                    obj.price,
                    obj.img
                );
            } else {
                console.error('Something went wrong');
            }
        }
    }

    const addNewProduct = async (productName, category, price, img) => { // Fetch new product
        try {
            setSpinnerState(true);
            const res = await axios.post('http://localhost:3001/product', 
            {productName: productName, category: category, price: price, img: img});
            setSpinnerState(false);
            
            if (res.data.status === '200') {
                dispatch({type: 'SET_REFETCH', refetch: Math.random() * 2});
                setPreviewSource('');  
                setIsInput(false);
                setIsSelect(false);
                setObj({});
                form.current.reset();
            } else {
                console.error('Something went wrong');
            }  
        } catch (err) {
            console.error(err);
        }
    }

    const createCategory = async (productName, newCategory, price, img) => { // Fetch new category
        try {
            const res = await axios.post('http://localhost:3001/category', 
            {newCategory: newCategory});
            setSpinnerState(false);

            if (res.data.status === '200') {
                dispatch({type: 'SET_CATEGORIES', categories: res.data.categories});
                addNewProduct(
                    productName,
                    res.data.category,
                    price,
                    img
                );
            } else {
                setErrMsgNewCat(res.data.data);
            }  
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form 
            className='add-product-form'
            onSubmit={handleTextInputChange} 
            autoComplete='off'
            ref={form}
        >
            <div className='img-box'>
                <input 
                    type='file' 
                    name='img' 
                    id='img'
                    className='input-file'
                    accept='image/png, image/jpeg, image/jpg'
                    onChange={handleFileInputChange}
                />

                { previewSource ? 
                <figure className='img-preview-box'>
                    <label htmlFor='img'>
                        <img src={previewSource} alt='Preview' title='Click to select image' />
                    </label>
                </figure>
                :
                <div className='placeholder-box'>
                    <span><IoImageOutline /></span>
                    <label htmlFor='img' className='img-btn'>Select Image</label>

                </div> } 
                <span className='err-msg'>{errMsgImg}</span>
            </div>

            <div className='product-name-box'>
                <label htmlFor='productName'>Product Name</label>
                <input 
                    type='text' 
                    name='productName' 
                    id='productName'
                    placeholder='e.g. Ice Cream, Vanilla'
                    onChange={(e) => {
                        if (errMsgProdName && e.target.value.length > 0) {
                            setErrMsgProdName('');
                        }
                    }}
                />
                <span className='err-msg'>{errMsgProdName}</span>
            </div>

            <div className='category-box'>
                <label htmlFor='category'>Select a Category</label>
                <div className='category-box-wraper'>
                    <select 
                        name='category' 
                        id='category' 
                        defaultValue=''
                        disabled={isSelect} 
                        ref={select} 
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setErrMsgCat('');
                                setErrMsgNewCat('');
                                setIsInput(true);
                            }
                        }}
                    >
                        <option disabled hidden value=''>Select a Category</option>
                        {arr.map(e => {
                            return(
                                <option 
                                    id={e.id} 
                                    value={e.id} 
                                    key={e.id}
                                >
                                    {e.name}
                                </option>
                            );
                        })}
                    </select>
                    <button 
                        className='select-reset-btn'
                        type='button'
                        disabled={isSelect} 
                        title='Click to Reset'
                        onClick={()=> {
                            select.current.value = '';
                            setIsInput(false);
                        }}
                    >
                        <span><GrPowerReset /></span>
                    </button>
                </div>
                <span className='err-msg'>{errMsgCat}</span>
            </div> 

            <div className='add-category-box'>
                <label htmlFor='newCategory'>Create a new Category</label>
                <input 
                    type='text' 
                    name='newCategory' 
                    id='newCategory' 
                    placeholder='e.g. Frozen'
                    disabled={isInput}
                    ref={inputNewCategory}
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            setErrMsgNewCat('');
                            setErrMsgCat('');
                            setIsSelect(true);
                        } else {
                            setIsSelect(false);
                        }
                    }}
                />
                <span className='err-msg'>{errMsgNewCat}</span>
            </div>  

            <div className='price-box'>
                <label htmlFor='price'>Product Price</label>
                <input 
                    type='text' 
                    name='price' 
                    id='price' 
                    placeholder='e.g. 4.95'
                    onChange={(e) => {
                        if (e.target.value.length > 0) {
                            setErrMsgPrice('');
                        }
                    }}
                />
                <span className='err-msg'>{errMsgPrice}</span>
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
                    : 
                    <button type='submit' className='btn-add'>
                        Add Product
                    </button>
                }
            </div>
        </form>
    );
}

export default AddProduct;