export const ADD_GOOD = 'ADD_GOOD';
export const DELETE_GOOD = 'DELETE_GOOD';
export const UPDATE_COUNT = 'UPDATE_COUNT';
export const SET_CART = 'SET_CART';

export const addGood = (cartData) => ({
    type: ADD_GOOD,
    payload: { cartData },
});

export const setCart = (cartData) => ({
    type: SET_CART,
    payload: { cartData },
});

export const deleteGood = (cartId) => ({
    type: DELETE_GOOD,
    payload: { cartId },
});

export const updateCount = (cartId, newCount) => ({
    type: UPDATE_COUNT,
    payload: { cartId, newCount },
});