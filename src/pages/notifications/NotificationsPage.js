import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PhotoPostModal from "../../components/modals/PhotoPostModal";
import {useTranslation} from "react-i18next";
import styles from "../../components/teegee/PricingWidget/css/PricingWidget.module.css";
import {getTimeAgo} from "../../App";
import animationStarGold from './../../assets/gif/gold_star.gif';
import Video from "../../components/player/Video";

const NotificationsPage = () => {
    const { addHandler, deleteHandler, sendData } = useWebSocket();
    const { token, userData, setUserData } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const imageSelector = useSelector(state => state.image.images);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [page, setPage] = useState("notifications");
    const [financeHistory, setFinanceHistory] = useState([]);
    
    const BackButton = window.Telegram.WebApp.BackButton;

    useEffect(() => {
        if (token) {
            sendData({
                action: "notifications/get/my",
                data: {
                    jwt: token
                }
            });
        }
    }, [token]);

    useEffect(() => {
        const handleReceiveNotifications = (msg) => {
            const notificationsArray = Array.isArray(msg.notifications)
                ? msg.notifications
                : Object.values(msg.notifications);

            const sortedNotifications = sortNotificationsByTime(notificationsArray);
            const grouped = groupNotificationsByDate(sortedNotifications);
            setNotifications(grouped);
            setUserData((prev) => (
                {
                    ...prev,
                    has_new_notify: false
                }
            ))
        };

        addHandler('receive_notifications', handleReceiveNotifications);

        return () => deleteHandler('receive_notifications');
    }, [setNotifications, addHandler, deleteHandler, setUserData]);

    useEffect(() => {
        const handleReceiveFinanceHistory = (msg) => {
            setFinanceHistory(msg.financeHistory);
        };

        addHandler('receive_finance_history', handleReceiveFinanceHistory);

        return () => deleteHandler('receive_finance_history');
    }, [addHandler, deleteHandler, setFinanceHistory]);

    const sortNotificationsByTime = (notifications) => {
        return notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };

    const groupNotificationsByDate = (notifications) => {
        const groupedByDate = notifications.reduce((acc, notification) => {
            const date = new Date(notification.created_at).toISOString().split('T')[0];

            if (!acc[date]) {
                acc[date] = [];
            }

            acc[date].push(notification);

            return acc;
        }, {});

        Object.keys(groupedByDate).forEach((date) => {
            groupedByDate[date] = groupNotificationsByUserAndType(groupedByDate[date]);
        });

        return groupedByDate;
    };

    const groupNotificationsByUserAndType = (notifications) => {
        const grouped = [];
        let lastNotification = null;

        notifications.forEach((notification) => {
            if (
                lastNotification && lastNotification.from_user &&
                lastNotification.from_user.id === notification.from_user.id &&
                notification.type !== 'comment' && 
                lastNotification.type === notification.type
            ) {
                lastNotification.count++;
            } else {
                if (lastNotification) {
                    grouped.push(lastNotification);
                }
                lastNotification = {
                    ...notification,
                    count: 1
                };
            }
        });

        if (lastNotification) {
            grouped.push(lastNotification);
        }

        return grouped.map((group) => {
            const text =
                group.type === "like"
                    ? ` поставил(а) вам лайк${group.count > 1 ? " и еще " + (group.count - 1) + " на ваши фотографии" : " на вашу фотографию"}`
                    : group.type === "subscribe"
                        ? ` подписался(ась) на вас`
                        : ` оставил(а) комментарий`;
            return { text, count: group.count, from_user: group.from_user, media_id: group.media_id, type: group.type, comment: group?.text };
        });
    };

    const renderNotifications = () => {
        return Object.entries(notifications).map(([date, notificationGroups]) => {
            return (
                <div key={date} style={{ marginTop: 10 }}>
                    <p className="text-muted">{date}</p>

                    {notificationGroups.map((group, index) => (
                        <div key={index} className="notification-group d-flex justify-content-between" style={{ display: 'flex', marginTop: 5 }}>
                            <div className="d-flex" style={{ maxWidth: "calc(100% - 60px)" }}>
                                <img
                                    onClick={() => navigate(`/profile/${group?.from_user?.id}`)}
                                    src={group?.from_user?.photo_url}
                                    alt="user-avatar"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        marginRight: '10px'
                                    }}
                                />
                                <p><Link style={{fontWeight: 800}} to={`/profile/${group?.from_user?.id}`}>{group?.from_user?.first_name} {group?.from_user?.last_name}</Link>{group.text}{group?.type === 'comment' && <>: <b>{group.text !== null && group.text.length > 16  ? group.text.slice(0, 16) + '...' : group.comment}</b></>}</p>
                            </div>
                            {
                                (group.type === 'like' || group.type === 'comment') && (
                                    <img
                                        onClick={() => {
                                            setSelectedPhoto(group.media_id);
                                            setIsModalOpen(true);
                                            sendData({
                                                action: "get/media/" + group.media_id,
                                                data: {
                                                    jwt: token,
                                                    photoId: group.media_id,
                                                    answerAction: "photo_modal_studio"
                                                }
                                            });
                                            BackButton.show();
                                        }}
                                        src={imageSelector[group.media_id]?.file_type === 'image' ? imageSelector[group.media_id]?.media_url : imageSelector[group.media_id]?.video_preview}
                                        alt={`media-${group.media_id}`}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '8px',
                                            marginRight: '10px',
                                            objectFit: "cover"
                                        }}
                                    />
                                )
                            }
                        </div>
                    ))}
                </div>
            );
        });
    };

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }, [page]);

    return (
        <div className="globalBlock">
            <div className="center-content-block">

                <div className="w-100 d-flex justify-content-center">
                    <div style={{ width: "80%" }}>
                        <div className={styles.toggleWrapper}>
                            <div
                                className={styles.toggleSlider}
                                style={{
                                    transform: page === "notifications" ? 'translateX(0%)' : 'translateX(calc(100% - 8px))',
                                }}
                            />
                            <button
                                onClick={() => {
                                    setPage("notifications")
                                }}
                                className={`${styles.toggleButton} ${page === "notifications" ? styles.activeToggle : ''}`}
                            >
                                {t('Notifications')}
                            </button>
                            <button
                                onClick={() => {
                                    setPage("finance")
                                }}
                                className={`${styles.toggleButton} ${page === "finance" ? styles.activeToggle : ''}`}
                            >
                                {t('Finance')}
                            </button>
                        </div>
                    </div>
                </div>

                {
                    page === 'notifications' ? (
                        <>
                            {renderNotifications()}
                            {
                                Object.keys(notifications).length < 1 && (
                                    <p>{t('Not found recently notifications')}</p>
                                )
                            }
                        </>
                    ) : page === 'finance' ? (
                        <div>
                            {
                                financeHistory.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "12px",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div>
                                            <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
                                                {item.amount > 0 ? `+${item.amount}` : item.amount} <img src={animationStarGold} width={14} />
                                            </p>
                                            <p style={{ margin: 0, color: "#555", display: "flex", alignItems: "center", gap: "5px" }}>
                                                {t(item.action)}
                                                {
                                                    item.from_user !== undefined && item.from_user?.id !== undefined ? (
                                                        <> {t('from')} <img src={item.from_user.photo_url} width={18} style={{ borderRadius: "50%" }} /> <Link to={`/profile/${item.from_user.id}`}>
                                                                {item.from_user.first_name} {item.from_user.last_name}
                                                            </Link>
                                                        </>
                                                    ) : item.action === 'The gift of a stars' && item.anonymous ? (
                                                        <> {t('from')} {t('anonymous user')}
                                                        </>
                                                    ) : null
                                                }
                                            </p>
                                            <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                                                {getTimeAgo(item.created_at)}
                                            </p>
                                        </div>
                                        {
                                            item.photo_id > 0 && (
                                                <img
                                                    onClick={() => {
                                                        setSelectedPhoto(item.photo_id);
                                                        setIsModalOpen(true);
                                                        sendData({
                                                            action: "get_photo",
                                                            data: {
                                                                jwt: token,
                                                                photoId: item.photo_id,
                                                                answerAction: "photo_modal_studio"
                                                            }
                                                        });
                                                        BackButton.show();
                                                    }}
                                                    src={imageSelector[item.photo_id]?.media_url}
                                                    alt={`media-${item.photo_id}`}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '8px',
                                                        marginRight: '10px',
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            )
                                        }
                                    </div>
                                ))
                            }
                            {
                                financeHistory.length < 1 && (
                                    <p>{t('Finance history is empty')}</p>
                                )
                            }
                        </div>
                    ) : <></>
                }
                <PhotoPostModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setOpenBackdropLoader={() => {}}
                    profileGallery={true}
                    nextPhoto={() => {}}
                    prevPhoto={() => {}}
                    userIdLoaded={userData.id}
                    selectedPhoto={selectedPhoto}
                    setSelectedPhoto={setSelectedPhoto}
                    from={"notification"}
                />
            </div>
        </div>
    );
};

export default NotificationsPage;
