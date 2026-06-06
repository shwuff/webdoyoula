// src/components/ThemeTransition.jsx - улучшенная версия
import React, { useEffect, useState } from 'react';
import './ThemeTransition.css';

const ThemeTransition = ({ children }) => {
    const [ripple, setRipple] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const handleThemeChange = (e) => {
            const x = e.detail?.x || window.innerWidth / 2;
            const y = e.detail?.y || window.innerHeight / 2;

            setRipple({ x, y, id: Date.now() });
            setIsTransitioning(true);

            setTimeout(() => {
                setIsTransitioning(false);
            }, 600);
        };

        // Слушаем кастомные события
        window.addEventListener('themechange', handleThemeChange);

        return () => {
            window.removeEventListener('themechange', handleThemeChange);
        };
    }, []);

    return (
        <>
            {isTransitioning && ripple && (
                <div
                    key={ripple.id}
                    className="theme-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y
                    }}
                />
            )}
            {children}
        </>
    );
};

export default ThemeTransition;