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
import { Chat } from "@mui/icons-material";

const FeedPage = () => {
    const [filter, setFilter] = useState("date");
    const [dateRange, setDateRange] = useState("all_time");
    const [feed, setFeed] = useState('feed');
    const [photosPage, setPhotosPage] = useState(1);

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
                // console.log(`📸 Следующая страница: ${nextPage}`);

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

    useEffect(() => {
        setPhotosPage(1);
    }, [dateRange, filter, feed]);

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
                />

                <div style={{ position: "absolute", bottom: "100px", right: "20px", padding: "10px", background: "var(--primary-color)", borderRadius: "50%" }} onClick={() => window.location.href = 'https://t.me/doyoulachat'}>
                    <Chat style={{fill: "white"}} />
                </div>

                {/*<PhotoPostModal*/}
                {/*    isModalOpen={isModalOpen}*/}
                {/*    setIsModalOpen={setIsModalOpen}*/}
                {/*    setOpenBackdropLoader={setOpenBackdropLoader}*/}
                {/*    profileGallery={true}*/}
                {/*    nextPhoto={handleNextPhoto}*/}
                {/*    prevPhoto={handlePrevPhoto}*/}
                {/*/>*/}
            </div>

        </div>
    );
};

export default FeedPage;
