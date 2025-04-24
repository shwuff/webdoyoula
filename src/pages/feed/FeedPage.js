import React, { useState, useEffect, useCallback, useRef } from "react";
import { Grid, ToggleButton, ToggleButtonGroup, MenuItem, Select, FormControl, InputLabel, Card, CardMedia, CardContent, Typography, Avatar, Box, IconButton } from "@mui/material";
import {FaHeart, FaComment, FaRegHeart} from 'react-icons/fa';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "../../components/gallery/css/MyGeneratedPhotosList.module.css";
import CommentsModal from "../../components/modals/CommentsModal";
import Modal from "react-modal";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import LikeHeart from "../../components/buttons/LikeHeart";
import PhotoPostModal from "../../components/modals/PhotoPostModal";
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import FeedFilters from "../../components/input/FeedFilters";
import ChatPng from './../../assets/images/chat.png';

const FeedPage = () => {
    const [filter, setFilter] = useState("repeats");
    const [dateRange, setDateRange] = useState("last_1_day");
    const [feed, setFeed] = useState('feed');
    const [photosPage, setPhotosPage] = useState(1);
    const [isMarket, setIsMarket] = useState(false);
    const [showPaidPrompts, setShowPaidPrompts] = useState(false);

    const isFetchingRef = useRef(false);
    const lastPageRef = useRef(1);
    const scrollTimeoutRef = useRef(null);

    const handleScroll = (e) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {

            const bottom = e.target.scrollHeight < e.target.scrollTop + e.target.clientHeight + 600;

            if (bottom && !isFetchingRef.current) {
                const nextPage = lastPageRef.current + 1;

                isFetchingRef.current = true;
                lastPageRef.current = nextPage;
                setPhotosPage(nextPage);
            }
        }, 100);
    };

    const resetLastPageRef = () => {
        lastPageRef.current = 1;
    };

    const resetFetchingRef = () => {
        isFetchingRef.current = false;
    };

    return (
        <div className={"globalBlock"} onScroll={handleScroll}>
            <div className={"center-content-block"} style={{marginTop: "7px"}}>
                <FeedFilters
                    filter={filter}
                    setFilter={setFilter}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    feed={feed}
                    setFeed={setFeed}
                    style={{ marginBottom: "10px" }}
                    setPhotosPage={setPhotosPage}
                    isMarket={showPaidPrompts}
                    setIsMarket={setShowPaidPrompts}
                />
                <MyGeneratedPhotosList
                    profileGallery={true}
                    resetLastPageRef={resetLastPageRef}
                    resetFetchingRef={resetFetchingRef}
                    photosPage={photosPage}
                    setPhotosPage={setPhotosPage}
                    from={"feedPage"}
                    filter={filter}
                    dateRange={dateRange}
                    feed={feed}
                    isMarket={isMarket}
                    showPaidPrompts={showPaidPrompts}
                />

                <div style={{ position: "absolute", bottom: "100px", right: "20px", padding: "10px", borderRadius: "50%", cursor: "pointer" }} onClick={() => window.location.href = 'https://t.me/doyoulachat'}>
                    <img src={ChatPng} width={52} />
                </div>
            </div>

        </div>
    );
};

export default FeedPage;
