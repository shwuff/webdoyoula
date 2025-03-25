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

const EditData = () => {
  const {userData} = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(userData.first_name);
  const [surname, setSurname] = useState(userData.last_name);
  const [username, setUsername] = useState(userData.username);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  console.log(userData)

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ profileImage, name, username });
  };

  return (
    <>
        <Button
            variant="contained"
            onClick={() => setIsOpen(true)}
            sx={{ bgcolor: 'var(--button-color)', fontSize: '12px', borderRadius: '8px', px: 3 }}
        >
            Редактировать профиль
        </Button>

      <RightModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box sx={{ width: '100%', p: 2, textAlign: 'center' }}>
        

          <Box sx={{ position: 'relative', mb: 2 }}>
          
            {/* Контейнер для аватара с затемнением */}
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
                src={userData.photo_url}
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
              label="Имя"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
              
            />

            <TextField
              size="small"
              fullWidth
              label="Фамилия"
              placeholder="Фамилия"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              sx={{ mb: 2 }}
              
            />

            <TextField
              size="small"
              fullWidth
              label="Username"
              placeholder="Ваш username"
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
              Сохранить изменения
            </Button>
          </form>
        </Box>
      </RightModal>
    </>
  );
};

export default EditData;
