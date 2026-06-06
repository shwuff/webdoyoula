import React, {useState} from 'react';
import {Tooltip} from "@mui/material";

const MenuButton = ({ children, label, open, onClick }) => {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Tooltip
            title={!open ? label : ''}
            placement="right"
            slotProps={{
                tooltip: {
                    sx: {
                        color: 'var(--text-color)',
                        fontSize: '14px',
                    }
                }
            }}
        >
            <span
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: open ? "8px" : "0px",
                    width: "100%",
                    borderRadius: "8px",
                    justifyContent: open ? 'flex-start' : 'center',
                    background: open ? isHovered ? "var(--hover-bg-color)" : "transparent" : "transparent",
                    marginBottom: open ? "4px" : "22px"
                  }}
            >
                {children}
            </span>
        </Tooltip>
    );
};

export default MenuButton;