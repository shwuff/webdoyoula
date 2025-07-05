import React from 'react';
import styles from './css/Settings.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Settings = () => {

    const navigate = useNavigate();

    const {t} = useTranslation();

    return (
        <div className={styles.container}>

        </div>
    );
};

export default Settings;
