import { ADD_GOOD, DELETE_GOOD, UPDATE_COUNT } from '../actions/cartActions';

const initialState = {
    cart: {}
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_GOOD: {
            const cartData = action.payload;
            return {
                ...state,
                cart: {
                    ...state.cart,
                    [cartData.id]: cartData,
                },
            };
        }

        case DELETE_GOOD: {
            const idToDelete = action.payload;
            const newCart = { ...state.cart };
            delete newCart[idToDelete];
            return {
                ...state,
                cart: newCart,
            };
        }

        case UPDATE_COUNT: {
            const { id, count } = action.payload;
            if (!state.cart[id]) return state;
            return {
                ...state,
                cart: {
                    ...state.cart,
                    [id]: {
                        ...state.cart[id],
                        count,
                    },
                },
            };
        }

        default:
            return state;
    }
};

export default cartReducer;
