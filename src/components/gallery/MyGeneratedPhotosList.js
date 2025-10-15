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
import { setCurrentImageSelected } from '../../redux/actions/imageActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {useSelector} from "react-redux";
import telegramStar from "../../assets/icons/telegramStar.png";
import telegramAnimationStar from "../../assets/gif/gold_star.gif";
import TShirtMask from './../../assets/images/t_shirt_mask.webp';
import PhotoMarketModal from '../modals/PhotoMarketModal';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import FeedSkeleton from "./FeedSkeleton";
import {Grid} from "@mui/material";
import {keyframes, styled} from "@mui/system";
import AudioWave from "./AudioWave";
import Confetti from 'react-confetti'

Modal.setAppElement('#app');

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Placeholder = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '100%',
    paddingTop: '125%',
    overflow: 'hidden',
    borderRadius: 12,
    background:
        `linear-gradient(90deg,
      ${theme.palette.action.hover} 0%,
      ${theme.palette.action.selected} 50%,
      ${theme.palette.action.hover} 100%)`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 1.5s linear infinite`,
}));

const PhotoCardComponent = ({ photo, index, openModal, toggleSelectPhoto, isSelected, profileGallery }) => {
    const { ref, inView } = useInView({ threshold: 0.01, triggerOnce: true });
    const {sendData} = useWebSocket();
    const {token} = useAuth();

    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiKey, setConfettiKey] = useState(0);

    const [animatingInId, setAnimatingInId] = useState(null);
    const [animatingOutId, setAnimatingOutId] = useState(null);

    const prevStatusRef = useRef();

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

    const toggleFavorite = (photoId, isAdding) => {

        if (isAdding) {
            setAnimatingInId(photoId);
            setTimeout(() => setAnimatingInId(null), 400);

            sendData({
                action: "gallery/favourites/add/" + photoId,
                data: {
                    jwt: token
                }
            });
        } else {
            setAnimatingOutId(photoId);
            setTimeout(() => setAnimatingOutId(null), 400);

            sendData({
                action: "gallery/favourites/delete/" + photoId,
                data: {
                    jwt: token
                }
            });
        }
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    };


    useEffect(() => {
        const currentStatus = imageSelector[photo.id]?.status;
        const prevStatus = prevStatusRef.current;

        if (prevStatus === 'creating' && currentStatus !== 'creating' && currentStatus !== undefined) {
            setShowConfetti(true);
            setConfettiKey(prev => prev + 1);

            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 3000);

            return () => clearTimeout(timer);
        }

        prevStatusRef.current = currentStatus;
    }, [imageSelector[photo.id]?.status])

    return (
        <animated.div ref={ref} style={style} className={styles.photoCard} onClick={() => openModal(photo.id)}>

            {showConfetti && (
                <Confetti
                    key={confettiKey}
                    width={200}
                    height={200}
                    numberOfPieces={100}
                    gravity={0.5}
                    recycle={false}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                />
            )}

            { imageSelector[photo.id].status !== 'creating' ? (
                <>
                    {
                        imageSelector[photo.id].media_url ? (
                            <>
                                {
                                    imageSelector[photo.id].file_type === 'video' ? (
                                        <img src={imageSelector[photo.id].video_preview} alt={`video-${photo.id}`} className={styles.photoImage} />
                                    ) : imageSelector[photo.id].file_type === 'audio' ? (
                                        <AudioWave audioUrl={imageSelector[photo.id].media_url} canPlay={false} />
                                    ) : (
                                        <img src={imageSelector[photo.id].media_url} className={styles.photoImage} />
                                    )
                                }
                            </>
                        ) : (
                            <>
                                <Grid item xs={4}>
                                    <Placeholder />
                                </Grid>
                            </>
                        )
                    }
                </>
            ) : (
                <div className={styles.loadingPlaceholder}>
                    <svg className="spinner" viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                </div>
            )}

            {profileGallery !== false && (
                <div
                    className={[
                        styles.favoriteBookmark,
                        animatingInId === photo.id ? styles.animateIn : '',
                        animatingOutId === photo.id ? styles.animateOut : '',
                    ].join(' ')}
                    onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(photo.id, !imageSelector[photo.id].isFavourite);
                    }}
                >
                    {imageSelector[photo.id].isFavourite
                        ? <BsBookmarkFill className={styles.bookmarkIcon} />
                        : <BsBookmark     className={styles.bookmarkIcon} />}
                </div>
            )}

            {Number(imageSelector[photo.id]?.author?.id) === Number(imageSelector[photo.id]?.prompt_author) ? (
                <div className={styles.publishedBadge} style={{ left: "4px" }}>
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
                        <div className={styles.publishedBadge} style={{ left: "4px" }}>
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

            {imageSelector[photo.id] !== undefined && imageSelector[photo.id].posted_at !== null && profileGallery === false && (
                <div className={styles.publishedBadge} style={{ right: 0 }}>
                     <div className={styles.doubleCheck}>
                         <TaskAltIcon className={styles.checkIcon} sx={{ fill: "#fff" }} />
                     </div>
                </div>
            )}


            {
                imageSelector[photo.id].status !== 'creating' && profileGallery === false && (
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
                (imageSelector[photo.id].file_type === 'video' && imageSelector[photo.id].status !== 'creating') && (
                    <button className={styles.playButton}>
                        <BiPlay style={{background: "var(--secondary-bg-color)"}} className={styles.playButtonIcon} />
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
    showSaved = false,
    userIdLoaded = 0,
    searchQuery = '',
    filter = '',
    searchingAiModel = 0,
    dateRange = '',
    feed = 'feed',
    isMarket = false,
    showPaidPrompts = false
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [closingModal, setClosingModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photosSortModel, setPhotosSortModel] = useState(0);
    const [selectedModel, setSelectedModel] = useState([]);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);
    const [photosList, setPhotosList] = useState([]);

    const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
    const [openBackdropLoader, setOpenBackdropLoader] = useState(false);

    const isEmptyRef = useRef(true);

    const { addHandler, deleteHandler, sendData, isConnected } = useWebSocket();
    const { token, myLoras, setMyLoras } = useAuth();
    const {t} = useTranslation();
    const imageSelector = useSelector((state) => state.image.images);

    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    const handleUploadToBot = () => {
        setIsActionsModalOpen(false);
        sendData({
            action: "bot/upload",
            data: { jwt: token, media_ids: selectedImages }
        });
        setSelectedImages([]);
    };

    const handlePostToGroup = () => {
        setIsActionsModalOpen(false);
        sendData({
            action: "bot/post_to_group",
            data: { jwt: token, media_ids: selectedImages }
        });
        setSelectedImages([]);
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
                    ...(showSaved ? {showSaved} : {}),
                    ...(searchQuery.length > 1 ? { searchParam: searchQuery } : {}),
                    ...(filter.length > 1 ? { filter: filter, dateRange: dateRange } : {}),
                    ...(showPaidPrompts !== false ? {showPaidPrompts: true} : {showPaidPrompts: false}),
                    ...(from === 'feedPage' ? {feed} : {}),
                    ...(searchingAiModel !== 0 ? {searching_ai_model: searchingAiModel} : {})
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
            searchingAiModel,
            dateRange,
            showPaidPrompts,
            showSaved
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
        setPhotosList([]);
        setPhotosPage(0);
        resetFetchingRef();
        resetLastPageRef();
    }, [filter, dateRange, feed, showPaidPrompts, showSaved, userIdLoaded, searchingAiModel, setPhotosList, searchQuery]);


    useEffect(() => {
        if (typeof window !== "undefined" &&
            window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred &&
            typeof showPaidPrompts !== "undefined"
        ) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }, [showPaidPrompts]);

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
        // if (isLoadingRef.current) return;
        if(token === null) return;

        sendData({
            action: from === "feedPage" ? "v2/get/feed" : "v2/get/media/all",
            data: {
                jwt: token,
                offset: photosPage,
                loraId: photosSortModel,
                userIdLoaded,
                requestId: requestId,
                ...(showSaved ? {showSaved} : {}),
                ...(searchQuery.length > 1 ? { searchParam: searchQuery } : {}),
                ...(filter.length > 1 ? { filter: filter, dateRange: dateRange } : {}),
                ...(showPaidPrompts !== false ? {showPaidPrompts: true} : {showPaidPrompts: false}),
                ...(from === 'feedPage' ? {feed} : {}),
                ...(searchingAiModel !== 0 ? {searching_ai_model: searchingAiModel} : {})
            }
        });
    }, [token, photosPage, photosSortModel, userIdLoaded, from, requestId, searchQuery, filter, searchingAiModel, dateRange, feed, showPaidPrompts, showSaved]);

    //generated media append
    useEffect(() => {
        const handleAppend = async (msg) => {

            if (msg.media && msg.media.length > 0 && (photosSortModel === msg.lora_id || msg.lora_id === undefined) && requestId === msg.requestId) {
                if(userIdLoaded < 1 && from !== 'feedPage') {
                    setPhotosList((prev) => (uniquePhotos([...prev, ...msg.media])));
                } else {
                    if(filter === 'repeats1' && dateRange === 'last_1_day1') {
                        setPhotosList((prev) => sortAndUniquePhotosWithRepeats([...prev, ...msg.media]));
                    } else {
                        setPhotosList((prev) => uniquePhotos([...prev, ...msg.media]));
                    }
                }
            }
            resetFetchingRef();

            setIsLoading(false);
        };

        addHandler('generated_media_append', handleAppend);
        return () => deleteHandler('generated_media_append');
    }, [addHandler, deleteHandler, resetFetchingRef, photosSortModel, photosList, userIdLoaded, from, requestId, setPhotosList, filter, dateRange, searchingAiModel, setIsLoading]);

    //scroll to top after filter avatar
    useEffect(() => {
        document.getElementById("generatedPhotosList")?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [photosSortModel]);

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
    }, [setPhotosPage, resetLastPageRef, resetFetchingRef, setPhotosList]);

    const memoizedPhotos = useMemo(() => photosList, [photosList]);
    const validPhotos = useMemo(() => (memoizedPhotos || []).filter(Boolean), [memoizedPhotos]);


    const handlePublishToGallery = () => {
        for (let i=0; i < selectedImages.length; i++){
            
            sendData({
                action: "gallery/add/" + selectedImages[i],
                data: { jwt: token, photoId: selectedImages[i] }
            });

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

    if(photosList.length < 1 && isLoading ) {
        return <FeedSkeleton />
    } else if(photosList.length < 1 && !isLoading) {
        return <p className={"text-center"} style={{marginTop: 10}}>{t("Media not found")}</p>
    }

    return (
        <div>
            {
                profileGallery === false && (
                    <div className="myButtonsContainer horizontal-list ">
                        <button
                            onClick={() => handleChangePhotosSortModel(0, myLoras)}
                            className={`btn no-wrap ${photosSortModel === 0 ? 'btn-primary' : 'btn-glass'}`}
                        >
                            {t('all')}
                        </button>



                        {myLoras.map((model, idx) => (
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
                                        onClick={handlePostToGroup}
                                    >
                                        {t('Post to group')}
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

            <div className={styles.photoGrid}>
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

            {
            isMarket
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
