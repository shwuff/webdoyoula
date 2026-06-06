import React, {useEffect, useState} from 'react';
import "../assets/css/index.css";
import { useAuth } from "./providers/UserContext";
import Auth from "../pages/user/auth/Auth";
import RightModal from '../components/modal/RightModal';
import Cart from "../components/modals/Cart";
import StableJoyride from "../components/joyride/JoyrideGlobal";

// Hooks
import { useAuthHandlers } from "./hooks/useAuthHandlers";
import { useCartHandlers } from "./hooks/useCartHandlers";
import { useUserDataHandlers } from "./hooks/useUserDataHandlers";
import { useNotificationHandlers } from "./hooks/useNotificationHandlers";
import { useTelegramHandlers } from "./hooks/useTelegramHandlers";
import { useTelegramSetup } from "./hooks/useTelegramSetup";
import { useStartParams } from "./hooks/useStartParams";
import { useLanguageSync } from "./hooks/useLanguageSync";
import { useInitialAuth } from "./hooks/useInitialAuth";
import { useOnboarding } from "./hooks/useOnboarding";
import { useModelsLoader } from "./hooks/useModelsLoader";
import { useScrollToTop } from "./hooks/useScrollToTop";

// Components
import AppRoutes from "./AppRoutes";
import AppNotification from "../components/app/AppNotification";
import AppLoadingScreen from "../components/app/AppLoadingScreen";
import CartButton from "../components/app/CartButton";
import ScrollToTopButton from "../components/app/ScrollToTopButton";
import PhotoModalWrapper from "../components/app/PhotoModalWrapper";
import {useNavigate, useSearchParams} from "react-router-dom";

const App = () => {
    const { token, login, userData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [openCart, setOpenCart] = useState(false);
    const query = new URLSearchParams(window.location.search);
    const jwt = query.get('jwt');
    const navigate = useNavigate();

    useEffect(() => {
        if(jwt !== null && jwt !== undefined) {
            localStorage.setItem('auth_token', jwt);
            login(jwt);
            navigate('/')
        }
    }, [jwt]);

    // Setup hooks
    useTelegramSetup();
    useLanguageSync();
    useModelsLoader();

    // WebSocket handlers
    useAuthHandlers(setLoading);
    useCartHandlers();
    useUserDataHandlers();
    const { notification, setNotification } = useNotificationHandlers();
    useTelegramHandlers();

    // Other hooks
    const { openedPhotoId, setOpenedPhotoId } = useStartParams();
    const { joyrideRef, skipAvailable, onboardingSteps } = useOnboarding();
    const { showButton, scrollToTop } = useScrollToTop();

    // Initial auth
    useInitialAuth(setLoading);

    const handleCloseNotification = () => {
        setNotification(null);
    };

    if (loading) {
        return <AppLoadingScreen />;
    }

    if (!token && window?.Telegram?.WebApp?.initData === "") {
        return <Auth />;
    }

    if (!token) {
        return <></>;
    }

    return (
        <div className="App">

            <StableJoyride ref={joyrideRef} steps={onboardingSteps} skipAvailable={skipAvailable} />

            {/*{*/}
            {/*    window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.requestFullscreen && !window.location.pathname.startsWith("/profile/") && !window.location.pathname.startsWith("/rating") && window.location.pathname !== '/' ? (*/}
            {/*        <div style={{width: "100%", height: window.Telegram.WebApp?.safeAreaInset?.top*/}
            {/*                ? `var(--safeAreaInset-top)`*/}
            {/*                : '0', background: window.location.pathname.startsWith('/chat') ? "var(--bg-color)" : "var(--body-bg-color)", display: "block", position: "fixed", zIndex: 500}}>*/}
            {/*        </div>*/}
            {/*    ) : null*/}
            {/*}*/}

            <AppRoutes />

            <ScrollToTopButton showButton={showButton} onClick={scrollToTop} />

            <PhotoModalWrapper
                openedPhotoId={openedPhotoId}
                onClose={() => setOpenedPhotoId(0)}
            />

            <CartButton onClick={() => setOpenCart(true)} />

            <RightModal isOpen={openCart} onClose={() => setOpenCart(false)}>
                <Cart />
            </RightModal>

            <AppNotification
                notification={notification}
                onClose={handleCloseNotification}
            />
        </div>
    );
};

export { getTimeAgo } from '../utils/getTimeAgo';

export default App;