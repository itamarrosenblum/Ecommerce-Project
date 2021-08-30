import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createStore, combineReducers } from 'redux';
import { 
  sessionReducer, 
  toggleMenuReducer, 
  categoriesReducer, 
  productsReducer, 
  toggleAddeReducer, 
  refetchReducer,
  productReducer,
  toggleEditReducer,
  toggleEditCategoryReducer,
  registerStepsDataReducer,
  errMsgRegisterReducer,
  openCartReducer,
  productCartReducer,
  refetchCartReducer,
  searchStatusReducer,
  totalPriceReducer,
  selectedProductReducer,
  addModalStateReducer,
  disabledBgReducer,
  deleteCartReduer,
  cartSummeryReduer,
  refetchCartSummeryReduer,
  cartIdReduer } from './reducers';
import { Provider } from 'react-redux';

const store = createStore(combineReducers({
  getSession: sessionReducer,
  getToggleMenu: toggleMenuReducer,
  getCategories: categoriesReducer,
  getProducts: productsReducer,
  getToggleAdd: toggleAddeReducer,
  getRefetch: refetchReducer,
  getProduct: productReducer,
  getToggleEdit: toggleEditReducer,
  getToggleEditCategory: toggleEditCategoryReducer,
  getRegisterStepsDataReducer: registerStepsDataReducer,
  getErrMsgRegisterReducer: errMsgRegisterReducer,
  getOpenCart: openCartReducer,
  getProductCart: productCartReducer,
  getRefetchCart: refetchCartReducer,
  getSearchStatus: searchStatusReducer,
  getTotalPrice: totalPriceReducer,
  getSelectedProduct: selectedProductReducer,
  getAddModalState: addModalStateReducer,
  getDisabledBg: disabledBgReducer,
  getDeleteCart: deleteCartReduer,
  getCartSummery: cartSummeryReduer,
  getRefetchCartSummery: refetchCartSummeryReduer,
  getCartId: cartIdReduer
}))

ReactDOM.render(
  <Provider store={store}> 
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
