import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './slices/imageSlice';
import cartReducer from './slices/cartSlice';
import modelReducer from './slices/modelSlice';
import chatReducer from './slices/chatSlice';

const store = configureStore({
    reducer: {
        image: imageReducer,
        cart: cartReducer,
        model: modelReducer,
        chat: chatReducer,
    },
    // Redux Toolkit включает redux-thunk и другие middleware по умолчанию
    // Можно добавить кастомные middleware если нужно
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Игнорируем некоторые actions если нужно
                ignoredActions: [],
            },
        }),
});

export default store;