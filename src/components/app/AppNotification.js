import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Компонент для отображения уведомлений
 */
const AppNotification = ({ notification, onClose }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleClick = () => {
        if (notification?.location) {
            navigate(notification.location);
            onClose();
        }
    };

    if (!notification) return null;

    return (
        <Snackbar
            open={Boolean(notification)}
            onClose={onClose}
            autoHideDuration={5000}
            sx={{
                marginBottom: "50px",
                zIndex: "10000",
                width: "100%",
                '& .MuiPaper-root': {
                    width: "100%",
                    maxWidth: "600px",
                    backgroundColor: 'rgba(30, 30, 30, 0.1)',
                    backdropFilter: 'blur(100px)',
                    color: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                }
            }}
            onClick={handleClick}
            anchorOrigin={{ 
                vertical: notification?.position || "bottom", 
                horizontal: 'center' 
            }}
        >
            <Alert
                onClose={onClose}
                severity={notification?.ok ? "success" : "error"}
                sx={{
                    marginTop: "var(--safeAreaInset-top)"
                }}
            >
                {notification?.from && (
                    <> {notification.from.first_name} {notification.from.last_name}</>
                )}
                {t(notification?.message)}
                {notification?.add}
            </Alert>
        </Snackbar>
    );
};

export default AppNotification;
