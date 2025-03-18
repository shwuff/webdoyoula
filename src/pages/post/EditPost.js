import React, { useState, useEffect, useRef } from 'react';
import styles from './css/EditPost.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Modal from 'react-modal';
import { motion, AnimatePresence } from "framer-motion";
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import DragImages from "../../components/drag/DragImages";

Modal.setAppElement('#app');

const EditPost = () => {
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState([]);
    const [postData, setPostData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    const { postId } = useParams();
    const { token } = useAuth();
    const { sendData, addHandler, deleteHandler } = useWebSocket();

    useEffect(() => {
        if (token !== null && postData.length < 1) {
            sendData({ action: "get_all_post_data", data: { jwt: token, postId } });
        }
    }, [token, postData]);

    useEffect(() => {
        if (caption) {
            sendData({ action: "update_post_caption", data: { jwt: token, postId, caption } });
        }
    }, [token, caption]);

    useEffect(() => {
        const handleGetPostData = (msg) => {
            setPostData(msg.post);
            setCaption(msg.post.caption)
            setImages((prev) => {
                const newPhotos = msg.photos.filter(photo => !prev.some(existingPhoto => existingPhoto.id === photo.id));

                const updatedImages = [...prev, ...newPhotos];
                updatedImages.sort((a, b) => a.order_index - b.order_index);

                return updatedImages;
            });
        };

        addHandler('receive_all_post_data', handleGetPostData);

        return () => deleteHandler('receive_all_post_data');
    }, [])

    useEffect(() => {
        const handleAddImagesToPost = (msg) => {
            setImages((prev) => {
                const newPhotos = msg.photos.filter(photo => !prev.some(existingPhoto => existingPhoto.id === photo.id));

                const updatedImages = [...prev, ...newPhotos];
                updatedImages.sort((a, b) => a.order_index - b.order_index);

                return updatedImages;
            });
            setIsModalOpen(false);

        };

        addHandler('new_photo_to_post_blank', handleAddImagesToPost);

        return () => deleteHandler('new_photo_to_post_blank');
    }, []);

    const [photosPage, setPhotosPage] = useState(1);

    const isFetchingRef = useRef(false);
    const lastPageRef = useRef(1);
    const scrollTimeoutRef = useRef(null);

    const resetLastPageRef = () => {
        lastPageRef.current = 1;
    }; // Функция сброса последней страницы

    const resetFetchingRef = () => {
        isFetchingRef.current = false;
    }; // Функция сброса состояния загрузки

    const handleScroll = (e) => {

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            const bottom = e.target.scrollHeight < e.target.scrollTop + e.target.clientHeight + 600;
            if (bottom && !isFetchingRef.current) {
                const nextPage = lastPageRef.current + 1;
                isFetchingRef.current = true;
                lastPageRef.current = nextPage;
                setPhotosPage(nextPage);
            }
        }, 100);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        sendData({
            action: "update_post_status",
            data: { jwt: token, postId, status: "posted" }
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination || destination.index === source.index) return;

        const reorderedImages = [...images];
        const [movedImage] = reorderedImages.splice(source.index, 1);
        reorderedImages.splice(destination.index, 0, movedImage);

        setImages(reorderedImages);

        sendData({
            action: "update_order_images_post",
            data: { jwt: token, postId, images: reorderedImages }
        });
    };


    return (
        <div className="container">
            <div className="center-content-block">
                <h2 className={'pageTitle'}>Редактирование поста</h2>

                <div className={styles.editBlock}>
                    <label className={styles.label}>Подпись к посту</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Напишите что-нибудь интересное..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </div>

                <div className={styles.editBlock}>
                    <label className={`${styles.label} d-flex align-items-center`}>Фотографии
                        <FaPlus onClick={openModal} className={styles.iconRight} />
                    </label>

                    <DragImages images={images} deleteImageWithConfirm={() => {}} handleDragEnd={onDragEnd} />

                </div>

                <button className={styles.saveButton} onClick={handleSave}>
                    Опубликовать
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Выбор фото"
                className={'modalContent'}
                overlayClassName={'modalOverlay'}
            >
                <button onClick={closeModal} className={'btn btn-primary'}>Закрыть</button>
                <MyGeneratedPhotosList
                    resetLastPageRef={resetLastPageRef}
                    resetFetchingRef={resetFetchingRef}
                    photosPage={photosPage}
                    setPhotosPage={setPhotosPage}
                    from={'editPost'}
                    postId={postId}
                />
            </Modal>
        </div>
    );
};

export default EditPost;
