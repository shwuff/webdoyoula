import React from 'react';
import styles from './css/Button.module.css';

const Button = ({ onClick, children, style, className }) => {
    return (
        <button onClick={onClick} style={style} className={`${className} ${styles.button}`}>
            {children}
        </button>
    );
};

export default Button;