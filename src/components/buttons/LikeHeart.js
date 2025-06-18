import React, { useEffect, useState, useRef } from 'react';
import HeartIcon from "../../assets/svg/HeartIcon";
import './css/LikeHeart.css';

const LikeHeart = ({ liked }) => {
    const [animate, setAnimate] = useState(false);
    const isFirstRender = useRef(true);

    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setAnimate(true);

        if (liked) {

            const hapticInterval = setInterval(() => {
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
            }, 500);

            const timer = setTimeout(() => {
                setAnimate(false);
                clearInterval(hapticInterval);
            }, 1000);

            return () => {
                clearTimeout(timer);
                clearInterval(hapticInterval);
            };
        } else {
            const timer = setTimeout(() => {
                setAnimate(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [liked]);

    return (
        <HeartIcon liked={liked} className={`heartIcon ${animate ? liked ? 'scale-animation-like' : 'scale-animation' : ''}`} />
    );
};

export default LikeHeart;
