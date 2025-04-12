import { useDispatch, useSelector } from 'react-redux';

export const ADD_GOOD = 'ADD_IMAGE';
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
    type: ADD_GOOD,
    payload: { cartId },
});

export const updateCount = (newCount) => ({
    type: UPDATE_COUNT,
    payload: { newCount },
});