import React, { useRef, useEffect, useState } from 'react';
import {
    Fade,
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
} from '@mui/material';
import config from '../../config';
import {useNavigate} from "react-router-dom";

/* --- маленький хук для отслеживания видимости --- */
const useInView = (offset = 0) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const io = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { rootMargin: `${offset}px` }
        );
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, [offset]);

    return [ref, visible];
};

/* --- обёртка, которая добавляет Fade + задержку --- */
const FadeInSection = ({ index, children }) => {
    const [ref, visible] = useInView(50);
    return (
        <Fade
            in={visible}
            timeout={600}
            style={{ transitionDelay: `${index * 120}ms` }}
        >
            <div ref={ref}>{children}</div>
        </Fade>
    );
};

const PageRenderer = ({ pageSetting, onClick }) => {

    const navigate = useNavigate();

    const handleLinkClick = (e) => {

        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');

        if (href.startsWith('/')) {
            e.preventDefault();
            navigate(href);
        }
    };

    return (
        <Container maxWidth="md" sx={{py: 4}}>
            {pageSetting.blocks.map((block, idx) => (
                <FadeInSection key={idx} index={idx}>
                    {(() => {
                        switch (block.type) {
                            /* ---------- HERO ---------- */
                            case 'hero':
                                return (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            height: {xs: 300, md: 420},
                                            mb: 6,
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            boxShadow: 3,
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            src={config.apiUrl + block.image}
                                            alt="hero"
                                            sx={{filter: 'brightness(0.6)'}}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                textAlign: 'center',
                                                color: '#fff',
                                            }}
                                        >
                                            <Typography variant="h3" fontWeight={700}>
                                                {block.headline}
                                            </Typography>
                                            {block.subtext && (
                                                <Typography variant="h6" sx={{mt: 1}}>
                                                    {block.subtext}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                );

                            /* ---------- TEXT ---------- */
                            case 'text':
                                return (
                                    <Typography
                                        variant="body1"
                                        sx={{my: 3, fontSize: 18, lineHeight: 1.6}}
                                        onClick={handleLinkClick}
                                        dangerouslySetInnerHTML={{__html: block.content}}
                                    />
                                );

                            /* ---------- SINGLE IMAGE ---------- */
                            case 'image':
                                return (
                                    <Card sx={{mb: 4, boxShadow: 2}}>
                                        <CardMedia
                                            component="img"
                                            image={config.apiUrl + block.src}
                                            alt={block.caption}
                                        />
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
                                    <Grid container spacing={2} sx={{mb: 4}}>
                                        {block.items.map((img, i) => (
                                            <Grid item xs={12} sm={6} md={4} key={i}>
                                                <Card sx={{boxShadow: 1}}>
                                                    <CardMedia
                                                        component="img"
                                                        image={config.apiUrl + img.src}
                                                        alt={img.caption}
                                                        sx={{aspectRatio: "1/1", objectFit: 'cover'}}
                                                    />
                                                    {img.caption && (
                                                        <CardContent sx={{py: 1.5}}>
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

                            /* ---------- CTA ---------- */
                            case 'cta':
                                return (
                                    <Box textAlign="center" sx={{my: 5}}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => {
                                                if(block.buttonCallback === 'closeModal') {
                                                    onClick();
                                                }
                                            }}
                                            sx={{px: 5, py: 1.5, borderRadius: 8}}
                                        >
                                            {block.buttonText}
                                        </Button>
                                    </Box>
                                );

                            default:
                                return null;
                        }
                    })()}
                </FadeInSection>
            ))}
        </Container>
    )
};

export default PageRenderer;
