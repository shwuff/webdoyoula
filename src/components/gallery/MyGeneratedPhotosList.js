import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import styles from './css/MyGeneratedPhotosList.module.css';
import Modal from 'react-modal';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { FaCheck } from 'react-icons/fa';
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import PhotoPostModal from "../modals/PhotoPostModal";
import {BiPlay} from "react-icons/bi";
import TrainAvatarProcess from "../../pages/studio/TrainAvatarProcess";
import {useTranslation} from "react-i18next";
import { useDispatch } from 'react-redux';
import { setCurrentImageSelected, updateImage } from '../../redux/actions/imageActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {useSelector} from "react-redux";
import telegramStar from "../../assets/icons/telegramStar.png";
import telegramAnimationStar from "../../assets/gif/gold_star.gif";
import TShirtMask from './../../assets/images/t_shirt_mask.webp';
import PhotoMarketModal from '../modals/PhotoMarketModal';
import {useNavigate} from "react-router-dom";
import imageReducer from "../../redux/reducers/imageReducer";

Modal.setAppElement('#app');

const PhotoCardComponent = ({ photo, index, openModal, toggleSelectPhoto, isSelected, profileGallery }) => {
    const { ref, inView } = useInView({ threshold: 0.01, triggerOnce: true });
    const navigate = useNavigate();

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

    const imageSelector = useSelector((state) => state.image.images);

    return (
        <animated.div ref={ref} style={style} className={styles.photoCard} onClick={() => openModal(photo.id)}>

            { photo.media_url && photo.status !== 'processing' ? (
                <img src={photo.file_type === 'image' ? imageSelector[photo.id].media_url : imageSelector[photo.id].video_preview} alt={`photo-${photo.id}`} className={styles.photoImage} />
            ) : (
                <div className={styles.loadingPlaceholder}>
                    <svg className="spinner" viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                </div>
            )}

            {Number(imageSelector[photo.id]?.author?.id) === Number(imageSelector[photo.id]?.prompt_author) ? (
                <div className={styles.publishedBadge} style={{ left: 0 }}>
                    {
                        imageSelector[photo.id]?.repeat_price !== null && imageSelector[photo.id]?.repeat_price > 0 ? (
                            <img
                                src={telegramAnimationStar}
                                alt="Gold Animation Star"
                                style={{

                                    width: '25px',
                                    height: '25px',
                                }}
                            />
                        ) : (
                            <img
                                src={telegramStar}
                                alt="Star"
                                style={{

                                    width: '25px',
                                    height: '25px',
                                }}
                            />
                        )
                    }
                </div>
            ) : (
                <>
                    { imageSelector[photo.id]?.repeat_price !== null && imageSelector[photo.id]?.repeat_price > 0 && (
                        <div className={styles.publishedBadge} style={{ left: 0 }}>
                            <img
                                src={telegramAnimationStar}
                                alt="Gold Animation Star"
                                style={{

                                    width: '25px',
                                    height: '25px',
                                }}
                            />
                        </div>
                        )
                    }
                </>
            )}

            {imageSelector[photo.id] !== undefined && imageSelector[photo.id].hided === false && profileGallery === false && (
                <div className={styles.publishedBadge} style={{ right: 0 }}>
                     <div className={styles.doubleCheck}>
                         <TaskAltIcon className={styles.checkIcon} sx={{ fill: "#fff" }} />
                     </div>
                </div>
            )}

            {
                photo.status !== 'creating' && profileGallery === false && (
                    <div
                        className={`${styles.selectCircle} ${isSelected ? styles.selected : ''}`}
                        onClick={handleCircleClick}
                    >
                        {/*<span style={{ color: "purple" }}>{ imageSelector[photo.id].id }</span>*/}
                        {isSelected && <FaCheck className={styles.checkIconSelected}/>}
                    </div>
                )
            }

            {
                photo.file_type === 'video' && (
                    <button className={styles.playButton}>
                        <BiPlay className={styles.playButtonIcon} />
                    </button>
                )
            }
            {/*{*/}
            {/*    profileGallery === true && (*/}
            {/*        <div className={styles.authorWrapper} onClick={() => navigate('/profile/' + imageSelector[photo.id].author.id)}>*/}
            {/*            <img src={imageSelector[photo.id].author.photo_url} className={styles.authorAvatar} alt={imageSelector[photo.id].author.username} />*/}
            {/*            <div className={styles.authorName}>*/}
            {/*                <span className={"text-shadow"} style={{ fontSize: 14 }}>{imageSelector[photo.id].author.first_name} {imageSelector[photo.id].author.last_name}</span>*/}
            {/*                <span className={"text-shadow"} style={{ fontSize: 10 }}>{imageSelector[photo.id].author.username ? "@" : ""}{imageSelector[photo.id].author.username}</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*}*/}
        </animated.div>
    );
};

const PhotoMarketCardComponent = ({ photo, index, openModal, toggleSelectPhoto, isSelected, profileGallery }) => {
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

    const imageSelector = useSelector((state) => state.image.images);

    return (
        <animated.div ref={ref} style={style} className={styles.photoMarketCard} onClick={() => openModal(photo.id)}>
            <img src={TShirtMask} style={{maxWidth: "100%", position: "absolute", aspectRatio: "4/5"}} />
            {photo.media_url && photo.status !== 'processing' ? (
                <img src={imageSelector[photo.id].media_url} alt={`photo-${photo.id}`} className={styles.photoImage} />
            ) : (
                <div className={styles.loadingPlaceholder}>
                    <svg className="spinner" viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                </div>
            )}

            <span>1 ₽</span>

            <button className={styles.addToCartButton}>Добавить в корзину</button>

            {/* {Number(imageSelector[photo.id]?.author?.id) === Number(imageSelector[photo.id]?.promptAuthor) && (
                <div className={styles.publishedBadge}>
                    <img
                        src={telegramStar}
                        alt="Telegram Star"
                        style={{
                        
                            width: '25px',
                            height: '25px',
                        }}
                    />
                </div>
            )} */}

            {/* {imageSelector[photo.id] !== undefined && imageSelector[photo.id].hided === false && profileGallery === false && (
                <div className={styles.publishedBadge}>

                     <div className={styles.doubleCheck}>
                         <TaskAltIcon className={styles.checkIcon} sx={{ fill: "#fff" }} />
                     </div>
                </div>
            )} */}

            {/* {
                photo.status !== 'processing' && profileGallery === false && (
                    <div
                        className={`${styles.selectCircle} ${isSelected ? styles.selected : ''}`}
                        onClick={handleCircleClick}
                    >
                        {isSelected && <FaCheck className={styles.checkIconSelected}/>}
                    </div>
                )
            } */}

            {/* {
                photo.fileType === 'video/mp4' && (
                    <button className={styles.playButton}>
                        <BiPlay className={styles.playButtonIcon} />
                    </button>
                )
            } */}
        </animated.div>
    );
};

const areEqual = (prevProps, nextProps) =>
    prevProps.photo.id === nextProps.photo.id &&
    prevProps.isSelected === nextProps.isSelected;

const PhotoCard = memo(PhotoCardComponent, areEqual);

const areEqualMarket = (prevProps, nextProps) =>
    prevProps.photo.id === nextProps.photo.id &&
    prevProps.isSelected === nextProps.isSelected;

const PhotoCardMarket = memo(PhotoMarketCardComponent, areEqual);

const MyGeneratedPhotosList = ({
    profileGallery = false,
    photosPage,
    setPhotosPage,
    resetLastPageRef,
    resetFetchingRef,
    from,
    postId,
    userIdLoaded = 0,
    searchQuery = '',
    filter = '',
    dateRange = '',
    feed = 'feed',
    isMarket = false,
    showPaidPrompts = false
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [closingModal, setClosingModal] = useState(false);
    const [photosSortModel, setPhotosSortModel] = useState(0);
    const [selectedModel, setSelectedModel] = useState([]);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);
    const [photosList, setPhotosList] = useState([]);

    const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
    const [openBackdropLoader, setOpenBackdropLoader] = useState(false);

    const { addHandler, deleteHandler, sendData, isConnected } = useWebSocket();
    const { token, myLoras, setMyLoras } = useAuth();
    const {t} = useTranslation();
    const imageSelector = useSelector((state) => state.image.images);

    const dispatch = useDispatch();

    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchText, setSearchText] = useState('');
    
    const searchInputRef = useRef(null);

    const handleSearchFocus = () => setSearchExpanded(true);

    const handleSearchBlur = () => {
        setSearchExpanded(false);
        setTimeout(() => {
            setSearchText('');
        }, 300);
    };

    useEffect(() => {
        setSearchText('');
    }, []);

    const photosRef = useRef([]);
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

        dispatch(setCurrentImageSelected(photoId));
        setSelectedPhoto(photoId);
        BackButton.show();

        setIsModalOpen(true);

        sendData({
            action: "get/media/" + photoId,
            data: {
                jwt: token,
                answerAction: "photo_modal_studio",
                userIdLoaded: userIdLoaded
            }
        });

    }, [sendData, token, setSelectedPhoto]);

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
            setSelectedPhoto(0);
        }, 300);
        BackButton.hide();
    }, [BackButton, setSelectedPhoto]);

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

    const sortAndUniquePhotosWithRepeats = (photosArray) => {
        const sorted = photosArray.sort((a, b) => {
            const aCount = a.count_generated_with_prompt_today || 0;
            const bCount = b.count_generated_with_prompt_today || 0;
    
            if (bCount !== aCount) {
                return bCount - aCount;
            }
    
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
            });

        return uniqueSorted;
    };

    const handleNextPhoto = useCallback((selectedPhoto) => {

        if (!selectedPhoto) return;

        const idx = photosList.findIndex((p) => p.id === selectedPhoto.id);

        if (idx === -1) return;

        if (idx < photosList.length - 1) {
            openModal(photosList[idx + 1].id);
        } else {
            const nextPg = photosPage + 1;
            setPhotosPage(nextPg);
            const requestUUID = requestId;
            sendData({
                action: from === "feedPage" ? "v2/get/feed" : "v2/get/media/all",
                data: {
                    jwt: token,
                    offset: nextPg,
                    loraId: photosSortModel,
                    userIdLoaded,
                    requestId: requestUUID,
                    ...(searchQuery.length > 1 ? { searchParam: searchQuery } : {}),
                    ...(filter.length > 1 ? { filter: filter, dateRange: dateRange } : {}),
                    ...(showPaidPrompts !== false ? {showPaidPrompts: true} : {showPaidPrompts: false}),
                    ...(from === 'feedPage' ? {feed} : {})
                }
            });
        }
    },
        [
            from,
            feed,
            photosList,
            photosPage,
            photosSortModel,
            setSelectedPhoto,
            setPhotosPage,
            sendData,
            token,
            userIdLoaded,
            requestId,
            filter,
            dateRange,
            showPaidPrompts,
        ]
    );

    const handlePrevPhoto = useCallback((selectedPhoto) => {
        if (!selectedPhoto) return;

        const idx = photosList.findIndex((p) => p.id === selectedPhoto.id);
        if (idx === -1) return;

        if (idx > 0) {
            openModal(photosList[idx - 1].id);
        }
    }, [sendData, photosList]);

    useEffect(() => {
        if(searchQuery.length > 1) {
            setPhotosList([]);
            setPhotosPage(0);
        }
    }, [searchQuery]);

    useEffect(() => {
        setPhotosList([]);
        setPhotosPage(0);
    }, [filter, dateRange, feed, showPaidPrompts]);

    //clean photos ref
    useEffect(() => {
        setPhotosList([]);
        setPhotosPage(0);
        resetLastPageRef();
        resetFetchingRef();
        isLoadingRef.current = false;
    }, [userIdLoaded, setPhotosList]);

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

    //close loading
    useEffect(() => {
        if (isLoadingRef.current) return;
        if(token === null) return;
        isLoadingRef.current = true;

        sendData({
            action: from === "feedPage" ? "v2/get/feed" : "v2/get/media/all",
            data: {
                jwt: token,
                offset: photosPage,
                loraId: photosSortModel,
                userIdLoaded,
                requestId: requestId,
                ...(searchQuery.length > 1 ? { searchParam: searchQuery } : {}),
                ...(filter.length > 1 ? { filter: filter, dateRange: dateRange } : {}),
                ...(showPaidPrompts !== false ? {showPaidPrompts: true} : {showPaidPrompts: false}),
                ...(from === 'feedPage' ? {feed} : {})
            }
        });
    }, [token, photosPage, photosSortModel, userIdLoaded, from, requestId, searchQuery, filter, dateRange, feed, showPaidPrompts]);

    //start generating image
    useEffect(() => {
        if(userIdLoaded < 1) {
            const handleStartGeneratingImages = async (msg) => {
                if (!msg.photos || msg.photos.length < 1) return;
                const { modelId, photos } = msg;

                if (photosSortModel === 0 || photosSortModel === modelId) {
                    setPhotosList((prev) => sortAndUniquePhotos([...prev, ...photos]));
                }
            };

            addHandler('start_generating_images', handleStartGeneratingImages);
            return () => deleteHandler('start_generating_images');
        }
    }, [photosSortModel, addHandler, deleteHandler, userIdLoaded, photosList, setPhotosList]);

    // update photo hided status
    useEffect(() => {
        const handleMessage = async (msg) => {
            setPhotosList(photo => {
                if (photo.id === msg.photoId) {
                    return { ...photo, hided: msg.hided };
                }
                return photo;
            });
            if(selectedPhoto !== null && selectedPhoto.id === msg.photoId) {
                // setSelectedPhoto((prev) => ({
                //     ...prev,
                //     hided: msg.hided
                // }));
                setPhotosList((prev) =>
                    prev.map((photo) =>
                        selectedImages.includes(photo.id)
                            ? { ...photo, hided: false }
                            : photo
                    )
                );
            }
            dispatch(updateImage(msg.photoId, {hided: msg.hided}));
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        };

        addHandler('update_photo_hided', handleMessage);
        return () => deleteHandler('update_photo_hided');
    }, [photosSortModel, addHandler, deleteHandler, selectedPhoto, setPhotosList]);

    //new photos notify
    useEffect(() => {

        if(userIdLoaded < 1) {
            const handleNewPhotos = async (msg) => {
                if (!msg.media || msg.media.length < 1) return;
                const { modelId, media, mediaGroupId } = msg;

                if (photosSortModel === 0 || photosSortModel === modelId) {
                    // let updatedPhotos;
                    // if (mediaGroupId) {
                    //     const filteredPrev = photosList.filter(
                    //         (photo) => photo.media_generated_group_id !== mediaGroupId
                    //     );
                    //     const newGroupPhotos = media.map((p) => ({
                    //         ...p,
                    //         media_generated_group_id: mediaGroupId,
                    //         status: "completed"
                    //     }));
                    //     updatedPhotos = [...newGroupPhotos, ...filteredPrev];
                    // } else {
                    //     updatedPhotos = [...msg.media, ...photosList];
                    // }
                    //
                    // updatedPhotos = sortAndUniquePhotos(updatedPhotos);
                    setPhotosList((prev) => {
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
                    })
                }
            };

            addHandler('new_photos', handleNewPhotos);
            return () => deleteHandler('new_photos');
        }

    }, [photosSortModel, addHandler, deleteHandler, userIdLoaded, setPhotosList]);

    //generated photos append
    useEffect(() => {
        const handleAppend = async (msg) => {
            if (msg.media && msg.media.length > 0 && (photosSortModel === msg.photosSortModel || msg.photosSortModel === undefined) && requestId === msg.requestId) {
                if(userIdLoaded < 1 && from !== 'feedPage') {
                    setPhotosList((prev) => sortAndUniquePhotos([...prev, ...msg.media]));
                } else {
                    if(filter === 'repeats1' && dateRange === 'last_1_day1') {
                        setPhotosList((prev) => sortAndUniquePhotosWithRepeats([...prev, ...msg.media]));
                    } else {
                        setPhotosList((prev) => uniquePhotos([...prev, ...msg.media]));
                    }
                }

                // setPhotosPage(photosPage += 1);
            }

            resetFetchingRef();
            isLoadingRef.current = false;
        };

        addHandler('generated_media_append', handleAppend);
        return () => deleteHandler('generated_media_append');
    }, [addHandler, deleteHandler, resetFetchingRef, photosSortModel, photosList, userIdLoaded, from, requestId, setPhotosList, filter, dateRange]);

    //generated photos
    useEffect(() => {
        const handleGeneratedPhotos = async (msg) => {
            if (!msg.photos || msg.photos.length < 1) {
                isLoadingRef.current = false;
                resetFetchingRef();
                return;
            }
            setPhotosList((prev) => sortAndUniquePhotos([...prev, ...msg.photos]))
            isLoadingRef.current = false;
            resetFetchingRef();
        };

        addHandler('generated_photos', handleGeneratedPhotos);
        return () => deleteHandler('generated_photos');
    }, [addHandler, deleteHandler, resetFetchingRef, photosSortModel, setPhotosList]);

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
                    ...myLoras
                ]);

                setMyLoras(prev => ([
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
    }, [profileGallery, myLoras]);

    const handleChangePhotosSortModel = useCallback((value, myLoras) => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setPhotosList([]);
        setPhotosPage(0);
        setPhotosSortModel(value);
        for (let i = 0; i < myLoras.length; i++) {
            if (myLoras[i].id === value) {
                setSelectedModel(myLoras[i]);
                break;
            }
        }
        resetLastPageRef();
        resetFetchingRef();
        isLoadingRef.current = false;
    }, [setPhotosPage, resetLastPageRef, resetFetchingRef, setPhotosList]);

    const memoizedPhotos = useMemo(() => photosList, [photosList]);
    const validPhotos = useMemo(() => (memoizedPhotos || []).filter(Boolean), [memoizedPhotos]);

    const handlePublishToGallery = () => {
        for (let i=0; i < selectedImages.length; i++){
            
            sendData({
                action: "publish_to_gallery",
                data: { jwt: token, photoId: selectedImages[i] }
            });

            // photosRef.current.forEach((photo) => {
            //     if (photo.id === selectedImages[i]) {
            //         photo.hided = false;
            //     }
            // });
            setPhotosList((prev) =>
                prev.map((photo) =>
                    selectedImages.includes(photo.id)
                        ? { ...photo, hided: false }
                        : photo
                )
            );
        }

        setSelectedImages([]);
    };

    return (
        <div>
            {
                profileGallery === false && (
                    <div className="myButtonsContainer horizontal-list ">
                        {(searchText.length === 0 || photosSortModel === 0) && (
                            <button
                                onClick={() => handleChangePhotosSortModel(0, myLoras)}
                                className={`btn no-wrap ${photosSortModel === 0 ? 'btn-primary' : 'btn-glass'}`}
                            >
                                {t('all')}
                            </button>
                        )}



                        {[...new Set([
                            ...myLoras?.filter((model) =>
                            model.name.toLowerCase().includes(searchText.toLowerCase())
                            ),
                            ...(photosSortModel !== 0
                            ? myLoras.filter((model) => model.id === photosSortModel)
                            : [])
                        ])].map((model, idx) => (
                            <button
                                key={model.id}
                                onClick={() => handleChangePhotosSortModel(model.id, myLoras)}
                                className={`btn no-wrap ${photosSortModel === model.id ? 'btn-primary' : 'btn-glass'}`}
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
                    <div className="horizontal-list d-flex align-items-center" style={{padding: 0}}>
                        {
                            from === 'createContent' ? (
                                <>
                                    <button
                                        className="btn btn-glass no-wrap"
                                        onClick={handleUploadToBot}
                                    >
                                        {t('upload_to_bot')}
                                    </button>

                                    <button
                                        className="btn btn-glass no-wrap"
                                        onClick={handlePublishToGallery}
                                    >
                                        {t('to_publish')}
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
                {
                    isMarket ? (
                        <>
                            {validPhotos.map((photo, index) => (
                                <PhotoCardMarket
                                    key={imageSelector[photo.id].id}
                                    photo={photo}
                                    index={index}
                                    openModal={openModal}
                                    isSelected={selectedImages.includes(photo.id)}
                                    toggleSelectPhoto={toggleSelectPhoto}
                                    profileGallery={profileGallery}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            {validPhotos.map((photo, index) => (
                                <PhotoCard
                                    key={imageSelector[photo.id].id}
                                    photo={photo}
                                    index={index}
                                    openModal={openModal}
                                    isSelected={selectedImages.includes(photo.id)}
                                    toggleSelectPhoto={toggleSelectPhoto}
                                    profileGallery={profileGallery}
                                />
                            ))}
                        </>
                    )
                }
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

            {isMarket 
            ? 
            <PhotoMarketModal 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setOpenBackdropLoader={setOpenBackdropLoader}
                profileGallery={profileGallery}
                nextPhoto={handleNextPhoto}
                prevPhoto={handlePrevPhoto}
                userIdLoaded={userIdLoaded}
                selectedPhoto={selectedPhoto}
                setSelectedPhoto={setSelectedPhoto}
            /> 
            : 
            <PhotoPostModal 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setOpenBackdropLoader={setOpenBackdropLoader}
                profileGallery={profileGallery}
                nextPhoto={handleNextPhoto}
                prevPhoto={handlePrevPhoto}
                userIdLoaded={userIdLoaded}
                selectedPhoto={selectedPhoto}
                setSelectedPhoto={setSelectedPhoto}
             />
            }


        </div>
    );
};

export default MyGeneratedPhotosList;
