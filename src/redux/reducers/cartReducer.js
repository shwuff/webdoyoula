import { ADD_GOOD, DELETE_GOOD, UPDATE_COUNT, SET_CART } from '../actions/cartActions';

const initialState = {
    cartList: {}
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_GOOD: {
            const cartData = action.payload.cartData;
            return {
                ...state,
                cartList: [...state.cartList, cartData],
            };
        }
        case SET_CART: {
            const cartData = action.payload.cartData;
            return {
                ...state,
                cartList: cartData
            };
        }
        case DELETE_GOOD: {
            const idToDelete = action.payload.cartId;
            return {
                ...state,
                cartList: state.cartList.filter(item => item.id !== idToDelete),
            };
        }

        case UPDATE_COUNT: {
            const { cartId, newCount } = action.payload;
            return {
                ...state,
                cartList: state.cartList.map(item =>
                    item.id === cartId ? { ...item, count: newCount } : item
                ),
            };
        }

        default:
            return state;
    }
};

export default cartReducer;
