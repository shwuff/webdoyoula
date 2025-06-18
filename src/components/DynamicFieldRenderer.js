import React from 'react';
import {
    FormControl,
    MenuItem,
    Select,
    TextField,
    Button
} from "@mui/material";
import StyledTextarea from "./input/StyledTextarea";
import {useTranslation} from "react-i18next";

const DynamicFieldRenderer = ({ name, config, value, onChange }) => {

    const { t } = useTranslation();

    if (!config || typeof config !== 'object') return null;

    const label = name.charAt(0) + name.slice(1).replaceAll('_', ' ');

    switch (config.type) {
        case 'text':
            return (
                <>
                    <div className={"d-flex align-items-center"} style={{ gap: "10px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path>
                        </svg> <span className={"comfortaa-500"}>{t(`${label}`)} {config.required ? "*" : ""}</span>
                    </div>
                    {/*<TextField*/}
                    {/*    fullWidth*/}
                    {/*    value={value}*/}
                    {/*    required={config.required}*/}
                    {/*    onChange={(e) => onChange(name, e.target.value)}*/}
                    {/*    margin="normal"*/}
                    {/*    size="small"*/}
                    {/*    sx={{padding: 0}}*/}
                    {/*/>*/}
                    <StyledTextarea
                        minRows={1}
                        maxRows={6}
                        value={value}
                        required={config.required}
                        onChange={(e) => onChange(name, e.target.value)}
                    />
                </>
            );
        case 'select':
            return (
                <FormControl fullWidth margin="normal" size="small" required={config.required}>
                    <div className={"d-flex align-items-center"} style={{ gap: "10px", marginBottom: "10px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
                        </svg> <span className={"comfortaa-500"}>{t(`${label}`)} {config.required ? "*" : ""}</span>
                    </div>
                    <Select
                        value={value ?? ''}
                        onChange={(e) => onChange(name, e.target.value)}
                    >
                        <MenuItem value="" disabled>{t('Select an option')}</MenuItem>

                        {Array.isArray(config.options)
                            ? config.options.map((opt, i) => {
                                if (typeof opt === 'object' && opt !== null && Object.keys(opt).length === 1) {
                                    const [val, label] = Object.entries(opt)[0];
                                    return <MenuItem key={val} value={val}>{label}</MenuItem>;
                                }
                                return <MenuItem key={opt} value={opt}>{opt}</MenuItem>;
                            })
                            : Object.entries(config.options).map(([val, label]) => (
                                <MenuItem key={val} value={val}>{String(label)}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            );
        case 'file':
            return (
                <FormControl fullWidth margin="normal">
                    <div className={"d-flex align-items-center"} style={{ gap: "10px", marginBottom: "10px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                        </svg> <span style={{ color: 'var(--text-color)' }} className={"comfortaa-500"}>{t(`${label}`)}</span>
                    </div>

                    <Button component="label" variant="contained">
                        {config.required ? '📷 ' + t('Choose image') + ' *' : '📷 ' + t('Choose image')}
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        onChange(name, reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </Button>

                    {value && (
                        <img
                            src={value}
                            alt="preview"
                            style={{
                                marginTop: '10px',
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)'
                            }}
                        />
                    )}
                </FormControl>
            );
        default:
            return null;
    }
};

export default DynamicFieldRenderer;