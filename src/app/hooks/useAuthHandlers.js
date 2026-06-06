import { useEffect } from 'react';
import { useWebSocket } from '../providers/WebSocketContext';
import { useAuth } from '../providers/UserContext';

/**
 * Hook для обработки событий авторизации через WebSocket
 */
export const useAuthHandlers = (setLoading) => {
    const { addHandler, deleteHandler, isConnected } = useWebSocket();
    const { login, setUserData, setMyLoras } = useAuth();

    useEffect(() => {
        if (!isConnected) return;

        addHandler('authorization', (msg) => {
            if (msg.session) {
                localStorage.setItem('auth_token', msg.session);
            }
            login(msg.session || msg.jwt);
            setUserData(msg.user);
            setMyLoras(msg.loras);
            setLoading(false);
        });

        return () => {
            deleteHandler('authorization');
        };
    }, [isConnected, addHandler, deleteHandler, login, setUserData, setMyLoras, setLoading]);

    useEffect(() => {
        if (!isConnected) return;

        addHandler('unauthorization', (msg) => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                localStorage.removeItem('auth_token');
            }
        });

        return () => {
            deleteHandler('unauthorization');
        };
    }, [isConnected, addHandler, deleteHandler]);

    useEffect(() => {
        if (!isConnected) return;

        addHandler('get/my', (msg) => {
            const token = localStorage.getItem('auth_token');
            login(token);
            setUserData(msg.user);
            setMyLoras(msg.loras);
            setLoading(false);
        });

        return () => {
            deleteHandler('get/my');
        };
    }, [isConnected, addHandler, deleteHandler, login, setUserData, setMyLoras, setLoading]);
};
