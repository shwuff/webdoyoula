import React, {useState} from 'react';
import { Alert, Stack } from '@mui/material';
import {useTranslation} from "react-i18next";
import PaymentModal from "../modals/PaymentModal";
import {useAuth} from "../../app/providers/UserContext";

function ErrorList({ error }) {

    const {t} = useTranslation();

    const {userData} = useAuth();

    const [isOpen, setOpen] = useState(false);

    if (!Array.isArray(error) || error.length === 0) return null;

    return (
        <div style={{ marginBottom: "8px" }}>
            {error.map((err, index) => (
                <Alert key={index} severity="error" sx={{ borderRadius: "12px", marginBottom: "5px", bgcolor: "var(--bg-color)" }}>
                    {t(err)} {err === 'There is no balance to generate' && (<span style={{ color: "#0f87ee", textDecoration: "underline", cursor: "pointer" }} onClick={() => setOpen(true)}>Пополнить баланс</span>)}
                    <PaymentModal openPaymentModal={isOpen} setOpenPaymentModal={setOpen} isRubles={userData.language_code === 'ru'} isGift={false} />
                </Alert>
            ))}
        </div>
    );
}

export default ErrorList;