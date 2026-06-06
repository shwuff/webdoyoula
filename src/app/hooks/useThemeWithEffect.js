// src/hooks/useThemeWithEffect.js
import { useTheme } from './../providers/ThemeContext';
import { useCallback } from 'react';

export const useThemeWithEffect = () => {
    const theme = useTheme();

    const toggleThemeWithEffect = useCallback((event) => {
        const themeChangeEvent = new CustomEvent('themechange', {
            detail: {
                x: event?.clientX || window.innerWidth / 2,
                y: event?.clientY || window.innerHeight / 2
            }
        });
        window.dispatchEvent(themeChangeEvent);

        setTimeout(() => {
            theme.toggleTheme();
        }, 100);

    }, [theme]);

    const setThemeWithEffect = useCallback((themeName, event) => {
        if (themeName === theme.currentTheme) return;

        const themeChangeEvent = new CustomEvent('themechange', {
            detail: {
                x: event?.clientX || window.innerWidth / 2,
                y: event?.clientY || window.innerHeight / 2
            }
        });
        window.dispatchEvent(themeChangeEvent);

        setTimeout(() => {
            theme.setTheme(themeName);
        }, 100);

    }, [theme]);

    return {
        ...theme,
        toggleTheme: toggleThemeWithEffect,
        setTheme: setThemeWithEffect
    };
};