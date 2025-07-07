import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/UserContext";

const Image = ({ mediaId, className }) => {
    const { token } = useAuth();
    const [src, setSrc] = useState(null);
    const [error, setError] = useState(null);

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

    if (error) {
        return <div className="text-red-500">Ошибка загрузки: {error}</div>;
    }

    if (!src) {
        return <div></div>;
    }

    return <img src={src} className={className} alt={`media ${mediaId}`} />;
};

export default Image;
