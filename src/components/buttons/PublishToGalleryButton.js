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
    Typography
} from '@mui/material';

const PublishToGalleryButton = ({ photoId, selectedPhoto, expanded, setExpanded, isMyPrompt }) => {
    const { t } = useTranslation();
    const { sendData, addHandler, deleteHandler } = useWebSocket();
    const { token } = useAuth();
    const imageSelector = useSelector((state) => state.image.images);
    const selected = imageSelector[selectedPhoto];
    const dispatch = useDispatch();

    const [repeatPrice, setRepeatPrice] = useState(selected && selected.repeat_price ? selected.repeat_price : '');
    const [salePrice, setSalePrice] = useState('');
    const [getPrice, setGetPrice] = useState('');
    const [caption, setCaption] = useState(selected && selected.caption ? selected.caption : '');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleDeleteFromGallery = (photoId) => {
        sendData({
            action: "delete_from_gallery",
            data: { jwt: token, photoId }
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
        dispatch(updateImage(selected.id, { caption, repeat_price: repeatPrice }));

        sendData({
            action: "publish_to_gallery",
            data: { jwt: token, photoId: selected.id, repeatPrice, salePrice, getPrice, caption }
        });

        setExpanded(false);
        setOpenConfirmDialog(false);
    };

    useEffect(() => {
        const handleMessage = async (msg) => {
            if(selectedPhoto !== null && selectedPhoto === msg.photoId) {
                dispatch(updateImage(msg.photoId, {hided: msg.hided}));
            }
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        };

        addHandler('update_photo_hided', handleMessage);
        return () => deleteHandler('update_photo_hided');
    }, [addHandler, deleteHandler, selectedPhoto]);

    return (
        <>
            {selected && !selected.hided ? (
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
                                        <input
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className="input-field price-field"
                                            placeholder={t('Repeat Price')}
                                            value={repeatPrice}
                                            onChange={(e) => setRepeatPrice(e.target.value)}
                                            style={{ width: "100%" }}
                                        />
                                        {/*<input*/}
                                        {/*    inputMode="numeric"*/}
                                        {/*    pattern="[0-9]*"*/}
                                        {/*    className="input-field price-field"*/}
                                        {/*    placeholder={t('Get Price')}*/}
                                        {/*    value={getPrice}*/}
                                        {/*    onChange={(e) => setGetPrice(e.target.value)}*/}
                                        {/*    style={{ width: "100%" }}*/}
                                        {/*/>*/}
                                        {/*<input*/}
                                        {/*    inputMode="numeric"*/}
                                        {/*    pattern="[0-9]*"*/}
                                        {/*    className="input-field price-field"*/}
                                        {/*    placeholder={t('Sale Price')}*/}
                                        {/*    value={salePrice}*/}
                                        {/*    onChange={(e) => setSalePrice(e.target.value)}*/}
                                        {/*    style={{ width: "100%" }}*/}
                                        {/*/>*/}
                                    </>
                                )
                            }
                        </div>
                        <textarea
                            className="input-field caption-field"
                            placeholder={t('Caption')}
                            maxLength={255}
                            value={caption}
                            rows={1}
                            onChange={(e) => {
                                setCaption(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            style={{ resize: 'none', overflow: 'hidden' }}
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
                                Публикация платного промта стоит 1 ⭐. Вы согласны?
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
