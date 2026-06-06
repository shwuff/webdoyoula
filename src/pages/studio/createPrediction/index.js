import React, {useEffect, useState} from 'react';
import styles from './css/GenerateImageAvatar.module.css';
import {useAuth} from "../../../app/providers/UserContext";
import {useWebSocket} from "../../../app/providers/WebSocketContext";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Button, Checkbox, FormControlLabel} from "@mui/material";
import animationStarGold from "../../../assets/gif/gold_star.gif";
import DynamicFieldRenderer from "../../../components/dynamic_field_render/DynamicFieldRenderer";
import config from "../../../app/config/config";
import RunsIcon from "../../../assets/svg/RunsIcon";
import ClockIcon from "../../../assets/svg/ClockIcon";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {useSelector} from "react-redux";
import Video from "../../../components/player/Video";
import ErrorList from "../../../components/list/ErrorList";
import Joyride from "react-joyride";
import CustomJoyrideTooltip from "../../../components/joyride/CustomJoyrideTooltip";
import Switch from "../../../components/teegee/Switch";

const Index = ({ editImage = false }) => {

    const { t} = useTranslation();

    const { owner, model, prompt_id} = useParams();
    const navigate = useNavigate();
    const { token, userData } = useAuth();
    const { sendData, addHandler, deleteHandler } = useWebSocket();
    const imageSelector = useSelector(state => state.image.images);

    const [searchParams] = useSearchParams();
    const get_prompt_id = searchParams.get('promptId');
    const image_id_animate = searchParams.get('image_id_animate');

    const [slug, setSlug] = useState(searchParams.get('selected_model') ? searchParams.get('selected_model') : owner !== undefined ? owner + '/' + model : null);

    const availableModels = useSelector(state => state.model.models);
    const [loading, setLoading] = useState(false);
    const [promptData, setPromptData] = useState(null);
    const [paidOptionsPrice, setPaidOptionsPrice] = useState(0);
    const [isPromptReceived, setIsPromptReceived] = useState(false);

    const [error, setError] = useState([]);

    const [currentSteps, setCurrentSteps] = useState([]);
    const [instructionOpen, setInstructionOpen] = useState(false);

    const [dynamicFieldValues, setDynamicFieldValues] = useState({});
    const [currentModelFields, setCurrentModelFields] = useState({});
    const [currentModel, setCurrentModel] = useState(null);

    const [publicPrompt, setPublicPrompt] = useState(true);

    useEffect(() => {
        if (currentModelFields && Object.keys(currentModelFields).length > 0) {
            const steps = Object.entries(currentModelFields)
                .filter(([fieldName]) => fieldName !== 'prompt' && fieldName !== 'settings')
                .map(([fieldName]) => ({
                    target: `#field-${fieldName}`,
                    title: t(`instruction.title_${fieldName}`),
                    content: t(`instruction.${fieldName}`),
                    disableBeacon: true,
                }));

            setCurrentSteps(steps);
        }
    }, [currentModelFields, t]);

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
        const selectedModel = availableModels.find(model => model.slug === slug);
        // console.log(currentModelFields);
        // console.log(Object.entries(currentModelFields).length > 0, Object.entries(currentModelFields).length > 0, Object.entries(dynamicFieldValues).length === 0, selectedModel);
        if (Object.entries(currentModelFields).length > 0 && Object.entries(currentModelFields).length > 0 && Object.entries(dynamicFieldValues).length === 0 && selectedModel) {
            const initial = {};
            for (const [key, field] of Object.entries(currentModelFields)) {
                initial[key] = field.value ?? '';
            }
            setDynamicFieldValues(initial);

            if(promptData && promptData.public) {
                setDynamicFieldValues({ ...initial, 'prompt': promptData.original_prompt });
            }
        }
    }, [currentModelFields, dynamicFieldValues, slug]);

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
            if(searchParams.get("selected_model") === null) {
                setSlug(msg.prompt.slug);
            }
        }

        addHandler("receive_prompt_data", handleReceivePromptData);

        return () => deleteHandler("receive_prompt_data", handleReceivePromptData);

    }, [addHandler, deleteHandler, setPromptData]);

    useEffect(() => {

        const handleError = (msg) => {
            const parseErrors = (errorData) => {
                if (typeof errorData === 'string') {
                    return [errorData];
                } else if (Array.isArray(errorData)) {
                    return errorData;
                } else if (typeof errorData === 'object' && errorData !== null) {
                    return Object.values(errorData);
                } else {
                    return [String(errorData)];
                }
            };

            if (msg.message !== undefined) {
                window.Telegram.WebApp?.HapticFeedback?.impactOccurred('heavy');
                setError(parseErrors(msg.message));
                setLoading(false);
            } else if (msg.messages !== undefined) {
                window.Telegram.WebApp?.HapticFeedback?.impactOccurred('heavy');
                setError(parseErrors(msg.messages));
                setLoading(false);
            }
        }

        addHandler("error_during_generation", handleError);

        return () => deleteHandler("error_during_generation", handleError);

    }, [addHandler, deleteHandler, setPromptData]);

    useEffect(() => {

        if(prompt_id !== undefined) {
            sendData({
                action: "get/prompt/" + prompt_id,
                data: { jwt: token }
            });
        }

    }, [prompt_id]);

    useEffect(() => {
        if (
            currentModel &&
            currentModel.paid_options &&
            typeof currentModel.paid_options === 'object'
        ) {
            const calc = async () => {
                let totalPrice = 0;

                for (const key in dynamicFieldValues) {
                    const selectedValue = dynamicFieldValues[key];
                    const options = currentModel.paid_options[key];
                    if (!options) continue;

                    if (!key.includes('__seconds')) {
                        if (!isNaN(selectedValue) && typeof selectedValue === 'number') {
                            const valueInt = Number(selectedValue);

                            if ('0' in options) {
                                totalPrice += Number(options['0']) * valueInt;
                            } else {
                                let thresholdPrice = 0;
                                for (const threshold in options) {
                                    if (valueInt >= Number(threshold)) {
                                        thresholdPrice = Number(options[threshold]);
                                    }
                                }
                                totalPrice += thresholdPrice;
                            }
                        } else if (options.hasOwnProperty(selectedValue)) {
                            totalPrice += Number(options[selectedValue]);
                        }
                    }
                }

                for (const key in currentModel.paid_options) {

                    if (!key.includes('__seconds')) continue;

                    const [fieldPart, ...conditionsParts] = key.split('&');

                    const [fieldName] = fieldPart.split('__');

                    let conditionsOk = true;
                    for (const cond of conditionsParts) {
                        if (!cond.includes(':')) continue;

                        const [condField, condValue] = cond.split(':');

                        let fieldValue = dynamicFieldValues[condField];
                        if (fieldValue == null) {
                            conditionsOk = false;
                            break;
                        }

                        if (!['prompt', 'aspect_ratio', 'lora'].includes(condField) && typeof fieldValue === 'string' && fieldValue.includes(':')) {
                            const parts = fieldValue.split(':');
                            fieldValue = parts[parts.length - 1];
                        }

                        if (String(fieldValue) !== condValue) {
                            conditionsOk = false;
                            break;
                        }
                    }


                    if (!conditionsOk) continue;

                    const options = currentModel.paid_options[key];
                    const pricePerSecond = Number(options['1']) || 0;

                    let seconds = 0;
                    const file = dynamicFieldValues[fieldName];

                    if (typeof file === "string" && file.trim() !== "") {
                        try {
                            const duration = await getVideoDuration(file);
                            seconds = Math.max(0, Math.ceil(duration));
                        } catch (error) {
                            console.error("Error getting video duration:", error);
                        }
                    }

                    totalPrice += seconds * pricePerSecond;
                }
                setPaidOptionsPrice(totalPrice);
            }

            calc();
        }


    }, [currentModel, dynamicFieldValues]);

    useEffect(() => {

        const handleClickBackButton = () => {
            if (instructionOpen) {
                setInstructionOpen(false);
            } else {
                navigate('/studio/create');
            }
        }

        if(userData.is_telegram) {

            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(handleClickBackButton);
        }

        return () => {
            window.Telegram.WebApp.BackButton.hide();
            window.Telegram.WebApp.BackButton.offClick(handleClickBackButton);
        };

    }, [userData, instructionOpen]);

    useEffect(() => {
        if(get_prompt_id !== undefined && get_prompt_id !== null && get_prompt_id.length > 0 && Object.entries(dynamicFieldValues).length > 0 && !isPromptReceived) {
            sendData({
                action: "prompt/get/" + get_prompt_id,
                data: { jwt: token }
            });

            setIsPromptReceived(true);
        }
    }, [dynamicFieldValues, get_prompt_id, isPromptReceived]);

    useEffect(() => {
        if (image_id_animate && Object.entries(dynamicFieldValues).length > 0 && !isPromptReceived) {
            const imageUrl = imageSelector[image_id_animate]?.media_url;

            if (!imageUrl) return;

            blobUrlToBase64(imageUrl).then(base64 => {
                setDynamicFieldValues(prev => {
                    const updated = { ...prev };

                    Object.keys(updated).forEach(key => {
                        if (key.includes('image')) {
                            updated[key] = base64;
                        }
                    });

                    return updated;
                });
            });

            setIsPromptReceived(true);
        }
    }, [image_id_animate, dynamicFieldValues]);

    useEffect(() => {
        const handleReceivedPrompt = (msg) => {
            setDynamicFieldValues(prev => ({ ...prev, 'prompt': msg.prompt }));
        }

        addHandler("received_prompt_text", handleReceivedPrompt);

        return () => deleteHandler("received_prompt_text");
    }, [dynamicFieldValues, setDynamicFieldValues]);

    function getVideoDuration(value) {
        return new Promise((resolve) => {
            if (!value) return resolve(0);

            let blob = null;

            if (value instanceof File) {
                blob = value;
            }

            else if (typeof value === "string" && value.startsWith("data:video")) {
                const arr = value.split(",");
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);

                while (n--) u8arr[n] = bstr.charCodeAt(n);
                blob = new Blob([u8arr], { type: mime });
            }

            if (!blob) return resolve(1);

            const url = URL.createObjectURL(blob);
            const video = document.createElement("video");
            video.preload = "metadata";
            video.src = url;

            video.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve(Math.max(0, Math.ceil(video.duration)));
            };

            video.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(0);
            };
        });
    }

    const validateDependentFields = (values, settings) => {
        const errors = {};

        const orientation = values.character_orientation;
        if (!orientation) return errors;

        const key = `character_orientation:${orientation}`;
        const rules = settings[key];
        if (!rules) return errors;

        for (const [field, rule] of Object.entries(rules)) {
            if (field === "video__seconds" && values.video) {
                const duration = getVideoDuration(values.video);
                const match = rule.match(/(<=|>=|<|>)(\d+)/);
                if (match) {
                    const [, operator, limitStr] = match;
                    const limit = Number(limitStr);
                    let invalid = false;
                    if (operator === "<=" && !(duration <= limit)) invalid = true;
                    if (operator === ">=" && !(duration >= limit)) invalid = true;
                    if (operator === "<" && !(duration < limit)) invalid = true;
                    if (operator === ">" && !(duration > limit)) invalid = true;
                    if (invalid) errors.video = `Видео должно быть ${rule}`;
                }
            }
        }

        return errors;
    };

    const onChange = (name, val) => {
        setDynamicFieldValues(prev => {
            const newValues = { ...prev, [name]: val };
            const errors = validateDependentFields(newValues, currentModelFields.settings || []);
            return { ...newValues, ...errors };
        });
    };

    const renderFields = () => (
        Object.entries(currentModelFields).map(([fieldName, fieldConfig]) => (
            <DynamicFieldRenderer
                key={fieldName}
                name={fieldName}
                config={fieldConfig}
                value={dynamicFieldValues[fieldName]}
                onChange={(name, val) => setDynamicFieldValues(prev => ({ ...prev, [name]: val }))}
                isRepeat={promptData !== {}}
                promptData={promptData}
                id={`field-${fieldName}`}
            />
        ))
    );

    function blobUrlToBase64(blobUrl) {
        return fetch(blobUrl) // забираем реальный Blob по ссылке
            .then(res => res.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result); // data:image/png;base64,...
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }));
    }

    if(currentModel === null) {
        return <CircularProgress />
    }

    if(availableModels.find(model => model.slug === slug) === undefined && !loading) {
        return (
            <div className={"p-2 d-flex justify-content-center w-100"} style={{flexDirection: "column", width: "100%", justifyContent: "center", height: "100vh", alignItems: "center"}}>
                <h2>{t('Model not found')}</h2>
                <Link to={"/studio/create"} style={{ color: "#0000FF" }}>{t('Back to models')}</Link>
            </div>
        )
    }

    return (
        <div className={`globalBlock`}>

            <div className={"center-content-block"} style={{
                height: 'auto',
                paddingBottom: '100px',
                boxSizing: 'border-box',
            }}>
                <h2><span className={"text-muted"}>{currentModel.owner} / </span>{currentModel.name}</h2>
                <div className={styles.modelPreview}>
                    <div className={styles.header}>
                        <img style={{ aspectRatio: "16/9" }} src={`${config.apiUrl}public/model_logo/${currentModel.logo}`} alt={""} />
                        <div className={styles.info}>
                            <div className="d-flex" style={{ gap: '15px' }}>
                                <Tooltip
                                    title={t('Total runs')}
                                    slotProps={{
                                        tooltip: {
                                            sx: {
                                                color: 'var(--text-color)',
                                                fontSize: '14px',
                                            }
                                        }
                                    }}
                                >
                                    <span className={styles.runs}>
                                        <RunsIcon />
                                        {currentModel.runs}
                                    </span>
                                </Tooltip>

                                <Tooltip
                                    title={t('Average generation time')}
                                    slotProps={{
                                        tooltip: {
                                            sx: {
                                                color: 'var(--text-color)',
                                                fontSize: '14px',
                                            }
                                        }
                                    }}
                                >
                                    <span className={styles.runs}>
                                        <ClockIcon />
                                        {currentModel.average_time}s
                                    </span>
                                </Tooltip>
                            </div>
                            {
                                (currentModel.name === 'flux-schnell' || currentModel.name === 'flux-dev') && (
                                    <i style={{ color: 'blue', textDecoration: "underline" }} className={"c-pointer"} onClick={() => navigate('/settings/content')}>Обучить модель со своим лицом</i>
                                )
                            }
                            {
                                promptData?.media_id && (
                                    <div>
                                        <button onClick={() => navigate("/studio/create?repeat_id=" + promptData?.uuid)} className={"btn btn-primary"} style={{ marginTop: "8px" }}>{t('Change model')}</button>
                                    </div>
                                )
                            }
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
                            </>
                        )
                    }

                </div>

                <p style={{ marginTop: "4px" }}>{currentModel.mini_description}</p>

                <hr />

                {/*<ModelInstructionModal open={instructionOpen} setOpen={setInstructionOpen} description={currentModel.description} />*/}

                <Button onClick={() => {
                    setInstructionOpen(false);
                    setTimeout(() => setInstructionOpen(true), 50);
                }} variant="outlined" sx={{ marginBottom: 2 }}>
                    {t("Show instructions")}
                </Button>

                {renderFields()}

                {
                    promptData === null && (
                        <>
                            <hr />

                            <FormControlLabel
                                control={
                                    <Switch checked={publicPrompt} onChange={(e) => {
                                            setPublicPrompt(e.target.checked)
                                        }
                                    }
                                    />
                                }
                                label={t('Public prompt')}
                                sx={{ maxWidth: "max-content", marginLeft: "2px", display: "flex", gap: "8px" }}
                            />
                        </>
                    )
                }

                <hr />

                {
                    promptData?.repeat_price || promptData?.repeat_price > 0 ? (
                        <p style={{ marginBottom: "4px" }}>
                            {/*<img src={redSirenAnimation} width={18} alt={"Red Siren"} /> */}
                            Повтор промта за {promptData.repeat_price} <img src={animationStarGold} width={12} alt={"Star"} />
                        </p>
                    ) : null
                }

                <ErrorList error={error} />

                <Button
                    variant="action"
                    sx={{ width: "100%", opacity: loading ? 0.6 : 1, fontSize: "16px" }}
                    disabled={loading}
                    onClick={() => {
                        setLoading(true);

                        sendData({
                            action: "prediction/create",
                            data: {
                                jwt: token,
                                slug: slug,
                                ...(promptData ? {} : {public_prompt: publicPrompt}),
                                input_data: {
                                    ...dynamicFieldValues,
                                    ...(prompt_id !== undefined && prompt_id !== null && (promptData.public === false || (promptData.public === true && promptData.original_prompt !== dynamicFieldValues.prompt)) ? {prompt: prompt_id} : {}),
                                },
                            }
                        });

                        setLoading(true);
                    }}
                >
                    {loading ? (
                            <CircularProgress size={20} sx={{ color: 'var(--text-color)' }} />
                        ) : (
                            <div style={{ gap: "8px", width: "100%" }} className={"d-flex align-items-center justify-content-between"}>
                                <div></div>
                                <span className={"no-wrap d-flex align-items-center"} style={{ color: "var(--button-text-color)" }}>
                                    {t("Generation price")}  { (dynamicFieldValues.quantity || 1) * currentModel.price + (dynamicFieldValues.quantity || 1) * paidOptionsPrice + ((promptData?.repeat_price || 0) * (dynamicFieldValues.quantity || 1)) }
                                    <img src={animationStarGold} width={16} style={{ marginLeft: "4px" }} alt={"Star"} />
                                </span>
                                <RunsIcon color={"#ffffff"} />
                            </div>
                        )
                    }
                </Button>
            </div>
            <Joyride
                steps={currentSteps}
                run={instructionOpen}
                continuous={true}
                showSkipButton={true}
                scrollToFirstStep={true}
                tooltipComponent={CustomJoyrideTooltip}
                styles={{
                    options: {
                        zIndex: 10000,
                        primaryColor: "#1976d2",
                        borderRadius: "8px",
                    },
                }}
            />

        </div>
    );
};

export default Index;
