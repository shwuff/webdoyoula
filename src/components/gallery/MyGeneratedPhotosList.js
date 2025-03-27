import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import styles from './css/MyGeneratedPhotosList.module.css';
import Modal from 'react-modal';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useSpring, animated } from '@react-spring/web';
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRetweet } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { FaCheck, FaWindowClose } from 'react-icons/fa';
import CommentsModal from "../modals/CommentsModal";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import LikeHeart from "../buttons/LikeHeart";
import PhotoPostModal from "../modals/PhotoPostModal";
import {BiPlay} from "react-icons/bi";
import TrainAvatarProcess from "../../pages/studio/TrainAvatarProcess";
import MyModels from "../models/MyModels";
import {useTranslation} from "react-i18next";
import {useImageContext} from "../../context/ImageContext";

Modal.setAppElement('#app');

const PhotoCardComponent = ({ photo, index, openModal, toggleSelectPhoto, isSelected, profileGallery }) => {
    const { ref, inView } = useInView({ threshold: 0.01, triggerOnce: true });

    const style = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0px)' : 'translateY(20px)',
        config: { tension: 55, friction: 9 },
        delay: inView ? Math.min(index * 20, 100) : 0,
    });

    const handleCircleClick = (e) => {
        e.stopPropagation();
        toggleSelectPhoto(photo.id);
    };


    return (
        <animated.div ref={ref} style={style} className={styles.photoCard} onClick={() => openModal(photo.id)}>
            {photo.blob_url && photo.status !== 'processing' ? (
                <img src={photo.blob_url} alt={`photo-${photo.id}`} className={styles.photoImage} />
            ) : (
                <div className={styles.loadingPlaceholder}>
                    <svg className="spinner" viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                </div>
            )}

            {
                photo.status !== 'processing' && profileGallery === false && (
                    <div
                        className={`${styles.selectCircle} ${isSelected ? styles.selected : ''}`}
                        onClick={handleCircleClick}
                    >
                        {isSelected && <FaCheck className={styles.checkIcon}/>}
                    </div>
                )
            }

            {
                photo.fileType === 'video/mp4' && (
                    <button className={styles.playButton}>
                        <BiPlay className={styles.playButtonIcon} />
                    </button>
                )
            }
        </animated.div>
    );
};

const areEqual = (prevProps, nextProps) =>
    prevProps.photo.id === nextProps.photo.id &&
    prevProps.isSelected === nextProps.isSelected;
const PhotoCard = memo(PhotoCardComponent, areEqual);

const MyGeneratedPhotosList = ({
    profileGallery = false,
    photosPage,
    setPhotosPage,
    resetLastPageRef,
    resetFetchingRef,
    from,
    postId,
    userIdLoaded = 0
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [closingModal, setClosingModal] = useState(false);
    const [photosSortModel, setPhotosSortModel] = useState(0);
    const [selectedModel, setSelectedModel] = useState([]);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);

    const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
    const [openBackdropLoader, setOpenBackdropLoader] = useState(false);

    const { addHandler, deleteHandler, sendData, isConnected } = useWebSocket();
    const { token, setMyPhotos, myPhotos, myModels, setMyModels } = useAuth();
    const { setCurrentImageContext } = useImageContext();
    const {t} = useTranslation();

    const photosRef = useRef(myPhotos);
    const isLoadingRef = useRef(false);

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const [requestId, setRequestId] = useState(generateUUID());

    const BackButton = window.Telegram.WebApp.BackButton;

    const openModal = useCallback(async (photoId) => {

        await setCurrentImageContext(photoId);

        sendData({
            action: "get_photo",
            data: {
                jwt: token,
                photoId: photoId,
                answerAction: "photo_modal_studio",
                userIdLoaded: userIdLoaded
            }
        });

    }, [sendData, token, setCurrentImageContext]);

    // const openModalP = (post) => {
    //     if (!post) return;
    //     setSelectedPostForComment(post);
    //     setIsModalOpen(true);
    // };
    //
    // const closeModalP = () => {
    //     setIsModalOpen(false);
    //     setSelectedPostForComment(null);
    // };

    const closeModal = useCallback(() => {
        setClosingModal(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setClosingModal(false);
            setSelectedPhoto(null);
        }, 300);
        BackButton.hide();
    }, [BackButton]);

    const toggleSelectPhoto = useCallback((photoId) => {
        setSelectedImages((prev) => {
            if (prev.includes(photoId)) {
                return prev.filter((id) => id !== photoId);
            } else {
                return [...prev, photoId];
            }
        });
    }, []);

    const openActionsModal = () => {
        setIsActionsModalOpen(true);
    };

    const closeActionsModal = () => {
        setClosingModal(true);
        setTimeout(() => {
            setIsActionsModalOpen(false);
            setClosingModal(false);
        }, 300);
    };

    const handleUploadToBot = () => {
        setIsActionsModalOpen(false);
        sendData({
            action: "upload_photos_to_bot",
            data: { jwt: token, photosIds: selectedImages }
        });
        setSelectedImages([]);
    };

    const handleAddToPost = () => {
        setIsActionsModalOpen(false);
        sendData({
            action: "add_images_to_post",
            data: { jwt: token, imagesIds: selectedImages, postId }
        });
        setSelectedImages([]);
    }
    const handleCreatePost = () => {
        setIsActionsModalOpen(false);
        sendData({
            action: "handle_create_post_with_generated_media",
            data: { jwt: token, mediaIds: selectedImages }
        });
        setSelectedImages([]);
    };

    const sortAndUniquePhotos = (photosArray) => {
        const sorted = photosArray.sort((a, b) => {
            const aStr = String(a.id);
            const bStr = String(b.id);
            if (aStr === bStr) return 0;

            const aStartsWithB = aStr.startsWith("b");
            const bStartsWithB = bStr.startsWith("b");

            if (aStartsWithB && bStartsWithB) {
                return parseInt(aStr.slice(1), 10) - parseInt(bStr.slice(1), 10);
            }
            if (aStartsWithB) {
                return -1;
            }
            if (bStartsWithB) {
                return 1;
            }
            return Number(b.id) - Number(a.id);
        });

        const uniqueSorted = sorted.filter((photo, index, arr) => {
            return index === 0 || photo.id !== arr[index - 1].id;
        });

        return uniqueSorted;
    };

    const uniquePhotos = (photosArray) => {
        const seen = new Set();

        const uniqueSorted = photosArray
            .filter(photo => {
                if (seen.has(photo.id)) {
                    return false;
                }
                seen.add(photo.id);
                return true;
            })
            .sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));

        return uniqueSorted;
    };

    const handleNextPhoto = useCallback((selectedPhoto) => {

        if (!selectedPhoto) return;

        const idx = myPhotos.findIndex((p) => p.id === selectedPhoto.id);

        if (idx === -1) return;

        if (idx < myPhotos.length - 1) {
            openModal(myPhotos[idx + 1].id);
        } else {
            const nextPg = photosPage + 1;
            setPhotosPage(nextPg);
            sendData({
                action: from === "feedPage" ? "load_feed_page" : "get_generated_photos",
                data: { jwt: token, photosPage: nextPg, photosSortModel, userIdLoaded, requestId: requestId }
            });
        }
    },
        [
            from,
            myPhotos,
            photosPage,
            photosSortModel,
            setSelectedPhoto,
            setPhotosPage,
            sendData,
            token,
            userIdLoaded,
            requestId
        ]
    );

    const handlePrevPhoto = useCallback((selectedPhoto) => {
        if (!selectedPhoto) return;

        const idx = myPhotos.findIndex((p) => p.id === selectedPhoto.id);
        if (idx === -1) return;

        if (idx > 0) {
            openModal(myPhotos[idx - 1].id);
        }
    }, [myPhotos, sendData]);

    // Click backButton Telegram
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
    }, [BackButton, isCommentModalOpen]);

    //clean photos ref
    useEffect(() => {
        photosRef.current = [];
        setMyPhotos([]);
    }, [userIdLoaded]);

    //close loading
    useEffect(() => {
        if (isLoadingRef.current) return;
        if(!isConnected) return;
        if(token === null) return;
        isLoadingRef.current = true;

        // const requestIdToken = crypto.randomUUID()
        //
        // setRequestId(crypto.randomUUID());

        sendData({
            action: from === "feedPage" ? "load_feed_page" : "get_generated_photos",
            data: { jwt: token, photosPage, photosSortModel, userIdLoaded, requestId: requestId }
        });
    }, [token, photosPage, photosSortModel, userIdLoaded, from, isConnected, requestId]);

    //start generating image
    useEffect(() => {
        if(userIdLoaded < 1) {
            const handleStartGeneratingImages = async (msg) => {
                if (!msg.photos || msg.photos.length < 1) return;
                const { modelId, photos } = msg;

                if (photosSortModel === 0 || photosSortModel === modelId) {
                    photosRef.current = [...photosRef.current, ...photos];
                    photosRef.current = sortAndUniquePhotos(photosRef.current);
                    setMyPhotos([...photosRef.current]);
                }
            };

            addHandler('start_generating_images', handleStartGeneratingImages);
            return () => deleteHandler('start_generating_images');
        }
    }, [photosSortModel, addHandler, deleteHandler, setMyPhotos, userIdLoaded]);

    // update photo hided status
    useEffect(() => {
        const handleMessage = async (msg) => {
            photosRef.current = photosRef.current.map(photo => {
                if (photo.id === msg.photoId) {
                    return { ...photo, hided: msg.hided };
                }
                return photo;
            });
            if(selectedPhoto !== null && selectedPhoto.id === msg.photoId) {
                setSelectedPhoto((prev) => ({
                    ...prev,
                    hided: msg.hided
                }));
            }
            setMyPhotos([...photosRef.current]);
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        };

        addHandler('update_photo_hided', handleMessage);
        return () => deleteHandler('update_photo_hided');
    }, [photosSortModel, addHandler, deleteHandler, setMyPhotos, selectedPhoto]);

    //new photos notify
    useEffect(() => {

        if(userIdLoaded < 1) {
            const handleNewPhotos = async (msg) => {
                if (!msg.media || msg.media.length < 1) return;
                const { modelId, media, mediaGroupId } = msg;

                if (photosSortModel === 0 || photosSortModel === modelId) {
                    setMyPhotos((prev) => {
                        let updatedPhotos;
                        if (mediaGroupId) {
                            const filteredPrev = prev.filter(
                                (photo) => photo.media_generated_group_id !== mediaGroupId
                            );
                            const newGroupPhotos = media.map((p) => ({
                                ...p,
                                media_generated_group_id: mediaGroupId,
                                status: "completed"
                            }));
                            updatedPhotos = [...newGroupPhotos, ...filteredPrev];
                        } else {
                            updatedPhotos = [...msg.media, ...prev];
                        }
                        updatedPhotos = sortAndUniquePhotos(updatedPhotos);
                        return updatedPhotos;
                    });
                }
            };

            addHandler('new_photos', handleNewPhotos);
            return () => deleteHandler('new_photos');
        }

    }, [photosSortModel, addHandler, deleteHandler, setMyPhotos, userIdLoaded]);

    //generated photos append
    useEffect(() => {
        const handleAppend = async (msg) => {

            if (msg.media && msg.media.length > 0 && (photosSortModel === msg.photosSortModel || msg.photosSortModel === undefined) && (userIdLoaded === msg.userIdLoaded || from === 'feedPage') && requestId === msg.requestId) {
                if (!photosRef.current) {
                    photosRef.current = [];
                }

                photosRef.current = [...photosRef.current, ...msg.media];
                if(userIdLoaded < 1 && from !== 'feedPage') {
                    photosRef.current = sortAndUniquePhotos(photosRef.current);
                } else {
                    photosRef.current = uniquePhotos(photosRef.current);
                }
                setMyPhotos([...photosRef.current]);
            }
            resetFetchingRef();
            isLoadingRef.current = false;
        };

        addHandler('generated_photos_append', handleAppend);
        return () => deleteHandler('generated_photos_append');
    }, [addHandler, deleteHandler, setMyPhotos, resetFetchingRef, photosSortModel, userIdLoaded, from, requestId]);

    //generated photos
    useEffect(() => {
        const handleGeneratedPhotos = async (msg) => {
            if (!msg.photos || msg.photos.length < 1) {
                isLoadingRef.current = false;
                resetFetchingRef();
                return;
            }
            photosRef.current = [...photosRef.current, ...msg.photos];
            photosRef.current = sortAndUniquePhotos(photosRef.current);
            setMyPhotos([...photosRef.current]);
            isLoadingRef.current = false;
            resetFetchingRef();
        };

        addHandler('generated_photos', handleGeneratedPhotos);
        return () => deleteHandler('generated_photos');
    }, [addHandler, deleteHandler, setMyPhotos, resetFetchingRef, photosSortModel]);

    //scroll to top after filter avatar
    useEffect(() => {
        document.getElementById("generatedPhotosList")?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [photosSortModel]);

    useEffect(() => {
        const handleNewAvatar = (msg) => {
            const avatar = msg.avatar;

            if(profileGallery === false) {
                handleChangePhotosSortModel(Number(avatar.id), [
                    {
                        ...avatar,
                        id: Number(avatar.id)
                    },
                    ...myModels
                ]);

                setMyModels(prev => ([
                    {
                        ...avatar,
                        id: Number(avatar.id)
                    },
                    ...prev
                ]));
            }
        }

        addHandler('handle_create_new_avatar', handleNewAvatar);

        return () => deleteHandler('handle_create_new_avatar');
    }, [profileGallery]);

    const handleChangePhotosSortModel = useCallback((value, myModels) => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setMyPhotos([]);
        photosRef.current = [];
        setPhotosPage(1);
        setPhotosSortModel(value);
        for (let i = 0; i < myModels.length; i++) {
            if (myModels[i].id === value) {
                setSelectedModel(myModels[i]);
                break;
            }
        }
        resetLastPageRef();
        resetFetchingRef();
        isLoadingRef.current = false;
    }, [setMyPhotos, setPhotosPage, resetLastPageRef, resetFetchingRef]);

    const memoizedPhotos = useMemo(() => myPhotos, [myPhotos]);
    const validPhotos = useMemo(() => (memoizedPhotos || []).filter(Boolean), [memoizedPhotos]);

    return (
        <div>
            {
                profileGallery === false && (
                    <div className="myButtonsContainer horizontal-list">
                        <button
                            onClick={() => handleChangePhotosSortModel(0, myModels)}
                            className={`btn no-wrap ${photosSortModel === 0 ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                            {t('all')}
                        </button>
                        {myModels && myModels.map((model, idx) => (
                            <button
                                key={model.id}
                                onClick={() => handleChangePhotosSortModel(model.id, myModels)}
                                className={`btn no-wrap ${photosSortModel === model.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                {model.name}
                            </button>
                        ))}
                    </div>
                )
            }

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdropLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {selectedImages.length > 0 && (
                <div className={styles.selectedBar}>
                    <span className={"no-wrap"} style={{width: "max-content", marginRight: 7, fontSize: 14}}>Выбрано: {selectedImages.length}</span>
                    <div className="horizontal-list align-items-center" style={{padding: 0}}>
                        {
                            from === 'createContent' ? (
                                <>
                                    <button
                                        className="btn btn-outline-primary no-wrap"
                                        style={{marginTop: '10px'}}
                                        onClick={handleUploadToBot}
                                    >
                                        {t('upload_to_bot')}
                                    </button>
                                    {/*<button*/}
                                    {/*    className="btn btn-outline-primary no-wrap"*/}
                                    {/*    style={{marginTop: '10px'}}*/}
                                    {/*    onClick={handleCreatePost}*/}
                                    {/*>*/}
                                    {/*    Создать пост*/}
                                    {/*</button>*/}
                                </>
                            ) : from === 'editPost' ? (
                                <>
                                    {/*<button*/}
                                    {/*    className="btn btn-outline-primary no-wrap"*/}
                                    {/*    style={{marginTop: '10px'}}*/}
                                    {/*    onClick={handleAddToPost}*/}
                                    {/*>*/}
                                    {/*    Добавить в пост*/}
                                    {/*</button>*/}
                                </>
                            ) : null
                        }
                    </div>
                </div>
            )}

            <div className={styles.photoGrid} id="generatedPhotosList">
                {validPhotos.map((photo, index) => (
                    <PhotoCard
                        key={photo.id}
                        photo={photo}
                        index={index}
                        openModal={openModal}
                        isSelected={selectedImages.includes(photo.id)}
                        toggleSelectPhoto={toggleSelectPhoto}
                        profileGallery={profileGallery}
                    />
                ))}
            </div>

            {
                selectedModel.status === 'waiting' && photosSortModel === selectedModel.id && (
                    <TrainAvatarProcess model={selectedModel} setModel={setSelectedModel} />
                )
            }

            {
                selectedModel.status === 'training' && photosSortModel === selectedModel.id && (
                    <p style={{marginTop: 5}}>
                        {t('model_training', {avatarName: selectedModel.name})}
                    </p>
                )
            }

            <PhotoPostModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setOpenBackdropLoader={setOpenBackdropLoader}
                profileGallery={profileGallery}
                nextPhoto={handleNextPhoto}
                prevPhoto={handlePrevPhoto}
                userIdLoaded={userIdLoaded}
            />

        </div>
    );
};

export default MyGeneratedPhotosList;
