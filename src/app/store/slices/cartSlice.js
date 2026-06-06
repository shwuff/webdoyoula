import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartList: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addGood: (state, action) => {
            const cartData = action.payload;
            state.cartList.push(cartData);
        },
        setCart: (state, action) => {
            state.cartList = action.payload;
        },
        deleteGood: (state, action) => {
            const cartId = action.payload;
            state.cartList = state.cartList.filter(item => item.id !== cartId);
        },
        updateCount: (state, action) => {
            const { cartId, newCount } = action.payload;
            const item = state.cartList.find(item => item.id === cartId);
            if (item) {
                item.count = newCount;
            }
        },
    },
});

export const { addGood, deleteGood, setCart, updateCount } = cartSlice.actions;
export default cartSlice.reducer;
