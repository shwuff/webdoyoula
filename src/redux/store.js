import { createStore, combineReducers } from 'redux';
import imageReducer from './reducers/imageReducer';

const rootReducer = combineReducers({
    image: imageReducer,
});

const store = createStore(rootReducer);

export default store;