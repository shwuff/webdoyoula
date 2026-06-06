import React from 'react';
import {Switch} from "@mui/material";

const Index = ({checked, onChange, style = {}}) => {
    return (
        <Switch
            checked={checked}
            onChange={(e) => { onChange(e) }}
            size="small"
            sx={{
                width: 44,
                height: 22,
                padding: 0,
                '& .MuiSwitch-switchBase': {
                    padding: 0,
                    margin: '2px',
                    transitionDuration: '300ms',
                    '&.Mui-checked': {
                        transform: 'translateX(22px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                            backgroundColor: 'var(--primary-color)',
                            opacity: 1,
                            border: 0,
                        },
                        '& .MuiSwitch-thumb': {
                            backgroundColor: '#fff',
                        },
                    },
                    '&.Mui-disabled .MuiSwitch-thumb': {
                        color: 'var(--border-color)',
                    },
                    '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: 0.7,
                    },
                },
                '& .MuiSwitch-thumb': {
                    boxSizing: 'border-box',
                    width: 18,
                    height: 18,
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px 0 rgba(0,35,11,0.2)',
                },
                '& .MuiSwitch-track': {
                    borderRadius: 11,
                    backgroundColor: 'var(--secondary-text-color)',
                    opacity: 1,
                    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                },
                ...(style)
            }}
        />
    );
};

export default Index;