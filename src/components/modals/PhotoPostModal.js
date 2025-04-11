import React, {useCallback, useEffect, useState} from 'react';
import styles from "../gallery/css/MyGeneratedPhotosList.module.css";
import {Avatar, Box, Typography} from "@mui/material";
import LikeHeart from "../buttons/LikeHeart";
import CommentsModal from "./CommentsModal";
import {useWebSocket} from "../../context/WebSocketContext";
import {useAuth} from "../../context/UserContext";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion, AnimatePresence } from 'framer-motion';
import SubscribeButton from "../buttons/SubscribeButton";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import { setCurrentImageSelected, updateImage } from "../../redux/actions/imageActions";
import telegramStar from "../../assets/icons/telegramStar.png";

const PhotoPostModal = ({ isModalOpen, setIsModalOpen, setOpenBackdropLoader, selectedPhoto, setSelectedPhoto, nextPhoto = () => {}, prevPhoto = () => {}, profileGallery = false, from = '' }) => {

    const {addHandler, deleteHandler, sendData, isConnected} = useWebSocket();
    const {token, userData} = useAuth();
    const {t} = useTranslation();

    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [closingModal, setClosingModal] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const imageSelector = useSelector((state) => state.image.images);

    const BackButton = window.Telegram.WebApp.BackButton;

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedPhoto(0);
        setCurrentImageSelected(0);
        BackButton.hide();
    }, [setCurrentImageSelected]);

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
            if (!selectedPhoto || selectedPhoto !== msg.imageId) {
                return;
            }

            dispatch(updateImage(msg.imageId, {liked: msg.liked, likes_count: msg.likesCount}));

            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        };

        addHandler('handle_update_like', handleLikes);
        return () => deleteHandler('handle_update_like');
    }, [userData, selectedPhoto, updateImage]);

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
            dispatch(updateImage(msg.media[0].id, {blob_url: msg.media[0].blob_url}));
        };

        addHandler('photo_modal_studio', handlePhotoGeneratedModal);
        return () => deleteHandler('photo_modal_studio');
    }, [addHandler, deleteHandler, BackButton, selectedPhoto]);

    useEffect(() => {
        const handleMessage = async (msg) => {
            if(selectedPhoto !== null && selectedPhoto === msg.photoId) {
                dispatch(updateImage(msg.photoId, {hided: msg.hided}));
            }
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        };

        addHandler('update_photo_hided', handleMessage);
        return () => deleteHandler('update_photo_hided');
    }, [addHandler, deleteHandler, selectedPhoto]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowLeft") {
                prevPhoto(imageSelector[selectedPhoto]);
            } else if (event.key === "ArrowRight") {
                nextPhoto(imageSelector[selectedPhoto]);
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
                        {imageSelector[selectedPhoto] && (
                            <div style={{ overflowY: "auto", paddingTop: "var(--safeAreaInset-top)" }}>
                                {
                                    profileGallery && (
                                        <div className="p-2 d-flex align-items-center justify-content-between">
                                            <Box display="flex" alignItems="center" gap={1} onClick={() => navigate(`/profile/${imageSelector[selectedPhoto].author.id}`)}>
                                                <Avatar
                                                    src={imageSelector[selectedPhoto].author.photo_url}
                                                    alt={`${imageSelector[selectedPhoto].author.first_name} ${imageSelector[selectedPhoto].author.last_name}`}
                                                    sx={{ width: 40, height: 40 }}
                                                />

                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {imageSelector[selectedPhoto].author.first_name} {imageSelector[selectedPhoto].author.last_name}
                                                    </Typography>
                                                    <Typography variant="body2" className={"text-muted"}>
                                                        {
                                                            imageSelector[selectedPhoto].author.username && (
                                                                <>
                                                                    @{imageSelector[selectedPhoto].author.username}
                                                                </>
                                                            )
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {
                                                Number(imageSelector[selectedPhoto].author.id) !== Number(userData.id) && (
                                                    <SubscribeButton
                                                        sub={imageSelector[selectedPhoto].author.sub}
                                                        setSub={(sub) => {
                                                            dispatch(updateImage(imageSelector[selectedPhoto].id, { author: {...imageSelector[selectedPhoto].author, sub: sub} }))
                                                        }}
                                                        userId={imageSelector[selectedPhoto].author.id}
                                                    />
                                                )
                                            }
                                        </div>
                                    )
                                }
                                <div className={styles.imageBlock} style={{ maxHeight: window.Telegram.WebApp?.safeAreaInset?.top
                                    ?`calc(100vh - ${window.Telegram.WebApp.safeAreaInset.top * 2 + 200}px)` : `calc(100vh - 200px)`, position: "relative", textAlign: "center" }}>
                                    {
                                        from !== 'notification' && (
                                            <div className={styles.leftNav} onClick={() => prevPhoto(imageSelector[selectedPhoto])}>
                                                <button
                                                    className={styles.navButton}
                                                    style={{ left: 10 }}
                                                    onClick={() => prevPhoto(imageSelector[selectedPhoto])}
                                                >
                                                    <ArrowBackIosNewIcon />
                                                </button>
                                            </div>
                                        )
                                    }

                                    <img
                                        src={imageSelector[selectedPhoto].blob_url}
                                        alt={`photo-${imageSelector[selectedPhoto].id}`}
                                        className={styles.modalImage}
                                        style={{maxHeight: window.Telegram.WebApp?.safeAreaInset?.top
                                                ?`calc(100vh - ${window.Telegram.WebApp.safeAreaInset.top * 2 + 200}px)` : `calc(100vh - 200px)`}}
                                    />
                                    {Number(imageSelector[selectedPhoto]?.author?.id) === Number(imageSelector[selectedPhoto].promptAuthor) && (
                                        <img
                                            src={telegramStar}
                                            alt="Telegram Star"
                                            style={{
                                                position: 'absolute',
                                                left: '8px',
                                                bottom: '8px',
                                                width: '40px',
                                                height: '40px',
                                            }}
                                        />
                                    )}

                                    {
                                        from !== 'notification' && (
                                            <div className={styles.rightNav} onClick={() => nextPhoto(imageSelector[selectedPhoto])}>
                                                <button
                                                    className={styles.navButton}
                                                    style={{ right: 10 }}
                                                    onClick={() => nextPhoto(imageSelector[selectedPhoto])}
                                                >
                                                    <ArrowForwardIosIcon />
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="p-2">
                                    {
                                        profileGallery === false ? (
                                            <>
                                                {
                                                    !imageSelector[selectedPhoto].hided === true ? (
                                                        <button className={"btn btn-outline-primary w-100"} onClick={() => {
                                                            handleDeleteFromGallery(imageSelector[selectedPhoto].id);
                                                        }}>
                                                            {t('hide')}
                                                        </button>
                                                    ) : (
                                                        <button className={"btn btn-primary w-100"} onClick={() => {
                                                            handlePublishToGallery(imageSelector[selectedPhoto].id);
                                                        }}>
                                                            {t('to_publish')}
                                                        </button>
                                                    )
                                                }
                                                <button className={"btn iconButton w-100"} style={{margin: 0, marginTop: 4}} onClick={() => navigate(`/studio/generate-image-avatar/${imageSelector[selectedPhoto].prompt_id}`)}>
                                                    {t('repeat')}
                                                </button>
                                                                                           
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-100 d-flex justify-content-between">
                                                    <div className={"actionBar d-flex align-items-center"}>
                                                        <div className={"d-flex align-items-center"}>
                                                            <button
                                                                className="actionButton d-flex align-items-center"
                                                                onClick={() => handleLike(imageSelector[selectedPhoto].id, userData.id)}
                                                            >
                                                                <LikeHeart liked={imageSelector[selectedPhoto].liked} />
                                                            </button>
                                                            <p style={{marginLeft: "5px"}}>
                                                                {imageSelector[selectedPhoto].likes_count}
                                                            </p>
                                                        </div>
                                                        <div className={"d-flex align-items-center"}>
                                                            <CommentsModal photoGallery={imageSelector[selectedPhoto]} isOpen={isCommentModalOpen} setOpen={setIsCommentModalOpen} />
                                                            <p style={{marginLeft: "8px"}}>
                                                                {imageSelector[selectedPhoto].comments_count}
                                                            </p>
                                                        </div>
                                                        <div className={"d-flex align-items-center"} style={{marginLeft: 3}}>
                                                            <VisibilityIcon sx={{width: 24, height: 24}} />
                                                            <p style={{marginLeft: "8px"}}>
                                                                {imageSelector[selectedPhoto].count_views}
                                                            </p>
                                                        </div>
                                                        <button className={"btn iconButton"} style={{margin: 0, marginLeft: 5}} onClick={() => navigate(`/studio/generate-image-avatar/${imageSelector[selectedPhoto].prompt_id}`)}>
                                                            {t('repeat')}
                                                        </button>
                                                        <span style={{ fontSize: 18 }}>{imageSelector[selectedPhoto].count_generated_with_prompt}</span>
                                                        {
                                                            imageSelector[selectedPhoto].count_generated_with_prompt_today && imageSelector[selectedPhoto].count_generated_with_prompt_today > 0 ? (
                                                                <span style={{ color: "#008000", fontWeight: 800, fontSize: 12, marginTop: -8, marginLeft: -4 }}>+{imageSelector[selectedPhoto].count_generated_with_prompt_today}</span>
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    Number(imageSelector[selectedPhoto].author.id) === userData.id && (
                                                        <>
                                                            {
                                                                !imageSelector[selectedPhoto].hided === true ? (
                                                                    <button className={"btn btn-outline-primary w-100"} style={{marginTop: 5}} onClick={() => {
                                                                        handleDeleteFromGallery(imageSelector[selectedPhoto].id);
                                                                    }}>
                                                                        {t('hide')}
                                                                    </button>
                                                                ) : (
                                                                    <button className={"btn btn-primary w-100"} style={{marginTop: 5}} onClick={() => {
                                                                        handlePublishToGallery(imageSelector[selectedPhoto].id);
                                                                    }}>
                                                                        {t('to_publish')}
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