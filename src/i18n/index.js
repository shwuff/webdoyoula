import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { v4 as uuidv4 } from 'uuid';

const getOrCreateUUID = () => {
    const uuid = uuidv4();

    return uuid;
};

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        lng: 'en',

        backend: {
            loadPath: (lng) => {
                const uuid = getOrCreateUUID();
                return `https://api.doyoula.com/translation/{{lng}}.json?id=${uuid}`;
            },
            crossDomain: true,
            requestOptions: {
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'default'
            }
        },

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;