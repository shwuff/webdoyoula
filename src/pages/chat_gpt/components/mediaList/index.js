import React, { useState } from 'react';
import "./index.css";
import LucideIcon from "../../../../assets/icons/LucideIcon";
import {useChatControl} from "../../hooks/useChatControl";

const MediaGallery = ({ mediaList }) => {
    const [fullscreenImage, setFullscreenImage] = useState(null);

    const {deleteUploadedMedia} = useChatControl();

    const handleImageClick = (media) => {
        setFullscreenImage(media);
    };

    const handleCloseFullscreen = () => {
        setFullscreenImage(null);
    };

    if(mediaList.length < 1) {
        return null;
    }

    return (
        <>
            <div className="media-gallery">
                <div className="media-list">
                    {mediaList.map((media) => (
                        <div key={media.temp_uuid || media.url} className="media-item">
                            <div className="media-image-container">
                                <img
                                    src={media.url}
                                    alt={media.filename || 'Uploaded media'}
                                    className="media-image"
                                    onClick={() => handleImageClick(media)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/150?text=Error';
                                    }}
                                />

                                <span
                                    className="delete-btn"
                                    onClick={() => {
                                        deleteUploadedMedia(media.url, media.temp_uuid);
                                    }}
                                    aria-label="Delete"
                                >
                                    <LucideIcon name={"X"} size={16} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {fullscreenImage && (
                <div className="fullscreen-modal" onClick={handleCloseFullscreen}>
                    <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
                        <span
                            className="close-fullscreen-btn"
                            onClick={handleCloseFullscreen}
                        >
                            <LucideIcon name={"X"} />
                        </span>
                        <img
                            src={fullscreenImage.url}
                            alt={fullscreenImage.filename || 'Fullscreen view'}
                            className="fullscreen-image"
                            onClick={handleCloseFullscreen}
                        />
                        {fullscreenImage.filename && (
                            <div className="fullscreen-filename">
                                {fullscreenImage.filename}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MediaGallery;