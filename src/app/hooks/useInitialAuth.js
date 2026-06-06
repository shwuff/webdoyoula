import { useEffect } from 'react';
import { useWebSocket } from '../providers/WebSocketContext';

export const useInitialAuth = (setLoading) => {
    const { sendData, isConnected } = useWebSocket();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (token && isConnected) {
            sendData({
                action: "get/my",
                data: {
                    jwt: token
                }
            });
        }

        if (!token && isConnected) {
            setLoading(false);
        }
    }, [isConnected, sendData, setLoading]);
};
