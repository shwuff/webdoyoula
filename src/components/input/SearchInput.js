import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({
                         value,
                         onChange,
                         onFocus,
                         onBlur,
                         placeholder = "Поиск..."
                     }) => {
    return (
        <TextField
            variant="outlined"
            fullWidth
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    paddingLeft: "8px",
                    background: "var(--secondary-bg-color)",
                    "& fieldset": {
                        borderColor: "#ddd",
                    },
                    "&:hover fieldset": {
                        borderColor: "#bbb",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "var(--primary-color)",
                    },
                },
                "& .MuiInputBase-input": {
                    padding: "10px 0px",
                    border: 0
                },
                "& .MuiFormControl-root:active": {
                    border: "1px solid var(--primary-color)"
                }
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#666" }} />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchInput;
