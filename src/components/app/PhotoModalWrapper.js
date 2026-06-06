import React from 'react';
import PhotoPostModal from "../modals/PhotoPostModal";
import { useAuth } from '../../app/providers/UserContext';

/**
 * Обертка для модального окна с фото
 */
const PhotoModalWrapper = ({ openedPhotoId, onClose }) => {
    const { userData } = useAuth();

    if (!openedPhotoId || openedPhotoId === 0) return null;

    return (
        <PhotoPostModal
            isModalOpen={true}
            setIsModalOpen={onClose}
            setOpenBackdropLoader={() => {}}
            profileGallery={true}
            nextPhoto={() => {}}
            prevPhoto={() => {}}
            userIdLoaded={userData?.id}
            selectedPhoto={openedPhotoId}
            setSelectedPhoto={onClose}
            from={"feed"}
        />
    );
};

export default PhotoModalWrapper;
