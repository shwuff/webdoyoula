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
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";

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
            sendData({ action: 'getProfile', data: { jwt: token, userId } });
        }
    }, [userId, userData, sendData, token]);

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
        <div className={"globalBlock"} onScroll={handleScroll}>
            <div className={"center-content-block"}>
                <div className={styles.profileHeader}>
                    <div className={styles.profileAvatarWrapper}>
                        <img
                            src={tempUserData.photo_url}
                            alt={tempUserData.first_name}
                            className={styles.profileAvatar}
                        />
                    </div>
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
                </div>
                <div className={styles.profileUserInfo}>
                    <h2 className={styles.profileName}>{tempUserData.first_name} {tempUserData.last_name}</h2>
                    <p className={styles.profileUsername}>@{tempUserData.username}</p>
                    <p className={styles.profileDescription}>{tempUserData.bio}</p>
                    {
                        userData.id === tempUserData.id ? (
                            <EditData />
                        ) : (
                            <SubscribeButton
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
                        )
                    }
                    <Button
                        variant="contained"
                        onClick={() => window.location.href = `https://t.me/share/url?url=https://t.me/doyoulabot/app?startapp=userId${userId}`}
                        sx={{ bgcolor: 'var(--button-color)', fontSize: '12px', borderRadius: '8px', px: 3, marginLeft: 2 }}
                    >
                        {t('share_profile')}
                    </Button>
                </div>
                <div className="w-100" style={{padding: 3}}>
                    {/*<ViewPosts*/}
                    {/*//     posts={posts}*/}
                    {/*//     setPosts={setPosts}*/}
                    {/*//     images={images}*/}
                    {/*//     user={tempUserData}*/}
                    {/*// />*/}

                    <MyGeneratedPhotosList
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
                                                <span
                                                    className={styles.profileUsername}>
                                                    @{user.subscriber?.username || user.subscribedTo?.username}
                                                </span>
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
