import React, {memo, useEffect, useRef, useState} from 'react';
import styles from './css/GenerateImageAvatar.module.css';
import {FaRobot, FaCog, FaHourglassHalf, FaCheckCircle, FaSortNumericUp, FaUser, FaCheck} from 'react-icons/fa';
import {useAuth} from "../../../context/UserContext";
import {useWebSocket} from "../../../context/WebSocketContext";
import {useInView} from "react-intersection-observer";
import {animated, useSpring} from "@react-spring/web";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import animationStarGold from "../../../assets/gif/gold_star.gif";
import redSirenAnimation from "./../../../assets/gif/red_siren.gif"

const GenerateImageAvatar = ({ editImage = false }) => {
    const [step, setStep] = useState(1);
    const [mediaGroup, setMediaGroup] = useState(0);
    const [availableModels, setAvailableModels] = useState([]);
    const [promptData, setPromptData] = useState(null);

    const { t} = useTranslation();

    const { userData, setUserData } = useAuth();
    const { promptId, photoId} = useParams();
    const navigate = useNavigate();
    const { myLoras, token } = useAuth();
    const { sendData, addHandler, deleteHandler } = useWebSocket();

    const [photoFormat, setPhotoFormat] = useState(userData.aspect_ratio);
    const [currentModelFields, setCurrentModelFields] = useState({});
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState('');

    const textareaRef = useRef(null);

    const handleFocus = () => {
        const navbar = document.getElementById('navbarBottom');
        if (navbar && window?.Telegram?.WebApp?.platform === 'ios') {
            navbar.style.display = 'none';
        }
    };

    const handleBlur = () => {
        const navbar = document.getElementById('navbarBottom');
        if (navbar) {
            navbar.style.display = 'flex';
        }
    };

    useEffect(() => {
        const selectedModel = availableModels.find(model => model.id === userData.current_ai_id);
        if (selectedModel?.fields) {
            setCurrentModelFields(selectedModel.fields);
        } else {
            setCurrentModelFields({});
        }
    }, [availableModels, userData.current_ai_id]);

    useEffect(() => {

        const BackButton = window.Telegram.WebApp.BackButton;

        const handleBackButtonClick = () => {
            setStep(Math.max(step - 1, 1))
        }

        if(step > 1 && step < 5) {
            BackButton.show();
            BackButton.onClick(handleBackButtonClick);
        } else {
            BackButton.hide();
        }

        return () => {
            BackButton.offClick();
        }

    }, [step, setStep]);

    useEffect(() => {

        const handleGenAvatarCompleted = (msg) => {
            if(mediaGroup === msg.mediaGroupId) {
                setStep(6);
            }
        }

        addHandler('gen_avatar_completed', handleGenAvatarCompleted);

        return () => deleteHandler('gen_avatar_completed')
    }, [mediaGroup]);

    useEffect(() => {

        const handleGenAvatarCompleted = (msg) => {
            setMediaGroup(msg.media_group_id);
        }

        addHandler('start_generating_image_avatar', handleGenAvatarCompleted);

        return () => deleteHandler('start_generating_image_avatar')
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [prompt]);

    useEffect(() => {
        if(token) {
            sendData({
                action: "get_available_models",
                data: {
                    jwt: token,
                    editImage: editImage
                }
            });
        }
    }, [token, editImage]);

    useEffect(() => {
        const receiveAvailableModels = (msg) => {
            setAvailableModels(msg.models);
        }

        addHandler("receive_available_models", receiveAvailableModels);

        return () => deleteHandler("receive_available_models");
    }, [addHandler, deleteHandler, setAvailableModels]);

    useEffect(() => {
        if(promptId) {
            sendData({
                action: "get_prompt_data",
                data: {
                    jwt: token,
                    promptId
                }
            });
        } else {
            setPromptData(null);
        }
    }, [promptId, token]);

    useEffect(() => {

        const receivePromptData = (msg) => {
            console.log(msg.promptData)
            setPromptData(msg.promptData);
        }

        addHandler('receive_prompt_data', receivePromptData);

        return () => deleteHandler('receive_prompt_data')

    }, [addHandler, deleteHandler]);

    useEffect(() => {
        if(photoFormat !== userData?.aspect_ratio) {
            sendData({action: "update_content_settings", data: {jwt: token, photoFormat }});
            setUserData({
                ...userData,
                aspect_ratio: photoFormat,
            });
        }
    }, [photoFormat, userData, setUserData, token]);

    console.log(currentModelFields);

    return (
        <div className={`globalBlock`} style={{ paddingTop: "var(--safeAreaInset-top)" }}>

            <div className={"center-content-block"}>
                <div className="w-100 d-flex" style={{ gap: "10px" }}>
                    <FormControl
                        sx={{ fontSize: "0.8rem", width: "100%", marginTop: "15px" }}
                        size="small"
                    >
                        <InputLabel id="filter-select-label" sx={{ fontSize: "0.8rem" }}>
                            {t('Select AI')}
                        </InputLabel>
                        <Select
                            labelId="filter-select-label"
                            value={!editImage ? userData.current_ai_id : 4}
                            onChange={(e) => {
                                sendData({
                                    action: "update_selected_model",
                                    data: {
                                        jwt: token,
                                        modelId: e.target.value,
                                    }
                                });
                                setPrompt('');
                                setImage('');
                            }}
                            label={t('feed_type')}
                            sx={{ fontSize: "0.8rem", height: "40px", width: "100%" }}
                        >
                            {
                                editImage ? (
                                        <MenuItem value={4}>
                                            Lora + Sora
                                        </MenuItem>
                                    ) :
                                    promptData?.photo_id ? (
                                            <MenuItem value={3}>
                                                Lora + Sora
                                            </MenuItem>
                                        ) :
                                    promptData?.edit_photo ? (
                                            <MenuItem value={3}>
                                                Sora
                                            </MenuItem>
                                    ) :
                                    availableModels?.map((model) =>
                                        (
                                            <MenuItem key={model.id} value={model.id}>
                                                {model.name}
                                            </MenuItem>
                                        )
                                    )
                            }
                        </Select>
                    </FormControl>

                    <FormControl
                        sx={{ fontSize: "0.8rem", width: "100%", marginTop: "15px" }}
                        size="small"
                    >
                        <InputLabel id="filter-select-label" sx={{ fontSize: "0.8rem" }}>
                            {t('Select quantity')}
                        </InputLabel>
                        <Select
                            labelId="filter-select-label"
                            value={userData.count_images_generate}
                            onChange={(e) => {
                                sendData({
                                    action: "update_count_images_generate",
                                    data: {
                                        jwt: token,
                                        quantity: e.target.value,
                                    }
                                })
                            }}
                            label={t('Select quantity')}
                            sx={{ fontSize: "0.8rem", height: "40px", width: "100%" }}
                        >
                            <MenuItem value={1}>
                                1
                            </MenuItem>
                            <MenuItem value={2}>
                                2
                            </MenuItem>
                            <MenuItem value={3}>
                                3
                            </MenuItem>
                            <MenuItem value={4}>
                                4
                            </MenuItem>
                            <MenuItem value={5}>
                                5
                            </MenuItem>
                            <MenuItem value={6}>
                                6
                            </MenuItem>
                            <MenuItem value={9}>
                                9
                            </MenuItem>

                        </Select>
                    </FormControl>
                    {
                        !editImage && (userData.current_ai_id === 1 || userData.current_ai_id === 2) ? (
                            <FormControl
                                sx={{ fontSize: "0.8rem", width: "100%", marginTop: "15px" }}>
                                <InputLabel id="filter-select-label" sx={{ fontSize: "0.8rem" }}>
                                    {t('Select photo format')}
                                </InputLabel>
                                <Select
                                    labelId="filter-select-label"
                                    value={photoFormat}
                                    onChange={(e) => setPhotoFormat(e.target.value)}
                                    sx={{ fontSize: "0.8rem", height: "40px", width: "100%" }}
                                    label={t('Select photo format')}
                                >
                                    <MenuItem value="1:1">1:1</MenuItem>
                                    <MenuItem value="3:4">3:4</MenuItem>
                                    <MenuItem value="9:16">9:16</MenuItem>
                                    <MenuItem value="16:9">16:9</MenuItem>
                                    <MenuItem value="4:5">4:5</MenuItem>
                                </Select>
                            </FormControl>
                        ) : null
                    }
                </div>

                {
                    (currentModelFields.avatar !== undefined) || promptData?.photo_id ? (
                        <FormControl
                            sx={{ fontSize: "0.8rem", width: "100%", marginTop: "15px" }}
                            size="small"
                        >
                            <InputLabel id="filter-select-label" sx={{ fontSize: "0.8rem" }}>
                                {t('select_avatar')}
                            </InputLabel>
                            <Select
                                labelId="filter-select-label"
                                value={userData.current_model_id}
                                onChange={(e) => {
                                    sendData({
                                        action: "update_selected_avatar",
                                        data: {
                                            jwt: token,
                                            avatarId: e.target.value,
                                        }
                                    })
                                }}
                                label={t('feed_type')}
                                sx={{ fontSize: "0.8rem", height: "40px", width: "100%" }}
                            >
                                {myLoras?.map((model) =>
                                    model.status === 'ready' && (
                                        <MenuItem key={model.id} value={model.id}>
                                            {model.name}
                                        </MenuItem>
                                    )
                                )}
                                {
                                    myLoras?.length < 1 && (
                                        <MenuItem value={63}>Paul Du Rove</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                    ) : null
                }

                <div className={styles.content}>
                    <div className={styles.stepContent}>
                        {(currentModelFields.prompt === 'required' && !promptId) || editImage ? (
                            <>
                                <h2>{t('enter_prompt')}</h2>
                                <textarea
                                    ref={textareaRef}
                                    value={prompt}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    rows={1}
                                    className="input-field caption-field"
                                    placeholder={t('Describe what you want to create...')}
                                    onChange={(e) => {
                                        setPrompt(e.target.value);
                                    }}
                                    style={{ resize: 'none', overflow: 'auto', maxHeight: "200px" }}
                                />
                                <div className="w-100 d-flex justify-content-end">
                                    <span className={"caption"}>{prompt.length}</span>
                                </div>
                            </>
                        ) : null}
                        {(((currentModelFields.image === 'required' || currentModelFields.image === 'optional') && !promptId) || (promptData && promptData?.edit_photo === true && promptId)) && !editImage ? (
                            <>
                                <h2 style={{ marginBottom: '10px' }}>{t('Upload image')}</h2>
                                {
                                    image && (
                                        <img src={image} width={100} style={{ borderRadius: "12px" }} />
                                    )
                                }
                                <label
                                    htmlFor="upload-image"
                                    style={{
                                        display: 'inline-block',
                                        padding: '10px 20px',
                                        background: 'var(--button-secondary-bg-color)',
                                        borderRadius: '12px',
                                        color: '#000',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                        transition: 'background 0.3s ease',
                                        textAlign: 'center',
                                        maxWidth: '100%',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#e0e0e0'}
                                    onMouseLeave={(e) => e.target.style.background = '#f1f1f1'}
                                >
                                    {image ? t('Edit choose image') : t('Choose image')}
                                </label>
                                <input
                                    type="file"
                                    id="upload-image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setImage(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </>
                        ) : null}
                        <button className={"publish-button w-100"} onClick={() => {
                            sendData(
                                {
                                    action: "generate/photo/avatar",
                                    data: {
                                        jwt: token,
                                        callback_data: promptId !== undefined ? "repeat_webapp_prompt" : "webapp",
                                        promptData: promptId !== undefined ? promptId : prompt,
                                        ...(currentModelFields.image || (promptId && promptData?.edit_photo === true) ? { image: image } : {}),
                                        ...(editImage ? {image_for_edit: photoId} : {})
                                    }
                                }
                            );
                            navigate('/studio/create');
                        }}>
                            {
                                promptId ? (
                                    <>{t("Repeat")}</>
                                ) : (
                                    <>{t('Create')}</>
                                )
                            }
                        </button>
                        {
                            promptData && promptData.repeat_price > 0 && promptData.owner !== userData.id ? (
                                <p><img src={redSirenAnimation} width={18} /> Вы собираетесь повторить промт, за который автор установил цену в <span className={"no-wrap"}>{promptData.repeat_price} <img src={animationStarGold} width={12} /></span>. С Вас спишется <span className={"no-wrap"}>{ (promptData.repeat_price * userData.count_images_generate + userData.count_images_generate) * (editImage ? 2 : 1) } <img src={animationStarGold} width={12} /></span></p>
                            ) : (
                                <p><img src={redSirenAnimation} width={18} /> С Вас спишется <span className={"no-wrap"}>{ userData.count_images_generate * (editImage || (!editImage && userData.current_ai_id === 3) ? 2 : 1) } <img src={animationStarGold} width={12} /></span></p>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GenerateImageAvatar;
