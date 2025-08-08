import React, { useState } from 'react';
import RightModal from "../modal/RightModal";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import starAnimation from './../../assets/gif/gold_star.gif';

const MAX_PHOTOS = 15;

export default function CreateAvatarModal() {
    const [open, setOpen] = useState(false);
    const [avatarName, setAvatarName] = useState('');
    const [photos, setPhotos] = useState([]);

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { sendData } = useWebSocket();
    const { token } = useAuth();

    const compressImage = (file, maxSizeKB = 100, maxWidth = 512) => {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
                const dataUrl = reader.result;
                const sizeKB = Math.round((dataUrl.length * (3 / 4)) / 1024);

                if (sizeKB <= maxSizeKB) {
                    return resolve(dataUrl.split(',')[1]);
                }

                const img = new Image();
                img.src = dataUrl;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ratio = img.width > maxWidth ? maxWidth / img.width : 1;

                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const tryCompress = (q = 0.8) => {
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', q);
                        const compressedSizeKB = Math.round((compressedDataUrl.length * (3 / 4)) / 1024);

                        if (compressedSizeKB <= maxSizeKB || q <= 0.4) {
                            resolve(compressedDataUrl.split(',')[1]);
                        } else {
                            tryCompress(q - 0.05);
                        }
                    };

                    tryCompress();
                };
            };

            reader.readAsDataURL(file);
        });
    };

    const handleFilesChange = async (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const slotsLeft = MAX_PHOTOS - photos.length;
        if (slotsLeft <= 0) return;

        const toCompress = selectedFiles.slice(0, slotsLeft);

        const compressed = await Promise.all(
            toCompress.map(async (file) => {
                const base64 = await compressImage(file);
                return {
                    base64,
                    preview: `data:image/jpeg;base64,${base64}`
                };
            })
        );

        setPhotos(prev => [...prev, ...compressed]);
        e.target.value = null;
    };

    const removePhoto = (idx) => {
        setPhotos(curr => {
            const copy = curr.slice();
            copy.splice(idx, 1);
            return copy;
        });
    };

    const handleCreateAvatar = async () => {
        const photosB64 = photos.map(p => p.base64);

        sendData({
            action: "lora/create",
            data: {
                jwt: token,
                lora_name: avatarName,
                photos: photosB64
            }
        });

        setOpen(false);
        navigate('/settings');
    };

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                onClick={() => setOpen(true)}
            >
                {t('create_avatar')}
            </Button>

            <RightModal isOpen={open} onClose={() => setOpen(false)}>
                <Box p={2}>
                    <Typography variant="h6" mb={2}>{t('create_avatar')}</Typography>

                    <TextField
                        size="small"
                        fullWidth
                        label={t('avatar_name')}
                        value={avatarName}
                        onChange={e => setAvatarName(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <hr />

                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        {t('Upload photos')} ({photos.length}/{MAX_PHOTOS})
                        {
                            window?.Telegram?.WebApp?.platform === 'android' ? (
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFilesChange}
                                />
                            ) : (
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    multiple
                                    onChange={handleFilesChange}
                                />
                            )
                        }
                    </Button>

                    <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={1}
                        mb={2}
                        overflow="auto"
                    >
                        {photos.map((p, i) => (
                            <Box key={i} position="relative">
                                <img
                                    src={p.preview}
                                    alt="preview"
                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => removePhoto(i)}
                                    sx={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -4,
                                        bgcolor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>

                    <hr />

                    <p>Стоимость обучения: 99 <img src={starAnimation} width={15} /></p>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCreateAvatar}
                        disabled={!avatarName || photos.length === 0}
                        sx={{ background: "var(--button-color)", borderRadius: "12px", marginTop: "10px" }}
                    >
                        {t("create")}
                    </Button>
                </Box>
            </RightModal>
        </>
    );
}
