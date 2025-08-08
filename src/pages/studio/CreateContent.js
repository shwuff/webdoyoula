import React, {useEffect, useRef, useState} from "react";
import styles from './css/CreateContent.module.css';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/UserContext";
import {CiSettings} from "react-icons/ci";
import PaymentModal from "../../components/modals/PaymentModal";
import {useWebSocket} from "../../context/WebSocketContext";
import {useTranslation} from "react-i18next";
import animationStarGold from './../../assets/gif/gold_star.gif';
import FeaturesGrid from "../../components/grid/FeaturesGrid";
import ChatLogo from './../../assets/images/chat.jpg';
import ChannelLogo from './../../assets/images/channel.jpg';
import TgLogo from './../../assets/svg/telegram-logo.svg';
import {Button} from "@mui/material";

const CreateContent = () => {

    const { userData, token } = useAuth();
    const { sendData, deleteHandler, addHandler } = useWebSocket();

    const {t} = useTranslation();

    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [availableModels, setAvailableModels] = useState([]);

    useEffect(() => {
        if(token) {
            sendData({
                action: "get/models",
                data: {
                    jwt: token,
                }
            });
        }
    }, [token]);

    useEffect(() => {
        const receiveAvailableModels = (msg) => {
            setAvailableModels(msg.models);
        }

        addHandler("receive_available_models", receiveAvailableModels);

        return () => deleteHandler("receive_available_models");
    }, [addHandler, deleteHandler, setAvailableModels]);

    return (
        <div className={"globalBlock"} id={"generatedPhotosList"}>
            <PaymentModal openPaymentModal={openPaymentModal} setOpenPaymentModal={setOpenPaymentModal} isRubles={userData.language_code === 'ru'} />
            <div className="center-content-block">
                <div className={"w-100 d-flex align-items-center justify-content-between"}>

                    <div className="w-100">
                        <div className={"d-flex align-items-center"} style={{ gap: "7px" }}>
                            <p>{t('Balance')}: {userData.photos_left} <img src={animationStarGold} width={14}/></p>
                            <div>
                                <button className={"publish-button"} onClick={() => setOpenPaymentModal(true)}>
                                    {t('Buy More Stars')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Link to={"/settings/content"}>
                        <CiSettings style={{width: 24, height: 24}} />
                    </Link>
                </div>
                <div className={styles.featuresList}>
                    <FeaturesGrid features={availableModels} />
                </div>
                {
                    availableModels.length > 0 && (
                        <div className={"d-flex"} style={{ gap: "5px", margin: 0, width: "100%", maxWidth: 800, marginTop: "4px", marginBottom: "0px" }}>
                            <Button size={"small"} variant={"outlined"} onClick={() => {
                                window.open('https://t.me/doyoulachat');
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                            }} sx={{ gap: "10px", width: "100%", height: "35px" }}>
                                <img src={TgLogo} alt={"Chat logo"} style={{ width: "25px", borderRadius: "12px" }} />
                                {t('Group')}
                            </Button>
                            <Button size={"small"} variant={"outlined"} onClick={() => {
                                window.open('https://t.me/doyoula');
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                            }} sx={{ gap: "10px", width: "100%", height: "35px" }}>
                                <img src={TgLogo} alt={"Channel logo"} style={{ width: "25px", borderRadius: "12px" }} />
                                {t('Channel')}
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default CreateContent;