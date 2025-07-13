import React, {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { FaHome, FaBookmark, FaPlus, FaUser, FaSearch, FaFolder } from 'react-icons/fa';
import styles from './css/NavbarBottom.module.css';
import {useAuth} from "../../context/UserContext";
import Search from "../Search";
import {useTranslation} from "react-i18next";
import HomeIcon from "../../assets/svg/HomeIcon";
import PlusIcon from "../../assets/svg/PlusIcon";
import SearchIcon from "../../assets/svg/SearchIcon";
import RatingIcon from "../../assets/svg/RatingIcon";
import NotificationIcon from "../../assets/svg/NotificationIcon";

const NavbarBottom = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [hideMenu, setHideMenu] = useState(false);

    const {userData} = useAuth();

    const {t} = useTranslation();

    return (
        <div id={"navbarBottom"} className={styles.navbar}>
            <div className={"navbar-content"}>
                {/*<div className={styles.searchContainer}>*/}
                {/*    <Search from={'navbar'} setHideMenu={setHideMenu} />*/}
                {/*</div>*/}

                {
                    !hideMenu && (
                        <>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate("/");
                            }} className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}>
                                <div className={styles.navIcon}>
                                    <HomeIcon className={location.pathname === '/' ? styles.activeIcon : ''} active={location.pathname === '/'} />
                                </div>
                                <p className={"navbar-content-title"}>{t('feed')}</p>
                            </div>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate("/search");
                            }} className={`${styles.navItem} d-none d-md-block ${location.pathname === '/search' ? styles.active : ''}`}>
                                <div className={styles.navIcon}>
                                    <SearchIcon className={location.pathname === '/search' ? styles.activeIcon : ''} active={location.pathname === '/search'} />
                                </div>
                                <p className={"navbar-content-title"}>{t('search')}</p>
                            </div>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate("/rating");
                            }} className={`${styles.navItem} ${location.pathname.startsWith('/rating') ? styles.active : ''}`}>
                                <div className={styles.navIcon}>
                                    <RatingIcon className={location.pathname.startsWith('/rating') ? styles.activeIcon : ''} active={location.pathname.startsWith('/rating')} />
                                </div>
                                <span className={"navbar-content-title"}>{t('rating')}</span>
                            </div>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate("/studio/create");
                            }} className={`${styles.navItem} ${styles.myCreationsMobile} ${location.pathname.startsWith('/studio') ? styles.active : ''}`}>
                                <div className={styles.navIcon}>
                                    <PlusIcon className={location.pathname.startsWith('/studio') ? styles.activeIcon : ''} active={location.pathname.startsWith('/studio')} />
                                </div>
                                <span className={"navbar-content-title"}>{t('my_creations')}</span>
                            </div>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate("/notifications");
                            }} className={`${styles.navItem} ${location.pathname.startsWith('/notifications') ? styles.active : ''}`}>
                                <div className={styles.navIcon}>
                                    {
                                        userData?.has_new_notify === true && (
                                            <div className='new-notify-bounce'></div>
                                        )
                                    }
                                    <NotificationIcon className={location.pathname.startsWith('/notifications') ? styles.activeIcon : ''} active={location.pathname.startsWith('/notifications')} />
                                </div>
                                <span className={"navbar-content-title"}>{t('notifications')}</span>
                            </div>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
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
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default NavbarBottom;