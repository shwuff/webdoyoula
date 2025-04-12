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
import Rating from "./pages/rating/Rating";
import NotificationsPage from './pages/notifications/NotificationsPage';
import RightModal from './components/modal/RightModal';

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
    const [openCart, setOpenCart] = useState(false);

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
        document.documentElement.style.setProperty('--safeAreaInset-top', `${window?.Telegram?.WebApp?.safeAreaInset?.top ? window?.Telegram?.WebApp?.safeAreaInset?.top * 2 : 5}px`);
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
            // setNotification(msg);
            if(msg.type === 'like' || msg.type === 'comment' || msg.type === 'subscribe') {
                setUserData((prev) => ({
                    ...prev,
                    has_new_notify: 1
                }));
                console.log(msg.type);
            } else {
                setNotification(msg);
            }
        }

        addHandler('notification', handleNotification);

        return () => deleteHandler('notification');
    }, [setUserData]);

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
            const params = window?.Telegram?.WebApp?.initDataUnsafe?.start_param.split('AAA');

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

        console.log(userData);

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
                window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.requestFullscreen && !window.location.pathname.startsWith("/profile/") && !window.location.pathname.startsWith("/rating") && (
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
                    <Route path="/rating" element={<Rating />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                </Routes>
            </div>
            <NavbarBottom />
            {/*{*/}
            {/*    userData.count_goods_in_cart && userData.count_goods_in_cart > 0 && (*/}
            {/*        <div className='cartButton' onClick={() => setOpenCart(true)}>*/}
            {/*            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99976 2.25C9.30136 2.25 8.69851 2.65912 8.4178 3.25077C7.73426 3.25574 7.20152 3.28712 6.72597 3.47298C6.15778 3.69505 5.66357 4.07255 5.29985 4.5623C4.93292 5.05639 4.76067 5.68968 4.5236 6.56133L4.47721 6.73169L3.96448 9.69473C3.77895 9.82272 3.61781 9.97428 3.47767 10.1538C2.57684 11.3075 3.00581 13.0234 3.86376 16.4552C4.40943 18.6379 4.68227 19.7292 5.49605 20.3646C6.30983 21 7.43476 21 9.68462 21H14.3153C16.5652 21 17.6901 21 18.5039 20.3646C19.3176 19.7292 19.5905 18.6379 20.1362 16.4552C20.9941 13.0234 21.4231 11.3075 20.5222 10.1538C20.382 9.97414 20.2207 9.82247 20.035 9.69442L19.5223 6.73169L19.4759 6.56133C19.2388 5.68968 19.0666 5.05639 18.6997 4.5623C18.336 4.07255 17.8417 3.69505 17.2736 3.47298C16.798 3.28712 16.2653 3.25574 15.5817 3.25077C15.301 2.65912 14.6982 2.25 13.9998 2.25H9.99976ZM18.4177 9.14571L18.0564 7.05765C17.7726 6.01794 17.6696 5.69121 17.4954 5.45663C17.2996 5.19291 17.0335 4.98964 16.7275 4.87007C16.5077 4.78416 16.2421 4.75888 15.5803 4.75219C15.299 5.34225 14.697 5.75 13.9998 5.75H9.99976C9.30252 5.75 8.70052 5.34225 8.41921 4.75219C7.75738 4.75888 7.4918 4.78416 7.272 4.87007C6.96605 4.98964 6.69994 5.19291 6.50409 5.45662C6.32988 5.6912 6.22688 6.01794 5.9431 7.05765L5.58176 9.14577C6.57992 9 7.9096 9 9.68462 9H14.3153C16.0901 9 17.4196 9 18.4177 9.14571ZM8 12.25C8.41421 12.25 8.75 12.5858 8.75 13V17C8.75 17.4142 8.41421 17.75 8 17.75C7.58579 17.75 7.25 17.4142 7.25 17V13C7.25 12.5858 7.58579 12.25 8 12.25ZM16.75 13C16.75 12.5858 16.4142 12.25 16 12.25C15.5858 12.25 15.25 12.5858 15.25 13V17C15.25 17.4142 15.5858 17.75 16 17.75C16.4142 17.75 16.75 17.4142 16.75 17V13ZM12 12.25C12.4142 12.25 12.75 12.5858 12.75 13V17C12.75 17.4142 12.4142 17.75 12 17.75C11.5858 17.75 11.25 17.4142 11.25 17V13C11.25 12.5858 11.5858 12.25 12 12.25Z" fill="#1C274C"/>*/}
            {/*            </svg>*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*}*/}

            {/*<RightModal isOpen={openCart} onClose={() => setOpenCart(false)}>*/}
            {/*    */}
            {/*</RightModal>*/}

            <Snackbar
                open={Boolean(notification)}
                onClose={handleCloseNotification}
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
                onClick={() => {
                    if(notification?.location) {
                        navigate(notification?.location);
                        setNotification(null);
                    }
                }}
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
                    {
                        notification?.from && (
                            <> {notification.from.first_name} {notification.from.last_name}</>
                        )
                    }
                </Alert>
            </Snackbar>
        </div>
    );
};

export default App;