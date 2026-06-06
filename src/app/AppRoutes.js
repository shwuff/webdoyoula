import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavbarBottom from "../components/navs/NavbarBottom";
import Profile from "../pages/user/Profile";
import Studio from "../pages/studio";
import CreatePrediction from "../pages/studio/createPrediction";
import Settings from "../pages/user/Settings";
import Blanks from "../pages/user/settings/Blanks";
import FeedPage from "../pages/feed/FeedPage";
import Content from "../pages/user/settings/Content";
import Rating from "../pages/rating/Rating";
import NotificationsPage from '../pages/notifications/NotificationsPage';
import ChatGpt from "../pages/chat_gpt/ChatGpt";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
    const location = useLocation();
    
    return (
        <>
            <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/blanks" element={<Blanks />} />
                <Route path="/settings/content" element={<Content />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/studio/create" element={<Studio />} />
                <Route path="/studio/create/:owner/:model" element={<CreatePrediction />} />
                <Route path="/studio/repeat/:prompt_id" element={<CreatePrediction />} />
                <Route path="/prompt/:prompt_id/" element={<CreatePrediction />} />
                <Route path="/rating" element={<Rating />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/chat" element={<ChatGpt />} />
                <Route path="/chat/:chatUUID" element={<ChatGpt />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            {!location.pathname.startsWith("/chat") && <NavbarBottom />}
        </>
    );
};

export default AppRoutes;
