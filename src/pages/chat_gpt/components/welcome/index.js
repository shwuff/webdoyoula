import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography } from "@mui/material";
import IdeaInputField from "./IdeaInputField";
import {useTranslation} from "react-i18next";

const Index = ({ setStartMessage, startMessage, handleNewChat, loading, uploadedMedia, handleFileSelect, deleteUploadedMedia }) => {

    const {t} = useTranslation();

    const examples = [
        // t('chatGPT.help_me_write_a_story'),
        // t('chatGPT.explain_quantum_physics'),
        t('chatGPT.plan_a_workout_routine'),
        t('chatGPT.help_with_prompt'),
        t('chatGPT.debug_my_code'),
        t('chatGPT.create_a_business_plan'),
        t('chatGPT.learn_a_new_language'),
        t('chatGPT.write_a_poem_about_nature'),
        t('chatGPT.explain_blockchain_technology'),
        t('chatGPT.create_a_meal_plan_for_the_week'),
        t('chatGPT.help_with_react_code'),
    ];

    const [isAnimating, setIsAnimating] = useState(true);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const lastTimeRef = useRef(0);
    const positionRef = useRef(0);
    const itemWidth = 200;
    const gap = 16;
    const speed = 1.5;

    useEffect(() => {
        const startAnimation = (timestamp) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;

            const deltaTime = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            if (!isAnimating) {
                animationRef.current = requestAnimationFrame(startAnimation);
                return;
            }

            const delta = (speed * deltaTime) / 16;

            positionRef.current -= delta;

            const container = containerRef.current;
            if (container) {
                const groupWidth = (itemWidth + gap) * examples.length;

                if (Math.abs(positionRef.current) >= groupWidth) {
                    positionRef.current += groupWidth;
                }

                container.style.transform = `translateX(${positionRef.current}px)`;
            }

            animationRef.current = requestAnimationFrame(startAnimation);
        };

        animationRef.current = requestAnimationFrame(startAnimation);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isAnimating]);

    useEffect(() => {
        const handleMouseEnter = () => setIsAnimating(false);
        const handleMouseLeave = () => setIsAnimating(true);

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mouseenter', handleMouseEnter);
            container.addEventListener('mouseleave', handleMouseLeave);

            const items = container.querySelectorAll('div[role="button"]');
            items.forEach(item => {
                item.addEventListener('mouseenter', handleMouseEnter);
                item.addEventListener('mouseleave', handleMouseLeave);
            });
        }

        return () => {
            if (container) {
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);

                const items = container.querySelectorAll('div[role="button"]');
                items.forEach(item => {
                    item.removeEventListener('mouseenter', handleMouseEnter);
                    item.removeEventListener('mouseleave', handleMouseLeave);
                });
            }
        };
    }, []);

    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            maxWidth: 'min(100%, 800px)',
            mx: 'auto',
            textAlign: 'center',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'var(--text-color)',
                    fontSize: { xs: '2rem', md: '3rem' }
                }}>
                    {t("How can I help you")}
                </Typography>

                <Typography variant="body1" sx={{
                    color: 'var(--hint-color)',
                    fontSize: { xs: '14px', md: '16px' },
                    maxWidth: '600px'
                }}>
                    {t("Ask anything and get instant answers from our AI assistant")}
                </Typography>
            </Box>

            <Box sx={{
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                mb: 6,
                height: '100px',
                display: 'flex',
                alignItems: 'center'
            }}
            >
                <Box sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '150px',
                    background: 'linear-gradient(90deg, var(--bg-color) 0%, var(--low-bg-color) 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                }} />
                <Box sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '150px',
                    background: 'linear-gradient(270deg, var(--bg-color) 0%, var(--low-bg-color) 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                }} />

                <Box
                    ref={containerRef}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        width: 'max-content',
                        transition: 'transform 0.016s linear',
                        willChange: 'transform',
                        paddingLeft: '50px'
                    }}
                >
                    {examples.map((item, index) => (
                        <Paper
                            key={`a-${item}-${index}`}
                            onClick={() => setStartMessage(item)}
                            sx={{
                                p: 2,
                                bgcolor: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                flexShrink: 0,
                                width: `${itemWidth}px`,
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                userSelect: 'none',
                                position: 'relative',
                                '&:hover': {
                                    transform: 'translateY(-2px) scale(1.02)'
                                }
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--text-color)',
                                    textAlign: 'center',
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrientation: 'vertical'
                                }}
                            >
                                {item}
                            </Typography>
                        </Paper>
                    ))}

                    {examples.map((item, index) => (
                        <Paper
                            key={`a-${item}-${index}`}
                            onClick={() => setStartMessage(item)}
                            sx={{
                                p: 2,
                                bgcolor: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                flexShrink: 0,
                                width: `${itemWidth}px`,
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                userSelect: 'none',
                                position: 'relative',
                                '&:hover': {
                                    transform: 'translateY(-2px) scale(1.02)'
                                }
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--text-color)',
                                    textAlign: 'center',
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrientation: 'vertical'
                                }}
                            >
                                {item}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>

            <IdeaInputField
                startMessage={startMessage}
                setStartMessage={setStartMessage}
                handleNewChat={handleNewChat}
                loading={loading}
                uploadedMedia={uploadedMedia}
                handleFileSelect={handleFileSelect}
            />
        </Box>
    );
};

export default Index;