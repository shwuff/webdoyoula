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

const FeedPage = () => {
    const [layout, setLayout] = useState("3");
    const [filter, setFilter] = useState("date");
    const [items, setItems] = useState([]);
    const [photosPage, setPhotosPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { token, userData } = useAuth();
    const { addHandler, sendData, deleteHandler, isConnected } = useWebSocket();
    const sentinelRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBackdropLoader, setOpenBackdropLoader] = useState(false);

    const handleLoadPhotos = useCallback((msg) => {
        if (msg.media && msg.media.length > 0) {
            setItems((prevItems) => [...prevItems, ...msg.media]);
            setHasMore(msg.hasMore);
        }
        setIsLoading(false);
    }, []);

    const fetchMoreData = useCallback(() => {
        if (isLoading || !isConnected || token == null || !hasMore) return;
        setIsLoading(true);
        sendData({
            action: "load_photos",
            data: {
                jwt: token,
                photosPage: photosPage,
                filter,
            },
        });
        setPhotosPage((prev) => prev + 1);
    }, [isLoading, token, photosPage, filter, sendData, isConnected, hasMore]);

    const sortedItems = [...items].sort((a, b) => {
        if (filter === "popularity") return b.popularity - a.popularity;
        if (filter === "generations") return b.generations - a.generations;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const handleNextPhoto = useCallback((selectedPhoto) => {

        if (!selectedPhoto) return;

        const idx = sortedItems.findIndex((p) => Number(p.id) === selectedPhoto.id);

        if (idx === -1) return;

        if (idx < sortedItems.length - 1) {
            openModal(sortedItems[idx + 1].id, selectedPhoto.author.id);
        } else {
            const nextPg = photosPage + 1;
            setPhotosPage(nextPg);
            sendData({
                action: "load_photos",
                data: {
                    jwt: token,
                    photosPage: photosPage,
                    filter,
                },
            });
        }
    }, [
        sortedItems,
        photosPage,
        setPhotosPage,
        sendData,
        token
    ]);

    const handlePrevPhoto = useCallback((selectedPhoto) => {
        if (!selectedPhoto) return;

        const idx = sortedItems.findIndex((p) => Number(p.id) === selectedPhoto.id);
        if (idx === -1) return;

        if (idx > 0) {
            openModal(sortedItems[idx - 1].id, selectedPhoto.author.id);
        }
    }, [sortedItems, sendData]);

    const openModal = useCallback((photoId, userId) => {
        setOpenBackdropLoader(true);
        sendData({
            action: "get_photo",
            data: {
                jwt: token,
                photoId: photoId,
                answerAction: "photo_modal_studio",
                userIdLoaded: userId
            }
        });
    }, [sendData, token]);

    useEffect(() => {
        addHandler("load_photos", handleLoadPhotos);
        return () => {
            deleteHandler("load_photos");
        };
    }, [addHandler, deleteHandler, handleLoadPhotos]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchMoreData();
                }
            },
            {
                root: null,      // Отслеживаем в рамках окна
                rootMargin: '200px', // Можно слегка увеличить отступ, чтобы догружать заранее
                threshold: 0.0,
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, [fetchMoreData]);

    // --------------------------------

    // const [photosPage, setPhotosPage] = useState(1);

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

    return (
        <div className={"globalBlock"} onScroll={handleScroll}>
            <div className={"center-content-block"}>
                <MyGeneratedPhotosList
                    profileGallery={true}
                    resetLastPageRef={resetLastPageRef}
                    resetFetchingRef={resetFetchingRef}
                    photosPage={photosPage}
                    setPhotosPage={setPhotosPage}
                    from={"feedPage"}
                />

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
