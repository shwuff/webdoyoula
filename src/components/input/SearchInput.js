import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useTranslation} from "react-i18next";

const SearchInput = ({
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder = 'Search',
    inputRef,
    collapsed = false // 👈 добавили
  }) => {
    const { t } = useTranslation();
  
    return (
      <TextField
        inputRef={inputRef}
        variant="outlined"
        fullWidth
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={collapsed ? '' : t('search')}
        sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              paddingLeft: "8px",
              background: "transparent", // 💥 убираем серый фон
              minHeight: "40px",
              cursor: collapsed ? "pointer" : "text",
              "& fieldset": {
                borderColor: collapsed ? "transparent" : "#ddd",
              },
              "&:hover fieldset": {
                borderColor: collapsed ? "transparent" : "#bbb",
              },
              "&.Mui-focused fieldset": {
                borderColor: collapsed ? "transparent" : "var(--primary-color)",
              },
            },
            "& .MuiInputBase-input": {
              padding: "10px 0px",
              border: 0,
              visibility: collapsed ? "hidden" : "visible",
              width: collapsed ? 0 : "auto",
            }
        }}
          
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#666", fontSize: 22 }} />
            </InputAdornment>
          ),
        }}
      />
    );
  }; 

export default SearchInput;
