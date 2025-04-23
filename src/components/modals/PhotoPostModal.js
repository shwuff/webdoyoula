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
import PublishToGalleryButton from "../buttons/PublishToGalleryButton";
import telegramAnimationStar from "../../assets/gif/gold_star.gif";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import {getTimeAgo} from "../../App";

const PhotoPostModal = ({ isModalOpen, setIsModalOpen, setOpenBackdropLoader, selectedPhoto, setSelectedPhoto, nextPhoto = () => {}, prevPhoto = () => {}, profileGallery = false, from = '' }) => {

    const {addHandler, deleteHandler, sendData, isConnected} = useWebSocket();
    const {token, userData} = useAuth();
    const {t} = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

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
        setExpanded(false);
    }, [setCurrentImageSelected]);

    const handleLike = (imageId, userId) => {
        sendData({
            action: "handle_like_post",
            data: { jwt: token, userId: userId, imageId: imageId }
        });
    };

    //handle like post
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

    //back button telegram
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

    // get large size photo
    useEffect(() => {
        const handlePhotoGeneratedModal = async (msg) => {
            if (!msg.media || msg.media.length < 1) return;
            dispatch(updateImage(msg.media[0].id, {blob_url: msg.media[0].blob_url}));
        };

        addHandler('photo_modal_studio', handlePhotoGeneratedModal);
        return () => deleteHandler('photo_modal_studio');
    }, [addHandler, deleteHandler, BackButton, selectedPhoto]);

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

    const handleEdit = () => {
        setAnchorEl(null);
    };

    const handleViewPrompt = () => {
        setAnchorEl(null);
    };

    const handleShare = (photoId) => {
        setAnchorEl(null);
        window.location.href = `https://t.me/share/url?url=https://t.me/doyoulabot/app?startapp=photoId${photoId}AAAfrom${userData.id}`;
    };

    const handleHideMedia = (photoId) => {
        setAnchorEl(null);
        sendData({
            action: "delete_from_gallery",
            data: { jwt: token, photoId }
        });
    };

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
                            <div style={{ overflowY: "auto", paddingTop: "var(--safeAreaInset-top)", minHeight: "100vh" }}>
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
                                            <Box sx={{ position: 'relative', display: "flex", width: "max-content", marginRight: "35px", gap: "10px" }}>
                                                {
                                                    Number(imageSelector[selectedPhoto].author.id) !== Number(userData.id) && (
                                                        <SubscribeButton
                                                            sub={imageSelector[selectedPhoto].author.sub}
                                                            setSub={(sub) => {
                                                                dispatch(updateImage(imageSelector[selectedPhoto].id, {
                                                                    author: { ...imageSelector[selectedPhoto].author, sub: sub }
                                                                }))
                                                            }}
                                                            userId={imageSelector[selectedPhoto].author.id}
                                                        />
                                                    )
                                                }

                                                <IconButton
                                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>

                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={() => setAnchorEl(null)}
                                                >
                                                    {/*{*/}
                                                    {/*    Number(imageSelector[selectedPhoto]?.author?.id) === Number(userData.id) && (*/}
                                                    {/*        <MenuItem onClick={handleEdit}>*/}
                                                    {/*            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>*/}
                                                    {/*            <ListItemText primary="Редактировать" />*/}
                                                    {/*        </MenuItem>*/}
                                                    {/*    )*/}
                                                    {/*}*/}
                                                    {/*<MenuItem onClick={handleViewPrompt}>*/}
                                                    {/*    <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>*/}
                                                    {/*    <ListItemText primary="Посмотреть промт" />*/}
                                                    {/*</MenuItem>*/}
                                                    <MenuItem onClick={() => handleShare(selectedPhoto)}>
                                                        <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>
                                                        <ListItemText primary="Поделиться" />
                                                    </MenuItem>
                                                    {
                                                        Number(imageSelector[selectedPhoto]?.author?.id) === Number(userData.id) && (
                                                            <MenuItem onClick={() => handleHideMedia(imageSelector[selectedPhoto].id)}>
                                                                <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                                                                <ListItemText primary="Скрыть" />
                                                            </MenuItem>
                                                        )
                                                    }
                                                </Menu>
                                            </Box>
                                        </div>
                                    )
                                }
                                <div className={styles.imageBlock} style={{ width: expanded ? "30%" : undefined, transition: "0.5s all", maxHeight: window.Telegram.WebApp?.safeAreaInset?.top
                                    ?`calc(100vh - ${window.Telegram.WebApp.safeAreaInset.top * 2 + 200}px)` : `calc(100vh - 200px)`, position: "relative", textAlign: "center" }}>
                                    {
                                        from !== 'notification' && !expanded && (
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
                                    <span style={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        borderRadius: "12px",
                                        padding: "4px 8px",
                                        border: "1px solid gold",
                                        color: "gold"
                                    }}>
                                        {imageSelector[selectedPhoto].ai_model}
                                    </span>
                                    {Number(imageSelector[selectedPhoto]?.author?.id) === Number(imageSelector[selectedPhoto].promptAuthor) && !expanded && (
                                        <>
                                            {
                                                imageSelector[selectedPhoto]?.repeat_price !== null && imageSelector[selectedPhoto]?.repeat_price > 0 ? (
                                                    <img
                                                        src={telegramAnimationStar}
                                                        alt="Gold Animation Star"
                                                        style={{
                                                            position: 'absolute',
                                                            left: '8px',
                                                            bottom: '8px',
                                                            width: '40px',
                                                            height: '40px',
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={telegramStar}
                                                        alt="Star"
                                                        style={{
                                                            position: 'absolute',
                                                            left: '8px',
                                                            bottom: '8px',
                                                            width: '40px',
                                                            height: '40px',
                                                        }}
                                                    />
                                                )
                                            }
                                        </>
                                    )}

                                    {
                                        from !== 'notification' && !expanded && (
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
                                                <PublishToGalleryButton
                                                    photoId={imageSelector[selectedPhoto]}
                                                    selectedPhoto={selectedPhoto}
                                                    expanded={expanded}
                                                    setExpanded={setExpanded}
                                                    isMyPrompt={Number(imageSelector[selectedPhoto]?.author?.id) === Number(imageSelector[selectedPhoto].promptAuthor)}
                                                />
                                                {
                                                    !expanded && (
                                                        <button className={"publish-outline-button iconButton w-100"} style={{}} onClick={() => navigate(`/studio/generate-image-avatar/${imageSelector[selectedPhoto].prompt_id}`)}>
                                                            {t('repeat')}
                                                        </button>
                                                    )
                                                }
                                                                                           
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
                                                        {/*{imageSelector[selectedPhoto].prompt_id}*/}
                                                        <button className={"btn iconButton"} style={{margin: 0, marginLeft: 5, display: "flex", alignItems: "center"}} onClick={() => navigate(`/studio/generate-image-avatar/${imageSelector[selectedPhoto].prompt_id}`)}>
                                                            {t('repeat')}
                                                            {
                                                                imageSelector[selectedPhoto].repeat_price && imageSelector[selectedPhoto].repeat_price > 0 ? (
                                                                    <span style={{ marginLeft: "5px" }}>
                                                                        <img
                                                                            src={telegramAnimationStar}
                                                                            alt={"Animation Gold Star"}
                                                                            style={{
                                                                                width: "8px",
                                                                                height: "8px"
                                                                            }}
                                                                        />
                                                                        {imageSelector[selectedPhoto].repeat_price}
                                                                    </span>
                                                                ) : null
                                                            }
                                                        </button>
                                                        <span style={{ fontSize: 18 }}>{imageSelector[selectedPhoto].count_generated_with_prompt}</span>
                                                        {
                                                            imageSelector[selectedPhoto].count_generated_with_prompt_today && imageSelector[selectedPhoto].count_generated_with_prompt_today > 0 ? (
                                                                <span style={{ color: "#008000", fontWeight: 800, fontSize: 12, marginTop: -8, marginLeft: -4 }}>+{imageSelector[selectedPhoto].count_generated_with_prompt_today}</span>
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>
                                                <p style={{margin: "5px 0"}}>
                                                    {imageSelector[selectedPhoto]?.caption}
                                                </p>
                                                <span className={"caption no-wrap"} style={{ marginTop: "10px" }}>
                                                    {
                                                        getTimeAgo(imageSelector[selectedPhoto].posted_at)
                                                    }
                                                </span>
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