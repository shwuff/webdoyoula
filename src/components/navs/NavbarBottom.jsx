import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { FaHome, FaBookmark, FaPlus, FaUser, FaSearch, FaFolder } from 'react-icons/fa';
import styles from './css/NavbarBottom.module.css';
import {useAuth} from "../../context/UserContext";
import Search from "../Search";
import {useTranslation} from "react-i18next";

const NavbarBottom = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [hideMenu, setHideMenu] = useState(false);

    const {userData} = useAuth();

    const {t} = useTranslation();

    return (
        <div id={"navbarBottom"} className={styles.navbar}>
            <div className={"navbar-content"}>
                <div className={styles.searchContainer}>
                    <Search from={'navbar'} setHideMenu={setHideMenu} />
                </div>

                {
                    !hideMenu && (
                        <>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate("/");
                            }} className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}>
                                <div className={styles.navIcon}>
                                    <FaHome className={location.pathname === '/' ? styles.activeIcon : ''} />
                                </div>
                                <p className={"navbar-content-title"}>{t('feed')}</p>
                            </div>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate("/search");
                            }} className={`${styles.navItem} ${styles.searchLink} ${location.pathname === '/search' ? styles.active : ''}`}>
                                <div className={styles.navIcon}>
                                    <FaSearch className={location.pathname === '/search' ? styles.activeIcon : ''} />
                                </div>
                                <p className={"navbar-content-title"}>{t('search')}</p>
                            </div>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate("/studio/create");
                            }} className={`${styles.navItem} ${location.pathname.startsWith('/studio') ? styles.active : ''}`}>
                                <div className={styles.navIcon}>
                                    <FaPlus className={location.pathname.startsWith('/studio') ? styles.activeIcon : ''} />
                                </div>
                                <span className={"navbar-content-title"}>{t('my_creations')}</span>
                            </div>
                            <div onClick={() => {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                navigate(`/profile/${userData.id}`);
                            }} className={`${styles.navItem} ${location.pathname.startsWith('/profile/') ? styles.active : ''}`}>
                                <div className={`${styles.navIcon} ${styles.profileIcon}`}>
                                    <FaUser className={location.pathname.startsWith('/profile/') ? styles.activeIcon : ''} />
                                </div>
                                <div className={styles.profileAvatar}>
                                    <img src={userData.photo_url} alt=""/>
                                    <p className={"navbar-content-title"}>{userData.first_name} {userData.last_name}</p>
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