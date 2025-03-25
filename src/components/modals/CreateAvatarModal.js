import React, {useState} from 'react';
import RightModal from "../modal/RightModal";
import {Box, Button, TextField} from "@mui/material";
import {useWebSocket} from "../../context/WebSocketContext";
import {useAuth} from "../../context/UserContext";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const CreateAvatarModal = () => {

    const [open, setOpen] = useState(false);
    const [avatarName, setAvatarName] = useState('');

    const {t} = useTranslation();
    const navigate = useNavigate();

    const { sendData } = useWebSocket();
    const { token } = useAuth();

    const handleCreateAvatar = () => {
        sendData({
            action: "create_new_avatar",
            data: {
                jwt: token,
                avatarName: avatarName
            }
        })
    }

    return (
        <div>
            <button className={"btn btn-primary"} style={{marginTop: 4}} onClick={() => setOpen(true)}>
                {t('create_avatar')}
            </button>
            <RightModal
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <Box p={1}>
                    <TextField
                        size="small"
                        fullWidth
                        label={t('avatar_name')}
                        value={avatarName}
                        onChange={(e) => setAvatarName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button onClick={handleCreateAvatar} variant={"contained"} sx={{background: "var(--button-color)", borderRadius: "12px"}} fullWidth={true}>
                        {t("create")}
                    </Button>
                </Box>
            </RightModal>
        </div>
    );
};

export default CreateAvatarModal;