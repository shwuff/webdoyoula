import { createStore, combineReducers } from 'redux';
import imageReducer from './reducers/imageReducer';
import cartReducer from './reducers/cartReducer';

const rootReducer = combineReducers({
    image: imageReducer,
    cart: cartReducer
});

const store = createStore(rootReducer);

export default store;