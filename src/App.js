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
import { Snackbar, Alert } from "@mui/material";
import Auth from "./pages/user/auth/Auth";
import {useTranslation} from "react-i18next";
import Rating from "./pages/rating/Rating";
import NotificationsPage from './pages/notifications/NotificationsPage';
import RightModal from './components/modal/RightModal';
import Cart from "./components/modals/Cart";
import {addGood, deleteGood, setCart, updateCount} from "./redux/actions/cartActions";
import {useDispatch} from "react-redux";
import PhotoPostModal from "./components/modals/PhotoPostModal";
import Video from './components/player/Video';
import {updateImage} from "./redux/actions/imageActions";

const Bookmark = () => {
    return <div className="page about">This is the Bookmark Page!</div>;
};

const App = () => {

    const themeParams = window?.Telegram?.WebApp?.themeParams;
    const navigate = useNavigate();

    window.Telegram?.WebApp?.setBottomBarColor(themeParams.secondary_bg_color);

    const { login, setUserData, setMyLoras, token, userData } = useAuth();
    const { addHandler, deleteHandler, isConnected, sendData } = useWebSocket();
    const dispatch = useDispatch();

    const [notification, setNotification] = useState(null);
    const [progress, setProgress] = useState(100);
    const [openCart, setOpenCart] = useState(false);
    const [openedPhotoId, setOpenedPhotoId] = useState(0);

    const {t, i18n} = useTranslation();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(isConnected) {
            addHandler('authorization', (msg) => {

                if (msg.session) {
                    localStorage.setItem('auth_token', msg.session);
                }

                login(msg.session || msg.jwt);
                setUserData(msg.user);
                setMyLoras(msg.loras);
                setLoading(false);
            });

            return () => {
                deleteHandler('authorization');
            }
        }
    }, [isConnected]);

    useEffect(() => {
        if(isConnected) {
            addHandler('get/my', (msg) => {
                const token = localStorage.getItem('auth_token');
                login(token);
                setUserData(msg.user);
                setMyLoras(msg.loras);
                setLoading(false);
            });

            return () => {
                deleteHandler('get/my');
            }
        }
    }, [isConnected]);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        document.documentElement.style.setProperty('--button-color', '#007aff');
        document.documentElement.style.setProperty('--primary-color', '#007aff');
        document.documentElement.style.setProperty('--text-color', '#fff');
        document.documentElement.style.setProperty('--bg-color', '#000');
        document.documentElement.style.setProperty('--secondary-bg-color', '#edeef0');
        document.documentElement.style.setProperty('--header-bg-color', '#f2f2f7');
        document.documentElement.style.setProperty('--section-bg-color', '#f2f2f7');
        document.documentElement.style.setProperty('--border-color', '#2196F3');
        document.documentElement.style.setProperty('--hint-color', '#2196F3');
        document.documentElement.style.setProperty('--button-text-color', '#fff');
        document.documentElement.style.setProperty('--secondary-text-color', '#888888');
        document.documentElement.style.setProperty('--content-height', `calc(100vh)`);
        document.documentElement.style.setProperty('--safeAreaInset-top', `${window?.Telegram?.WebApp?.safeAreaInset?.top ? window?.Telegram?.WebApp?.safeAreaInset?.top * 2 : 5}px`);
        document.documentElement.style.setProperty('--safeAreaInset-top-value', `${window?.Telegram?.WebApp?.safeAreaInset?.top * 2}`);
        document.documentElement.style.setProperty('--button-secondary-bg-color', "#f1f1f1");
        document.documentElement.style.setProperty('--glass-bg', "rgba(255, 255, 255, 0.1)");
        document.documentElement.style.setProperty('--glass-secondary-bg', "rgba(255, 255, 255, 0.15)");
        document.documentElement.style.setProperty('--glass-border', "rgba(255, 255, 255, 0.15)");

        if (token && isConnected) {
            sendData({
                action: "get/my",
                data: {
                    jwt: token
                }
            });
        }

        if(!token && isConnected) {
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

            params.some(param => {
                const match = param.match(/photoId(\w+)/);
                if (match && window.location.pathname === "/") {
                    setOpenedPhotoId(match[1]);
                    window.Telegram.WebApp.BackButton.show();
                    sendData({
                        action: "get_photo",
                        data: {
                            jwt: token,
                            photoId: match[1],
                            answerAction: "photo_modal_studio",
                        }
                    });
                    return true;
                }
                setOpenedPhotoId(0);
                return false;
            });
        }
    }, [setOpenedPhotoId, token]);

    useEffect(() => {
        if(window.location.pathname !== '/') {
            setOpenedPhotoId(0);
        }
    }, [window.location.pathname, setOpenedPhotoId]);

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

    useEffect(() => {
        const receiveCart = (msg) => {
            dispatch(setCart(msg.data.cartList));
        }

        addHandler("receive_cart", receiveCart);

        return () => deleteHandler('receive_cart');
    }, [addHandler, deleteHandler]);

    useEffect(() => {
        const receiveCart = (msg) => {
            console.log(msg.data);
            dispatch(addGood(msg.data));
        }

        addHandler("receive_new_cart_good", receiveCart);

        return () => deleteHandler('receive_new_cart_good');
    }, [addHandler, deleteHandler]);

    useEffect(() => {
        const receiveCart = (msg) => {
            console.log(msg.data);
            dispatch(updateCount(msg.data.id, msg.data.count));
        }

        addHandler("receive_update_count_cart_good", receiveCart);

        return () => deleteHandler('receive_update_count_cart_good');
    }, [addHandler, deleteHandler]);

    useEffect(() => {
        const receiveCart = (msg) => {
            console.log(msg.data);
            dispatch(deleteGood(msg.data.id));
        }

        addHandler("delete_good_from_cart", receiveCart);

        return () => deleteHandler('delete_good_from_cart');
    }, [addHandler, deleteHandler]);

    useEffect(() => {
        const updateSelectedModel = (msg) => {
            setUserData((prev) => ({
                ...prev,
                current_model_id: msg.model_id
            }));
        }

        addHandler("update_selected_model", updateSelectedModel);

        return () => deleteHandler('update_selected_model');
    }, [addHandler, deleteHandler]);

    useEffect(() => {
        const updateSelectedLora = (msg) => {
            setUserData((prev) => ({
                ...prev,
                current_lora_id: msg.lora_id
            }));
        }

        addHandler("update_selected_lora", updateSelectedLora);

        return () => deleteHandler('update_selected_lora');
    }, [addHandler, deleteHandler]);

    useEffect(() => {
        const updateRepeatPrice = (msg) => {
            dispatch(updateImage(msg.photo_id, {repeat_price: msg.repeat_price}))
        }

        addHandler("update_repeat_price", updateRepeatPrice);

        return () => deleteHandler('update_repeat_price');
    }, [addHandler, deleteHandler]);

    // repeat_price: repeatPrice

    useEffect(() => {
        const handleUpdateCountImagesGenerate = (msg) => {
            setUserData((prev) => ({
                ...prev,
                count_images_generate: msg.count_images_generate
            }));
        }

        addHandler("update_count_images_generate", handleUpdateCountImagesGenerate);

        return () => deleteHandler("update_count_images_generate");
    }, [addHandler, deleteHandler]);

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
        <div className="App">
            {
                window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.requestFullscreen && !window.location.pathname.startsWith("/profile/") && !window.location.pathname.startsWith("/rating") && (
                    <div style={{width: "100%", height: window.Telegram.WebApp?.safeAreaInset?.top
                                 ? `${window.Telegram.WebApp.safeAreaInset.top * 2}px`
                                 : '0', background: "var(--bg-color)", display: "block", position: "fixed", zIndex: 500}}>

                    </div>
                )
            }
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
                <Route path="/studio/create/:owner/:model" element={<GenerateImageAvatar />} />
                <Route path="/studio/repeat/:prompt_id" element={<GenerateImageAvatar />} />
                <Route path="/rating" element={<Rating />} />
                <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
            <NavbarBottom />
            {
                openedPhotoId > 0 && (
                    <PhotoPostModal
                        isModalOpen={true}
                        setIsModalOpen={() => setOpenedPhotoId(0)}
                        setOpenBackdropLoader={() => {}}
                        profileGallery={true}
                        nextPhoto={() => {}}
                        prevPhoto={() => {}}
                        userIdLoaded={userData.id}
                        selectedPhoto={openedPhotoId}
                        setSelectedPhoto={() => setOpenedPhotoId(0)}
                        from={"feed"}
                    />
                )
            }
            {
                (userData.count_goods_in_cart && userData.count_goods_in_cart > 0) ? (
                    <div className='cartButton' onClick={() => setOpenCart(true)}>
                        <span className={"cart-count"}>{userData.count_goods_in_cart}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" fill="none">
                            <path fill="var(--text-color)" fillRule="evenodd" d="M9.522 14.866a1 1 0 0 0 1.1.653l12.766-2.036a1 1 0 0 0 .823-.792l1.355-6.792a1 1 0 0 0-.964-1.196l-17.36-.28a1 1 0 0 0-.958 1.335l3.238 9.108ZM10.326 23.052a2.326 2.326 0 1 0 0-4.652 2.326 2.326 0 0 0 0 4.652ZM21.957 23.052a2.326 2.326 0 1 0 0-4.652 2.326 2.326 0 0 0 0 4.652Z" clipRule="evenodd"></path>
                            <path fill="var(--text-color)" d="M6.169.9h-4.71a1.31 1.31 0 1 0 0 2.618h3.337a1 1 0 0 1 .945.672l.942 2.71L9.35 5.6 8.035 2.182A2 2 0 0 0 6.17.9Z"></path>
                        </svg>
                    </div>
                ) : (
                    <></>
                )
            }

            <RightModal isOpen={openCart} onClose={() => setOpenCart(false)}>
                <Cart />
            </RightModal>

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

export const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: "год", seconds: 31536000 },
        { label: "мес.", seconds: 2592000 },
        { label: "дн.", seconds: 86400 },
        { label: "ч.", seconds: 3600 },
        { label: "м.", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label} назад`;
        }
    }

    return "только что";
};

export default App;