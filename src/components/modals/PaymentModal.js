import React, {useEffect, useState} from 'react';
import RightModal from "../modal/RightModal";
import "./PaymentModal.css";
import { useAuth } from "../../app/providers/UserContext";
import { useWebSocket } from "../../app/providers/WebSocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { FormControlLabel } from '@mui/material';
import { useTranslation } from "react-i18next";
import PricingWidget from "../teegee/PricingWidget/PricingWidget";
import SmartDropdown from "../teegee/SmartDropdown/SmartDropdown";
import GoldStarImg from './../../assets/images/gold_star.png';
import Switch from "../teegee/Switch";

const PaymentModal = ({ openPaymentModal, setOpenPaymentModal, isRubles = true, isGift = false, giftUserId = 0 }) => {
    const { token, userData } = useAuth();
    const { sendData } = useWebSocket();

    const {t} = useTranslation();

    const [selectedOption, setSelectedOption] = useState(null);
    const [currencyType, setCurrencyType] = useState(isRubles ? 'RUB' : 'XTR');
    const [paymentStep, setPaymentStep] = useState(1);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [paymentOptions, setPaymentOptions] = useState([
        { id: 1, name: "100 " + t('photos'), price: isRubles ? 899 : 749 },
        { id: 2, name: "300 " + t('photos'), price: isRubles ? 1499 : 1299 },
        { id: 3, name: "500 " + t('photos'), price: isRubles ? 2549 : 2199 },
        { id: 4, name: "1000 " + t('photos'), price: isRubles ? 4999 : 3999 },
    ]);

    const handleConfirmPurchase = () => {
        if (!selectedOption) return;
        sendData({
            action: "payment/buy/stars",
            data: {
                jwt: token,
                optionId: selectedOption,
                currency: currencyType,
                ...(isGift ? { giftUserId: giftUserId, isAnonymous: isAnonymous } : {})
            }
        });
        setOpenPaymentModal(false);
        setPaymentStep(1);
    };

    const handleBack = () => {
        setPaymentStep(1);
    };

    const currencyOptions = [
        { label: 'RUB', icon: 'https://flagcdn.com/w40/ru.png', value: "RUB" },
        { label: 'Telegram Stars', icon: GoldStarImg, value: "XTR" }
    ];

    useEffect(() => {
        setPaymentOptions([
            { id: 1, stars: 459, name: "459", price: currencyType === "RUB" ? 599 : 699, last_price: currencyType === "RUB" ? 999 : 999 },
            { id: 2, stars: 1399, name: "1399", price: currencyType === "RUB" ? 1499 : 1599, last_price: currencyType === "RUB" ? 1999 : 1999, popular: true },
            { id: 3, stars: 2999, name: "2999", price: currencyType === "RUB" ? 2999 : 2099, last_price: currencyType === "RUB" ? 3499 : 3499 },
            { id: 4, stars: 4999, name: "4999", price: currencyType === "RUB" ? 4999 : 4999, last_price: currencyType === "RUB" ? 5499 : 5499, benefit: true },
        ]);
    }, [currencyType, t]);

    useEffect(() => {

        const handleClickBackButton = () => {
            setOpenPaymentModal(false);
        }

        if(userData.is_telegram && openPaymentModal) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(handleClickBackButton);
        }

        return () => {
            window.Telegram.WebApp.BackButton.hide();
            window.Telegram.WebApp.BackButton.offClick(handleClickBackButton);
        }

    }, [userData, openPaymentModal]);

    const textsPrimary = [
        "Профессиональные фото за 2 минуты — без камеры и студии",
        "AI-фотосессия, после которой вам будут писать \"Кто ваш фотограф?\"",
        "Выгляди как после дорогой фотосессии — заплати в 10 раз меньше",
        "AI-фотосессия за 2 минуты — дешевле чашки кофе",
        "Загрузи фото — получи образы уже через пару секунд",
        "Воплощайте любые свои идеи в жизнь",
        "Создавайте фото и видео, где единственное ограничение - ваша фантазия",
        "Образы уровня fashion-съёмки — без съёмки за пару секунд",
        "Дешевле одной фотосессии — в результате сотни фото",
        "Экономия времени, денег и нервов",
        "Максимум результата за минимальную цену",
        "Премиальные фото без премиальной цены"
    ];

    const [textPrimary] = useState(() =>
        textsPrimary[Math.floor(Math.random() * textsPrimary.length)]
    );

    return (
        <RightModal
            isOpen={openPaymentModal}
            onClose={() => {
                setOpenPaymentModal(false);
                setPaymentStep(1);
            }}
            isBackButton={paymentStep > 1}
            onBack={handleBack}
        >
            <div className="payment-modal-content">
                <AnimatePresence mode="wait">
                    {paymentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {
                                isGift ? (
                                    <h2>{t("Give a gift")}</h2>
                                ) : (
                                    <h2>{t("Buy photos")}</h2>
                                )
                            }
                            <p style={{marginBottom: 4, lineHeight: 1, fontSize: 20, fontWeight: 600}} align={"center"}>{textPrimary}</p>
                            <div className="payment-plans" style={{ marginTop: 4 }}>
                                {isRubles && (
                                    <div className={"w-100 justify-content-center d-flex"}>
                                        <SmartDropdown
                                            options={currencyOptions}
                                            selected={currencyType}
                                            setSelected={setCurrencyType}
                                        />
                                    </div>
                                )}

                                <PricingWidget
                                    billingOptions={['photos_filter', 'avatar_filter']}
                                    plansByCycle={{
                                        photos_filter: paymentOptions
                                    }}
                                    selectedOption={selectedOption}
                                    setSelectedOption={setSelectedOption}
                                    currency={currencyType}
                                    billingVoid={handleConfirmPurchase}
                                    afterBillingButton={() => {
                                        return (
                                            <>
                                                {
                                                    isGift && (
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1rem" }}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} style={{ marginRight: "8px" }} />
                                                                }
                                                                label={t("Send anonymously")}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </>
                                        )
                                    }}
                                />

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </RightModal>
    );
};

export default PaymentModal;