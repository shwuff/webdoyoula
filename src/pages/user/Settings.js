import React from 'react';
import styles from './css/Settings.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";

const Settings = () => {

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className="center-content-block">
                <h2 className="pageTitle">Настройки</h2>

                <div className={styles.block}>
                    <div className={`${styles.item} ${styles.firstItem}`} onClick={() => navigate('/profile/settings/blanks')}>
                        <span className={styles.leftIcon}>
                            <FontAwesomeIcon icon={faFileAlt} />
                        </span>
                        <span className={styles.itemText}>Черновики</span>
                        <span className={styles.rightIcon}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        height: window.Telegram.WebApp?.safeAreaInset?.top
                            ? `${window.Telegram.WebApp.safeAreaInset.top * 2}px`
                            : '0px'
                    }}
                />
            </div>
        </div>
    );
};

export default Settings;
