import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ImageContext = createContext();

export const useImageContext = () => {
    return useContext(ImageContext);
};

export const ImageProvider = ({ children }) => {
    const [images, setImages] = useState({});
    const [currentImageContext, setCurrentImageContext] = useState(0);

    const addImage = useCallback((id, imageData) => {
        setImages((prevImages) => ({
            ...prevImages,
            [id]: imageData,
        }));
    }, []);

    const getImage = useCallback((id) => {
        return images[id];
    }, [images]); // зависимость от images, так как мы обращаемся к состоянию

    const hasImage = useCallback((id) => {
        return id in images;
    }, [images]); // зависимость от images

    const updateImage = useCallback((id, newImageData) => {
        setImages((prevImages) => ({
            ...prevImages,
            [id]: {
                ...prevImages[id],
                ...newImageData
            }
        }));
    }, []);

    return (
        <ImageContext.Provider value={{ addImage, getImage, hasImage, updateImage, images, currentImageContext, setCurrentImageContext }}>
            {children}
        </ImageContext.Provider>
    );
};
