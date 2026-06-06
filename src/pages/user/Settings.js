import React, {useState, useRef} from 'react';
import { useAuth } from "../../app/providers/UserContext";
import styles from './css/Settings.module.css';
import {useNavigate} from "react-router-dom";
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import EditData from './settings/EditData';
import {useTranslation} from "react-i18next";
import {Box, Button} from "@mui/material";
import ToggleSlider from "../../components/teegee/ToogleSlider/ToggleSlider";
import PromptsHistory from "../../components/gallery/PromptsHistory";
import LucideIcon from "../../assets/icons/LucideIcon";
import {useThemeWithEffect} from "../../app/hooks/useThemeWithEffect";
import RightModal from "../../components/modal/RightModal";
import {useWebSocket} from "../../app/providers/WebSocketContext";

const LanguageOption = ({ code, name, onClick, isActive }) => (
    <div
        onClick={onClick}
        style={{
            padding: '16px',
            backgroundColor: isActive ? 'var(--primary-color)' : 'var(--secondary-bg-color)',
            color: isActive ? 'var(--text-color)' : 'var(--text-color)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: isActive ? 'white' : 'var(--text-color)'
            }}>
                {code.toUpperCase()}
            </div>
            <span style={{ fontWeight: '500', color: isActive ? 'white' : "var(--text-color)"}}>{name}</span>
        </div>
    </div>
);

const Settings = () => {

    const {userData, token, updateUserData} = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const {sendData} = useWebSocket();

    const { isDarkTheme, setTheme } = useThemeWithEffect();

    const [photosPage, setPhotosPage] = useState(0);

    const isFetchingRef = useRef(false);
    const lastPageRef = useRef(0);
    const scrollTimeoutRef = useRef(null);
    const [showSaved, setShowSaved] = useState(false);
    const [showPromptsHistory, setShowPromptsHistory] = useState(false);
    const [languageModalOpen, setLanguageModalOpen] = useState(false);

    const resetLastPageRef = () => {
        lastPageRef.current = 0;
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
        }, 0);
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

    const toggleShowSaved = (i) => {
        setPhotosPage(0)
        resetLastPageRef();
        resetFetchingRef();
        if(i === 0) {
            setShowSaved(false);
            setShowPromptsHistory(false);
        } else if(i === 1) {
            setShowSaved(true);
            setShowPromptsHistory(false);
        } else if(i === 2) {
            setShowSaved(false);
            setShowPromptsHistory(true);
        }
    }

    const switchLanguage = (language_code) => {
        setLanguageModalOpen(false);

        sendData({
            action: "user/update/language",
            data: { jwt: token, language_code: language_code }
        });

        updateUserData({
            ...userData,
            language_code: language_code,
        });

        i18n.changeLanguage(language_code);

        window?.Telegram?.WebApp?.BackButton?.hide();
        window?.Telegram?.WebApp?.BackButton?.offClick();
    }

    return (
        <div className={'globalBlock'} onScroll={(e) => {
            handleScroll(e);
            handleScrollMiniIcon(e);
        }}>
            <div className="center-content-block">
                <div className="d-flex" style={{ gap: "12px" }}>
                    <img
                        src={userData.photo_url}
                        alt={userData.first_name}
                        className={styles.profileAvatar}
                    />
                    <div className={"d-flex justify-content-between w-100"}>
                        <div>
                            <h2 style={{ zIndex: 5 }} className={`no-wrap ${styles.profileName}`}>{userData.first_name?.substring(0, 24)} {userData.last_name?.substring(0, 24)}</h2>
                            {
                                userData?.username?.length > 0 && (
                                    <p className={styles.profileUsername}>@{userData.username}</p>
                                )
                            }
                        </div>
                        <div>
                            <span>
                                {
                                    isDarkTheme ? (
                                        <button data-theme-toggle className={"publish-button"} onClick={() => setTheme('light')}>
                                            <LucideIcon name={"Sun"} />
                                        </button>
                                    ) : (
                                        <button data-theme-toggle className={"publish-button"} onClick={() => setTheme('dark')}>
                                            <LucideIcon name={"Moon"} />
                                        </button>
                                    )
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className={`p-2-phone ${styles.profileButton}`} id={"generation-history"}>

                    <Button sx={{ marginBottom: "15px", display: "flex", gap: "4px" }} onClick={() => navigate(`/profile/${userData.id}`)} className={'publish-outline-button'}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            viewBox="0 0 24 24"
                            width="20"
                            fill="var(--text-color)"
                        >
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>{t("My Profile")}</span>
                    </Button>

                    <EditData buttonStyle={{ marginBottom: "15px" }} />

                    <Button onClick={() => {
                        setLanguageModalOpen(true);
                        window?.Telegram?.WebApp?.BackButton?.show();
                        window?.Telegram?.WebApp?.BackButton?.onClick(() => {
                            setLanguageModalOpen(false);
                            window?.Telegram?.WebApp?.BackButton?.offClick();
                        });
                    }} sx={{ marginBottom: "15px", display: "flex", gap: "8px" }} className={'publish-outline-button'}>
                        <LucideIcon name={"Languages"} color={"var(--text-color)"} size={18} />
                        <span>{t("Change Language")}</span>
                    </Button>

                    <RightModal isOpen={languageModalOpen} onClose={() => setLanguageModalOpen(false)}>
                        <Box p={2}>
                            <h3 style={{ marginBottom: '24px', marginTop: "12px", color: 'var(--text-color)' }}>
                                {t("Select Language")}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                                <LanguageOption
                                    code="en"
                                    name="English"
                                    onClick={() => {
                                        switchLanguage('en');
                                        setLanguageModalOpen(false);
                                    }}
                                    isActive={userData.language_code === 'en'}
                                />

                                <LanguageOption
                                    code="ru"
                                    name="Русский"
                                    onClick={() => {
                                        switchLanguage('ru');
                                        setLanguageModalOpen(false);
                                    }}
                                    isActive={userData.language_code === 'ru'}
                                />
                            </div>
                        </Box>
                    </RightModal>

                    <ToggleSlider
                        options={[t('My Generations'), t('Saved'), t('Prompts history')]}
                        onChange={toggleShowSaved}
                    />
                </div>
                <div>
                    {
                        showPromptsHistory ? (
                            <PromptsHistory
                                resetLastPageRef={resetLastPageRef}
                                resetFetchingRef={resetFetchingRef}
                                page={photosPage}
                                setPage={setPhotosPage}
                            />
                        ) : (
                            <MyGeneratedPhotosList
                                key={showSaved}
                                resetLastPageRef={resetLastPageRef}
                                resetFetchingRef={resetFetchingRef}
                                photosPage={photosPage}
                                showSaved={showSaved}
                                profileGallery={showSaved ? true : false}
                                setPhotosPage={setPhotosPage}
                                from={showSaved ? 'viewGallery' : 'createContent'}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Settings;
