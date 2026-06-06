import React from 'react';
import { ArrowUpwardRounded } from "@mui/icons-material";

/**
 * Компонент кнопки прокрутки наверх
 */
const ScrollToTopButton = ({ showButton, onClick }) => {
    if (!showButton) return null;

    return (
        <>
            <button className="scrollToTop" onClick={onClick}>
                <ArrowUpwardRounded />
            </button>
            <button className="scrollToTop" style={{ left: "16px" }} onClick={onClick}>
                <ArrowUpwardRounded />
            </button>
        </>
    );
};

export default ScrollToTopButton;
