import React, { useEffect, useState } from 'react';
import {useWebSocket} from "../../context/WebSocketContext";
import {useAuth} from "../../context/UserContext";
import {useDispatch, useSelector} from "react-redux";
import { updateImage } from "../../redux/actions/imageActions";
import { useTranslation } from "react-i18next";
import './css/PublishToGalleryButton.css';
import CloseButton from "./CloseButton";
import Button from "../teegee/Button/Button";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MUIButton,
    Typography, Input, TextField
} from '@mui/material';
import StyledTextarea from "../input/StyledTextarea";

const PublishToGalleryButton = ({ selectedPhoto, expanded, setExpanded, isMyPrompt }) => {
    const { t } = useTranslation();
    const { sendData, addHandler, deleteHandler } = useWebSocket();
    const { token } = useAuth();
    const imageSelector = useSelector((state) => state.image.images);
    const selected = imageSelector[selectedPhoto];
    const dispatch = useDispatch();

    const [repeatPrice, setRepeatPrice] = useState(selected && selected.repeat_price ? selected.repeat_price : '');
    // const [salePrice, setSalePrice] = useState('');
    // const [getPrice, setGetPrice] = useState('');
    const [caption, setCaption] = useState(selected && selected.caption ? selected.caption : '');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleDeleteFromGallery = (photoId) => {
        sendData({
            action: "gallery/delete/" + photoId,
            data: { jwt: token }
        });
    };

    const handleProcessPublishToGallery = () => {
        if (parseFloat(repeatPrice) > 0) {
            setOpenConfirmDialog(true);
        } else {
            confirmPublish();
        }
    };

    const confirmPublish = () => {
        dispatch(updateImage(selected.id, { caption }));

        sendData({
            action: "gallery/add/" + selected.id,
            data: { jwt: token, repeat_price: repeatPrice, caption }
        });

        setExpanded(false);
        setOpenConfirmDialog(false);
    };

    useEffect(() => {
        const handleUpdatePostedAt = async (msg) => {
            if(selectedPhoto !== null && selectedPhoto === msg.media_id) {
                dispatch(updateImage(msg.media_id, {posted_at: msg.posted_at}));
            }
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        };

        addHandler('update_photo_posted_at', handleUpdatePostedAt);
        return () => deleteHandler('update_photo_posted_at');
    }, [addHandler, deleteHandler, selectedPhoto]);

    return (
        <>
            {selected && selected.posted_at !== null ? (
                <Button className="publish-outline-button iconButton w-100" style={{ marginBottom: "10px" }} onClick={() => {
                    handleDeleteFromGallery(selected.id);
                }}>
                    {t('hide')}
                </Button>
            ) : (
                <div className="publish-wrapper">
                    <button
                        className={`publish-button ${expanded ? 'shrink' : ''}`}
                        onClick={() => {
                            setExpanded(!expanded)
                        }}
                    >
                        {
                            expanded ? <CloseButton onClick={() => setExpanded(false)} color={"var(--button-text-color)"} /> : t('to_publish')
                        }
                    </button>

                    <div className={`publish-fields ${expanded ? 'visible' : ''}`}>
                        <div className="w-100 d-flex" style={{ gap: "10px" }}>
                            {
                                isMyPrompt && (
                                    <>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            placeholder={t('Repeat Price')}
                                            value={repeatPrice}
                                            onChange={(e) => setRepeatPrice(e.target.value)}
                                            style={{ width: "100%", fontSize: "14px" }}
                                            InputProps={{
                                                sx: {
                                                    width: '100%',
                                                    resize: 'none',
                                                    fontSize: '14px',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--glass-border)',
                                                    backgroundColor: 'var(--glass-bg)',
                                                    color: 'var(--text-color)',
                                                    fontFamily: 'inherit',
                                                    lineHeight: 1.5,
                                                    outline: 'none',
                                                    backdropFilter: 'blur(8px)',
                                                }
                                            }}
                                        />
                                    </>
                                )
                            }
                        </div>
                        <StyledTextarea
                            minRows={1}
                            maxRows={6}
                            placeholder={t('Caption')}
                            maxLength={255}
                            value={caption}
                            rows={1}
                            onChange={(e) => {
                                setCaption(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                        />
                        <div className="w-100 d-flex justify-content-end">
                            <span className={"text-muted caption"}>{caption.length} / 255</span>
                        </div>
                        <Button
                            className={"publish-button"}
                            onClick={() => handleProcessPublishToGallery(selected.id)}>
                            {t('to_publish')}
                        </Button>
                    </div>
                    <Dialog
                        open={openConfirmDialog}
                        onClose={() => setOpenConfirmDialog(false)}
                    >
                        <DialogTitle>{t('Confirmation')}</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Публикация медиа с платным prompt стоит 1 ⭐. Вы согласны?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <MUIButton onClick={() => setOpenConfirmDialog(false)} color="inherit">
                                {t('Cancel')}
                            </MUIButton>
                            <MUIButton onClick={confirmPublish} color="primary" autoFocus>
                                {t('Yes')}
                            </MUIButton>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </>
    );
};

export default PublishToGalleryButton;
