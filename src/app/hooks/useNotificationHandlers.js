import { useEffect, useState } from 'react';
import { useWebSocket } from '../providers/WebSocketContext';
import { useAuth } from '../providers/UserContext';

/**
 * Hook для обработки уведомлений через WebSocket
 */
export const useNotificationHandlers = () => {
    const { addHandler, deleteHandler } = useWebSocket();
    const { setUserData } = useAuth();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const handleNotification = (msg) => {
            setNotification(msg);
            if (msg.type === 'like' || msg.type === 'comment' || msg.type === 'subscribe') {
                setUserData((prev) => ({
                    ...prev,
                    has_new_notify: true
                }));
            }
        };

        addHandler('notification', handleNotification);
        return () => deleteHandler('notification');
    }, [addHandler, deleteHandler, setUserData]);

    return { notification, setNotification };
};
