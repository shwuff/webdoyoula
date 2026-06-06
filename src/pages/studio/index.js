import React, {useState} from "react";
import styles from './css/CreateContent.module.css';
import {Link, useSearchParams} from "react-router-dom";
import {useAuth} from "../../app/providers/UserContext";
import {CiSettings} from "react-icons/ci";
import PaymentModal from "../../components/modals/PaymentModal";
import {useTranslation} from "react-i18next";
import animationStarGold from './../../assets/gif/gold_star.gif';
import FeaturesList from "./FeaturesList";
import TgLogo from './../../assets/svg/telegram-logo.svg';
import {Button} from "@mui/material";
import {useSelector} from "react-redux";

import {
    Dialog,
    DialogContent,
    TextField,
    Box,
    IconButton,
    Alert,
    Typography
} from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LucideIcon from "../../assets/icons/LucideIcon";

const Index = () => {

    const { userData } = useAuth();
    const [searchParams] = useSearchParams();

    const [openModal, setOpenModal] = useState(false);
    const [textToCopy] = useState(userData.is_telegram ? "https://t.me/doyoulabot/app?startapp=from" + userData.id : "");
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    };

    const availableModels = useSelector(state => state.model.models);

    const repeat_id = searchParams.get('repeat_id') ? searchParams.get('repeat_id') : null;

    const {t} = useTranslation();

    const [openPaymentModal, setOpenPaymentModal] = useState(false);

    return (
        <div className={"globalBlock"} id={"generatedPhotosList"}>
            <PaymentModal openPaymentModal={openPaymentModal} setOpenPaymentModal={setOpenPaymentModal}
                          isRubles={userData.language_code === 'ru'}/>
            <div className="center-content-block">
                <div className={"w-100 d-flex align-items-center justify-content-between"}>

                    <div className="w-100" id={"balance-container"}>
                        <div className={"d-flex align-items-center"} style={{gap: "7px", paddingBottom: "4px"}}>
                            <button className={"publish-button"} style={{ maxWidth: "max-content" }}>
                                <img src={animationStarGold} width={14}/> {userData.photos_left}
                            </button>

                            <div style={{maxHeight: "80%"}}>
                                <button className={"publish-button"} onClick={() => setOpenPaymentModal(true)}>
                                    {t('Buy More Stars')}
                                </button>
                            </div>
                            <div style={{maxHeight: "80%"}}>
                                <button className={"publish-button"} onClick={() => setOpenModal(true)}>
                                    <img src={animationStarGold} width={14}/> {t('Free')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Dialog
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        PaperProps={{
                            sx: { maxWidth: 400, width: '100%', p: 2, backdropFilter: "blur(12px)" }
                        }}
                    >
                        <DialogContent>
                            <Typography variant="p" sx={{ color: "white" }} gutterBottom>
                                {t("Your Referral Link")}
                            </Typography>

                            <TextField
                                value={textToCopy}
                                fullWidth
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <IconButton onClick={handleCopy} color="primary">
                                {copied ? <LucideIcon name={"Check"} color={"white"} /> : <LucideIcon name={"Copy"} color={"white"} />}
                            </IconButton>

                            <p
                                style={{ color: "white" }}
                                dangerouslySetInnerHTML={{ __html: t('Ref_link_description') }}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => setOpenModal(false)}
                                sx={{
                                    background: "var(--bg-color)",
                                    color: "var(--text-color)",
                                    marginTop: "6px"
                                }}
                            >
                                {t("Close")}
                            </Button>
                        </DialogContent>
                    </Dialog>

                    <Link to={"/settings/content"}>
                        <CiSettings style={{width: 24, height: 24}}/>
                    </Link>
                </div>
                <div className={styles.featuresList}>
                    <FeaturesList repeat_id={repeat_id} features={availableModels}/>
                </div>
                {
                    availableModels.length > 0 && (
                        <div className={"d-flex"} style={{
                            gap: "5px",
                            margin: 0,
                            width: "100%",
                            maxWidth: 800,
                            marginTop: "4px",
                            marginBottom: "0px"
                        }}>
                            <Button size={"small"} variant={"outlined"} onClick={() => {
                                window.open('https://t.me/doyoulachat');
                                window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');
                            }} sx={{gap: "10px", width: "100%", height: "35px"}}>
                                <img src={TgLogo} alt={"Chat logo"} style={{width: "25px", borderRadius: "12px"}}/>
                                {t('Group')}
                            </Button>
                            <Button size={"small"} variant={"outlined"} onClick={() => {
                                window.open('https://t.me/doyoula');
                                window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');
                            }} sx={{gap: "10px", width: "100%", height: "35px"}}>
                                <img src={TgLogo} alt={"Channel logo"} style={{width: "25px", borderRadius: "12px"}}/>
                                {t('Channel')}
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Index;