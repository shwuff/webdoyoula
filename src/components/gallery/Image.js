import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/UserContext";
import Video from "../player/Video";
import LoadingPlaceholder from "../loading/LoadingPlaceholer";
import {useSelector} from "react-redux";
import AudioWave from "./AudioWave";

const Image = ({ mediaId, className, style, file_type = 'image' }) => {
    const { token } = useAuth();
    const [src, setSrc] = useState(null);
    const [error, setError] = useState(null);

    const imageSelector = useSelector(state => state.image.images);

    useEffect(() => {
        if (!mediaId || !token) return;

        const fetchImage = async () => {
            try {
                const authHeader = token.includes('.')
                    ? `Bearer ${token}`
                    : `Session ${token}`;

                const res = await fetch(`https://testapi.doyoula.com/api/get/file/${mediaId}`, {
                    headers: {
                        'Authorization': authHeader,
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setSrc(url);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchImage();

        // cleanup URL object when unmounting or mediaId changes
        return () => {
            if (src) URL.revokeObjectURL(src);
        };
    }, [mediaId, token]);

    if(file_type === 'image') {
        return <img src={imageSelector[mediaId].media_url} style={style} className={className} alt={`media ${mediaId}`} />;
    }

    if(file_type === 'audio') {
        return <AudioWave audioUrl={src} />
    }

    if(file_type === 'video') {
        return <Video style={style} className={className} videoUrl={src} />
    }
};

export default Image;
