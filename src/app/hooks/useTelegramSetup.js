import { useEffect } from 'react';

/**
 * Hook для настройки Telegram WebApp (fullscreen, swipes и т.д.)
 */
export const useTelegramSetup = () => {

    useEffect(() => {
        if (window.Telegram?.WebApp?.platform === 'ios') {
            if (!window.Telegram.WebApp.isFullscreen && window.Telegram.WebApp.requestFullscreen) {
                window.Telegram.WebApp.requestFullscreen();
            }
        }

        if (window.Telegram?.WebApp?.disableVerticalSwipes) {
            window.Telegram.WebApp.disableVerticalSwipes();
        }
    }, []);
};
