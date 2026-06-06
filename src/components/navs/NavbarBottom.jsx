import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styles from './css/NavbarBottom.module.css';
import {useAuth} from "../../app/providers/UserContext";
import {useTranslation} from "react-i18next";
import HomeIcon from "../../assets/svg/HomeIcon";
import PlusIcon from "../../assets/svg/PlusIcon";
import RatingIcon from "../../assets/svg/RatingIcon";
import NotificationIcon from "../../assets/svg/NotificationIcon";
import ChatGpt from "../../assets/svg/ChatGpt";
import {useMediaQuery, useTheme} from "@mui/material";

const NavbarBottom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {userData} = useAuth();
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div id={"navbarBottom"} className={styles.navbar}>
            <div className={"navbar-content"}>

                <div onClick={() => {
                    window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');
                    navigate("/");
                }} className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}>
                    <div className={styles.navIcon}>
                        <HomeIcon color={"var(--text-color)"} active={location.pathname === '/'} />
                    </div>
                    <p className={"navbar-content-title"}>{t('feed')}</p>
                </div>

                <div onClick={() => {
                    window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');
                    window.location.href = '/chat'
                }} className={`${styles.navItem} ${location.pathname === '/chat' ? styles.active : ''}`}>
                    <div className={styles.navIcon}>
                        <ChatGpt className={location.pathname === '/chat' ? styles.activeIcon : ''} active={location.pathname === '/chat'} />
                        {/*<LucideIcon name={"Bot"} />*/}
                    </div>
                    <p className={"navbar-content-title"}>{t('ChatGPT')}</p>
                </div>
                {/*<div onClick={() => {*/}
                {/*    window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');*/}
                {/*    navigate("/rating");*/}
                {/*}} className={`${styles.navItem} ${location.pathname.startsWith('/rating') ? styles.active : ''}`}>*/}
                {/*    <div className={styles.navIcon}>*/}
                {/*        <RatingIcon color={"var(--text-color)"} active={location.pathname.startsWith('/rating')} />*/}
                {/*    </div>*/}
                {/*    <span className={"navbar-content-title"}>{t('rating')}</span>*/}
                {/*</div>*/}
                <div onClick={() => {
                    window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');
                    navigate("/studio/create");
                }} className={`${styles.navItem} ${styles.myCreationsMobile} ${location.pathname.startsWith('/studio') ? styles.active : ''}`}>
                    <div className={styles.navIcon}>
                        <PlusIcon color={"var(--text-color)"} active={location.pathname.startsWith('/studio')} />
                    </div>
                    <span className={"navbar-content-title"}>{t('my_creations')}</span>
                </div>
                <div onClick={() => {
                    window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');
                    navigate("/notifications");
                }} className={`${styles.navItem} ${location.pathname.startsWith('/notifications') ? styles.active : ''}`}>
                    <div className={styles.navIcon}>
                        {
                            userData?.has_new_notify === true && (
                                <div className='new-notify-bounce'></div>
                            )
                        }
                        <NotificationIcon color={"var(--text-color)"} active={location.pathname.startsWith('/notifications')} />
                    </div>
                    <span className={"navbar-content-title"}>{t('notifications')}</span>
                </div>
                <div onClick={() => {
                    window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');
                    navigate(`/settings`);
                }} className={`${styles.navItem} ${location.pathname.startsWith('/profile/') || location.pathname.startsWith('/settings') ? styles.active : ''}`}>
                    <div className={`${styles.navIcon} ${styles.profileIcon}`}>
                        <img src={userData.photo_url} alt=""/>
                    </div>
                    <div className={styles.profileAvatar}>
                        <div className={`${styles.bigProfileIcon}`}>
                            <img src={userData.photo_url} alt=""/>
                        </div>
                        <div>
                            <p className={"navbar-content-title"}>{userData.first_name} {userData.last_name}</p>
                            {
                                userData?.username?.length > 0 && (
                                    <p className={"navbar-content-subtitle text-muted"}>@{userData.username}</p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarBottom;