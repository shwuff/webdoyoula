import React, {useEffect, useState} from 'react';
import styles from './css/GenerateImageAvatar.module.css';
import {useAuth} from "../../../context/UserContext";
import {useWebSocket} from "../../../context/WebSocketContext";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Button} from "@mui/material";
import animationStarGold from "../../../assets/gif/gold_star.gif";
import redSirenAnimation from "./../../../assets/gif/red_siren.gif";
import DynamicFieldRenderer from "../../../components/DynamicFieldRenderer";
import config from "../../../config";
import RunsIcon from "../../../assets/svg/RunsIcon";
import ClockIcon from "../../../assets/svg/ClockIcon";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import AllPage from "../../../components/loading/AllPage";
import {useSelector} from "react-redux";
import Video from "../../../components/player/Video";
import Image from "../../../components/gallery/Image";
import ErrorList from "../../../components/list/ErrorList";

const GenerateImageAvatar = ({ editImage = false }) => {

    const { t} = useTranslation();

    const { owner, model, prompt_id} = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { sendData, addHandler, deleteHandler } = useWebSocket();
    const imageSelector = useSelector(state => state.image.images);

    const [slug, setSlug] = useState(owner + '/' + model);
    const promptId = undefined;
    const photoId = undefined;

    const [currentModelFields, setCurrentModelFields] = useState({});
    const [currentModel, setCurrentModel] = useState(null);
    const [availableModels, setAvailableModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [promptData, setPromptData] = useState({});

    const [error, setError] = useState([]);

    const [dynamicFieldValues, setDynamicFieldValues] = useState({});

    useEffect(() => {
        const selectedModel = availableModels.find(model => model.slug === slug);
        if (selectedModel?.fields) {
            setCurrentModelFields(selectedModel.fields);
            setCurrentModel(selectedModel);
        } else {
            setCurrentModelFields({});
        }
    }, [availableModels, slug]);

    useEffect(() => {
        if(token) {
            sendData({
                action: "get/models",
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
        if (currentModelFields) {
            const initial = {};
            for (const [key, field] of Object.entries(currentModelFields)) {
                initial[key] = field.value ?? '';
            }
            setDynamicFieldValues(initial);
        }
    }, [currentModelFields]);

    useEffect(() => {
        const onPredictionCreated = (msg) => {
            setLoading(false);
            navigate('/settings');
        };

        addHandler("prediction/created", onPredictionCreated);
        return () => deleteHandler("prediction/created");
    }, [addHandler, deleteHandler]);

    useEffect(() => {

        const handleReceivePromptData = (msg) => {
            setPromptData(msg.prompt);
            setSlug(msg.prompt.slug);

            sendData({
                action: "get/media/"
            })
        }

        addHandler("receive_prompt_data", handleReceivePromptData);

        return () => addHandler("receive_prompt_data", handleReceivePromptData);

    }, [addHandler, deleteHandler, setPromptData]);

    useEffect(() => {

        const handleError = (msg) => {
            console.log(msg);
            if(msg.message !== undefined) {
                setError([msg.message]);
                setLoading(false);
            } else if(msg.messages !== undefined) {
                setError(Object.values(msg.messages));
                setLoading(false);
            }
        }

        addHandler("error_during_generation", handleError);

        return () => addHandler("error_during_generation", handleError);

    }, [addHandler, deleteHandler, setPromptData]);

    useEffect(() => {

        if(prompt_id !== undefined) {
            sendData({
                action: "get/prompt/" + prompt_id,
                data: { jwt: token }
            });
        }

    }, [prompt_id]);

    if(currentModel === null) {
        return <AllPage />
    }

    return (
        <div className={`globalBlock`} style={{ paddingTop: "var(--safeAreaInset-top)" }}>

            <div className={"center-content-block"} style={{
                /* либо auto+padding, либо calc от %: */
                height: 'auto',
                paddingBottom: '100px',
                boxSizing: 'border-box',
            }}>

                <div className={styles.modelPreview}>

                    <div className={styles.header}>
                        <img src={`${config.apiUrl}public/models_logo/${currentModel.logo}`} />
                        <div className={styles.info}>
                            <h2><span className={"text-muted"}>{currentModel.owner} / </span>{currentModel.name}</h2>
                            <div className="d-flex" style={{ gap: '15px' }}>
                                <Tooltip title={t('Total runs')}>
                                    <span className={styles.runs}>
                                        <RunsIcon />
                                        {currentModel.runs}
                                    </span>
                                </Tooltip>

                                <Tooltip title={t('Average generation time')}>
                                    <span className={styles.runs}>
                                        <ClockIcon />
                                        {currentModel.average_time}s.
                                    </span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    {
                        promptData?.media_id && (
                            <>
                                <div className={styles.promptPreview} >
                                    <div className={styles.exampleMedia}>
                                        {
                                            imageSelector[promptData.media_id].file_type === 'image' ? (
                                                <img src={imageSelector[promptData.media_id].media_url} style={{ borderRadius: "12px", height: "200px" }} alt={"Prompt example"} />
                                            ) : (
                                                <div style={{ width: "220px" }}>
                                                    <Video videoUrl={imageSelector[promptData.media_id].media_url} style={{ borderRadius: "12px" }} />
                                                </div>
                                            )
                                        }
                                        {/*<Image mediaId={promptData.media_id} style={{ borderRadius: "12px", height: "200px" }} />*/}
                                    </div>
                                    <Tooltip title={t("Prompt's author")}>
                                        <div className={`glass-card ${styles.promptAuthor}`} onClick={() => navigate(`/profile/${promptData.author?.id}`)}>
                                            <img src={promptData.author?.photo_url} className={styles.authorAvatar} alt={promptData.author?.first_name} />
                                            <div className={styles.authorInfo}>
                                                <p>{promptData.author.first_name} {promptData.author.last_name}</p>
                                                <span className={'text-muted'}>{promptData.author.username ? "@" + promptData.author.username : ''}</span>
                                            </div>
                                        </div>
                                    </Tooltip>
                                </div>
                                <hr className={styles.hiddenHr} />
                            </>
                        )
                    }

                </div>

                {Object.entries(currentModelFields).map(([fieldName, fieldConfig]) => (
                    <DynamicFieldRenderer
                        key={fieldName}
                        name={fieldName}
                        config={fieldConfig}
                        value={dynamicFieldValues[fieldName]}
                        onChange={(name, val) => {
                            setDynamicFieldValues(prev => ({ ...prev, [name]: val }));
                        }}
                        isRepeat={promptData?.media_id ? true : false}
                    />
                ))}

                <hr />

                <ErrorList error={error} />

                <Button
                    variant="action"
                    sx={{ width: "100%", opacity: loading ? 0.6 : 1 }}
                    disabled={loading}
                    onClick={() => {
                        setLoading(true);

                        sendData({
                            action: "prediction/create",
                            data: {
                                jwt: token,
                                slug: slug,
                                input_data: {
                                    ...dynamicFieldValues,
                                    ...(prompt_id !== undefined && prompt_id !== null ? {prompt: prompt_id} : {}),
                                },
                            }
                        });

                        setLoading(true);
                    }}
                >
                    {loading ? (
                        <CircularProgress size={20} sx={{ color: 'var(--text-color)' }} />
                    ) : promptData.uuid ? (
                        <div style={{ gap: "8px" }} className={"d-flex align-items-center"}>{t("Repeat")} <RunsIcon/> </div>
                    ) : (
                        <div style={{ gap: "8px" }} className={"d-flex align-items-center"}>{t("Create")} <RunsIcon/> </div>
                    )}
                </Button>
                <hr />
                {
                    !promptData?.repeat_price || promptData?.repeat_price < 1 ? (
                        <p>
                            <img src={redSirenAnimation} width={18} alt={"Red Siren"} /> С Вас спишется <span className={"no-wrap"}>{ (dynamicFieldValues.quantity || 1) * currentModel.price }
                            <img src={animationStarGold} width={12} alt={"Star"} /></span>
                        </p>
                    ) : (
                        <p>
                            <img src={redSirenAnimation} width={18} alt={"Red Siren"} /> Вы повторяете prompt стоимостью {promptData.repeat_price} <img src={animationStarGold} width={12} alt={"Star"} />.
                            С Вас спишется <span className={"no-wrap"}>{ (dynamicFieldValues.quantity || 1) * currentModel.price + promptData.repeat_price * (dynamicFieldValues.quantity || 1) }
                            <img src={animationStarGold} width={12} alt={"Star"} /></span>
                        </p>
                    )
                }
            </div>
        </div>
    );
};

export default GenerateImageAvatar;
