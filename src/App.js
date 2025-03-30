import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import NavbarBottom from "./components/navs/NavbarBottom";
import "./assets/css/index.css";
import {useAuth} from "./context/UserContext";
import {useWebSocket} from "./context/WebSocketContext";
import Profile from "./pages/user/Profile";
import CreateContent from "./pages/studio/CreateContent";
import GenerateImageAvatar from "./pages/studio/generateImageAvatar/GenerateImageAvatar";
import EditPost from "./pages/post/EditPost";
import Settings from "./pages/user/Settings";
import Blanks from "./pages/user/settings/Blanks";
import Search from "./components/Search";
import FeedPage from "./pages/feed/FeedPage";
import Content from "./pages/user/settings/Content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Snackbar, Alert, CircularProgress as MUICircularProgress } from "@mui/material";
import Auth from "./pages/user/auth/Auth";
import {useTranslation} from "react-i18next";

const Bookmark = () => {
    return <div className="page about">This is the Bookmark Page!</div>;
};

const App = () => {

    const themeParams = window?.Telegram?.WebApp?.themeParams;
    const navigate = useNavigate();

    window.Telegram?.WebApp?.setBottomBarColor(themeParams.secondary_bg_color);

    const { login, setUserData, setMyModels, token, userData } = useAuth();
    const { addHandler, deleteHandler, isConnected, sendData } = useWebSocket();

    const [notification, setNotification] = useState(null);
    const [progress, setProgress] = useState(100);

    const {t, i18n} = useTranslation();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(isConnected) {
            addHandler('authorization', (msg) => {

                if (msg.token) {
                    localStorage.setItem('auth_token', msg.token);
                }

                login(msg.token);
                setUserData(msg.user);
                setMyModels(msg.myModels);
                setLoading(false);
            });

            return () => {
                deleteHandler('authorization');
            }
        }
    }, [isConnected]);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        document.documentElement.style.setProperty('--button-color', '#2196F3');
        document.documentElement.style.setProperty('--primary-color', '#2d88ff');
        document.documentElement.style.setProperty('--text-color', '#000');
        document.documentElement.style.setProperty('--bg-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-bg-color', '#f4f4f5');
        document.documentElement.style.setProperty('--header-bg-color', '#f2f2f7');
        document.documentElement.style.setProperty('--section-bg-color', '#f2f2f7');
        document.documentElement.style.setProperty('--border-color', '#2196F3');
        document.documentElement.style.setProperty('--hint-color', '#2196F3');
        document.documentElement.style.setProperty('--button-text-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-text-color', '#888888');
        document.documentElement.style.setProperty('--content-height', `calc(100vh - ${window?.Telegram?.WebApp?.safeAreaInset?.top + 40}px)`);
        document.documentElement.style.setProperty('--safeAreaInset-top', `${window?.Telegram?.WebApp?.safeAreaInset?.top * 2}px`);
        document.documentElement.style.setProperty('--safeAreaInset-top-value', `${window?.Telegram?.WebApp?.safeAreaInset?.top * 2}`);

        if (token && isConnected) {
            sendData({
                action: "handleGetMyProfile",
                data: {
                    jwt: token
                }
            });
        } else if(isConnected) {
            setLoading(false);
        }
    }, [isConnected]);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.platform === 'ios') {
            if (!window.Telegram.WebApp.isFullscreen && window.Telegram.WebApp.requestFullscreen) {
                window.Telegram.WebApp.requestFullscreen();
            }
        }
        if(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.disableVerticalSwipes) {
            window.Telegram.WebApp.disableVerticalSwipes();
        }
    }, []);

    useEffect(() => {
        const handleNotification = (msg) => {
            setNotification(msg);
        }

        addHandler('notification', handleNotification);

        return () => deleteHandler('notification');
    }, []);

    useEffect(() => {
        const handleUpdatePhotosLeft = (msg) => {
            setUserData(prev => ({
                ...prev,
                photos_left: msg.photos_left
            }));
        }

        addHandler('update_photos_left_count', handleUpdatePhotosLeft);

        return () => deleteHandler('update_photos_left_count');
    }, []);

    useEffect(() => {
        const handleInvoice = (msg) => {
            if(msg.platform === 'telegram') {
                try {
                    window.Telegram.WebApp.openInvoice(msg.link);
                } catch (error) {
                    window.open(msg.link);
                }
            }
        }

        addHandler('open_invoice', handleInvoice);

        return () => deleteHandler('open_invoice');
    }, []);

    useEffect(() => {
        const handleRedirect = (msg) => {
            navigate(msg.url);
        }

        addHandler('redirect', handleRedirect);

        return () => deleteHandler('redirect');
    }, []);

    useEffect(() => {
        const handleNewPostBlank = (msg) => {
            navigate(`/post/edit/${msg.post_id}`);
        }

        addHandler('created_post_blank', handleNewPostBlank);

        return () => deleteHandler('created_post_blank');
    }, []);

    useEffect(() => {
        if (window?.Telegram?.WebApp?.initDataUnsafe?.start_param !== undefined) {
            const params = window?.Telegram?.WebApp?.initDataUnsafe?.start_param.split('--');

            params.some(param => {
                const match = param.match(/userId(\w+)/);
                if (match) {
                    navigate(`/profile/${match[1]}`);
                    return true;
                }
                return false;
            });
        }
    }, []);

    useEffect(() => {
        if (!notification) {
            setProgress(100);
            return;
        }

        const totalDuration = notification.time || 5000;
        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const ratio = Math.min(elapsed / totalDuration, 1);

            const currentValue = 100 - ratio * 100;
            setProgress(currentValue);

            if (ratio < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);

        return () => {
            setProgress(100);
        };
    }, [notification]);

    const handleCloseNotification = () => {
        setNotification(null);
    };

    useEffect(() => {

        if(userData !== null) {
            if(userData.language_code === 'ru') {
                i18n.changeLanguage('ru');
            } else {
                i18n.changeLanguage('en');
            }
        }

    }, [userData]);

    // useEffect(() => {
    //     const SettingsButton = window?.Telegram?.WebApp?.SettingsButton;
    //
    //     SettingsButton.show();
    //
    //     SettingsButton.onClick(() => {
    //         navigate('/profile/settings')
    //     })
    //
    // }, []);

    if(loading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    if(!token) {
        return <Auth />;
    }

    return (
        <div className="App" style={{background: "var(--bg-color)", width: "100vw", height: "100vh"}}>
            {
                window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.requestFullscreen && !window.location.pathname.startsWith("/profile/") && (
                    <div style={{width: "100%", height: window.Telegram.WebApp?.safeAreaInset?.top
                                 ? `${window.Telegram.WebApp.safeAreaInset.top * 2}px`
                                 : '0', background: "var(--bg-color)", display: "block", position: "fixed", zIndex: 500}}>

                    </div>
                )
            }
            <div>
                <Routes>
                    <Route path="/" element={<FeedPage />} />
                    {/*<Route path="/profile/auth" element={<Auth />} />*/}
                    <Route path="/search" element={<Search />} />
                    <Route path="/bookmark" element={<Bookmark />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/blanks" element={<Blanks />} />
                    <Route path="/settings/content" element={<Content />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/studio/create" element={<CreateContent />} />
                    <Route path="/studio/generate-image-avatar" element={<GenerateImageAvatar />} />
                    <Route path="/studio/generate-image-avatar/:promptId" element={<GenerateImageAvatar />} />
                    <Route path="/post/edit/:postId" element={<EditPost />} />
                </Routes>
            </div>
            <NavbarBottom />
            <Snackbar
                open={Boolean(notification)}
                onClose={handleCloseNotification}
                autoHideDuration={5000}
                sx={{marginBottom: "50px", zIndex: "10000"}}
                anchorOrigin={{ vertical: notification?.position ? notification?.position : "bottom", horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification?.ok ? "success" : "error"}
                    sx={{
                        marginTop: "var(--safeAreaInset-top)"
                    }}
                    // icon={
                    //     <CircularProgress
                    //         variant="determinate"
                    //         value={progress}
                    //         size={24}
                    //     />
                    // }
                >
                    {t(notification?.message)}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default App;