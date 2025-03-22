import React, { useEffect, useState } from "react";
import { Button, IconButton, Dialog, DialogActions, DialogContent, Grid, Paper } from "@mui/material";
import { Delete, ZoomIn } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";

const TrainAvatarProcess = ({ model }) => {
    const [photos, setPhotos] = useState([]);       // Массив объектов: храним и загруженные с сервера, и новые
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [requestId, setRequestId] = useState("");

    const { sendData, addHandler, deleteHandler, isConnected } = useWebSocket();
    const { token } = useAuth();

    // Для генерации requestId (если нужно)
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    // --- [1] ПОЛУЧЕНИЕ УЖЕ ЗАГРУЖЕННЫХ ИЗОБРАЖЕНИЙ ---
    useEffect(() => {
        if (!isConnected || !model?.id) return;

        const tempRequestId = generateUUID();
        setRequestId(tempRequestId);

        sendData({
            action: "get_images_for_training",
            data: {
                jwt: token,
                modelId: model.id,
                requestId: tempRequestId
            }
        });
    }, [isConnected, token, model]);

    useEffect(() => {

        const handleGetEducationImages = (msg) => {
            if (!msg.media || !msg.files) return;

            const newPhotos = msg.media.map((imageObj, index) => {
                return {
                    id: imageObj.id,
                    previewUrl: imageObj.blob_url,
                };
            });

            setPhotos((prev) => [...newPhotos]);
        };

        addHandler("receive_images_for_training", handleGetEducationImages);
        return () => deleteHandler("receive_images_for_training");
    }, [addHandler, deleteHandler, requestId]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            const newPhotoEntries = acceptedFiles.map((file) => ({
                id: file.id,
                file,
                isFromServer: false,
                previewUrl: URL.createObjectURL(file)
            }));

            setPhotos((prev) => [...prev, ...newPhotoEntries]);

            acceptedFiles.forEach((file) => {
                sendData({
                    action: "upload_image_for_training",
                    data: {
                        jwt: token,
                        modelId: model.id
                    }
                }, [file]);
            });
        },
        accept: "image/*"
    });

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newPhotoEntries = files.map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            isFromServer: false,
            previewUrl: URL.createObjectURL(file)
        }));

        setPhotos((prev) => [...prev, ...newPhotoEntries]);

        files.forEach((file) => {
            sendData({
                action: "upload_image_for_training",
                data: {
                    jwt: token,
                    modelId: model.id
                }
            }, [file]);
        });
    };

    useEffect(() => {
        const handleTrainModelUploadResult = (msg) => {
            if (!msg.data || !msg.data.files) return;

            msg.data.files.forEach((serverFile) => {
                setPhotos((prev) =>
                    prev.map((p) => {
                        if (!p.isFromServer && p.file && p.file.name === serverFile.originalName) {
                            return {
                                ...p,
                                isFromServer: true,
                                serverId: serverFile.id, // id из базы
                            };
                        }
                        return p;
                    })
                );
            });
        };

        addHandler("train_model_upload_result", handleTrainModelUploadResult);
        return () => deleteHandler("train_model_upload_result");
    }, [addHandler, deleteHandler]);

    const handleDeletePhoto = (index) => {
        const photo = photos[index];

        const serverImageId = photo.serverId || photo.id;
        if (serverImageId) {
            sendData({
                action: "delete_image_for_training",
                data: {
                    jwt: token,
                    imageId: serverImageId
                }
            });
        }

        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const handleTrainModelUploadResult = (msg) => {

            const tempRequestId = generateUUID();
            setRequestId(tempRequestId);

            sendData({
                action: "get_images_for_training",
                data: {
                    jwt: token,
                    modelId: model.id,
                    requestId: tempRequestId
                }
            });
        };

        addHandler("train_model_upload_result", handleTrainModelUploadResult);
        return () => deleteHandler("train_model_upload_result");
    }, [addHandler, deleteHandler]);

    useEffect(() => {
        const handleDeleteImageResult = (msg) => {

        };

        addHandler("delete_image_for_training_result", handleDeleteImageResult);
        return () => deleteHandler("delete_image_for_training_result");
    }, [addHandler, deleteHandler]);

    const handleOpenDialog = (photo) => {
        setSelectedPhoto(photo);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedPhoto(null);
    };

    useEffect(() => {
        return () => {
            photos.forEach((photo) => {
                if (photo.previewUrl) {
                    URL.revokeObjectURL(photo.previewUrl);
                }
            });
        };
    }, [photos]);

    return (
        <div className="w-100">
            <p style={{marginTop: 5}}>
                Модель <b>{model.name}</b> не обучена! Загрузите 10 фотографий для обучения модели.
            </p>

            <Paper
                {...getRootProps()}
                style={{
                    border: "2px dashed #2196F3",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    marginTop: "10px"
                }}
                className={"d-block-xl"}
            >
                <input {...getInputProps()} />
                <p>Перетащите сюда изображения или нажмите, чтобы загрузить фотографии</p>
            </Paper>

            <input
                type="file"
                accept="image/*"
                multiple
                id="fileUpload"
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />
            <button
                className={"d-block-sm w-100 btn btn-primary"}
                style={{ marginTop: 7 }}
                onClick={() => document.getElementById("fileUpload").click()}
            >
                Загрузить фотографии
            </button>

            <Grid container spacing={2}>
                {photos.map((photo, index) => (
                    <Grid item xs={4} key={photo.id || index}>
                        <div style={{ position: "relative", borderRadius: "8px" }}>
                            <img
                                src={photo.previewUrl}
                                alt={`Uploaded ${index}`}
                                style={{
                                    width: "100%",
                                    aspectRatio: "4/5",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <IconButton
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    background: "white",
                                    borderRadius: "50%",
                                }}
                                onClick={() => handleDeletePhoto(index)}
                            >
                                <Delete color="error" />
                            </IconButton>
                            <IconButton
                                style={{
                                    position: "absolute",
                                    bottom: "8px",
                                    right: "8px",
                                    background: "white",
                                    borderRadius: "50%",
                                }}
                                onClick={() => handleOpenDialog(photo)}
                            >
                                <ZoomIn color="primary" />
                            </IconButton>
                        </div>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth style={{maxWidth: 600, margin: "auto"}}>
                <DialogContent>
                    {selectedPhoto && (
                        <img
                            src={selectedPhoto.previewUrl}
                            alt="Selected"
                            style={{ width: "100%", height: "auto" }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TrainAvatarProcess;
