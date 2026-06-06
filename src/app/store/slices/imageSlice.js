import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    images: {},
    current_image_selected: 0,
    hasImage: false
};

const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        addImage: (state, action) => {
            const { id, imageData } = action.payload;
            state.images[id] = imageData;
        },
        updateImage: (state, action) => {
            const { id, newImageData } = action.payload;
            if (state.images[id]) {
                state.images[id] = {
                    ...state.images[id],
                    ...newImageData
                };
            }
        },
        setImages: (state, action) => {
            state.images = action.payload;
        },
        setCurrentImageSelected: (state, action) => {
            state.current_image_selected = action.payload;
        },
    },
});

export const { addImage, updateImage, setImages, setCurrentImageSelected } = imageSlice.actions;
export default imageSlice.reducer;
