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

const EditData = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

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
        sx={{ bgcolor: '#2196F3', fontSize: '16px', borderRadius: '8px', px: 3 }}
      >
        Изменить
      </Button>

      <RightModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box sx={{ width: '100%', p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Редактировать профиль
          </Typography>

          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar
              src={profileImage || "https://via.placeholder.com/150"}
              sx={{ width: 80, height: 80, cursor: 'pointer', margin: 'auto' }}
              onClick={() => fileInputRef.current.click()}
            />
            <IconButton
              color="primary"
              component="span"
              sx={{ position: 'absolute', bottom: 0, right: 'calc(50% - 24px)' }}
              onClick={() => fileInputRef.current.click()}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
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
              required
            />

            <TextField
              size="small"
              fullWidth
              label="Фамилия"
              placeholder="Фамилия"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              size="small"
              fullWidth
              label="Username"
              placeholder="Ваш username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 3 }}
              required
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
