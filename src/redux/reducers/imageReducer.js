import { ADD_IMAGE, UPDATE_IMAGE, SET_IMAGES, GET_IMAGE, HAS_IMAGE, SET_CURRENT_IMAGE_SELECTED, GET_CURRENT_IMAGE_SELECTED } from '../actions/imageActions';

const initialState = {
    images: {},
    current_image_selected: 0,
    hasImage: false
};

const imageReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_IMAGE:
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.payload.id]: action.payload.imageData,
                },
            };
        case UPDATE_IMAGE:
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.payload.id]: {
                        ...state.images[action.payload.id],
                        ...action.payload.newImageData,
                    },
                },
            };
        case SET_IMAGES:
            return {
                ...state,
                images: action.payload,
            };
        case SET_CURRENT_IMAGE_SELECTED:
            return {
                ...state,
                current_image_selected: action.payload,
            };
        default:
            return state;
    }
};

export default imageReducer;
