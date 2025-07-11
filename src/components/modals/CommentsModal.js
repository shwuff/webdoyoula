import React, { useEffect, useState } from 'react';
import { FaComment } from 'react-icons/fa';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import Modal from "../modal/Modal";
import {
    Avatar,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
    Button,
    Typography,
    TextareaAutosize
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import CommentIcon from './../../assets/svg/CommentIcon';
import CloseButton from "../buttons/CloseButton";
import {useTranslation} from "react-i18next";
import StyledTextarea from "../input/StyledTextarea";
import CircularProgress from "@mui/material/CircularProgress";

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


const CommentsModal = ({ photoGallery }) => {
    const [comments, setComments] = useState([]);
    const [textComment, setTextComment] = useState('');
    const [attachedFile, setAttachedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const { addHandler, deleteHandler, sendData } = useWebSocket();
    const { token, userData } = useAuth();
    const navigate = useNavigate();
    const {t} = useTranslation();

    //receive new comments
    useEffect(() => {
        const handleReceiveNewComment = (msg) => {
            setComments((prev) => {
                if (!prev.some(comment => comment.id === msg.id)) {
                    return [{
                        ...msg.comment
                    }, ...prev];
                }
                return prev;
            });
            setLoading(false);
            setTextComment('');
            setAttachedFile(null);
        };

        addHandler('receive_new_comment', handleReceiveNewComment);

        return () => deleteHandler('receive_new_comment');
    }, [userData, setComments]);

    useEffect(() => {
        const handleReceiveComments = (msg) => {
            setComments((prev) => {
                const existingIds = new Set(prev.map(comment => comment.id));
                const newComments = msg.comments.filter(comment => !existingIds.has(comment.id));
                return [...prev, ...newComments];
            });
        };

        addHandler('receive_comments', handleReceiveComments);

        return () => deleteHandler('receive_comments');
    }, [setComments]);

    //request for create comment
    const handleCreateComment = (imageId, userId) => {
        sendData({
            action: "gallery/comment/create/" + imageId,
            data: { jwt: token, text_comment: textComment, attached_file: attachedFile },
        });
        setLoading(true);
    };

    //receive post comments
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

    //get all comments
    useEffect(() => {
        sendData({
            action: "gallery/get/comments/" + photoGallery.id,
            data: { jwt: token }
        });
    }, [photoGallery]);

    return (
        <>
            <div className="w-100 mt-2" style={{padding: 5}}>
                <StyledTextarea
                    minRows={1}
                    maxRows={6}
                    value={textComment}
                    placeholder={t('Write a comment...')}
                    onChange={(e) => setTextComment(e.target.value)}
                    maxLength={255}
                />
                <div className={"w-100 d-flex justify-content-end"}>
                    <span className={"text-muted"}>
                        {textComment.length} / 255
                    </span>
                </div>

                <div style={{ marginTop: 10 }}>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/gif"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const fileData = {
                                    name: file.name,
                                    size: file.size,
                                    extension: file.name.split('.').pop().toLowerCase(),
                                    base64: reader.result
                                };
                                setAttachedFile(fileData);
                            };
                            reader.readAsDataURL(file);
                        }}
                        style={{ display: 'none' }}
                        id="upload-comment-file"
                    />
                    <label htmlFor="upload-comment-file">
                        <Button
                            variant="outlined"
                            component="span"
                            style={{ width: "100%", textTransform: "none" }}
                        >
                            {attachedFile ? attachedFile.name : t('Attach image or GIF')}
                        </Button>
                    </label>
                    {
                        attachedFile !== null && (
                            <img src={attachedFile.base64} style={{ borderRadius: "12px", width: "200px", marginTop: "8px" }} alt={"Comment Image"} />
                        )
                    }
                </div>

                <Button
                    variant="action"
                    color="primary"
                    disabled={loading}
                    sx={{ opacity: loading ? 0.6 : 1 }}
                    onClick={() => handleCreateComment(photoGallery.id, userData.id)}
                    style={{ marginTop: '16px', width: "100%" }}
                >
                    {
                        loading ? <CircularProgress size={20} sx={{ color: 'var(--text-color)' }} /> : <span>{t('to_publish')}</span>
                    }
                </Button>
            </div>
            <List>
                {comments.map((comment, index) => (
                    <div key={index}>
                        <ListItem alignItems="flex-start" sx={{padding: "6px 12px 0 12px"}}>
                            <Avatar
                                alt={comment.comment_user?.first_name}
                                src={comment.comment_user?.photo_url}
                                style={{ marginRight: '16px' }}
                                onClick={() => {
                                    window.location.href = (`/profile/${comment.comment_user?.id}`);
                                }}
                            />
                            <ListItemText
                                primary={
                                    <Typography variant="body2" style={{ fontSize: "12px" }}>
                                        {`${comment.comment_user?.first_name} ${comment.comment_user?.last_name}`}
                                    </Typography>
                                }
                                secondary={
                                    <div>
                                        <Typography sx={{ fontSize: "14px", marginBottom: 0, color: "var(--text-color)" }}>
                                            {
                                                comment.files && (
                                                    <div className={"w-100"}>
                                                        <img src={comment.files.base64} style={{ width: "250px", borderRadius: "12px" }} />
                                                    </div>
                                                )
                                            }
                                            {comment.text}
                                        </Typography>

                                    </div>
                                }
                            />
                        </ListItem>
                        <div className="d-flex justify-content-end">
                            <p className="text-muted" style={{fontSize: 12, marginRight: "10px", marginTop: 0}}>
                                {getTimeAgo(comment.created_at)}
                            </p>
                        </div>
                        {index < comments.length - 1 && <hr style={{ margin: "0 10px" }} />}
                    </div>
                ))}
            </List>
        </>
    );
};

export default CommentsModal;
