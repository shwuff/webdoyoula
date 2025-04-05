import React, {useState, useEffect, useRef} from 'react';
import { useAuth } from "../../context/UserContext";
import styles from './css/Profile.module.css';
import {useNavigate, useParams} from "react-router-dom";
import { useWebSocket } from "../../context/WebSocketContext";
import CircularProgress from '@mui/material/CircularProgress';
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import Modal from "../../components/modal/Modal";
import SubscribeButton from "../../components/buttons/SubscribeButton";
import CloseButton from "../../components/buttons/CloseButton";
import EditData from './settings/EditData';
import {Box, Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import TelegramStar from './../../assets/icons/profileIcons/telegram-star.png';
import zzzIcon from './../../assets/icons/profileIcons/zzz.png';
import palmIcon from './../../assets/icons/profileIcons/palm.png';
import hiIcon from './../../assets/icons/profileIcons/hi.png';

const Profile = () => {
    const { userData, token, setUserData } = useAuth();
    const { sendData, addHandler, deleteHandler } = useWebSocket();

    const {t} = useTranslation();

    const [isMyProfile, setMyProfile] = useState(true);
    const [tempUserData, setTempUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    // const [posts, setPosts] = useState([]);
    // const [images, setImages] = useState([]);
    const [followUsers, setFollowUsers] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const BackButton = window.Telegram.WebApp.BackButton;

    useEffect(() => {
        const handleFollowers = (msg) => {
            setIsFollowLoading(false);
            setFollowUsers(msg.followers);
        };

        addHandler('receive_followers', handleFollowers);

        return () => deleteHandler('receive_followers');
    }, [addHandler, deleteHandler]);


    const handleShowFollowers = () => {
        setModalTitle(t('followers'));
        BackButton.show();
        BackButton.onClick(() => {setIsModalOpen(false)});
        setIsFollowLoading(true);
        sendData({
            action: "get_followers",
            data: { jwt: token, userId: tempUserData.id }
        });
    };

    useEffect(() => {
        const handleFollowing = (msg) => {
            setIsFollowLoading(false);
            setFollowUsers(msg.followings);
        };

        addHandler('receive_followings', handleFollowing);

        return () => deleteHandler('receive_followings');
    }, [addHandler, deleteHandler]);

    const handleShowFollowing = () => {
        setModalTitle(t('follows'));
        BackButton.show();
        BackButton.onClick(() => {setIsModalOpen(false)});
        setIsFollowLoading(true);
        sendData({
            action: "get_following",
            data: { jwt: token, userId: tempUserData.id }
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if(isModalOpen === false) {
            BackButton.hide();
        }
    }, [isModalOpen, BackButton]);

    // useEffect(() => {
    //     const handleInviteSub = (msg) => {
    //         setTempUserData((prev) => {
    //             return {
    //                 ...prev,
    //                 sub: msg.sub,
    //                 followersCount: msg.followersCount
    //             }
    //         });
    //     }
    //
    //     addHandler('to_subscribe', handleInviteSub);
    //
    //     return () => deleteHandler('to_subscribe');
    //
    // }, []);

    useEffect(() => {
        if (userId && userData) {
            setPhotosPage(1);
            sendData({ action: 'getProfile', data: { jwt: token, userId } });
        }
    }, [userId]);

    useEffect(() => {
        const handleGetPosts = (msg) => {
            // console.log(msg.post)
            // setPosts((prev) => [
            //     ...prev,
            //     msg.post
            // ].sort((a, b) => b.post_id - a.post_id));
            // setImages((prev) => [
            //     ...prev,
            //     ...msg.photos
            // ])
        }

        addHandler('receive_user_post', handleGetPosts);

        return () => deleteHandler('receive_user_post');
    }, [addHandler, deleteHandler]);

    useEffect(() => {
        const handleGetProfile = (msg) => {
            setTempUserData(msg.user);
            setMyProfile(msg.user.id === userData.id);

            if(msg.user.id === userData.id) {
                setUserData(prev => ({
                    ...prev,
                    photo_url: msg.user.photo_url
                }))
            }

        }

        addHandler('get_user_answere', handleGetProfile);

        return () => deleteHandler('get_user_answere');

    }, [userData, addHandler, deleteHandler]);

    // useEffect(() => {
    //     if(tempUserData) {
    //         sendData({action: 'get_user_posts', data: {jwt: token, userId: tempUserData.id}})
    //     }
    // }, [tempUserData]);

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

    const initialMiniProfileIconsCoordinates = [
        { x: -40, y: 40, opacity: 0.9, size: 25 },
        { x: -10, y: -5, opacity: 1, size: 30 },
        { x: 50, y: -40, opacity: 0.9, size: 25 },
        { x: 100, y: -5, opacity: 1, size: 30 },
        { x: 140, y: 40, opacity: 0.9, size: 25 },
        { x: 100, y: 80, opacity: 1, size: 30 },
        { x: 50, y: 115, opacity: 0.9, size: 25 },
        { x: -10, y: 80, opacity: 0.9, size: 30 },
        { x: -80, y: 40, opacity: 0.4, size: 20 },
        { x: -50, y: -5, opacity: 0.5, size: 23 },
        { x: 10, y: -30, opacity: 0.5, size: 23 },
        { x: 90, y: -30, opacity: 0.5, size: 23 },
        { x: 150, y: -5, opacity: 0.5, size: 23 },
        { x: 180, y: 40, opacity: 0.5, size: 23 },
        { x: 150, y: 80, opacity: 0.5, size: 23 },
        { x: 90, y: 115, opacity: 0.5, size: 23 },
        { x: 10, y: 115, opacity: 0.5, size: 23 },
        { x: -50, y: 80, opacity: 0.5, size: 23 },
    ];

    const [miniIconsCoordinates, setMiniIconsCoordinates] = useState(initialMiniProfileIconsCoordinates);

    const handleScrollMiniIcon = (e) => {
        const scrollY = e.target.scrollTop;

        setMiniIconsCoordinates((prev) =>
            prev.map((icon, i) => {
                const startX = initialMiniProfileIconsCoordinates[i].x;
                const startY = initialMiniProfileIconsCoordinates[i].y;
                const startSize = initialMiniProfileIconsCoordinates[i].size;

                const progress = Math.min(1, scrollY / 150);

                const sizeProgress = Math.max(0.5, 1 - progress * 0.5);

                return {
                    ...icon,
                    x: startX + (50 - startX) * progress,
                    y: startY + (50 - startY) * progress,
                    size: startSize * sizeProgress,
                    opacity: icon.opacity,
                };
            })
        );
    };

    useEffect(() => {
        const contentBlock = document.querySelector('.globalProfileBlock');
        if (contentBlock) {
            contentBlock.addEventListener('scroll', handleScrollMiniIcon);
        }

        return () => {
            if (contentBlock) {
                contentBlock.removeEventListener('scroll', handleScrollMiniIcon);
            }
        };
    }, []);

    if (!tempUserData) {
        return (
            <div className={"globalBlock"}>
                <div className={"center-content-block d-flex justify-content-center align-items-center"} style={{height: "100%"}}>
                    <CircularProgress color="inherit" />
                </div>
            </div>
        );
    }

    return (
        <div className={"globalProfileBlock"} onScroll={(e) => {
            handleScroll(e);
            handleScrollMiniIcon(e);
        }}>
            <div className={"center-content-block"}>
                <div className={styles.profileHeader}>
                    <div className={styles.profileBackgroundBlock} style={{marginBottom: "10px", paddingTop: window.Telegram.WebApp?.safeAreaInset?.top
                                 ? `${window.Telegram.WebApp.safeAreaInset.top * 2}px` : '30px', background: tempUserData.profile_color.second_color_full}}>
                        <div className={styles.miniProfileIconWrapper}>
                            <img
                                src={tempUserData.photo_url}
                                alt={tempUserData.first_name}
                                className={styles.profileAvatar}
                                style={{ boxShadow: `0px 0px 200px 20px ${tempUserData.profile_color.first_color}` }}
                            />
                            <div className={styles.starWrapper}>
                                {[...Array(18)].map((_, index) => (
                                    <img
                                        key={index}
                                        src={tempUserData.mini_icon_name === 'star' ? TelegramStar : tempUserData.mini_icon_name === 'zzz' ? zzzIcon : tempUserData.mini_icon_name === 'hi' ? hiIcon : tempUserData.mini_icon_name === 'palm' ? palmIcon : TelegramStar}
                                        className={styles.miniProfileIcon}
                                        style={{
                                            left: `${miniIconsCoordinates[index].x}px`,
                                            top: `${miniIconsCoordinates[index].y}px`,
                                            opacity: miniIconsCoordinates[index].opacity,
                                            width: `${miniIconsCoordinates[index].size}px`,
                                            height: `${miniIconsCoordinates[index].size}px`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.profileUserInfo}>
                            <h2 style={{ color: "white", zIndex: 5 }} className={styles.profileName}>{tempUserData.first_name} {tempUserData.last_name}</h2>
                            {
                                tempUserData?.username?.length > 0 && (
                                    <p style={{ color: "white", zIndex: 5 }} className={styles.profileUsername}>@{tempUserData.username}</p>
                                )
                            }
                            {/*<p style={{ color: "white" }} className={styles.profileDescription}>{tempUserData.bio}</p>*/}
                        </div>
                    </div>
                    <div className={styles.blockStats}>
                        <div className={styles.profileStats}>
                            <div className={styles.statBlock}>
                                <p className={styles.statNumber}>{tempUserData.count_photos_gallery}</p>
                                <p className={styles.statLabel}>{t('posts')}</p>
                            </div>
                            <div className={styles.statBlock} onClick={() => {
                                openModal();
                                handleShowFollowers();
                            }}>
                                <p className={styles.statNumber}>{tempUserData.followersCount}</p>
                                <p className={styles.statLabel}>{t('followers')}</p>
                            </div>
                            <div className={styles.statBlock} onClick={() => {
                                openModal();
                                handleShowFollowing();
                            }}>
                                <p className={styles.statNumber}>{tempUserData.followingCount}</p>
                                <p className={styles.statLabel}>{t('follows')}</p>
                            </div>
                        
                        </div>
                        <div className={styles.profileStats} style={{marginTop: "10px"}}>
                            <div className={styles.statBlock2}>
                                <p className={styles.statNumber}>{tempUserData.count_likes}</p>
                                <p className={styles.statLabel}>{t('likes')}</p>
                            </div>
                            <div className={styles.statBlock2}>
                                <p className={styles.statNumber}>{tempUserData.count_repeats}</p>
                                <p className={styles.statLabel}>{t('repeats')}</p>
                            </div>
                            <div className={styles.statBlock2}>
                                <p className={styles.statNumber}>{tempUserData.count_views}</p>
                                <p className={styles.statLabel}>{t('views')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Box sx={{ display: 'flex', gap: 1, padding: "4px" }}>
                    {
                        userData.id === tempUserData.id ? (
                            <Box sx={{ width: '50%' }}>
                                <EditData />
                            </Box>
                        ) : (
                            <Box sx={{ width: '50%' }}>
                                <SubscribeButton
                                    style={{width: "100%" }}
                                    sub={tempUserData.sub}
                                    setSub={(sub) => {
                                        setTempUserData((prev) => {
                                            return {
                                                ...prev,
                                                sub: sub
                                            }
                                        });
                                    }}
                                    userId={tempUserData.id}
                                    setFollowersCount={(followersCount) => {
                                        setTempUserData((prev) => {
                                            return {
                                                ...prev,
                                                followersCount: followersCount
                                            }
                                        });
                                    }}
                                />
                            </Box>
                        )
                    }
                    <Box sx={{ width: '50%' }}>
                        <Button
                            variant="contained"
                            onClick={() => window.location.href = `https://t.me/share/url?url=https://t.me/doyoulabot/app?startapp=userId${userId}AAAfrom${userId}`}
                            sx={{ bgcolor: 'var(--button-color)', fontSize: '8px', width: "100%", borderRadius: '8px' }}
                        >
                            {t('share_profile')}
                        </Button>
                    </Box>
                </Box>
                <div className="w-100" style={{padding: 3}}>
                    {/*<ViewPosts*/}
                    {/*//     posts={posts}*/}
                    {/*//     setPosts={setPosts}*/}
                    {/*//     images={images}*/}
                    {/*//     user={tempUserData}*/}
                    {/*// />*/}

                    <MyGeneratedPhotosList
                        key={tempUserData?.id}
                        profileGallery={true}
                        resetLastPageRef={resetLastPageRef}
                        resetFetchingRef={resetFetchingRef}
                        photosPage={photosPage}
                        setPhotosPage={setPhotosPage}
                        from={'viewGallery'}
                        userIdLoaded={tempUserData.id}
                    />
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <div className="p-2 w-100 d-flex justify-content-between">
                    <h2 className={styles.modalTitle}>{modalTitle}</h2>
                    {
                        !userData.isTelegram && (
                            <CloseButton onClick={closeModal} />
                        )
                    }
                </div>

                {
                    isFollowLoading ? (
                        <div className={"p-2 w-100 d-flex justify-content-center"}>
                            <CircularProgress color="inherit" />
                        </div>
                    ) : (
                        <ul className={styles.userList}>
                            {followUsers.length > 0 ? (
                                followUsers.map((user) => {

                                    return (
                                        <li key={user.subscriber?.id || user.subscribedTo?.id} onClick={() => {
                                            navigate(`/profile/${user?.subscriber?.id || user.subscribedTo?.id}`);
                                            setIsModalOpen(false);
                                        }} className={styles.userItem}>
                                            <div onClick={() => navigate(`/profile/${user.subscriber?.id || user.subscribedTo?.id}`)} >
                                                <img src={user?.subscriber?.photo_url || user.subscribedTo?.photo_url}
                                                     alt={user.subscriber?.first_name || user.subscribedTo?.first_name}
                                                     style={{ width: 52, height: 52, borderRadius: "50%" }} />
                                            </div>
                                            <div onClick={() => navigate(`/profile/${user.subscriber?.id || user.subscribedTo?.id}`)} className={styles.userInfo} >
                                                <span
                                                    className={styles.profileName}>
                                                    {user.subscriber?.first_name || user.subscribedTo?.first_name} {user.subscriber?.last_name || user.subscribedTo?.last_name}
                                                </span>
                                                {
                                                    user.subscriber?.username?.length > 0 || user.subscribedTo?.username?.length > 0 ? (
                                                        <span
                                                            className={styles.profileUsername}>
                                                            @{user.subscriber?.username || user.subscribedTo?.username}
                                                        </span>
                                                    ) : null
                                                }
                                            </div>

                                            {/*<button className={'btn-outline-primary'} >*/}
                                            {/*    Follow*/}
                                            {/*</button>*/}
                                        </li>
                                    )
                                })
                            ) : (
                                <p className={"p-2"}>{t('there_are_no_users')}</p>
                            )}
                        </ul>
                    )
                }
            </Modal>
        </div>
    );
};

export default Profile;
