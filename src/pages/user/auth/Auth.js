// import React, {useEffect, useState} from 'react';
// import { Container, Box, Paper, Typography, TextField, Button } from '@mui/material';
// import {useWebSocket} from "../../../app/providers/WebSocketContext";
// import Logo from './../../../assets/images/doyoula_logo.jpg';
//
// const Auth = () => {
//
//     const {sendData, addHandler, deleteHandler} = useWebSocket();
//
//     const [page, setPage] = useState('enterEmail');
//     const [email, setEmail] = useState('');
//     const [confirmationCode, setConfirmationCode] = useState('');
//
//     const handleSendEmailAuthorization = () => {
//         sendData({
//             action: "oauth/email",
//             data: {
//                 email: email
//             }
//         });
//     }
//
//     const handleSendConfirmationCode = () => {
//         sendData({
//             action: "oauth/confirm",
//             data: {
//                 code: confirmationCode,
//                 email: email
//             }
//         });
//     }
//
//     useEffect(() => {
//
//         const handleConfirmEmailCode = async() => {
//             setPage("enterConfirmationCode");
//         }
//
//         addHandler("confirm_email_code", handleConfirmEmailCode);
//
//         return () => deleteHandler("confirm_email_code");
//
//     }, [addHandler, deleteHandler]);
//
//     useEffect(() => {
//
//         const handleConfirmEmailCode = async(msg) => {
//
//         }
//
//         addHandler("answere_confirmation_code", handleConfirmEmailCode);
//
//         return () => deleteHandler("answere_confirmation_code");
//
//     }, [addHandler, deleteHandler]);
//
//     return (
//         <Container
//             maxWidth="xs"
//             sx={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             <Paper
//                 elevation={6}
//                 sx={{
//                     p: 5,
//                     width: '100%',
//                     borderRadius: 3,
//                     boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
//                     textAlign: 'center',
//                 }}
//             >
//                 <Box mb={3} display="flex" justifyContent="center">
//                     <img src={Logo} alt="Doyoula Logo" style={{ width: 120, height: 'auto', borderRadius: "16px" }} />
//                 </Box>
//
//                 <h1 style={{ fontWeight: 600, color: "var(--text-color)" }}>
//                     {page === "enterEmail" ? "Sign in to Doyoula" : "Enter Confirmation Code"}
//                 </h1>
//
//                 <Box mt={2} display="flex" flexDirection="column" gap={2}>
//                     {page === "enterEmail" && (
//                         <>
//                             <TextField
//                                 label="Email"
//                                 type="email"
//                                 variant="outlined"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 fullWidth
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: 2,
//                                     },
//                                 }}
//                             />
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleSendEmailAuthorization}
//                                 fullWidth
//                                 sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
//                             >
//                                 Send Code
//                             </Button>
//                         </>
//                     )}
//
//                     {page === "enterConfirmationCode" && (
//                         <>
//                             <TextField
//                                 label="Confirmation Code"
//                                 type="text"
//                                 variant="outlined"
//                                 value={confirmationCode}
//                                 onChange={(e) => setConfirmationCode(e.target.value)}
//                                 fullWidth
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: 2,
//                                     },
//                                 }}
//                             />
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleSendConfirmationCode}
//                                 fullWidth
//                                 sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
//                             >
//                                 Confirm
//                             </Button>
//                         </>
//                     )}
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };
//
// export default Auth;

import React, { useEffect } from 'react';
import config from "../../../app/config/config";

const TelegramLogin = ({ botUsername = 'doyoulabot' }) => {

    useEffect(() => {
        // Telegram Login Widget вставляется через скрипт
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?19";
        script.setAttribute('data-telegram-login', botUsername); // юзернейм твоего бота
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-userpic', 'false'); // показывать аватар
        script.setAttribute('data-radius', '12'); // скругление
        script.setAttribute('data-auth-url', `${config.apiUrl}api/oauth/telegram_widget`); // сервер для проверки
        script.async = true;
        document.getElementById('telegram-login-container').appendChild(script);
    }, [botUsername]);

    return <div id="telegram-login-container" style={{ textAlign: 'center', marginTop: '40px' }}></div>;
};

export default TelegramLogin;
