import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import config from "../config";
import { useDispatch, useSelector } from 'react-redux';
import {addImage, setCurrentImageSelected, updateImage} from '../redux/actions/imageActions';
import { decode as msgpackDecode } from "@msgpack/msgpack";

const WebSocketContext = createContext();

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const wsRef = useRef(null);
    const handlersRef = useRef({});
    const [isConnected, setIsConnected] = useState(false);

    const imagesSelector = useSelector((state) => state.image.images);
    const imagesSelectorRef = useRef(imagesSelector);

    useEffect(() => {
        imagesSelectorRef.current = imagesSelector;
    }, [imagesSelector]);

    const dispatch = useDispatch();

    useEffect(() => {

        const connectWebSocket = () => {
            const socket = new WebSocket(config.wsUrl);

            socket.onopen = () => {
                setIsConnected(true);
                console.log("[WS] < WebSocket connected");
            };

            socket.onmessage = async (event) => {
                try {
                    if (!(event.data instanceof Blob)) return;

                    const buffer = await event.data.arrayBuffer();
                    const dv     = new DataView(buffer);

                    const metaLength = dv.getUint32(0, true);

                    const metaBin  = new Uint8Array(buffer, 4, metaLength);
                    const metaData = msgpackDecode(metaBin);

                    let offset = 4 + metaLength;
                    const images = [];

                    if (metaData.action === "normal_quality_append") {
                        const { id, size } = metaData;
                        if (imagesSelectorRef.current.hasOwnProperty(id)) {
                            const imgSlice = buffer.slice(offset, offset + size);
                            const blob     = new Blob([imgSlice], { type: "image/webp" });
                            dispatch(updateImage(id, {
                                media_url: URL.createObjectURL(blob),
                            }));
                        }
                        return;
                    }

                    if (Array.isArray(metaData.media) && metaData.media.length) {
                        for (const photo of metaData.media) {
                            const { id, size, file_type } = photo;
                            const slice = buffer.slice(offset, offset + size);
                            const mime  = file_type === "video"
                                ? "video/mp4"
                                : "image/webp";
                            const blob  = new Blob([slice], { type: mime });

                            const imageData = {
                                ...photo,
                                media_url: URL.createObjectURL(blob),
                            };

                            console.log(imageData);

                            if (!imagesSelectorRef.current.hasOwnProperty(id)) {
                                dispatch(addImage(id, imageData));
                            }
                            dispatch(updateImage(id, imageData));
                            images.push(imageData);

                            offset += size;
                        }
                    }

                    const payload = { ...metaData, media: images };
                    const handler = handlersRef.current[metaData.action];
                    if (handler) handler(payload);
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
    }, [updateImage]);

    const generateUUID = () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };

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
            if(initData) {

                let promoUser = 0;

                if (window?.Telegram?.WebApp?.initDataUnsafe?.start_param !== undefined) {
                    const params = window?.Telegram?.WebApp?.initDataUnsafe?.start_param.split('AAA');
                    params.some(param => {
                        const match = param.match(/from(\w+)/);
                        if (match) {
                            promoUser = match[1];
                            return true;
                        }
                        return false;
                    });
                }

                sendData({ action: "oauth/telegram", data: { hash, initData, promoUser } });
            }
        }
    }, [isConnected]);

    return (
        <WebSocketContext.Provider value={{ addHandler, deleteHandler, sendData, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};
