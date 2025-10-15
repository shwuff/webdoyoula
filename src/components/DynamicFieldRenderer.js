import React, {useState} from 'react';
import {
    FormControl,
    MenuItem,
    Select,
    Button,
    Slider
} from "@mui/material";
import StyledTextarea from "./input/StyledTextarea";
import {useTranslation} from "react-i18next";
import { Checkbox, FormControlLabel } from '@mui/material';
import {Remove, RemoveCircleOutlined} from "@mui/icons-material";

const DynamicFieldRenderer = ({ name, config, value, onChange, isRepeat = false }) => {

    const { t } = useTranslation();

    const [createFromImage, setCreateFromImage] = useState(false);

    if (!config || typeof config !== 'object') return null;

    const label = name.charAt(0) + name.slice(1).replaceAll('_', ' ');

    if(isRepeat && name === 'prompt') {
        return (
            <>
                <div className={"d-flex align-items-center"} style={{ gap: "10px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path>
                    </svg> <span className={"comfortaa-500"}>{t(`${label}`)} {config.required ? "*" : ""}</span>
                </div>
                <StyledTextarea
                    minRows={1}
                    maxRows={6}
                    value={''}
                    placeholder={"Hided"}
                    required={config.required}
                    disabled
                />
            </>
        );
    }

    switch (config.type) {
        case 'text':
            return (
                <>
                    {
                        name === 'prompt' && (
                            <FormControlLabel
                                control={<Checkbox onChange={(e) => {
                                    setCreateFromImage(e.target.checked);
                                    onChange(name, '');
                                }} />}
                                label={t('Input image prompt')}
                                labelPlacement="end"
                            />
                        )
                    }
                    {
                        createFromImage ? (
                            <FormControl fullWidth margin="normal" sx={{ marginTop: 0 }}>
                                <div className={"d-flex align-items-center"} style={{ gap: "10px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                                    </svg> <span style={{ color: 'var(--text-color)' }} className={"comfortaa-500"}>{t(`${label}`)} {config.required ? "*" : ""}</span>
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
                                            maxWidth: '200px',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            border: '1px solid var(--glass-border)'
                                        }}
                                    />
                                )}
                            </FormControl>
                        ) : (
                            <>
                                <div className={"d-flex align-items-center"} style={{ gap: "10px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path>
                                    </svg> <span className={"comfortaa-500"}>{t(`${label}`)} {config.required ? "*" : ""}</span>
                                </div>
                                <StyledTextarea
                                    minRows={1}
                                    maxRows={6}
                                    value={value}
                                    required={config.required}
                                    onChange={(e) => onChange(name, e.target.value)}
                                />
                            </>
                        )
                    }
                    <hr />
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
                                    return (
                                        <MenuItem key={val} value={val}>
                                            {label}
                                        </MenuItem>
                                    );
                                }
                                return <MenuItem key={opt} value={opt}>
                                    {
                                        name === 'aspect_ratio' ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "25px" }}>
                                                <div
                                                    style={{
                                                        border: "2px solid white",
                                                        aspectRatio: opt.replaceAll(':', '/'),
                                                        height: "100%",
                                                        borderRadius: "4px"
                                                    }}
                                                />
                                                <span>{opt}</span>
                                            </div>
                                        ) : (
                                            t(opt)
                                        )
                                    }
                                </MenuItem>;
                            })
                            : Object.entries(config.options).map(([val, label]) => (
                                <MenuItem key={val} value={val}>
                                    {String(label)}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            );
        case 'file':
            return (
                <FormControl fullWidth margin="normal">
                    <div className={"d-flex align-items-center"} style={{ gap: "10px", marginBottom: "10px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
                            <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                        </svg>
                        <span style={{ color: 'var(--text-color)' }} className={"comfortaa-500"}>
                    {t(`${label}`)}
                </span>
                    </div>

                    <Button component="label" variant="contained">
                        {config.required ? t('Choose files') + ' *' : t('Choose files')}
                        <input
                            type="file"
                            hidden
                            multiple={config.multiple}
                            accept="*"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    const readers = [];
                                    const fileContents = [];

                                    Array.from(files).forEach((file, index) => {
                                        const reader = new FileReader();
                                        readers.push(reader);

                                        reader.onloadend = () => {
                                            fileContents.push(reader.result); // Только base64 данные

                                            // Когда все файлы прочитаны
                                            if (fileContents.length === files.length) {
                                                if (config.multiple) {
                                                    // Для multiple - массив base64 строк
                                                    const currentFiles = Array.isArray(value) ? value : [];
                                                    onChange(name, [...currentFiles, ...fileContents]);
                                                } else {
                                                    // Для одиночного файла - просто base64 строка
                                                    onChange(name, fileContents[0]);
                                                }
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    });
                                }
                            }}
                        />
                    </Button>

                    {value && (
                        <div style={{ marginTop: '10px' }}>
                            {config.multiple && Array.isArray(value) ? (
                                // Отображение нескольких файлов с кнопками удаления
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {value.map((fileData, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            {/* Кнопка удаления */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedFiles = value.filter((_, i) => i !== index);
                                                    onChange(name, updatedFiles.length > 0 ? updatedFiles : null);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-8px',
                                                    right: '-8px',
                                                    background: 'var(--error-color)',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '32px',
                                                    height: '32px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                    zIndex: 1
                                                }}
                                                title="Remove file"
                                            >
                                                <RemoveCircleOutlined />
                                            </button>

                                            {/* Проверяем, является ли файл изображением по MIME-type */}
                                            {typeof fileData === 'string' && fileData.startsWith('data:image/') ? (
                                                <img
                                                    src={fileData}
                                                    alt={`preview-${index}`}
                                                    style={{
                                                        maxWidth: '200px',
                                                        maxHeight: '200px',
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                        border: '1px solid var(--glass-border)'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '200px',
                                                    height: '200px',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                    padding: '10px',
                                                    background: 'var(--glass-bg)'
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                                                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                                                    </svg>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        marginTop: '8px',
                                                        textAlign: 'center',
                                                        wordBreak: 'break-all'
                                                    }}>
                                                File {index + 1}
                                            </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Отображение одиночного файла с кнопкой удаления
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    {/* Кнопка удаления для одиночного файла */}
                                    <button
                                        type="button"
                                        onClick={() => onChange(name, null)}
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            background: 'var(--error-color)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            zIndex: 1
                                        }}
                                        title="Remove file"
                                    >
                                        <RemoveCircleOutlined />
                                    </button>

                                    {typeof value === 'string' && value.startsWith('data:image/') ? (
                                        <img
                                            src={value}
                                            alt="preview"
                                            style={{
                                                maxWidth: '200px',
                                                maxHeight: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                border: '1px solid var(--glass-border)'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '200px',
                                            height: '200px',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            padding: '10px',
                                            background: 'var(--glass-bg)'
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                                            </svg>
                                            <span style={{
                                                fontSize: '12px',
                                                marginTop: '8px',
                                                textAlign: 'center'
                                            }}>
                                        File
                                    </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </FormControl>
            );
        case 'range': {
            const [min, max] = (config.range || "0-100")
                .split('-')
                .map(n => parseInt(n.trim(), 10));

            const handleSliderChange = (e, newValue) => {
                onChange(name, newValue);
            };

            return (
                <FormControl fullWidth margin="normal">
                    <div className={"d-flex align-items-center"} style={{ gap: "10px", marginBottom: "10px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path></svg>
                        <span className={"comfortaa-500"}>
                            {t(`${label}`)} {config.required ? "*" : ""} ({value})
                        </span>
                    </div>
                    <Slider
                        value={value || min}
                        onChange={handleSliderChange}
                        step={1}
                        min={min}
                        max={max}
                        valueLabelDisplay="auto"
                    />
                </FormControl>
            );
        }

        default:
            return null;
    }
};

export default DynamicFieldRenderer;