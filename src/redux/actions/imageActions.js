export const ADD_IMAGE = 'ADD_IMAGE';
export const UPDATE_IMAGE = 'UPDATE_IMAGE';
export const SET_IMAGES = 'SET_IMAGES';
export const GET_IMAGE = 'GET_IMAGE';
export const HAS_IMAGE = 'HAS_IMAGE';
export const SET_CURRENT_IMAGE_SELECTED = 'SET_CURRENT_IMAGE_SELECTED';
export const GET_CURRENT_IMAGE_SELECTED = 'GET_CURRENT_IMAGE_SELECTED';

export const addImage = (id, imageData) => ({
    type: ADD_IMAGE,
    payload: { id, imageData },
});

export const updateImage = (id, newImageData) => ({
    type: UPDATE_IMAGE,
    payload: { id, newImageData },
});

export const setImages = (images) => ({
    type: SET_IMAGES,
    payload: images,
});

export const setCurrentImageSelected = (id) => ({
    type: SET_CURRENT_IMAGE_SELECTED,
    payload: id,
});