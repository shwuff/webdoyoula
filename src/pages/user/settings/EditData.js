import React, { useState, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import RightModal from '../../../components/modal/RightModal';
import { useAuth } from "./../../../context/UserContext";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Cropper from 'react-easy-crop';
import getCroppedImg from './../../../utils/cropImage';
import {useWebSocket} from "../../../context/WebSocketContext";
import {useTranslation} from "react-i18next";

const EditData = () => {
    const { userData, token } = useAuth();
    const { sendData, addHandler, deleteHandler } = useWebSocket();

    const {t} = useTranslation();

    const [profileImage, setProfileImage] = useState(userData.photo_url);
    const [name, setName] = useState(userData.first_name);
    const [surname, setSurname] = useState(userData.last_name);
    const [username, setUsername] = useState(userData.username);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef(null);

    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
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
        console.log({ profileImage, name, username });

        sendData({
            action: "update_personal_data",
            data: {
                jwt: token,
                username,
                first_name: name,
                last_name: surname
            }
        })

      };

  return (
    <>
        <Button
            variant="contained"
            onClick={() => setIsOpen(true)}
            sx={{ bgcolor: 'var(--button-color)', fontSize: '8px', width: "100%", borderRadius: '8px', px: 3 }}
        >
            {t('edit_profile')}
        </Button>

      <RightModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >

          <RightModal isOpen={openCropModal} onClose={() => setOpenCropModal(false)}>
              <Box sx={{ position: 'relative', height: 300, width: '100%' }}>
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

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
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

        <Box sx={{ width: '100%', p: 2, textAlign: 'center' }}>
        

          <Box sx={{ position: 'relative', mb: 2 }}>

            <Box
              sx={{
                position: 'relative',
                display: 'inline-block',
                width: 100,
                height: 100,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#000',
              }}
            >
              <Avatar
                src={profileImage}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(50%)', 
                }}
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
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(1.2)', 
                  }
                  
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <PhotoCamera fontSize="large" style = {{fill: "#fff"}} />
                <AddCircleIcon sx={{ position: 'absolute', bottom: 3, right: -2, fontSize: '20px', fill: '#fff' }} />
              </IconButton>
            </Box>
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
              placeholder={t('name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
              
            />

            <TextField
              size="small"
              fullWidth
              label={t('lastname')}
              placeholder={t('lastname')}
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              sx={{ mb: 2 }}
              
            />

            <TextField
              size="small"
              fullWidth
              label={t('username')}
              placeholder={t('username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: '#2196F3', fontSize: '14px', borderRadius: '8px' }}
            >
                {t('save')}
            </Button>
          </form>
        </Box>
      </RightModal>
    </>
  );
};

export default EditData;
