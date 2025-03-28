import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import config from "../config";
import { useDispatch, useSelector } from 'react-redux';
import {addImage, setCurrentImageSelected, updateImage} from '../redux/actions/imageActions';

const WebSocketContext = createContext();

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const wsRef = useRef(null);
    const handlersRef = useRef({});
    const [isConnected, setIsConnected] = useState(false);

    const dispatch = useDispatch();
    const imagesSelector = useSelector((state) => state.image.images);

    useEffect(() => {
        const connectWebSocket = () => {
            const socket = new WebSocket(config.wsUrl);

            socket.onopen = () => {
                setIsConnected(true);
                console.log("[WS] < WebSocket connected");
            };

            socket.onmessage = async (event) => {
                try {
                    if (!(event.data instanceof Blob)) {
                        return;
                    }

                    const arrayBuffer = await event.data.arrayBuffer();
                    const dataView = new DataView(arrayBuffer);

                    const jsonLength = dataView.getUint32(0, true);

                    const jsonBuffer = new Uint8Array(arrayBuffer, 4, jsonLength);
                    const jsonString = new TextDecoder().decode(jsonBuffer);
                    const metaData = JSON.parse(jsonString);

                    let images = [];
                    let offset = 4 + jsonLength;

                    if (metaData.media && metaData.media.length > 0) {
                        for (let photo of metaData.media) {

                            const blob = new Blob([new Uint8Array(arrayBuffer, offset, photo.size)], { type: photo.fileType === 'video/mp4' ? "video/mp4" : "image/webp" });

                            const imageData = {
                                id: photo.id,
                                status: photo.status,
                                hided: photo.hided,
                                liked: photo.liked,
                                likes_count: photo.likes_count,
                                comments_count: photo.comments_count,
                                fileType: photo.fileType,
                                model_id: photo.model_id,
                                posted_at: photo.posted_at,
                                order_index: photo.order_index,
                                media_generated_group_id: photo.media_generated_group_id,
                                media_group_id: photo.media_group_id,
                                blob_url: URL.createObjectURL(blob),
                                author: photo.author,
                                prompt_id: photo.prompt_id,
                                count_views: photo.count_views,
                                count_generated_with_prompt: photo.count_generated_with_prompt,
                                size: photo.size,
                                low: photo.low
                            };

                            offset += photo.size;

                            if(metaData.action === 'generated_photos_append' && !(photo.id in imagesSelector)) {
                                dispatch(addImage(photo.id, imageData));
                            }

                            if(metaData.action === 'photo_modal_studio') {
                                dispatch(updateImage(photo.id, imageData));
                            }

                            images.push(imageData);
                        }
                    }

                    const payload = {
                        ...metaData,
                        media: images.length > 0 ? images : []
                    };

                    if (handlersRef.current[metaData.action]) {
                        handlersRef.current[metaData.action]?.(payload);
                    }
                } catch (error) {
                    console.error("❌ Error message:", error);
                }
            };


            socket.onerror = (error) => {
                console.error('[WS] < WebSocket Error:', error);
            };

            socket.onclose = (event) => {
                console.log('[WS] < WebSocket closed');
                setIsConnected(false);
                if (!event.wasClean) {
                    console.log('[WS] < Attempting to reconnect...');
                    setTimeout(connectWebSocket, 1000);
                }
            };

            wsRef.current = socket;
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [dispatch]);

    const addHandler = (action, handler) => {
        handlersRef.current[action] = handler;
    };

    const deleteHandler = (action) => {
        delete handlersRef.current[action];
    };

    const sendData = useCallback(async (data, files = []) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('[WS] WebSocket is not open, unable to send data');
            return;
        }

        if (data.action === 'get_photo') {
            const photoId = data.data?.photoId;

            if (photoId in imagesSelector) {
                const image = imagesSelector[photoId];

                if (handlersRef.current['photo_modal_studio']) {
                    if (image.low === false) {
                        handlersRef.current['photo_modal_studio']({
                            media: [image]
                        });
                        return;
                    } else {
                        handlersRef.current['photo_modal_studio']({
                            media: [image]
                        });
                    }
                }
            }
        }

        try {
            const fileMetas = [];
            const fileBuffers = [];

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                fileMetas.push({
                    name: file.name,
                    type: file.type,
                    size: arrayBuffer.byteLength,
                });
                fileBuffers.push(new Uint8Array(arrayBuffer));
            }

            data.files = fileMetas;

            const jsonString = JSON.stringify(data);
            const jsonBuffer = new TextEncoder().encode(jsonString);

            const totalLength = 4 + jsonBuffer.length + fileBuffers.reduce((acc, b) => acc + b.length, 0);
            const finalBuffer = new Uint8Array(totalLength);

            new DataView(finalBuffer.buffer).setUint32(0, jsonBuffer.length, true);

            finalBuffer.set(jsonBuffer, 4);

            let offset = 4 + jsonBuffer.length;
            for (const fb of fileBuffers) {
                finalBuffer.set(fb, offset);
                offset += fb.length;
            }

            wsRef.current.send(finalBuffer);

        } catch (error) {
            console.error('[WS] ❌ Error with send binary message:', error);
        }
    }, [dispatch, imagesSelector]);

    useEffect(() => {
        if (isConnected) {
            let tg = window?.Telegram?.WebApp;
            const hash = tg?.initDataUnsafe?.hash;
            const initData = tg?.initData;
            sendData({ action: "authorization", data: { hash, initData } });
        }
    }, [isConnected, sendData]);

    return (
        <WebSocketContext.Provider value={{ addHandler, deleteHandler, sendData, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};
