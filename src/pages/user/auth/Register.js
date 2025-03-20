import React from 'react';
import { Container, Box, Paper, Typography, TextField, Button, Link } from '@mui/material';

const Auth = () => {
    return (
        <Container
            maxWidth="xs"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Пример фонового градиента на всю страницу
                background: 'linear-gradient(to top right, #f0f4f7, #fff)',
            }}
        >
            {/* Блок с формой, обёрнутый в Paper, для «карточки» авторизации */}
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    borderRadius: 2,
                }}
            >
                <Box display="flex" flexDirection="column" gap={2}>
                    {/* Заголовок формы */}
                    <Typography variant="h5" component="h1" align="center" gutterBottom>
                        Авторизация
                    </Typography>

                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                    />

                    {/* Дополнительные ссылки «Забыли пароль?» и «Регистрация» */}
                    <Box display="flex" justifyContent="space-between" mt={1}>
                        <Link href="#" underline="hover">
                            Забыли пароль?
                        </Link>
                        <Link href="#" underline="hover">
                            Регистрация
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Auth;
