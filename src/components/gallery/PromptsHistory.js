import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Skeleton, Button
} from '@mui/material';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import Image from "./Image";
import {useNavigate} from "react-router-dom";

const PromptsHistory = ({ resetLastPageRef, resetFetchingRef, page, setPage }) => {
    const { sendData, isConnected, addHandler, deleteHandler } = useWebSocket();
    const { token } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isConnected || !token) return;
        sendData({
            action: "v2/get/prompts/all",
            data: { jwt: token, offset: page }
        });
    }, [isConnected, token, page, sendData]);

    useEffect(() => {
        const handleReceive = (msg) => {
            const newPrompts = msg.prompts || []

            setPrompts(prev => {
                const existingIds = new Set(prev.map(p => p.prompt_id))
                const toAdd = newPrompts.filter(p => !existingIds.has(p.prompt_id))
                return [...prev, ...toAdd]
            })
            setLoading(false);
            resetFetchingRef();
        };

        addHandler('receive_prompts_history', handleReceive);
        return () => deleteHandler('receive_prompts_history', handleReceive);
    }, [addHandler, deleteHandler, resetLastPageRef, resetFetchingRef]);

    return (
        <Box p={2}>
            {loading
                ?
                Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="rectangular"
                        width="100%"
                        height={100}
                        sx={{ mb: 2, borderRadius: 1 }}
                    />
                ))
                :
                prompts.map((p) => (
                    <Card
                        key={p.prompt_id}
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            width: '100%',
                            mb: 2,
                            boxShadow: 1
                        }}
                    >
                        <div>
                            <Image mediaId={p.media.id} alt={"Media"} style={{ maxWidth: "100px", height: "auto"}} />
                        </div>
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: "var(--primary-color)", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate('/studio/repeat/' + p.prompt_id)} gutterBottom noWrap>
                                {p.prompt_id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('repeats')}: {p.repeats}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('Price per repeat')}: {p.repeat_price}
                            </Typography>
                            <div style={{ marginTop: "5px" }}>
                                <Button variant={"contained"} size={"small"} onClick={() => navigate(`/studio/create/${p.slug}?promptId=${p.prompt_id}`)}>
                                    {t('Edit prompt')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </Box>
    );
};

export default PromptsHistory;
