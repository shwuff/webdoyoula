import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    models: []
};

const modelSlice = createSlice({
    name: 'model',
    initialState,
    reducers: {
        setModels: (state, action) => {
            state.models = action.payload;
        },
    },
});

export const { setModels } = modelSlice.actions;
export default modelSlice.reducer;
