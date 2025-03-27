import React, { createContext, useContext, useState, useEffect } from 'react';

const ImageContext = createContext();

export const useImageContext = () => {
    return useContext(ImageContext);
};

export const ImageProvider = ({ children }) => {
    const [images, setImages] = useState({});
    const [currentImageContext, setCurrentImageContext] = useState(0);

    console.log(images);

    const addImage = (id, imageData) => {
        setImages((prevImages) => {
            return {
                ...prevImages,
                [id]: imageData,
            };
        });
    };

    const getImage = (id) => {
        return images[id];
    };

    const hasImage = (id) => {
        return id in images;
    };

    const updateImage = (id, newImageData) => {

        setImages((prevImages) => {
            if (id in prevImages) {
                return {
                    ...prevImages,
                    [id]: {
                        ...prevImages[id],
                        ...newImageData,
                    },
                };
            } else {
                return {
                    ...prevImages,
                    [id]: newImageData,
                };
            }
        });
    };

    useEffect(() => {
    }, [images]);

    return (
        <ImageContext.Provider value={{ addImage, getImage, hasImage, updateImage, images, currentImageContext, setCurrentImageContext }}>
            {children}
        </ImageContext.Provider>
    );
};
