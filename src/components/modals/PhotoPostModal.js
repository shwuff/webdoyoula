import React, {useCallback, useEffect, useState} from 'react';
import styles from "../gallery/css/MyGeneratedPhotosList.module.css";
import {Avatar, Box, Typography} from "@mui/material";
import LikeHeart from "../buttons/LikeHeart";
import CommentsModal from "./CommentsModal";
import Modal from "../modal/Modal";
import {useWebSocket} from "../../context/WebSocketContext";
import {useAuth} from "../../context/UserContext";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion, AnimatePresence } from 'framer-motion';
import SubscribeButton from "../buttons/SubscribeButton";

const PhotoPostModal = ({ isModalOpen, setIsModalOpen, setOpenBackdropLoader, nextPhoto = () => {}, prevPhoto = () => {}, profileGallery = false }) => {

    const {addHandler, deleteHandler, sendData, isConnected} = useWebSocket();
    const {token, userData} = useAuth();

    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [closingModal, setClosingModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const navigate = useNavigate();

    const BackButton = window.Telegram.WebApp.BackButton;

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedPhoto(null);
        BackButton.hide();
    }, []);

    const handleLike = (imageId, userId) => {
        sendData({
            action: "handle_like_post",
            data: { jwt: token, userId: userId, imageId: imageId }
        });
    };

    const handleDeleteFromGallery = (photoId) => {
        sendData({
            action: "delete_from_gallery",
            data: { jwt: token, photoId }
        });
    };

    const handlePublishToGallery = (photoId) => {
        sendData({
            action: "publish_to_gallery",
            data: { jwt: token, photoId }
        });
    };

    useEffect(() => {
        const handleLikes = (msg) => {
            if (!selectedPhoto || selectedPhoto.id !== msg.imageId) {
                return;
            }
            setSelectedPhoto((prevPhoto) =>
                prevPhoto && prevPhoto.id === msg.imageId
                    ? {
                        ...prevPhoto,
                        liked: msg.liked,
                        likes_count: msg.likesCount
                    }
                    : prevPhoto
            );
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        };

        addHandler('handle_update_like', handleLikes);
        return () => deleteHandler('handle_update_like');
    }, [userData, selectedPhoto]);

    useEffect(() => {

        const handleBackButtonClicked = () => {

            if(isCommentModalOpen) {
                setIsCommentModalOpen(false);
            } else {
                closeModal();
            }
        }

        BackButton.onClick(handleBackButtonClicked);

        return () => BackButton.offClick(handleBackButtonClicked);
    }, [isCommentModalOpen]);

    useEffect(() => {
        const handlePhotoGeneratedModal = async (msg) => {
            if (!msg.media || msg.media.length < 1) return;
            setSelectedPhoto(msg.media[0]);
            BackButton.show();
            setIsModalOpen(true);
            setOpenBackdropLoader(false);
        };

        addHandler('photo_modal_studio', handlePhotoGeneratedModal);
        return () => deleteHandler('photo_modal_studio');
    }, [addHandler, deleteHandler, BackButton]);

    useEffect(() => {
        const handleMessage = async (msg) => {
            if(selectedPhoto !== null && selectedPhoto.id === msg.photoId) {
                setSelectedPhoto((prev) => ({
                    ...prev,
                    hided: msg.hided
                }));
            }
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        };

        addHandler('update_photo_hided', handleMessage);
        return () => deleteHandler('update_photo_hided');
    }, [addHandler, deleteHandler, selectedPhoto]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowLeft") {
                prevPhoto(selectedPhoto);
            } else if (event.key === "ArrowRight") {
                nextPhoto(selectedPhoto);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedPhoto, nextPhoto, prevPhoto]);

    return (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    className={styles.modalOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className={`${styles.modalContent} ${closingModal ? styles.modalClosing : ''}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedPhoto && (
                            <div style={{ overflowY: "auto", paddingTop: window.Telegram.WebApp?.safeAreaInset?.top
                                    ? `${window.Telegram.WebApp.safeAreaInset.top * 2}px`
                                    : '0' }}>
                                {
                                    profileGallery && (
                                        <div className="p-2 d-flex align-items-center justify-content-between">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Avatar
                                                    src={selectedPhoto.author.photo_url}
                                                    alt={`${selectedPhoto.author.first_name} ${selectedPhoto.author.last_name}`}
                                                    sx={{ width: 40, height: 40 }}
                                                    onClick={() => navigate(`/profile/${selectedPhoto.author.id}`)}
                                                />

                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {selectedPhoto.author.first_name} {selectedPhoto.author.last_name}
                                                    </Typography>
                                                    <Typography variant="body2" className={"text-muted"}>
                                                        @{selectedPhoto.author.username}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {
                                                Number(selectedPhoto.author.id) !== Number(userData.id) && (
                                                    <SubscribeButton
                                                        sub={selectedPhoto.author.sub}
                                                        setSub={(sub) => {
                                                            setSelectedPhoto((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    author: {
                                                                        ...selectedPhoto.author,
                                                                        sub: sub
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                        userId={selectedPhoto.author.id}
                                                    />
                                                )
                                            }
                                        </div>
                                    )
                                }
                                <div className={styles.imageBlock} style={{ height: window.Telegram.WebApp?.safeAreaInset?.top
                                    ?`calc(100vh - ${window.Telegram.WebApp.safeAreaInset.top * 2 + 200}px)` : `max-content`, position: "relative", textAlign: "center" }}>
                                    <div className={styles.leftNav} onClick={() => prevPhoto(selectedPhoto)}>
                                        <button
                                            className={styles.navButton}
                                            style={{ left: 10 }}
                                            onClick={() => prevPhoto(selectedPhoto)}
                                        >
                                            <ArrowBackIosNewIcon />
                                        </button>
                                    </div>

                                    <img
                                        src={selectedPhoto.blob_url}
                                        alt={`photo-${selectedPhoto.id}`}
                                        className={styles.modalImage}
                                    />

                                    <div className={styles.rightNav} onClick={() => nextPhoto(selectedPhoto)}>
                                        <button
                                            className={styles.navButton}
                                            style={{ right: 10 }}
                                            onClick={() => nextPhoto(selectedPhoto)}
                                        >
                                            <ArrowForwardIosIcon />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-2">
                                    {
                                        profileGallery === false ? (
                                            <>
                                                {
                                                    !selectedPhoto.hided === true ? (
                                                        <button className={"btn btn-outline-primary w-100"} onClick={() => {
                                                            handleDeleteFromGallery(selectedPhoto.id);
                                                        }}>
                                                            Скрыть
                                                        </button>
                                                    ) : (
                                                        <button className={"btn btn-primary w-100"} onClick={() => {
                                                            handlePublishToGallery(selectedPhoto.id);
                                                        }}>
                                                            Опубликовать
                                                        </button>
                                                    )
                                                }
                                                <button className={"btn iconButton w-100"} style={{margin: 0, marginTop: 4}} onClick={() => navigate(`/studio/generate-image-avatar/${selectedPhoto.prompt_id}`)}>
                                                    Повторить
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-100 d-flex justify-content-between">
                                                    <div className={"actionBar d-flex align-items-center"}>
                                                        <div className={"d-flex align-items-center"}>
                                                            <button
                                                                className="actionButton"
                                                                onClick={() => handleLike(selectedPhoto.id, userData.id)}
                                                            >
                                                                <LikeHeart liked={selectedPhoto.liked} />
                                                            </button>
                                                            <p style={{marginLeft: "5px", marginTop: "5px"}}>
                                                                {selectedPhoto.likes_count}
                                                            </p>
                                                        </div>
                                                        <div className={"d-flex align-items-center"}>
                                                            <CommentsModal photoGallery={selectedPhoto} isOpen={isCommentModalOpen} setOpen={setIsCommentModalOpen} />
                                                            <p style={{marginLeft: "8px", marginTop: "5px"}}>
                                                                {selectedPhoto.comments_count}
                                                            </p>
                                                        </div>
                                                        <div className={"d-flex align-items-center"} style={{marginLeft: 3}}>
                                                            <VisibilityIcon sx={{width: 24, height: 24, marginTop: 0.5}} />
                                                            <p style={{marginLeft: "8px", marginTop: "5px"}}>
                                                                {selectedPhoto.count_views}
                                                            </p>
                                                        </div>
                                                        <button className={"btn iconButton"} style={{margin: 0, marginLeft: 5}} onClick={() => navigate(`/studio/generate-image-avatar/${selectedPhoto.prompt_id}`)}>
                                                            Повторить
                                                        </button>
                                                        {selectedPhoto.count_generated_with_prompt}
                                                    </div>
                                                </div>
                                                {
                                                    Number(selectedPhoto.author.id) === userData.id && (
                                                        <>
                                                            {
                                                                !selectedPhoto.hided === true ? (
                                                                    <button className={"btn btn-outline-primary w-100"} onClick={() => {
                                                                        handleDeleteFromGallery(selectedPhoto.id);
                                                                    }}>
                                                                        Скрыть
                                                                    </button>
                                                                ) : (
                                                                    <button className={"btn btn-primary w-100"} onClick={() => {
                                                                        handlePublishToGallery(selectedPhoto.id);
                                                                    }}>
                                                                        Опубликовать
                                                                    </button>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PhotoPostModal;