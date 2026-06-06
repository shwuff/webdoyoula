import { useEffect, useState, useCallback } from 'react';

const THEMES = {
    dark: {
        '--button-color': '#007aff',
        '--primary-color': '#007aff',
        '--hover-primary-color': '#0b5fba',
        '--text-color': '#ffffff',
        '--bg-color': '#000000',
        '--secondary-bg-color': '#1c1c1e',
        '--header-bg-color': '#1c1c1e',
        '--section-bg-color': '#2c2c2e',
        '--border-color': '#38383a',
        '--hint-color': '#98989f',
        '--button-text-color': '#ffffff',
        '--secondary-text-color': '#8e8e93',
        '--button-secondary-bg-color': '#2c2c2e',
        '--glass-bg': 'rgba(255, 255, 255, 0.1)',
        '--glass-secondary-bg': 'rgba(255, 255, 255, 0.15)',
        '--glass-border': 'rgba(255, 255, 255, 0.15)',
        '--body-bg-color': '#000000',
        '--text-shadow': '0 0 6px rgba(0, 0, 0, 0.8)'
    },
    light: {
        '--button-color': '#007aff',
        '--primary-color': '#007aff',
        '--hover-primary-color': '#0b5fba',
        '--text-color': '#000000',
        '--bg-color': '#ffffff',
        '--secondary-bg-color': '#e0e0e4',
        '--header-bg-color': '#f2f2f7',
        '--section-bg-color': '#f8f8f8',
        '--border-color': '#c7c7cc',
        '--hint-color': '#8e8e93',
        '--button-text-color': '#ffffff',
        '--secondary-text-color': '#666666',
        '--button-secondary-bg-color': '#f1f1f1',
        '--glass-bg': 'rgba(255, 255, 255, 0.8)',
        '--glass-secondary-bg': 'rgba(255, 255, 255, 0.9)',
        '--glass-border': 'rgba(0, 0, 0, 0.1)',
        '--body-bg-color': '#edeef0',
        '--text-shadow': '0'
    }
};

const THEME_STORAGE_KEY = 'app_theme';

export const useThemeSetup = ({ userData }) => {
    const [currentTheme, setCurrentTheme] = useState('dark');
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

        document.documentElement.style.setProperty('--content-height', `calc(100vh)`);
        document.documentElement.style.setProperty('--safeAreaInset-top', `${window?.Telegram?.WebApp?.safeAreaInset?.top ? window?.Telegram?.WebApp?.safeAreaInset?.top * 2 : 8}px`);
        document.documentElement.style.setProperty('--safeAreaInset-top-value', `${window?.Telegram?.WebApp?.safeAreaInset?.top * 2 || 0}`);

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
    }, [userData]);

    const getCurrentTheme = useCallback(() => currentTheme, [currentTheme]);

    const isDarkTheme = useCallback(() => currentTheme === 'dark', [currentTheme]);

    const isLightTheme = useCallback(() => currentTheme === 'light', [currentTheme]);

    return {
        currentTheme,
        isDarkTheme: isDarkTheme(),
        isLightTheme: isLightTheme(),
        toggleTheme,
        setTheme,
        getCurrentTheme,
        themes: THEMES,
        applyTheme,
    };
};

export { THEMES };