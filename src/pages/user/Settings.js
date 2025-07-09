import React, {useState, useEffect, useRef} from 'react';
import { useAuth } from "../../context/UserContext";
import styles from './css/Settings.module.css';
import {useNavigate, useParams} from "react-router-dom";
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import EditData from './settings/EditData';
import {useTranslation} from "react-i18next";
import TelegramStar from './../../assets/icons/profileIcons/telegram-star.png';
import zzzIcon from './../../assets/icons/profileIcons/zzz.png';
import palmIcon from './../../assets/icons/profileIcons/palm.png';
import hiIcon from './../../assets/icons/profileIcons/hi.png';
import {Button} from "@mui/material";


const Settings = () => {

    const {userData} = useAuth();

    const {t} = useTranslation();

    const navigate = useNavigate();

    const [photosPage, setPhotosPage] = useState(0);

    const isFetchingRef = useRef(false);
    const lastPageRef = useRef(1);
    const scrollTimeoutRef = useRef(null);

    const resetLastPageRef = () => {
        lastPageRef.current = 1;
    }

    const resetFetchingRef = () => {
        isFetchingRef.current = false;
    }

    const initialMiniProfileIconsCoordinates = [
        { x: -40, y: 40, opacity: 0.9, size: 25 },
        { x: -10, y: -5, opacity: 1, size: 30 },
        { x: 50, y: -40, opacity: 0.9, size: 25 },
        { x: 100, y: -5, opacity: 1, size: 30 },
        { x: 140, y: 40, opacity: 0.9, size: 25 },
        { x: 100, y: 80, opacity: 1, size: 30 },
        { x: 50, y: 115, opacity: 0.9, size: 25 },
        { x: -10, y: 80, opacity: 0.9, size: 30 },
        { x: -80, y: 40, opacity: 0.4, size: 20 },
        { x: -50, y: -5, opacity: 0.5, size: 23 },
        { x: 10, y: -30, opacity: 0.5, size: 23 },
        { x: 90, y: -30, opacity: 0.5, size: 23 },
        { x: 150, y: -5, opacity: 0.5, size: 23 },
        { x: 180, y: 40, opacity: 0.5, size: 23 },
        { x: 150, y: 80, opacity: 0.5, size: 23 },
        { x: 90, y: 115, opacity: 0.5, size: 23 },
        { x: 10, y: 115, opacity: 0.5, size: 23 },
        { x: -50, y: 80, opacity: 0.5, size: 23 },
    ];

    const [miniIconsCoordinates, setMiniIconsCoordinates] = useState(initialMiniProfileIconsCoordinates);

    const handleScroll = (e) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            const { scrollHeight, scrollTop, clientHeight } = e.target;

            const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

            if (distanceToBottom <= 2500 && !isFetchingRef.current) {
                const nextPage = lastPageRef.current + 1;
                isFetchingRef.current = true;
                lastPageRef.current = nextPage;
                setPhotosPage(nextPage);
            }
        }, 100);
    };

    const handleScrollMiniIcon = (e) => {
        const scrollY = e.target.scrollTop;

        setMiniIconsCoordinates((prev) =>
            prev.map((icon, i) => {
                const startX = initialMiniProfileIconsCoordinates[i].x;
                const startY = initialMiniProfileIconsCoordinates[i].y;
                const startSize = initialMiniProfileIconsCoordinates[i].size;

                const progress = Math.min(1, scrollY / 150);

                const sizeProgress = Math.max(0.5, 1 - progress * 0.5);

                return {
                    ...icon,
                    x: startX + (50 - startX) * progress,
                    y: startY + (50 - startY) * progress,
                    size: startSize * sizeProgress,
                    opacity: icon.opacity,
                };
            })
        );
    };

    return (
        <div className={'globalProfileBlock'} onScroll={(e) => {
            handleScroll(e);
            handleScrollMiniIcon(e);
        }}>
            <div className="center-content-block">
                <div className={styles.profileBackgroundBlock} style={{marginBottom: "10px", position: "relative", paddingTop: window.Telegram.WebApp?.safeAreaInset?.top
                        ? `${window.Telegram.WebApp.safeAreaInset.top * 2}px` : '30px', background: userData.profile_color.second_color_full}}>
                    <div className={styles.miniProfileIconWrapper}>
                        <img
                            src={userData.photo_url}
                            alt={userData.first_name}
                            className={styles.profileAvatar}
                            style={{ boxShadow: `0px 0px 200px 20px ${userData.profile_color.first_color}` }}
                        />
                        <div className={styles.starWrapper}>
                            {[...Array(18)].map((_, index) => (
                                <img
                                    key={index}
                                    src={userData.mini_icon_name === 'star' ? TelegramStar : userData.mini_icon_name === 'zzz' ? zzzIcon : userData.mini_icon_name === 'hi' ? hiIcon : userData.mini_icon_name === 'palm' ? palmIcon : TelegramStar}
                                    className={styles.miniProfileIcon}
                                    style={{
                                        left: `${miniIconsCoordinates[index].x}px`,
                                        top: `${miniIconsCoordinates[index].y}px`,
                                        opacity: miniIconsCoordinates[index].opacity,
                                        width: `${miniIconsCoordinates[index].size}px`,
                                        height: `${miniIconsCoordinates[index].size}px`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={styles.profileUserInfo}>
                        <h2 style={{ color: "white", zIndex: 5 }} className={`no-wrap ${styles.profileName}`}>{userData.first_name?.substring(0, 24)} {userData.last_name?.substring(0, 24)}</h2>
                        {
                            userData?.username?.length > 0 && (
                                <p style={{ color: "white", zIndex: 5 }} className={styles.profileUsername}>@{userData.username}</p>
                            )
                        }

                    </div>


                </div>
                <div className={styles.profileButton}>

                    <Button onClick={() => navigate(`/profile/${userData.id}`)} className={'publish-outline-button'}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            viewBox="0 0 24 24"
                            width="20"
                            fill="#fff"
                        >
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>Мой профиль</span>
                    </Button>

                    <Button sx={{ marginTop: "15px" }} className={'publish-outline-button'}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            viewBox="0 0 24 24"
                            width="20"
                            fill="#fff"
                        >
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M20 5h-3.17l-1.84-2H8.99L7.17 5H4a2 2 0 00-2 2v11a2 2 0 002 2h7v-2H4V7h16v4h2V7a2 2 0 00-2-2zm-5 7a4 4 0 11-8 0 4 4 0 018 0zm5 6v-2h-2v-2h-2v2h-2v2h2v2h2v-2h2z"/>
                        </svg>
                        <span>Изменить фотографию</span>
                    </Button>

                    <EditData buttonStyle={{ marginTop: "15px" }} />
                </div>
                <MyGeneratedPhotosList
                    resetLastPageRef={resetLastPageRef}
                    resetFetchingRef={resetFetchingRef}
                    photosPage={photosPage}
                    setPhotosPage={setPhotosPage}
                    from={'createContent'}
                />
            </div>
        </div>
    );
};

export default Settings;
