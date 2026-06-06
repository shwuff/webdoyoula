import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../providers/WebSocketContext';
import { useAuth } from '../providers/UserContext';

/**
 * Hook для обработки Telegram-специфичных событий через WebSocket
 */
export const useTelegramHandlers = () => {
    const { addHandler, deleteHandler, sendData, isConnected } = useWebSocket();
    const { token, userData } = useAuth();
    const navigate = useNavigate();

    // Обработка открытия инвойса
    useEffect(() => {
        const handleInvoice = (msg) => {
            if (msg.platform === 'telegram') {
                try {
                    window.Telegram.WebApp.openInvoice(msg.link.invoice_link);
                } catch (error) {
                    window.open(msg.link.invoice_link);
                }
            }
        };

        addHandler('open_invoice', handleInvoice);
        return () => deleteHandler('open_invoice');
    }, [addHandler, deleteHandler]);

    // Обработка редиректов
    useEffect(() => {
        const handleRedirect = (msg) => {
            navigate(msg.url);
        };

        addHandler('redirect', handleRedirect);
        return () => deleteHandler('redirect');
    }, [addHandler, deleteHandler, navigate]);

    // Обработка создания нового поста
    useEffect(() => {
        const handleNewPostBlank = (msg) => {
            navigate(`/post/edit/${msg.post_id}`);
        };

        addHandler('created_post_blank', handleNewPostBlank);
        return () => deleteHandler('created_post_blank');
    }, [addHandler, deleteHandler, navigate]);

    return { sendData, isConnected, token, userData };
};
