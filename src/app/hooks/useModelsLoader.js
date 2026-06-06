import { useEffect } from 'react';
import { useWebSocket } from '../providers/WebSocketContext';
import { useAuth } from '../providers/UserContext';

/**
 * Hook для загрузки моделей при наличии токена
 */
export const useModelsLoader = () => {
    const { sendData } = useWebSocket();
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            sendData({
                action: "get/models",
                data: {
                    jwt: token,
                    optimized: true
                }
            });
        }
    }, [token, sendData]);
};
