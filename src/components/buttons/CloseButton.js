import React from 'react';
import './CloseButton.css';

const CloseButton = ({ onClick }) => {
    return (
        <button className="close-button" onClick={onClick} aria-label="Close">
            <span className="close-icon"></span>
        </button>
    );
};

export default CloseButton;
