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

const GenerateImageAvatar = () => {
    const [step, setStep] = useState(1);
    const [mediaGroup, setMediaGroup] = useState(0);
    const [availableModels, setAvailableModels] = useState([]);
    const [promptData, setPromptData] = useState(null);

    const { t} = useTranslation();

    const { userData, setUserData } = useAuth();
    const { promptId} = useParams();
    const navigate = useNavigate();
    const { myModels, token } = useAuth();
    const { sendData, addHandler, deleteHandler } = useWebSocket();

    const [photoFormat, setPhotoFormat] = useState(userData.aspect_ratio);
    const [prompt, setPrompt] = useState('');

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
                    jwt: token
                }
            });
        }
    }, [token]);

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

    return (
        <div className={styles.container} style={{ paddingTop: "var(--safeAreaInset-top)" }}>

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
                        value={userData.current_ai_id}
                        onChange={(e) => {
                            sendData({
                                action: "update_selected_model",
                                data: {
                                    jwt: token,
                                    modelId: e.target.value,
                                }
                            })
                        }}
                        label={t('feed_type')}
                        sx={{ fontSize: "0.8rem", height: "40px", width: "100%" }}
                    >
                        {availableModels?.map((model) =>
                            (
                                <MenuItem key={model.id} value={model.id}>
                                    {model.name}
                                </MenuItem>
                            )
                        )}
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
            </div>

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
                    {myModels?.map((model) =>
                            model.status === 'ready' && (
                                <MenuItem key={model.id} value={model.id}>
                                    {model.name}
                                </MenuItem>
                            )
                    )}
                    {
                        myModels.length < 1 && (
                            <MenuItem value={63}>Paul Du Rove</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <div className={styles.content}>
                <div className={styles.stepContent}>
                    {
                        !promptId && (
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
                        )
                    }
                    {
                        prompt.length > 0 || promptId ? (
                            <>
                                <button className={"publish-button w-100"} onClick={() => {
                                    sendData(
                                        {
                                            action: "generate/photo/avatar",
                                            data: {
                                                jwt: token,
                                                callback_data: promptId !== undefined ? "repeat_webapp_prompt" : "webapp",
                                                promptData: promptId !== undefined ? promptId : prompt
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
                            </>
                        ) : null
                    }
                    {
                        promptData && promptData.repeat_price > 0 && promptData.owner !== userData.id ? (
                            <p><img src={redSirenAnimation} width={18} /> Вы собираетесь повторить промт, за который автор установил цену в <span className={"no-wrap"}>{promptData.repeat_price} <img src={animationStarGold} width={12} /></span>. С Вас спишется <span className={"no-wrap"}>{ promptData.repeat_price * userData.count_images_generate + userData.count_images_generate } <img src={animationStarGold} width={12} /></span></p>
                        ) : (
                            <p><img src={redSirenAnimation} width={18} /> С Вас спишется <span className={"no-wrap"}>{ userData.count_images_generate } <img src={animationStarGold} width={12} /></span></p>
                        )
                    }
                </div>

            </div>
        </div>
    );
};

export default GenerateImageAvatar;
