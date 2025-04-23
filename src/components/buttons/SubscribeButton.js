import React, {useEffect} from 'react';
import {useAuth} from "../../context/UserContext";
import {useWebSocket} from "../../context/WebSocketContext";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";

const SubscribeButton = ({ sub, setSub, userId, style = {}, setFollowersCount = (count) => {} }) => {

    const { token } = useAuth();
    const {addHandler, deleteHandler, sendData} = useWebSocket();
    const {t} = useTranslation();

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
        <button className={sub ? "publish-outline-button" : "publish-button"}
                style={{ ...style }}
                onClick={handleSub}>
            {sub ? t('unfollow') : t('follow')}
        </button>
    );
};

export default SubscribeButton;