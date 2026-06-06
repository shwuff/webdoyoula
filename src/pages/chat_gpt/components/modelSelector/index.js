import { useState } from 'react';
import {
    Typography,
    Menu,
    Box,
    Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function Index({ models, selectedModel, setSelectedModel }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectModel = (model) => {
        setSelectedModel(model);
        handleClose();
    };

    const modelDescriptions = {
        'GPT-4': 'Great for everyday tasks',
        'GPT-3.5': 'Fast and efficient',
        'Claude-2': 'Helpful and harmless',
        'Llama-2': 'Open source model',
        'Gemini': 'Multimodal AI model'
    };

    const modelColors = {
        'GPT-4': '#10a37f',
        'GPT-3.5': '#8b5cf6',
        'Claude-2': '#f59e0b',
        'Llama-2': '#ef4444',
        'Gemini': '#3b82f6'
    };

    return (
        <>
            <Typography variant="h6" sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: 1 }}>
                <span
                    onClick={handleClick}
                    style={{
                        background: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: 'var(--glass-border)',
                        fontSize: '1.2rem',
                        height: '36px',
                        minWidth: '80px',
                        textTransform: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {selectedModel}
                        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Box>
                </span>
            </Typography>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        bgcolor: 'var(--bg-color)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        mt: 1,
                        p: 0.2,
                        minWidth: '250px',
                        boxShadow: "0"
                    }
                }}
                MenuListProps={{
                    sx: { p: 0 }
                }}
            >
                <Box sx={{ p: 0.2 }}>
                    {models.map((model) => (
                        <Box
                            key={model}
                            onClick={() => handleSelectModel(model)}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                p: 1,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                bgcolor: 'transparent',
                                border: "1px solid var(--bg-color)",
                                '&:hover': {
                                    bgcolor: 'var(--hover-bg-color)',
                                    // border: model === selectedModel ? '1px solid var(--border-color)' : '1px solid transparent',
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 28,
                                    height: 28,
                                    bgcolor: modelColors[model],
                                    fontSize: '0.75rem',
                                    mr: 1,
                                }}
                            >
                                {model.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        color: 'var(--text-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    {model}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary-color)'
                                    }}
                                >
                                    {modelDescriptions[model]}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Menu>
        </>
    );
}

export default Index;