import React, {useState} from 'react';
import {
    FormControl,
    MenuItem,
    Select,
    Button,
    Slider, TextField
} from "@mui/material";
import StyledTextarea from "../input/StyledTextarea";
import {useTranslation} from "react-i18next";
import { Checkbox, FormControlLabel } from '@mui/material';
import {RemoveCircleOutlined} from "@mui/icons-material";
import './DynamicFieldRender.css';
import SelectableItem from "./SelectableItem";
import LucideIcon from "../../assets/icons/LucideIcon";

const customComponents = [
    { name: "SelectableItem", component: SelectableItem }
];

function dataVideoToBlob(value) {
    if (typeof value !== "string") return null;
    if (!value.startsWith("data:video/")) return null;

    const [meta, base64] = value.split(",");
    if (!base64) return null;

    const mime = meta.match(/data:(.*?);base64/)[1];
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
    }

    return new Blob([buffer], { type: mime });
}


const DynamicFieldRenderer = ({ name, config, value, onChange, isRepeat = false, id, promptData = {} }) => {

    const { t } = useTranslation();

    const [createFromImage, setCreateFromImage] = useState(false);

    if (!config || typeof config !== 'object') return null;

    const raw = name.includes(':') ? name.split(':')[0] : name;
    const label = raw.charAt(0) + raw.slice(1).replaceAll('_', ' ');

    let videoUrl = '';

    if(value && typeof value === "string" && value.includes('data:video/')) {
        const blob = dataVideoToBlob(value);
        videoUrl = URL.createObjectURL(blob);
    }

    function getCustomComponent(name) {
        const entry = customComponents.find(c => c.name === name);
        return entry ? entry.component : null;
    }

    const Component = config?.render_component
        ? getCustomComponent(config.render_component)
        : null;

    let aspectRatioList = [];

    if (name === 'aspect_ratio' && config?.options) {
        aspectRatioList = config.options.map(value => {
            let icon = null;

            if (value === '16:9') icon = 'Youtube';
            if (value === '9:16') icon = 'Smartphone';
            if (value === '4:5')  icon = 'Instagram';
            if (value === '1:1')  icon = 'Square';

            return {
                title: value,
                value: value,
                ...(icon ? { icon } : {})
            };
        });
    }

    if(isRepeat && name === 'prompt' && promptData && promptData.public === false) {
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
                    disabled={promptData === {}}
                />
            </>
        );
    }

    const renderField = () => {
        switch (config.type) {
            case 'text':
                return (
                    <>
                        {
                            name === 'prompt' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {
                                        !createFromImage && (
                                            <>
                                                <div className={"d-flex align-items-center"} style={{ gap: "10px" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--text-color)" viewBox="0 0 256 256" aria-hidden="true">
                                                        <path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path>
                                                    </svg>
                                                    <span className={"comfortaa-500"}>{t('generation.prompt')} {config.required ? "*" : ""}</span>
                                                </div>
                                                <TextField
                                                    multiline
                                                    minRows={1}
                                                    maxRows={6}
                                                    placeholder={t("generation.prompt_description")}
                                                    value={value}
                                                    onChange={(e) => onChange(name, e.target.value)}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            fontSize: "14px",
                                                            padding: "0px",
                                                            lineHeight: 1.4,
                                                        },
                                                        borderRadius: "4px"
                                                    }}
                                                />
                                            </>
                                        )
                                    }

                                    {
                                        createFromImage && (
                                            <FormControl fullWidth margin="normal" sx={{ marginTop: 0 }}>
                                                <div className={"d-flex align-items-center"} style={{ gap: "10px" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                                                    </svg> <span style={{ color: 'var(--text-color)' }} className={"comfortaa-500"}>{t(`${label}`)} {config.required ? "*" : ""}</span>
                                                </div>

                                                <Button id={id} component="label" variant="contained" sx={{ marginTop: 2 }}>
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
                                        )
                                    }

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={createFromImage}
                                                onChange={(e) => {
                                                    setCreateFromImage(e.target.checked);
                                                    onChange(name, '');
                                                }}
                                            />
                                        }
                                        label={t('Input image prompt')}
                                        sx={{ maxWidth: "max-content" }}
                                    />
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div className={"d-flex align-items-center"} style={{ gap: "10px" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--text-color)" viewBox="0 0 256 256" aria-hidden="true">
                                                <path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path>
                                            </svg>
                                            <span className={"comfortaa-500"}>{t("generation." + name)} {config.required ? "*" : ""}</span>
                                        </div>
                                        <TextField
                                            multiline
                                            minRows={1}
                                            maxRows={6}
                                            placeholder={t("generation." + name + "_description")}
                                            value={value}
                                            onChange={(e) => onChange(name, e.target.value)}
                                            fullWidth
                                            sx={{
                                                "& .MuiInputBase-input": {
                                                    fontSize: "14px",
                                                    padding: "0px",
                                                    lineHeight: 1.4,
                                                },
                                                borderRadius: "4px"
                                            }}
                                        />
                                </div>
                            )
                        }
                        <hr />
                    </>
                );
            case 'select':
                return (
                    <FormControl fullWidth margin="normal" size="small" required={config.required}>
                        <div className={"d-flex align-items-center"} style={{ gap: "10px", marginBottom: "10px" }}>
                            {/*<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>*/}
                            {/*</svg>*/}
                            <LucideIcon
                                name={"AlignJustify"}
                                size={14}
                                color={"var(--text-color)"}
                            />
                            <span className={"comfortaa-500"}>{t(`${label}`)} {config.required ? "*" : ""}</span>
                        </div>
                        {
                            Component ? (
                                <>
                                    <Component renderSettings={config.render_settings} onChange={(e) => onChange(name, e)} value={value} />
                                </>
                            ) : name === 'aspect_ratio' ? (
                                <>
                                    <SelectableItem renderSettings={aspectRatioList} onChange={(e) => onChange(name, e)} value={value} mini={true} />
                                </>
                            ) : (
                                <Select
                                    value={value ?? ''}
                                    onChange={(e) => onChange(name, e.target.value)}
                                    id={id}
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

                                            const label = String(opt).includes(':') ? opt.split(':')[0] : opt;

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
                                                        <span>
                                                    {t(label)}
                                                </span>
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
                            )
                        }
                    </FormControl>
                );
            case 'file':
                return (
                    <FormControl id={id} fullWidth margin="normal">
                        <div className={"d-flex align-items-center"} style={{ gap: "10px", marginBottom: "10px" }}>
                            <LucideIcon
                                name={"File"}
                                size={14}
                                color={"var(--text-color)"}
                            />
                            <span style={{ color: 'var(--text-color)' }} className={"comfortaa-500"}>
                                {t(`${label}`)}
                            </span>
                        </div>

                        <div className="loadFile">
                            <input
                                type="file"
                                id={`fileUpload-${name}`}
                                className="fileInput"
                                multiple={config?.multiple}
                                accept={config?.filetype === 'video' ? 'video/*' : '*'}
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        const readers = [];
                                        const fileContents = [];

                                        Array.from(files).forEach((file, index) => {
                                            const reader = new FileReader();
                                            readers.push(reader);

                                            reader.onloadend = () => {
                                                fileContents.push(reader.result);

                                                if (fileContents.length === files.length) {
                                                    if (config.multiple) {
                                                        const currentFiles = Array.isArray(value) ? value : [];
                                                        onChange(name, [...currentFiles, ...fileContents]);
                                                    } else {
                                                        onChange(name, fileContents[0]);
                                                    }
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }
                                }}
                            />
                            <div className="d-flex w-100 justify-content-center" style={{gap: "4px"}}>
                                {
                                    config?.filetype === 'video' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round" className="load-icon"
                                             aria-hidden="true">
                                            <path
                                                d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                                            <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round" className="load-icon">
                                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                            <circle cx="9" cy="9" r="2"></circle>
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                        </svg>
                                    )
                                }
                                <label htmlFor={`fileUpload-${name}`} className="fileLabel">
                                    <span className="fileText">
                                      {config?.filetype === 'video'
                                          ? config?.multiple
                                              ? config?.required ? t('Choose videos') + ' *' : t('Choose videos')
                                              : config?.required ? t('Choose video') + ' *' : t('Choose video')
                                          : config?.multiple
                                              ? config?.required ? t('Choose files') + ' *' : t('Choose files')
                                              : config?.required ? t('Choose file') + ' *' : t('Choose file')}
                                    </span>
                                </label>
                            </div>
                        </div>


                        {/*<Button component="label" variant="contained">*/}
                        {/*    {*/}
                        {/*        config?.filetype === 'video' ? (*/}
                        {/*            <>*/}
                        {/*                {*/}
                        {/*                    config.multiple ? (*/}
                        {/*                        <>*/}
                        {/*                            {config.required ? t('Choose videos') + ' *' : t('Choose videos')}*/}
                        {/*                        </>*/}
                        {/*                    ) : (*/}
                        {/*                        <>*/}
                        {/*                            {config.required ? t('Choose video') + ' *' : t('Choose video')}*/}
                        {/*                        </>*/}
                        {/*                    )*/}
                        {/*                }*/}
                        {/*            </>*/}
                        {/*        ) : (*/}
                        {/*            <>*/}
                        {/*                {*/}
                        {/*                    config.multiple ? (*/}
                        {/*                        <>*/}
                        {/*                            {config.required ? t('Choose files') + ' *' : t('Choose files')}*/}
                        {/*                        </>*/}
                        {/*                    ) : (*/}
                        {/*                        <>*/}
                        {/*                            {config.required ? t('Choose file') + ' *' : t('Choose file')}*/}
                        {/*                        </>*/}
                        {/*                    )*/}
                        {/*                }*/}
                        {/*            </>*/}
                        {/*        )*/}
                        {/*    }*/}
                        {/*    <input*/}
                        {/*        type="file"*/}
                        {/*        hidden*/}
                        {/*        multiple={config.multiple}*/}
                        {/*        accept="*"*/}
                        {/*        onChange={(e) => {*/}
                        {/*            const files = e.target.files;*/}
                        {/*            if (files && files.length > 0) {*/}
                        {/*                const readers = [];*/}
                        {/*                const fileContents = [];*/}
                        {/*                Array.from(files).forEach((file, index) => {*/}
                        {/*                    const reader = new FileReader();*/}
                        {/*                    readers.push(reader);*/}
                        {/*                    reader.onloadend = () => {*/}
                        {/*                        fileContents.push(reader.result);*/}
                        {/*                        if (fileContents.length === files.length) {*/}
                        {/*                            if (config.multiple) {*/}
                        {/*                                const currentFiles = Array.isArray(value) ? value : [];*/}
                        {/*                                onChange(name, [...currentFiles, ...fileContents]);*/}
                        {/*                            } else {*/}
                        {/*                                onChange(name, fileContents[0]);*/}
                        {/*                            }*/}
                        {/*                        }*/}
                        {/*                    };*/}
                        {/*                    reader.readAsDataURL(file);*/}
                        {/*                });*/}
                        {/*            }*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</Button>*/}

                        {value && (
                            <div style={{ marginTop: '10px' }}>
                                {config.multiple && Array.isArray(value) ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {value.map((fileData, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
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
                                                ) : typeof fileData === 'string' && fileData.startsWith('data:video/') ? (
                                                    <video
                                                        src={fileData}
                                                        style={{
                                                            width: 160,
                                                            maxHeight: 120,
                                                            borderRadius: 12,
                                                            objectFit: "cover",
                                                            background: "#000"
                                                        }}
                                                        muted
                                                        loop
                                                        playsInline
                                                        preload="metadata"
                                                        onMouseEnter={e => e.target.play()}
                                                        onMouseLeave={e => e.target.pause()}
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
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
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
                                        ) : typeof value === 'string' && value.startsWith('data:video/') ? (
                                            <video
                                                src={videoUrl}
                                                style={{
                                                    width: 260,
                                                    maxHeight: 140,
                                                    borderRadius: 12,
                                                    objectFit: "cover",
                                                    background: "#000"
                                                }}
                                                muted
                                                loop
                                                playsInline
                                                controls={true}
                                                preload="metadata"
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--text-color)" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path></svg>
                            <span className={"comfortaa-500"}>
                            {t(`${label}`)} {config.required ? "*" : ""} ({value})
                        </span>
                        </div>
                        <Slider
                            id={id}
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
    }

    return (
        <div>
            {renderField()}
        </div>
    )
};

export default DynamicFieldRenderer;