import React, {useState, useEffect, useRef} from 'react';
import { useAuth } from "../../context/UserContext";
import styles from './css/Settings.module.css';
import {useNavigate, useParams} from "react-router-dom";
import { useWebSocket } from "../../context/WebSocketContext";
import CircularProgress from '@mui/material/CircularProgress';
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import Modal from "../../components/modal/Modal";
import SubscribeButton from "../../components/buttons/SubscribeButton";
import CloseButton from "../../components/buttons/CloseButton";
import EditData from './settings/EditData';
import {Box, Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import TelegramStar from './../../assets/icons/profileIcons/telegram-star.png';
import zzzIcon from './../../assets/icons/profileIcons/zzz.png';
import palmIcon from './../../assets/icons/profileIcons/palm.png';
import hiIcon from './../../assets/icons/profileIcons/hi.png';
import FeedFilters from "../../components/input/FeedFilters";
import {faGift} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GiftIcon from "../../assets/svg/GiftIcon";
import PaymentModal from "../../components/modals/PaymentModal";


const Settings = () => {

    const navigate = useNavigate();
    const {userData} = useAuth();

    const {t} = useTranslation();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [photosPage, setPhotosPage] = useState(0);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [availableModels, setAvailableModels] = useState([]);

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

    return (
        <div className={'globalProfileBlock'}>
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
                    <div className={styles.editPhotoButton}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            viewBox="0 0 24 24"
                            width="20"
                            fill="#4EA5F7"
                        >
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M20 5h-3.17l-1.84-2H8.99L7.17 5H4a2 2 0 00-2 2v11a2 2 0 002 2h7v-2H4V7h16v4h2V7a2 2 0 00-2-2zm-5 7a4 4 0 11-8 0 4 4 0 018 0zm5 6v-2h-2v-2h-2v2h-2v2h2v2h2v-2h2z"/>
                        </svg>
                        <span>Изменить фотографию</span>
                    </div>
                    
                    <div className={styles.editPhotoButton}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            viewBox="0 0 24 24"
                            width="20"
                            fill="#4EA5F7"
                        >
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>Мой профиль</span>
                    </div>

                    <div className={styles.editButton}>
                        <EditData />
                    </div>
                </div>
                <div>
                    <MyGeneratedPhotosList
                        resetLastPageRef={resetLastPageRef}
                        resetFetchingRef={resetFetchingRef}
                        photosPage={photosPage}
                        setPhotosPage={setPhotosPage}
                        from={'createContent'}
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
