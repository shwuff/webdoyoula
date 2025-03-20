import React, {useEffect, useState} from 'react';
import { Container, Box, Paper, Typography, TextField, Button } from '@mui/material';
import {useWebSocket} from "../../../context/WebSocketContext";

const Auth = () => {

    const {sendData, addHandler, deleteHandler} = useWebSocket();

    const [page, setPage] = useState('enterEmail');
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendEmailAuthorization = () => {
        sendData({
            action: "emailAuthorization",
            data: {
                email: email
            }
        });
        setLoading(true);
    }

    const handleSendConfirmationCode = () => {
        sendData({
            action: "send_verification_code",
            data: {
                code: confirmationCode,
                email: email
            }
        });
        setLoading(true);
    }

    useEffect(() => {

        const handleConfirmEmailCode = async() => {
            setPage("enterConfirmationCode");
        }

        addHandler("confirm_email_code", handleConfirmEmailCode);

        return () => deleteHandler("confirm_email_code");

    }, [addHandler, deleteHandler]);

    useEffect(() => {

        const handleConfirmEmailCode = async(msg) => {

        }

        addHandler("answere_confirmation_code", handleConfirmEmailCode);

        return () => deleteHandler("answere_confirmation_code");

    }, [addHandler, deleteHandler]);

    return (
        <Container
            maxWidth="xs"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    borderRadius: 2,
                }}
            >
                <Box display="flex" flexDirection="column" gap={2}>

                    {
                        page === "enterEmail" ? (
                            <>
                                <Typography variant="h5" component="h1" align="center" gutterBottom>
                                    Войдите в аккаунт
                                </Typography>

                                <TextField
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                />

                                <Button variant="contained" color="primary" onClick={handleSendEmailAuthorization} fullWidth>
                                    Войти
                                </Button>
                            </>
                        ) : page === "enterConfirmationCode" ? (
                            <>
                                <Typography variant="h5" component="h1" align="center" gutterBottom>
                                    Введите код подтверждения
                                </Typography>

                                <TextField
                                    label="Code"
                                    type="email"
                                    variant="outlined"
                                    value={confirmationCode}
                                    onChange={(e) => setConfirmationCode(e.target.value)}
                                    fullWidth
                                />

                                <Button variant="contained" color="primary" onClick={handleSendConfirmationCode} fullWidth>
                                    Подтвердить
                                </Button>
                            </>
                        ) : null
                    }

                </Box>
            </Paper>
        </Container>
    );
};

export default Auth;
