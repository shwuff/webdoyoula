import React, {useEffect, useRef, useState} from "react";
import styles from './css/CreateContent.module.css';
import {Link, useNavigate} from "react-router-dom";
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import MyModels from "../../components/models/MyModels";
import {useAuth} from "../../context/UserContext";
import {CiSettings} from "react-icons/ci";
import WebAppModal from "../../components/modal/WebAppModal";
import RightModal from "../../components/modal/RightModal";
import PaymentModal from "../../components/modals/PaymentModal";
import CreateAvatarModal from "../../components/modals/CreateAvatarModal";
import {useWebSocket} from "../../context/WebSocketContext";
import {useTranslation} from "react-i18next";

const CreateContent = () => {

    const navigate = useNavigate();

    const { userData, myModels, myPhotos } = useAuth();

    const {t} = useTranslation();

    const [value, setValue] = useState(0);
    const [photosPage, setPhotosPage] = useState(1);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);

    const isFetchingRef = useRef(false);
    const lastPageRef = useRef(1);
    const scrollTimeoutRef = useRef(null);

    const resetLastPageRef = () => {
        lastPageRef.current = 1;
    }

    const resetFetchingRef = () => {
        isFetchingRef.current = false;
    }

    const handleScroll = (e) => {
        if (value !== 0) return;

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {

            const bottom = e.target.scrollHeight < e.target.scrollTop + e.target.clientHeight + 600;

            if (bottom && !isFetchingRef.current) {
                const nextPage = lastPageRef.current + 1;

                isFetchingRef.current = true;
                lastPageRef.current = nextPage;
                setPhotosPage(nextPage);
            }
        }, 100);
    };

    const handleTabChange = (newValue) => {
        setValue(newValue);
    };

    const features = [
        { title: t('create_image'), url: "/studio/generate-image-avatar", available: true }
    ];

    return (
        <div className={"globalBlock"} id={"generatedPhotosList"} onScroll={handleScroll}>
            <PaymentModal openPaymentModal={openPaymentModal} setOpenPaymentModal={setOpenPaymentModal} isRubles={userData.language_code === 'ru'} />
            <div className="center-content-block">
                <div className={"w-100 d-flex align-items-center justify-content-between"}>
                    <div className={"p-2-phone d-flex"}>
                        <div>
                            <p>{t('photos_left')} {userData.photos_left}</p>
                            <p>{t('models_left')} {userData.models_left}</p>
                        </div>
                        <button className={"btn btn-primary"} style={{marginTop: 4, marginLeft: 8}} onClick={() => setOpenPaymentModal(true)}>
                            {t('buy_photos')}
                        </button>
                    </div>
                    <Link to={"/settings/content"}>
                        <CiSettings style={{width: 24, height: 24}} />
                    </Link>
                </div>
                <div className={styles.featuresList}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(feature.url)}
                            className={`${styles.featureItem} text-center ${feature.available ? styles.active : styles.disabled}`}
                        >
                            {feature.title}
                        </div>
                    ))}
                </div>

                {/*<div className={styles.tabsContainer}>*/}
                {/*    <button*/}
                {/*        className={`${styles.tabButton} ${value === 0 ? styles.activeTab : ''}`}*/}
                {/*        onClick={() => handleTabChange(0)}*/}
                {/*    >*/}
                {/*        Мои фото*/}
                {/*    </button>*/}
                {/*    <button*/}
                {/*        className={`${styles.tabButton} ${value === 1 ? styles.activeTab : ''}`}*/}
                {/*        onClick={() => handleTabChange(1)}*/}
                {/*    >*/}
                {/*        Мои модели*/}
                {/*    </button>*/}
                {/*</div>*/}

                <div className={styles.tabContent}>
                    {value === 0 && (
                        <MyGeneratedPhotosList
                            resetLastPageRef={resetLastPageRef}
                            resetFetchingRef={resetFetchingRef}
                            photosPage={photosPage}
                            setPhotosPage={setPhotosPage}
                            from={'createContent'}
                        />
                    )}
                    {value === 1 && (
                        <MyModels myModels={myModels}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateContent;