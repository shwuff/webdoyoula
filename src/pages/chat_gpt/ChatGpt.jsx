import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    useTheme,
    useMediaQuery,
    Tooltip,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ChatGpt.module.css';
import Drawer from "./components/drawer";
import Welcome from "./components/welcome";
import ModelSelector from "./components/modelSelector";
import ChatView from './components/chat';

import {useParams} from "react-router-dom";
import useChatInitial from "./hooks/useChatInitial";
import { useChatControl } from "./hooks/useChatControl";
import {Menu as MenuIcon} from "@mui/icons-material";
import LucideIcon from "../../assets/icons/LucideIcon";
import SubscriptionModal from "./components/modals/SubscriptionModal";
import {useTranslation} from "react-i18next";
import Confetti from 'react-confetti';

const ChatGpt = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {t} = useTranslation();

    const { currentChat, chats, error, setUploadedMedia, uploadedMedia, currentSubPlan, congratulationWithNewSub, setCongratulationWithNewSub } = useChatInitial();
    const { chatUUID } = useParams();
    const { createChat, getChat, sendMessage, uploadMedia, getCurrentSubPlan, getSubsPlan, createSubPlan } = useChatControl();

    const [loading, setLoading] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

    const [showConfetti, setShowConfetti] = useState(false);
    const confettiRef = useRef(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
        const savedState = localStorage.getItem('drawerOpenState');
        return savedState !== null && !isMobile ? JSON.parse(savedState) : !isMobile;
    });

    useEffect(() => {
        if (error) {
            setErrorSnackbarOpen(true);
        }
    }, [error]);

    const handleCloseErrorSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorSnackbarOpen(false);
    };

    useEffect(() => {
        if (congratulationWithNewSub) {
            setShowConfetti(true);

            // const timer = setTimeout(() => {
            //     setShowConfetti(false);
            //     setCongratulationWithNewSub(false);
            // }, 5000);

            // return () => clearTimeout(timer);
        }
    }, [congratulationWithNewSub, setCongratulationWithNewSub]);

    useEffect(() => {
        if(chatUUID) {
            setSelectedChat(chatUUID);
            getChat(chatUUID);
        }
    }, [chatUUID]);

    useEffect(() => {
        getCurrentSubPlan();
        localStorage.setItem('drawerOpenState', JSON.stringify(isDrawerOpen));
    }, [isDrawerOpen]);

    useEffect(() => {
        const savedState = localStorage.getItem('drawerOpenState');
        if (savedState === null) {
            setIsDrawerOpen(!isMobile);
        }
    }, [isMobile]);

    const [startMessage, setStartMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [prompt, setPrompt] = useState('');
    const [subModalOpen, setSubModalOpen] = useState(false);

    const [selectedModel, setSelectedModel] = useState('GPT-4');
    const models = ['GPT-4'];

    const handleNewMessage = () => {
        if (prompt.trim()) {
            setPrompt('');
            setUploadedMedia([]);
            sendMessage(chatUUID, prompt, uploadedMedia);
        }
    };

    const handleNewChat = () => {
        setUploadedMedia([]);
        setStartMessage('');
        createChat(startMessage, uploadedMedia);
    };

    const handleFileSelect = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        for (const file of files) {
            const reader = new FileReader();

            reader.onload = () => {
                const base64Data = reader.result;
                const temp_uuid = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                uploadMedia(base64Data, temp_uuid);
                setUploadedMedia(prev => {
                    return [
                        {
                            temp_uuid: temp_uuid,
                        },
                        ...prev,
                    ]
                });
            };

            reader.readAsDataURL(file);
        }

        e.target.value = null;
    };

    console.log(currentSubPlan);

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            bgcolor: 'var(--bg-color)',
            color: 'white',
            paddingTop: "var(--safeAreaInset-top)",
            position: 'relative',
            overflow: 'hidden'
        }}>

            {showConfetti && (
                <Confetti
                    ref={confettiRef}
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={true}
                    numberOfPieces={200}
                    gravity={0.15}
                    initialVelocityY={15}
                    wind={0.01}
                    colors={[
                        '#FF6B6B',
                        '#4ECDC4',
                        '#FFD166',
                        '#06D6A0',
                        '#118AB2',
                        '#EF476F',
                        '#FFD166',
                        '#073B4C'
                    ]}
                    confettiSource={{
                        x: 0,
                        y: windowSize.height / 2,
                        w: windowSize.width,
                        h: 0
                    }}
                    drawShape={(ctx) => {
                        const shapes = ['circle', 'square', 'triangle'];
                        const shape = shapes[Math.floor(Math.random() * shapes.length)];

                        switch(shape) {
                            case 'circle':
                                ctx.beginPath();
                                ctx.arc(0, 0, 5, 0, 2 * Math.PI);
                                break;
                            case 'square':
                                ctx.fillRect(-5, -5, 10, 10);
                                break;
                            case 'triangle':
                                ctx.beginPath();
                                ctx.moveTo(0, -5);
                                ctx.lineTo(5, 5);
                                ctx.lineTo(-5, 5);
                                ctx.closePath();
                                break;
                        }
                        ctx.fill();
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                />
            )}

            {showConfetti && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        pointerEvents: 'none'
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '16px',
                            padding: '32px',
                            textAlign: 'center',
                            maxWidth: '400px',
                            pointerEvents: 'auto',
                            animation: 'scaleIn 0.5s ease-out',
                            '@keyframes scaleIn': {
                                '0%': {
                                    transform: 'scale(0.8)',
                                    opacity: 0
                                },
                                '100%': {
                                    transform: 'scale(1)',
                                    opacity: 1
                                }
                            }
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: '48px',
                                marginBottom: '16px',
                                animation: 'bounce 1s infinite alternate',
                                '@keyframes bounce': {
                                    'from': { transform: 'translateY(0)' },
                                    'to': { transform: 'translateY(-10px)' }
                                }
                            }}
                        >
                            🎉
                        </Box>
                        <h2 style={{
                            color: '#FFD700',
                            marginBottom: '16px',
                            fontSize: '24px'
                        }}>
                            {t('Congratulations!')}
                        </h2>
                        <p style={{
                            color: 'white',
                            marginBottom: '24px',
                            fontSize: '16px'
                        }}>
                            {t('Your subscription has been successfully activated!')}
                        </p>
                        <button
                            onClick={() => {
                                setShowConfetti(false);
                                setCongratulationWithNewSub(false);
                            }}
                            style={{
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'var(--primary-color-dark)',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            {t('Continue')}
                        </button>
                    </Box>
                </Box>
            )}

            <Drawer currentSubPlan={currentSubPlan} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isMobile={isMobile} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} handleNewChat={handleNewChat} selectedChat={selectedChat} setSelectedChat={setSelectedChat} chats={chats} />

            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                transition: 'margin-left 0.2s ease-in-out',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    p: 1,
                    pl: 2,
                    borderBottom: "1px solid var(--glass-border)",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", gap: 2, width: "100%" }}>
                        <div className={"d-flex"}>
                            {
                                isMobile && (
                                    <Tooltip
                                        title={isDrawerOpen ? t('Close menu') : t('Open menu')}
                                        slotProps={{
                                            tooltip: {
                                                sx: {
                                                    color: 'var(--text-color)',
                                                    fontSize: '14px',
                                                }
                                            }
                                        }}
                                    >
                                    <span
                                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                                        style={{
                                            color: 'white',
                                            cursor: 'pointer',
                                            height: 40,
                                            width: 40,
                                            display: "flex",
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <MenuIcon />
                                    </span>
                                    </Tooltip>
                                )
                            }
                            <ModelSelector models={models} selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                        </div>

                        <div>
                            {
                                (currentSubPlan === null || currentSubPlan.expired) && (
                                    <span onClick={() => { setSubModalOpen(true) }} className={`d-flex align-items-center ${styles.upgradeYourPlan}`} style={{ gap: "8px", color: "var(--primary-color)" }}>
                                        <LucideIcon name={"Sparkles"} color={"var(--primary-color)"} size={18} />
                                        {t('Upgrade Your Plan')}
                                    </span>
                                )
                            }
                        </div>

                        <div className={`${styles.flexBlock}`}></div>
                    </Box>
                </Box>

                {
                    chatUUID ? (
                        <ChatView
                            chat={currentChat}
                            isMobile={isMobile}
                            handleNewMessage={handleNewMessage}
                            prompt={prompt}
                            setPrompt={setPrompt}
                            uploadedMedia={uploadedMedia}
                            handleFileSelect={handleFileSelect}
                        />
                    ) : (
                        <Welcome
                            startMessage={startMessage}
                            setStartMessage={setStartMessage}
                            handleNewChat={handleNewChat}
                            loading={loading}
                            uploadedMedia={uploadedMedia}
                            handleFileSelect={handleFileSelect}
                        />
                    )
                }

            </Box>

            <SubscriptionModal currentSubPlan={currentSubPlan} open={subModalOpen} setOpen={setSubModalOpen} />

            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseErrorSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: 'var(--body-bg-color)',
                        color: 'white',
                        borderRadius: '8px',
                        border: "1px solid var(--glass-border)",
                        minWidth: 'unset',
                        width: 'auto',
                        maxWidth: '90%',
                        whiteSpace: 'pre-line'
                    }
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={handleCloseErrorSnackbar}
                    sx={{
                        width: '100%',
                        backgroundColor: 'var(--body-bg-color)',
                        color: 'white',
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                            color: 'white',
                        },
                        '& .MuiAlert-action': {
                            paddingTop: 0,
                            paddingBottom: 0,
                        }
                    }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseErrorSnackbar}
                            sx={{ marginLeft: 1 }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default ChatGpt;