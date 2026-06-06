import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../providers/WebSocketContext';
import { useAuth } from '../providers/UserContext';

/**
 * Hook для обработки start_param из Telegram WebApp
 */
export const useStartParams = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { sendData, isConnected } = useWebSocket();
    const { token, userData } = useAuth();
    const [openedPhotoId, setOpenedPhotoId] = useState(0);

    useEffect(() => {
        const startParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
        if (!startParam) return;

        const params = startParam.split(/AAA(?!A)/);

        params.some(param => {
            const match = param.match(/userId(\w+)/);
            if (match) {
                navigate(`/profile/${match[1]}`);
                return true;
            }
            return false;
        });

        params.some(param => {
            if (param === 'selectModel') {
                navigate('/studio/create');
                return true;
            }
            return false;
        });

        params.some(param => {
            const match = param.match(/promptId([A-Za-z0-9-]+)/);
            if (match) {
                navigate(`/studio/repeat/${match[1]}`);
                return true;
            }
            return false;
        });

        params.some(param => {
            const match = param.match(/buy(\w+)/);
            if (match && token && isConnected) {
                sendData({
                    action: "payment/buy/stars",
                    data: {
                        jwt: token,
                        optionId: match[1],
                        currency: userData?.language_code === 'ru' ? 'RUB' : 'XTR',
                    }
                });
                return true;
            }
            return false;
        });

        params.some(param => {
            const match = param.match(/photoId(\w+)/);
            if (match && window.location.pathname === "/") {
                setOpenedPhotoId(match[1]);
                window.Telegram.WebApp.BackButton.show();
                sendData({
                    action: "get_photo",
                    data: {
                        jwt: token,
                        photoId: match[1],
                        answerAction: "photo_modal_studio",
                    }
                });
                return true;
            }
            setOpenedPhotoId(0);
            return false;
        });
    }, [isConnected]);

    useEffect(() => {
        if (location.pathname !== '/') {
            setOpenedPhotoId(0);
        }
    }, [location.pathname]);

    return { openedPhotoId, setOpenedPhotoId };
};
