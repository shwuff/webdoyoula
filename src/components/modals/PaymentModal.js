import React, {useEffect, useState} from 'react';
import RightModal from "../modal/RightModal";
import "./PaymentModal.css";
import { useAuth } from "../../context/UserContext";
import { useWebSocket } from "../../context/WebSocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import {useTranslation} from "react-i18next";
import PricingWidget from "../teegee/PricingWidget/PricingWidget";
import SmartDropdown from "../teegee/SmartDropdown/SmartDropdown";
import GoldStarImg from './../../assets/images/gold_star.png';

const PaymentModal = ({ openPaymentModal, setOpenPaymentModal, isRubles = true }) => {
    const { token, userData } = useAuth();
    const { sendData } = useWebSocket();

    const {t} = useTranslation();

    const [selectedOption, setSelectedOption] = useState(null);
    const [currencyType, setCurrencyType] = useState(isRubles ? 'RUB' : 'XTR');
    const [paymentStep, setPaymentStep] = useState(1);

    const [paymentOptions, setPaymentOptions] = useState([
        { id: 1, name: "100 " + t('photos'), price: isRubles ? 899 : 749 },
        { id: 2, name: "300 " + t('photos'), price: isRubles ? 1499 : 1299 },
        { id: 3, name: "500 " + t('photos'), price: isRubles ? 2549 : 2199 },
        { id: 4, name: "1000 " + t('photos'), price: isRubles ? 4999 : 3999 },
    ]);

    const handleCurrencyChange = (event, newCurrency) => {
        if (newCurrency !== null) {
            setCurrencyType(newCurrency);
        }
    };

    const [modelOption, setModelOption] = useState({
        id: 5,
        name: t('buy_avatar'),
        price: isRubles ? 399 : 249
    });

    const handleBuyClick = (option) => {
        if(userData.language_code === 'ru') {
            setSelectedOption(option);
            setPaymentStep(2);
        } else {
            setSelectedOption(option);
            handleConfirmPurchase("XTR");
        }
    };

    const handleConfirmPurchase = () => {
        if (!selectedOption) return;
        sendData({
            action: "purchase_generates",
            data: {
                jwt: token,
                optionId: selectedOption,
                currency: currencyType
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
            { id: 1, name: "100 " + t('photos'), price: currencyType === "RUB" ? 899 : 749 },
            { id: 2, name: "300 " + t('photos'), price: currencyType === "RUB" ? 1499 : 1299 },
            { id: 3, name: "500 " + t('photos'), price: currencyType === "RUB" ? 2549 : 2199 },
            { id: 4, name: "1000 " + t('photos'), price: currencyType === "RUB" ? 4999 : 3999 },
        ]);

        setModelOption({
            id: 5,
            name: t('buy_avatar'),
            price: currencyType === "RUB" ? 399 : 249
        });
    }, [currencyType, t]);

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
                            <h2>{t("Buy photos")}</h2>
                            <div className="payment-plans">
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
                                        photos_filter: paymentOptions,
                                        avatar_filter: [modelOption]
                                    }}
                                    selectedOption={selectedOption}
                                    setSelectedOption={setSelectedOption}
                                    currency={currencyType}
                                    billingVoid={handleConfirmPurchase}
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