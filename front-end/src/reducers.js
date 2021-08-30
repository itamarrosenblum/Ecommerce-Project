export const sessionReducer = (state = localStorage.getItem('userType'), action)=>{
    switch (action.type) {
        case 'SET_SESSION':
            return action.session;
        default:
            return state;
    }
}

export const toggleMenuReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_TOGGLE_MENU':
            return action.toggleMenu;
        default:
            return state;
    }
}

export const categoriesReducer = (state = [], action)=>{
    switch (action.type) {
        case 'SET_CATEGORIES':
            return action.categories;
        default:
            return state;
    }
}

export const productsReducer = (state = [], action)=>{
    switch (action.type) {
        case 'SET_PRODUCTS':
            return action.products;
        default:
            return state;
    }
}

export const toggleAddeReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_TOGGLE_ADD':
            return action.toggleAdd;
        default:
            return state;
    }
}

export const refetchReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_REFETCH':
            return action.refetch;
        default:
            return state;
    }
}

export const refetchCartReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_REFETCH_CART':
            return action.refetchCart;
        default:
            return state;
    }
}

export const productReducer = (state = {}, action)=>{
    switch (action.type) {
        case 'SET_PRODUCT':
            return action.product;
        default:
            return state;
    }
}

export const toggleEditReducer = (state = true, action)=>{
    switch (action.type) {
        case 'SET_TOGGLE_EDIT':
            return action.toggleEdit;
        default:
            return state;
    }
}

export const toggleEditCategoryReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_TOGGLE_EDIT_CATEGORY':
            return action.toggleEditCategory;
        default:
            return state;
    }
}

export const registerStepsDataReducer = (state = {}, action)=>{
    switch (action.type) {
        case 'SET_REGISTER_STEPS_DATA':
            return {...state, ...action.registerStepsData};
        case 'SET_RESET_REGISTER_STEPS_DATA':
            return action.registerStepsData;
        default:
            return state;
    }
}

export const errMsgRegisterReducer = (state = {}, action)=>{
    switch (action.type) {
        case 'SET_ERR_MSG_REGISTER':
            return action.errMsgRegister;
        default:
            return state;
    }
}

export const openCartReducer = (state = {}, action)=>{
    switch (action.type) {
        case 'SET_OPEN_CART':
            return action.openCart;
        default:
            return state;
    }
}

export const productCartReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_PRODUCT_CART':
            return action.productCart;
        default:
            return state;
    }
}

export const searchStatusReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_SEARCH_STATUS':
            return action.searchStatus;
        default:
            return state;
    }
}

export const totalPriceReducer = (state = 0.00, action)=>{
    switch (action.type) {
        case 'SET_TOTAL_PRICE':
            return action.totalPrice;
        default:
            return state;
    }
}

export const selectedProductReducer = (state = {}, action)=>{
    switch (action.type) {
        case 'SET_SELECTED_PRODUCT':
            return action.selectedProduct;
        default:
            return state;
    }
}

export const addModalStateReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_ADD_MODAL_STATE':
            return action.addModalState;
        default:
            return state;
    }
}

export const disabledBgReducer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_DISABLED_BG':
            return action.disabledBg;
        default:
            return state;
    }
}

export const deleteCartReduer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_DELETE_CART':
            return action.deleteCart;
        default:
            return state;
    }
}

export const cartSummeryReduer = (state = [], action)=>{
    switch (action.type) {
        case 'SET_CART_SUMMERY':
            return action.cartSummery;
        default:
            return state;
    }
}

export const refetchCartSummeryReduer = (state = false, action)=>{
    switch (action.type) {
        case 'SET_REFETCH_CART_SUMMERY':
            return action.refetchCartSummery;
        default:
            return state;
    }
}

export const cartIdReduer = (state = '', action)=>{
    switch (action.type) {
        case 'SET_CART_ID':
            return action.cartId;
        default:
            return state;
    }
}