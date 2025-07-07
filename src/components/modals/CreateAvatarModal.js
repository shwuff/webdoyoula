import React, { useState } from 'react';
import RightModal from "../modal/RightModal";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

const MAX_PHOTOS = 15;

export default function CreateAvatarModal() {
    const [open, setOpen] = useState(false);
    const [avatarName, setAvatarName] = useState('');
    const [photos, setPhotos] = useState([]); // массив { file, preview }

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { sendData } = useWebSocket();
    const { token } = useAuth();

    const handleFilesChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        setPhotos(prev => {
            // сколько ещё можно добавить
            const slotsLeft = MAX_PHOTOS - prev.length;
            if (slotsLeft <= 0) return prev;

            // берем не больше чем осталось слотов
            const toAdd = selectedFiles.slice(0, slotsLeft).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));

            return [...prev, ...toAdd];
        });
        // чтобы можно было выбрать те же файлы повторно
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
        // конвертация в base64
        const toBase64 = (file) =>
            new Promise((res, rej) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // reader.result: data:<mime>;base64,<data>
                    const dataUrl = reader.result || "";
                    res(dataUrl.split(',')[1]);
                };
                reader.onerror = () => rej(reader.error);
                reader.readAsDataURL(file);
            });

        const photosB64 = await Promise.all(photos.map(p => toBase64(p.file)));

        sendData({
            action: "lora/create",
            data: {
                jwt: token,
                lora_name: avatarName,
                photos: photosB64
            }
        });

        setOpen(false);
        navigate('/profile');
    };

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{ mt: 1 }}
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

                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        {t('Upload photos')} ({photos.length}/{MAX_PHOTOS})
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            multiple
                            onChange={handleFilesChange}
                        />
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

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCreateAvatar}
                        disabled={!avatarName || photos.length === 0}
                        sx={{ background: "var(--button-color)", borderRadius: "12px" }}
                    >
                        {t("create")}
                    </Button>
                </Box>
            </RightModal>
        </>
    );
}
