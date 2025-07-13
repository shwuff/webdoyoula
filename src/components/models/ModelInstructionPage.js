import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button
} from '@mui/material';

const PageRenderer = ({ pageSetting }) => (
    <Container maxWidth="md" sx={{ py: 4 }}>
        {pageSetting.blocks.map((block, index) => {
            switch (block.type) {
                /* ---------- HERO ---------- */
                case 'hero':
                    return (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                height: { xs: 300, md: 420 },
                                mb: 6,
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: 3
                            }}
                        >
                            <CardMedia
                                component="img"
                                src={block.image}
                                alt="hero"
                                sx={{ height: '100%', filter: 'brightness(0.6)' }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                    color: '#fff'
                                }}
                            >
                                <Typography variant="h3" fontWeight={700}>
                                    {block.title}
                                </Typography>
                                {block.subtitle && (
                                    <Typography variant="h6" sx={{ mt: 1 }}>
                                        {block.subtitle}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );

                /* ---------- TEXT ---------- */
                case 'text':
                    return (
                        <Typography
                            key={index}
                            variant="body1"
                            sx={{ my: 3, fontSize: 18, lineHeight: 1.6 }}
                        >
                            {block.content}
                        </Typography>
                    );

                /* ---------- SINGLE IMAGE ---------- */
                case 'image':
                    return (
                        <Card key={index} sx={{ mb: 4, boxShadow: 2 }}>
                            <CardMedia component="img" image={block.src} alt={block.caption} />
                            {block.caption && (
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {block.caption}
                                    </Typography>
                                </CardContent>
                            )}
                        </Card>
                    );

                /* ---------- GALLERY ---------- */
                case 'gallery':
                    return (
                        <Grid container spacing={2} key={index} sx={{ mb: 4 }}>
                            {block.images.map((img, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Card sx={{ boxShadow: 1 }}>
                                        <CardMedia
                                            component="img"
                                            image={img.src}
                                            alt={img.caption}
                                            sx={{ height: 240, objectFit: 'cover' }}
                                        />
                                        {img.caption && (
                                            <CardContent sx={{ py: 1.5 }}>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    display="block"
                                                    textAlign="center"
                                                >
                                                    {img.caption}
                                                </Typography>
                                            </CardContent>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    );

                /* ---------- CTA/BUTTON ---------- */
                case 'cta':
                    return (
                        <Box key={index} textAlign="center" sx={{ my: 5 }}>
                            <Button
                                variant="contained"
                                size="large"
                                href={block.buttonUrl}
                                sx={{ px: 5, py: 1.5, borderRadius: 8 }}
                            >
                                {block.buttonText}
                            </Button>
                        </Box>
                    );

                default:
                    return null;
            }
        })}
    </Container>
);

export default PageRenderer;
