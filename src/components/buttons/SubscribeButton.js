import React, {useEffect} from 'react';
import {useAuth} from "../../context/UserContext";
import {useWebSocket} from "../../context/WebSocketContext";

const SubscribeButton = ({sub, setSub, userId, setFollowersCount = (count) => {}}) => {

    const { token } = useAuth();
    const {addHandler, deleteHandler, sendData} = useWebSocket();

    const handleSub = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        sendData({ action: 'subscribe', data: { jwt: token, toUserId: userId } })
    }

    useEffect(() => {
        const handleInviteSub = (msg) => {
            setSub(msg.sub);
            setFollowersCount(msg.followersCount);
        }

        addHandler('to_subscribe', handleInviteSub);

        return () => deleteHandler('to_subscribe');

    }, []);

    return (
        <button className={`btn ${sub ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={handleSub}>
            {sub ? "Отписаться" : "Подписаться"}
        </button>
    );
};

export default SubscribeButton;