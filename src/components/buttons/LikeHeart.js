import React, { useEffect, useState, useRef } from 'react';
import HeartIcon from './../../assets/icons/heart.png';
import RedHeartIcon from './../../assets/icons/red-heart.png';
import HeartAnimate from './../../assets/gif/heart-animate.gif';
import './LikeHeart.css';

const LikeHeart = ({ liked }) => {
    const [animate, setAnimate] = useState(false);
    const [imgSrc, setImgSrc] = useState(liked ? RedHeartIcon : HeartIcon);
    const isFirstRender = useRef(true);

    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setAnimate(true);

        if (liked) {
            setImgSrc(RedHeartIcon);

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
            setImgSrc(HeartIcon);
            const timer = setTimeout(() => {
                setAnimate(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [liked]);

    return (
        <img
            src={imgSrc}
            alt=""
            className={`heartIcon ${animate ? liked ? 'scale-animation-like' : 'scale-animation' : ''}`}
        />
    );
};

export default LikeHeart;
