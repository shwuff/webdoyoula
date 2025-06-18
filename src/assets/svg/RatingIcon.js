import React from 'react';

const RatingIcon = ({className, active}) => {

    const color = '#fff';

    if(active) {
        return (
            <svg className={className} fill={color}
                 height="24" role="img" viewBox="0 0 24 24" width="24">
                <path
                    d="M18.44 1H5.56A4.566 4.566 0 0 0 1 5.56v12.88A4.566 4.566 0 0 0 5.56 23h12.88A4.566 4.566 0 0 0 23 18.44V5.56A4.566 4.566 0 0 0 18.44 1ZM9 16a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0v3Zm4 0a1 1 0 1 1-2 0V8a1 1 0 1 1 2 0v8Zm4 0a1 1 0 1 1-2 0v-6a1 1 0 1 1 2 0v6Z"></path>
            </svg>
        )
    }

    return (
        <svg className={className} fill={color} height="24"
             role="img" viewBox="0 0 24 24" width="24">
            <path
                d="M8 12a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1Zm8-3a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Zm-4-2a1 1 0 0 0-1 1v8a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Z"></path>
            <path
                d="M18.44 1H5.567a4.565 4.565 0 0 0-4.56 4.56v12.873a4.565 4.565 0 0 0 4.56 4.56H18.44a4.565 4.565 0 0 0 4.56-4.56V5.56A4.565 4.565 0 0 0 18.44 1ZM21 18.433a2.563 2.563 0 0 1-2.56 2.56H5.567a2.563 2.563 0 0 1-2.56-2.56V5.56A2.563 2.563 0 0 1 5.568 3H18.44A2.563 2.563 0 0 1 21 5.56v12.873Z"></path>
        </svg>
    );
};

export default RatingIcon;