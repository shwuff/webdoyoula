import React, {useEffect, useState} from "react";
import {
    Card,
    CardHeader,
    CardContent,
    FormControl,
    Select,
    MenuItem,
    Typography,
} from '@mui/material'
import {useAuth} from "../../../context/UserContext";
import {useWebSocket} from "../../../context/WebSocketContext";
import {useTranslation} from "react-i18next";
import CreateAvatarModal from "../../../components/modals/CreateAvatarModal";
import MyLorasList from "./MyLorasList";
import {useNavigate} from "react-router-dom";

const Content = () => {

    const { userData, token, setUserData, myLoras } = useAuth();
    const {t} = useTranslation();
    const { sendData } = useWebSocket();
    const navigate = useNavigate();

    const [uploadType, setUploadType] = useState(userData?.send_bot_media_type);

    useEffect(() => {
        if(uploadType !== userData?.send_bot_media_type) {
            sendData({action: "user/update/upload_settings", data: {jwt: token, send_bot_media_type: uploadType }});
            setUserData({
                ...userData,
                send_bot_media_type: uploadType
            });
        }
    }, [uploadType, token, sendData, setUserData, userData]);

    useEffect(() => {

        const handleClickBackButton = () => {
            navigate('/studio/create');
        }

        if(userData.is_telegram) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(handleClickBackButton);
        }

        return () => {
            window.Telegram.WebApp.BackButton.hide();
            window.Telegram.WebApp.BackButton.offClick(handleClickBackButton);
        }

    }, [userData, navigate]);

    return (
        <div className={"globalBlock"}>
            <div className={"center-content-block"}>
                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                    {t('content_settings')}
                </Typography>
                <Card
                    variant="outlined"
                    sx={{
                        mt: 2,
                        borderRadius: 2,
                        boxShadow: 1,
                        bgcolor: 'background.paper'
                    }}
                >
                    <CardHeader
                        title={t('uploading_to_bot')}
                        titleTypographyProps={{
                            variant: 'subtitle2',
                            sx: { fontSize: '0.875rem', fontWeight: 500 }
                        }}
                        sx={{ pb: 0 }}
                    />
                    <CardContent sx={{ pt: 1, pb: 2 }}>
                        <FormControl fullWidth variant="outlined" size="small">
                            <Select
                                labelId="upload-type-label"
                                id="upload-type-select"
                                // label={t('uploading_to_bot')}
                                value={uploadType}
                                onChange={e => setUploadType(e.target.value)}
                                sx={{
                                    fontSize: '0.875rem',
                                    py: 0.5
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            '& .MuiMenuItem-root': {
                                                fontSize: '0.875rem'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="file">{t('file')}</MenuItem>
                                <MenuItem value="media">{t('media')}</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>


                <hr />

                <CreateAvatarModal />

                <hr />

                <MyLorasList myLoras={myLoras} />
            </div>
        </div>
    );
};

export default Content;
