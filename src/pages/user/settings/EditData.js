import React, { useState, useRef } from 'react';
import styles from './../css/EditData.module.css';
import RightModal from '../../../components/modal/WebAppModal';

const EditData = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [name, setName] = useState('Ваше имя');
    const [username, setUsername] = useState('username');
    const fileInputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ profileImage, name, username });
    };

    return (
        <>
        <button className={"btn btn-primary"} onClick={() => setIsOpen(true)}>Изменить</button>
            <RightModal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
            >
                <div className={styles.container}>
                    <h2 className={styles.header}>Редактировать профиль</h2>
                    <div className={styles.profileImageWrapper}>
                        <img 
                            src={profileImage || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className={styles.profileImage}
                            onClick={handleImageClick}
                        />
                        <button className={styles.changePhotoButton} onClick={handleImageClick}>
                            Изменить фото
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.label}>Имя и Фамилия</label>
                        <input
                            type="text"
                            placeholder="Ваше имя и фамилия"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            placeholder="username"
                            className={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <button type="submit" className={styles.saveButton}>
                            Сохранить изменения
                        </button>
                    </form>
                </div>
            </RightModal>
        </>
    );
};

export default EditData;