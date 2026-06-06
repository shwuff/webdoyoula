import React, { useState } from "react";
import { Dialog, List, ListItem, ListItemText, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CustomSelect = ({ value, onChange, options, label }) => {
    const [open, setOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleApply = () => {
        onChange(tempValue);
        handleClose();
    };

    return (
        <>
            {/* span выглядит как маленький селект */}
            <span
                onClick={handleOpen}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 8px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    cursor: "pointer",
                    minWidth: 80,
                    textAlign: "center",
                }}
            >
                <span>{options.find(o => o.value === value)?.label || label}asd</span>
                <span style={{ marginLeft: 8 }}>▼</span>
            </span>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
                fullScreen={isMobile}
            >
                <List>
                    {options.map((o) => (
                        <ListItem
                            button
                            key={o.value}
                            selected={tempValue === o.value}
                            onClick={() => setTempValue(o.value)}
                        >
                            <ListItemText primary={o.label} />
                        </ListItem>
                    ))}
                </List>
                <div style={{ padding: 10, display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="contained" onClick={handleApply}>Показать</Button>
                </div>
            </Dialog>
        </>
    );
};

export default CustomSelect;
