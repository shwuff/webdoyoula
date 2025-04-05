import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PhotoPostModal from "../../components/modals/PhotoPostModal";

const NotificationsPage = () => {
    const { addHandler, deleteHandler, sendData } = useWebSocket();
    const { token, userData, setUserData } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const imageSelector = useSelector(state => state.image.images);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    
    const BackButton = window.Telegram.WebApp.BackButton;

    useEffect(() => {
        if (token) {
            sendData({
                action: "get_notifications",
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
                    has_new_notify: 0
                }
            ))
        };

        addHandler('receive_notifications', handleReceiveNotifications);

        return () => deleteHandler('receive_notifications');
    }, [setNotifications, addHandler, deleteHandler, setUserData]);

    const sortNotificationsByTime = (notifications) => {
        return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const groupNotificationsByDate = (notifications) => {
        const groupedByDate = notifications.reduce((acc, notification) => {
            const date = new Date(notification.createdAt).toISOString().split('T')[0];

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
                lastNotification && lastNotification.fromUser &&
                lastNotification.fromUser.id === notification.fromUser.id &&
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
            return { text, count: group.count, fromUser: group.fromUser, imageId: group.image_id, type: group.type, commentText: group?.text };
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
                                    onClick={() => navigate(`/profile/${group.fromUser.id}`)}
                                    src={group.fromUser.photo_url}
                                    alt="user-avatar"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        marginRight: '10px'
                                    }}
                                />
                                <p><Link style={{fontWeight: 800}} to={`/profile/${group.fromUser.id}`}>{group.fromUser.first_name} {group.fromUser.last_name}</Link>{group.text}{group?.type === 'comment' && <>: <b>{group.commentText.length > 16  ? group.commentText.slice(0, 16) + '...' : group.commentText}</b></>}</p>
                            </div>
                            {
                                (group.type === 'like' || group.type === 'comment') && (
                                    <img
                                        onClick={() => {
                                            setSelectedPhoto(group.imageId);
                                            setIsModalOpen(true);
                                            sendData({
                                                action: "get_photo",
                                                data: {
                                                    jwt: token,
                                                    photoId: group.imageId,
                                                    answerAction: "photo_modal_studio"
                                                }
                                            });
                                            BackButton.show();
                                        }}
                                        src={imageSelector[group.imageId]?.blob_url}
                                        alt="user-image"
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

    return (
        <div className="globalBlock">
            <div className="center-content-block">
                {renderNotifications()}
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
