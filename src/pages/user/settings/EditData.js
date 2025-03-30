import React, {useState, useRef, useEffect} from 'react';
import {
    Avatar,
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
} from '@mui/material';
import {PhotoCamera} from '@mui/icons-material';
import RightModal from '../../../components/modal/RightModal';
import {useAuth} from "../../../context/UserContext";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Cropper from 'react-easy-crop';
import getCroppedImg from './../../../utils/cropImage';
import {useWebSocket} from "../../../context/WebSocketContext";
import {useTranslation} from "react-i18next";
import ColorCircle from "../../../components/input/ColorCircle";
import styles from "../css/Profile.module.css";

import TelegramStar from './../../../assets/icons/profileIcons/telegram-star.png';
import zzzIcon from './../../../assets/icons/profileIcons/zzz.png';
import palmIcon from './../../../assets/icons/profileIcons/palm.png';
import hiIcon from './../../../assets/icons/profileIcons/hi.png';

const EditData = () => {
    const {userData, token} = useAuth();
    const { isConnected, sendData, addHandler, deleteHandler } = useWebSocket();

    const {t} = useTranslation();

    const [profileImage, setProfileImage] = useState(userData.photo_url);
    const [name, setName] = useState(userData.first_name);
    const [surname, setSurname] = useState(userData.last_name);
    const [username, setUsername] = useState(userData.username);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef(null);

    const [availableSettings, setAvailableSettings] = useState([]);

    const [selectedProfileColor, setSelectedProfileColor] = useState(userData.profile_color);
    const [selectedMiniIconProfile, seselectedMiniIconProfile] = useState(userData.mini_icon_name);

    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [openCropModal, setOpenCropModal] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCropImageSrc(reader.result);
                setOpenCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadNewPic = (base64) => {
        sendData({
            action: "handle_update_user_pic",
            data: {
                jwt: token,
                image: base64
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        sendData({
            action: "update_personal_data",
            data: {
                jwt: token,
                username,
                first_name: name,
                last_name: surname,
                selectedProfileColor: selectedProfileColor.id,
                selectedMiniIconProfile
            }
        });

        setIsOpen(false);

    };

    useEffect(() => {
        if(isConnected && token) {

            sendData({
                action: "get_available_settings",
                data: {
                    jwt: token
                }
            })

        }
    }, [token, isConnected, sendData]);

    useEffect(() => {

        const receiveAvailableSettings = (msg) => {
            setAvailableSettings(msg.settings);
        }

        addHandler('receive_available_settings', receiveAvailableSettings);

        return () => deleteHandler('receive_available_settings');

    }, [addHandler, deleteHandler, setAvailableSettings]);

    if(!selectedProfileColor) {
        return (<></>);
    }

    const starCoordinates = [
        { x: -40, y: 40, opacity: 0.9, size: 25 }, // 1
        { x: -10, y: -5, opacity: 1, size: 30 }, // 2
        { x: 50, y: -40, opacity: 0.9, size: 25 }, // 3
        { x: 100, y: -5, opacity: 1, size: 30 }, // 4
        { x: 140, y: 40, opacity: 0.9, size: 25 }, // 5
        { x: 100, y: 80, opacity: 1, size: 30 }, // 6
        { x: 50, y: 115, opacity: 0.9, size: 25 }, // 7
        { x: -10, y: 80, opacity: 0.9, size: 30 }, // 8
        { x: -80, y: 40, opacity: 0.4, size: 20 }, // 1
        { x: -50, y: -5, opacity: 0.5, size: 23 }, // 2
        { x: 10, y: -30, opacity: 0.5, size: 23 }, // 3
        { x: 90, y: -30, opacity: 0.5, size: 23 }, // 4
        { x: 150, y: -5, opacity: 0.5, size: 23 }, // 5
        { x: 180, y: 40, opacity: 0.5, size: 23 }, // 6
        { x: 150, y: 80, opacity: 0.5, size: 23 }, // 7
        { x: 90, y: 115, opacity: 0.5, size: 23 }, // 8
        { x: 10, y: 115, opacity: 0.5, size: 23 }, // 9
        { x: -50, y: 80, opacity: 0.5, size: 23 }, // 10
    ];

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setIsOpen(true)}
                sx={{bgcolor: 'var(--button-color)', fontSize: '8px', width: "100%", borderRadius: '8px', px: 3}}
            >
                {t('edit_profile')}
            </Button>

            <RightModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >

                <RightModal isOpen={openCropModal} onClose={() => setOpenCropModal(false)}>
                    <Box sx={{position: 'relative', height: 300, width: '100%'}}>
                        <Cropper
                            image={cropImageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                        />
                    </Box>

                    <Box sx={{mt: 2, display: 'flex', justifyContent: 'center', gap: 2}}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenCropModal(false)}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                const base64 = await getCroppedImg(cropImageSrc, croppedAreaPixels);
                                setProfileImage(base64);
                                setOpenCropModal(false);
                                handleUploadNewPic(base64)
                            }}
                        >
                            {t('save')}
                        </Button>
                    </Box>
                </RightModal>

                <div className={styles.profileBackgroundBlock} style={{marginBottom: "10px", borderBottomRightRadius: "0", background: selectedProfileColor.second_color_full}}>
                    <div className={styles.profileAvatarWrapper}>
                        <div
                            className={styles.miniProfileIconWrapper}
                        >
                            <img
                                src={profileImage}
                                alt={name}
                                className={styles.profileAvatar}
                                style={{ boxShadow: `0px 0px 200px 20px ${selectedProfileColor.first_color}`, filter: "brightness(90%)" }}
                            />

                            <IconButton
                                color="primary"
                                component="span"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fill: "#fff",
                                    transition: "0.25s all",
                                    zIndex: 200,
                                    '&:hover': {
                                        transform: 'translate(-50%, -50%) scale(1.2)',
                                    }

                                }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <PhotoCamera fontSize="large" style={{fill: "#fff"}}/>
                                <AddCircleIcon
                                    sx={{position: 'absolute', bottom: 3, right: -2, fontSize: '20px', fill: '#fff'}}/>
                            </IconButton>
                            <div className={styles.starWrapper}>
                                {[...Array(18)].map((_, index) => (
                                    <img
                                        key={index}
                                        src={selectedMiniIconProfile === 'star' ? TelegramStar : selectedMiniIconProfile === 'zzz' ? zzzIcon : selectedMiniIconProfile === 'hi' ? hiIcon : selectedMiniIconProfile === 'palm' ? palmIcon : TelegramStar}
                                        className={styles.miniProfileIcon}
                                        style={{
                                            left: `${starCoordinates[index].x}px`,
                                            top: `${starCoordinates[index].y}px`,
                                            opacity: starCoordinates[index].opacity,
                                            width: `${starCoordinates[index].size}px`,
                                            height: `${starCoordinates[index].size}px`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.profileUserInfo}>
                        <h2 style={{ color: "white", zIndex: 5 }} className={styles.profileName}>{name} {surname}</h2>
                        {
                            username && username.length > 0 && (
                                <p className={styles.profileUsername} style={{ color: "white", zIndex: 5 }}>@{username}</p>
                            )
                        }
                    </div>
                </div>

                <Box sx={{width: '100%', p: 2, textAlign: 'center'}}>

                    <Box sx={{position: 'relative', mb: 2}}>


                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            size="small"
                            fullWidth
                            label={t('name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{mb: 2}}

                        />

                        <TextField
                            size="small"
                            fullWidth
                            label={t('lastname')}
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            sx={{mb: 2}}

                        />

                        <TextField
                            size="small"
                            fullWidth
                            label={t('username')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{mb: 3}}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{bgcolor: '#2196F3', fontSize: '14px', borderRadius: '8px'}}
                        >
                            {t('save')}
                        </Button>
                    </form>
                </Box>

                <Box sx={{width: '100%', p: 2}}>
                    {
                        availableSettings.profileBackgrounds && availableSettings.profileBackgrounds.length > 0 && (
                            <div className={"w-100 d-flex"} style={{ gap: "12px" }}>
                                {
                                    availableSettings.profileBackgrounds.map(color => (
                                        <ColorCircle key={color.id} selectedColor={selectedProfileColor} setSelectedColor={setSelectedProfileColor} color={color} />
                                    ))
                                }
                            </div>
                        )
                    }
                    <div className="w-100 d-flex" style={{marginTop: 20, gap: "10px"}}>
                        <div className={"c-pointer"} style={selectedMiniIconProfile === 'star' ? { border: "1px solid var(--primary-color)", background: "rgb(0,0,0,.2", borderRadius: 12} : {background: "rgb(0,0,0,.2", borderRadius: 12, border: "1px solid var(--bg-color)"}} onClick={() => seselectedMiniIconProfile('star')}>
                            <img src={TelegramStar} style={{width: 32}} />
                        </div>
                        <div className={"c-pointer"} style={selectedMiniIconProfile === 'hi' ? { border: "1px solid var(--primary-color)", borderRadius: 12} : {borderRadius: 12, border: "1px solid var(--bg-color)"} } onClick={() => seselectedMiniIconProfile('hi')}>
                            <img src={hiIcon} style={{width: 32}} />
                        </div>
                        <div className={"c-pointer"} style={selectedMiniIconProfile === 'palm' ? { border: "1px solid var(--primary-color)", borderRadius: 12} : {borderRadius: 12, border: "1px solid var(--bg-color)"} } onClick={() => seselectedMiniIconProfile('palm')}>
                            <img src={palmIcon} style={{width: 32}} />
                        </div>
                        <div className={"c-pointer"} style={selectedMiniIconProfile === 'zzz' ? { border: "1px solid var(--primary-color)", borderRadius: 12} : {borderRadius: 12, border: "1px solid var(--bg-color)"} } onClick={() => seselectedMiniIconProfile('zzz')}>
                            <img src={zzzIcon} style={{width: 32}} />
                        </div>
                    </div>
                </Box>
            </RightModal>
        </>
    );
};

export default EditData;
