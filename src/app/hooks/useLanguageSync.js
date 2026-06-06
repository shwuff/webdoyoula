import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../providers/UserContext';

/**
 * Hook для синхронизации языка приложения с языком пользователя
 */
export const useLanguageSync = () => {
    const { userData } = useAuth();
    const { i18n } = useTranslation();

    useEffect(() => {
        if (userData?.language_code) {
            if (userData.language_code === 'ru') {
                i18n.changeLanguage('ru');
            } else {
                i18n.changeLanguage('en');
            }
        }
    }, [userData, i18n]);
};
