// theme.js или theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#000',
            paper: 'rgba(255,255,255,0.05)'
        },
        text: {
            primary: '#fff',
            secondary: '#aaa',
        }
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--text-color)',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--glass-border)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border-color)',
                    }
                },
                input: {
                    color: 'var(--text-color)',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'var(--text-color)',
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: 'var(--text-color)',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    background: 'var(--glass-bg)',
                    color: 'var(--text-color)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 12
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: 'var(--text-color)',
                    fontWeight: 'bold',
                    fontSize: 14,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: 'var(--text-color)'
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    background: 'var(--glass-bg)',
                    color: 'var(--text-color)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 12,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--glass-border)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border-color)',
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-color)',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    padding: '8px 12px',
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 0.12)',
                    }
                }
            },
            variants: [
                {
                    props: { variant: 'action' },
                    style: {
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--button-text-color)',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 122, 255, 0.85)',
                        },
                    }
                }
            ]
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: "14px",
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    border: "1px solid var(--glass-border)"
                }
            }
        }
    }
});

export default theme;