import React, { useEffect, useState } from 'react';
import { FaComment } from 'react-icons/fa';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import Modal from "../modal/Modal";
import { Avatar, List, ListItem, ListItemText, Divider, TextField, Button, Typography } from '@mui/material';
import {useNavigate} from "react-router-dom";
import CommentIcon from './../../assets/icons/chat.png';
import CloseButton from "../buttons/CloseButton";
import {useTranslation} from "react-i18next";

const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: "год", seconds: 31536000 }, // 1 год = 365 * 24 * 60 * 60
        { label: "мес", seconds: 2592000 }, // 1 месяц ≈ 30 * 24 * 60 * 60
        { label: "дн", seconds: 86400 }, // 1 день = 24 * 60 * 60
        { label: "час", seconds: 3600 }, // 1 час = 60 * 60
        { label: "мин", seconds: 60 }, // 1 минута = 60
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label} назад`;
        }
    }

    return "только что";
};


const CommentsModal = ({ photoGallery, isOpen, setOpen }) => {
    const [comments, setComments] = useState([]);
    const [textComment, setTextComment] = useState('');

    const { addHandler, deleteHandler, sendData } = useWebSocket();
    const { token, userData } = useAuth();
    const navigate = useNavigate();
    const {t} = useTranslation();

    useEffect(() => {
        const handleReceiveNewComment = (msg) => {
            setComments((prev) => {
                if (!prev.some(comment => comment.id === msg.id)) {
                    return [{
                        id: msg.id,
                        imageId: msg.imageId,
                        userId: msg.userId,
                        text: msg.text,
                        commentUser: msg.comment_user
                    }, ...prev];
                }
                return prev;
            });
        };

        addHandler('receive_new_comment', handleReceiveNewComment);

        return () => deleteHandler('receive_new_comment');
    }, [userData, textComment]);

    const handleCreateComment = (imageId, userId) => {
        sendData({
            action: "create_comment",
            data: { jwt: token, userId: userId, imageId: imageId, text: textComment }
        });
        setTextComment('');
    };

    useEffect(() => {
        const handleComments = (msg) => {
            setComments((prev) => {
                const newComments = msg.comments.filter(
                    (newComment) => !prev.some((comment) => comment.id === newComment.id)
                );
                return [...newComments, ...prev];
            });
        };

        addHandler('receive_post_comments', handleComments);

        return () => deleteHandler('receive_post_comments');
    }, [userData, comments]);

    useEffect(() => {
        sendData({
            action: "get_comments",
            data: { jwt: token, userId: userData.id, imageId: photoGallery.id }
        });
    }, [photoGallery]);

    return (
        <div>
            <button className="actionButton">
                <img src={CommentIcon} className="comment"  onClick={() => setOpen(true)} alt={"Comment icon"} style={{width: 24, height: 24}} />
            </button>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)} style={{ overflowY: "auto" }} isFirst={false}>
                <div className={'w-100 d-flex justify-content-between'}>
                    <Typography variant="h6" style={{ marginTop: '16px', padding: 5 }}>
                        {t('comments')}
                    </Typography>
                    {
                        !userData.isTelegram && (
                            <CloseButton onClick={() => setOpen(false)} />
                        )
                    }
                </div>
                <div className="w-100 mt-2" style={{padding: 5}}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={textComment}
                        onChange={(e) => setTextComment(e.target.value)}
                        className={"searchInput"}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCreateComment(photoGallery.id, userData.id)}
                        style={{ marginTop: '16px' }}
                    >
                        {t('to_publish')}
                    </Button>
                </div>
                <List>
                    {comments.map((comment, index) => (
                        <div key={index}>
                            <ListItem alignItems="flex-start">
                                <Avatar
                                    alt={comment.commentUser.first_name}
                                    src={comment.commentUser.photo_url}
                                    style={{ marginRight: '16px' }}
                                    onClick={() => {
                                        window.location.href = (`/profile/${comment.commentUser.id}`);
                                    }}
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" style={{ fontSize: "12px" }}>
                                            {`${comment.commentUser.first_name} ${comment.commentUser.last_name}`}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography style={{ fontSize: "14px", color: "var(--text-color)" }}>
                                            {comment.text}
                                        </Typography>
                                    }
                                />
                                <p className="text-muted" style={{fontSize: 12}}>
                                    {getTimeAgo(comment.createdAt)}
                                </p>
                            </ListItem>
                            {index < comments.length - 1 && <Divider />}
                        </div>
                    ))}
                </List>
            </Modal>
        </div>
    );
};

export default CommentsModal;
