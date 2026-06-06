// src/app/providers/ThemeContext.jsx
import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import {useAuth} from "./UserContext";

const THEMES = {
    dark: {
        '--button-color': '#007aff',
        '--primary-color': '#007aff',
        '--hover-primary-color': '#0b5fba',
        '--text-color': '#ffffff',
        '--bg-color': '#000000',
        '--secondary-bg-color': '#35353a',
        '--header-bg-color': '#1c1c1e',
        '--section-bg-color': '#2c2c2e',
        '--border-color': '#38383a',
        '--hint-color': '#98989f',
        '--button-text-color': '#ffffff',
        '--secondary-text-color': '#4c4c50',
        '--button-secondary-bg-color': '#2c2c2e',
        '--glass-bg': 'rgba(255, 255, 255, 0.1)',
        '--glass-secondary-bg': 'rgba(255, 255, 255, 0.15)',
        '--glass-border': 'rgba(255, 255, 255, 0.15)',
        '--body-bg-color': '#000000',
        '--text-shadow': '0 0 6px rgba(0, 0, 0, 0.8)',
        '--hover-bg-color': '#615959',
        '--low-bg-color': 'rgb(0,0,0, 0.1)',
        '--danger-color': 'red'
    },
    light: {
        '--button-color': '#007aff',
        '--primary-color': '#007aff',
        '--hover-primary-color': '#0b5fba',
        '--text-color': '#000000',
        '--bg-color': '#ffffff',
        '--secondary-bg-color': '#e0e0e4',
        '--header-bg-color': '#edeef0',
        '--section-bg-color': '#f8f8f8',
        '--border-color': '#c7c7cc',
        '--hint-color': '#8e8e93',
        '--button-text-color': '#ffffff',
        '--secondary-text-color': '#666666',
        '--button-secondary-bg-color': '#f1f1f1',
        '--glass-bg': 'rgba(255, 255, 255, 0.8)',
        '--glass-secondary-bg': 'rgba(255, 255, 255, 0.9)',
        '--glass-border': 'rgba(92,80,80,0.1)',
        '--body-bg-color': '#edeef0',
        '--text-shadow': '0',
        '--hover-bg-color': '#f1eeee',
        '--low-bg-color': 'rgb(255,255,255, 0.1)',
        '--danger-color': 'red'
    }
};

const THEME_STORAGE_KEY = 'app_theme';

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
    const {userData} = useAuth();
    const [currentTheme, setCurrentTheme] = useState(window.Telegram.WebApp.themeParams ? window.Telegram.WebApp.colorTheme : 'dark');
    const [isInitialized, setIsInitialized] = useState(false);

    const applyTheme = useCallback((themeName) => {
        const theme = THEMES[themeName];

        if (!theme) {
            console.warn(`Тема "${themeName}" не найдена`);
            return;
        }

        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });

        localStorage.setItem(THEME_STORAGE_KEY, themeName);
        setCurrentTheme(themeName);

        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${themeName}`);

        console.log(`Тема "${themeName}" применена`);
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        return newTheme;
    }, [currentTheme, applyTheme]);

    const setTheme = useCallback((themeName) => {
        if (THEMES[themeName]) {
            applyTheme(themeName);
        } else {
            console.error(`Неизвестная тема: ${themeName}`);
        }
    }, [applyTheme]);

    useEffect(() => {
        if (isInitialized) return;

        const telegramTheme = window?.Telegram?.WebApp?.colorScheme;
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        let themeToApply = 'dark';

        if (savedTheme && THEMES[savedTheme]) {
            themeToApply = savedTheme;
        } else if (telegramTheme && THEMES[telegramTheme]) {
            themeToApply = telegramTheme;
        } else if (prefersDark) {
            themeToApply = 'dark';
        } else {
            themeToApply = 'light';
        }

        applyTheme(themeToApply);
        setIsInitialized(true);
    }, [applyTheme, isInitialized]);

    useEffect(() => {
        const themeParams = window?.Telegram?.WebApp?.themeParams;
        if (themeParams?.secondary_bg_color) {
            window.Telegram?.WebApp?.setBottomBarColor(themeParams.secondary_bg_color);
        }
        document.documentElement.style.setProperty('--content-height', `calc(100vh)`);
        document.documentElement.style.setProperty('--safeAreaInset-top', `${window?.Telegram?.WebApp?.safeAreaInset?.top ? window?.Telegram?.WebApp?.safeAreaInset?.top * 2 : 6}px`);
        document.documentElement.style.setProperty('--safeAreaInset-top-value', `${window?.Telegram?.WebApp?.safeAreaInset?.top || 0}px`);
        document.documentElement.style.setProperty('--default-font-family', `"ui-sans-serif","-apple-system","system-ui","Segoe UI","Helvetica","Apple Color Emoji","Arial","sans-serif","Segoe UI Emoji","Segoe UI Symbol"`);
    }, [userData]);

    const isDarkTheme = currentTheme === 'dark';
    const isLightTheme = currentTheme === 'light';

    const value = {
        currentTheme,
        isDarkTheme,
        isLightTheme,
        toggleTheme,
        setTheme,
        themes: THEMES,
        applyTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme должен использоваться внутри CustomThemeProvider');
    }
    return context;
};