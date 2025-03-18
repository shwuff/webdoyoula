import React, {memo, useEffect, useState} from 'react';
import styles from './css/GenerateImageAvatar.module.css';
import {FaRobot, FaCog, FaHourglassHalf, FaCheckCircle, FaSortNumericUp, FaUser, FaCheck} from 'react-icons/fa';
import {useAuth} from "../../../context/UserContext";
import {useWebSocket} from "../../../context/WebSocketContext";
import {useInView} from "react-intersection-observer";
import {animated, useSpring} from "@react-spring/web";
import {useNavigate, useParams} from "react-router-dom";

const PhotoCardComponent = ({ photo, index, openModal, toggleSelectPhoto, isSelected }) => {
    const { ref, inView } = useInView({ threshold: 0.01, triggerOnce: true });

    const style = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0px)' : 'translateY(20px)',
        config: { tension: 55, friction: 9 },
        delay: inView ? Math.min(index * 20, 100) : 0,
    });

    const handleCircleClick = (e) => {
        e.stopPropagation();
        toggleSelectPhoto(photo.id);
    };

    return (
        <animated.div ref={ref} style={style} className={styles.photoCard} onClick={() => openModal(photo.id)}>
            {photo.blob_url && photo.status !== 'processing' ? (
                <img src={photo.blob_url} alt={`photo-${photo.id}`} className={styles.photoImage} />
            ) : (
                <div className={styles.loadingPlaceholder}>
                    <svg className="spinner" viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                </div>
            )}

            {
                photo.status !== 'processing' && (
                    <div
                        className={`${styles.selectCircle} ${isSelected ? styles.selected : ''}`}
                        onClick={handleCircleClick}
                    >
                        {isSelected && <FaCheck className={styles.checkIcon}/>}
                    </div>
                )
            }
        </animated.div>
    );
};

const areEqual = (prevProps, nextProps) =>
    prevProps.photo.id === nextProps.photo.id &&
    prevProps.isSelected === nextProps.isSelected;
const PhotoCard = memo(PhotoCardComponent, areEqual);

const GenerateImageAvatar = () => {
    const [step, setStep] = useState(1);
    const [mediaGroup, setMediaGroup] = useState(0);
    const [aiStyles, setAiStyles] = useState([]);

    const {promptId} = useParams();

    const navigate = useNavigate();

    const [completedImages, setCompletedImages] = useState([]);

    const [generationType, setGenerationType] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const availableQuantities = [2, 3, 4, 5, 6, 9];

    const [selectedModel, setSelectedModel] = useState(0);

    const [selectedStyle, setSelectedStyle] = useState(0);
    const [prompt, setPrompt] = useState('');

    const { myModels, token } = useAuth();
    const { sendData, addHandler, deleteHandler } = useWebSocket();

    const stepIcons = promptId !== undefined ? [FaUser, FaSortNumericUp] : [FaUser, FaRobot, FaCog, FaSortNumericUp];

    const nextStep = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setStep(prev => Math.min(prev + 1, 6));
    };
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const fillWidth = promptId === undefined ? ((step - 1) / (stepIcons.length - 1)) * 100 : step === 1 ? 0 : (3 / 3) * 100;

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
        if(generationType === 'style' && step === 3) {
            sendData({action: "get/styles/avatar", data: { jwt: token, answerAction: "aistyles_for_generate_photo_avatar" }});
        }
    }, [generationType, step]);

    useEffect(() => {

        const handleHandler = (msg) => {
            setAiStyles(msg.styles);
        }

        addHandler('aistyles_for_generate_photo_avatar', handleHandler)

        return () => deleteHandler('aistyles_for_generate_photo_avatar');
    }, []);

    useEffect(() => {

        // const MainButton = window.Telegram.WebApp.MainButton;
        //
        // if(step === 1 && selectedModel > 0) {
        //     MainButton.show();
        //     MainButton.text = 'Далее'
        //     MainButton.onClick(() => {
        //         window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        //         setStep(Math.min(step + 1, 6));
        //     });
        // } else if(step === 2 && generationType !== null) {
        //     MainButton.show();
        //     MainButton.text = 'Далее'
        //     MainButton.onClick(() => {
        //         window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        //         setStep(Math.min(step + 1, 6));
        //     });
        // } else if(step === 3 && generationType === 'style' && selectedStyle > 0) {
        //     MainButton.show();
        //     MainButton.text = 'Далее'
        //     MainButton.onClick(() => {
        //         window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        //         setStep(Math.min(step + 1, 6));
        //     });
        // } else if(step === 3 && generationType === 'prompt' && prompt.length > 0) {
        //     MainButton.show();
        //     MainButton.text = 'Далее'
        //     MainButton.onClick(() => {
        //         window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        //         setStep(Math.min(step + 1, 6));
        //         handleBlur();
        //     });
        // } else if(step === 4 && quantity > 1) {
        //     MainButton.show();
        //     MainButton.text = 'Начать генерацию'
        //     MainButton.onClick(() => {
        //         window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        //         setStep(Math.min(step + 1, 6));
        //         sendData(
        //             {
        //                 action: "generate/photo/avatar",
        //                 data: {
        //                     jwt: token,
        //                     generationType,
        //                     promptData: prompt,
        //                     quantity,
        //                     selectedModel,
        //                     selectedStyle,
        //                     callback_data: "webapp"
        //                 }
        //             }
        //         );
        //     });
        // } else {
        //     MainButton.hide();
        // }
        //
        // return () => {
        //     MainButton.hide();
        //     MainButton.offClick();
        // }
    }, [step, generationType, prompt, quantity, selectedModel, nextStep, selectedStyle]);

    useEffect(() => {

        const handleGenAvatarCompleted = (msg) => {
            if(mediaGroup === msg.mediaGroupId) {
                setStep(6);
                setCompletedImages(msg.photos);
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

    const newGeneration = () => {
        setGenerationType(null);
        setSelectedModel(0);
        setSelectedStyle(0);
        setPrompt('');
        setQuantity(1);
        setStep(1);
        setMediaGroup(0);
    }

    return (
        <div className={styles.container}>
            <div className={styles.progressBar}>
                <div className={styles.progressLine} />
                <div
                    className={styles.progressLineFill}
                    style={{ width: `${fillWidth}%` }}
                />
                {stepIcons.map((Icon, idx) => {
                    const isActive = step >= (idx + 1);
                    return (
                        <div
                            key={idx}
                            className={`${styles.stepCircle} ${isActive ? styles.active : ''}`}
                        >
                            <Icon className={styles.stepIcon} />
                        </div>
                    );
                })}
            </div>

            <div className={styles.content}>

                {step === 1 && (
                    <div className={styles.stepContent}>
                        <h2>Выберите используемую модель</h2>
                        <div className={styles.amountsContainer}>
                            {myModels?.map((model) => (
                                <button
                                    key={model.id}
                                    className={`${styles.amountBtn} ${selectedModel === model.id ? styles.active : ''}`}
                                    onClick={() => {
                                        setSelectedModel(model.id);
                                        if(promptId !== undefined) {
                                            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                            setStep(4);
                                            setGenerationType('prompt');
                                        } else {
                                            nextStep();
                                        }
                                    }}
                                >
                                    {model.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContent}>
                        <h2>Выберите метод генерации</h2>
                        <div className={styles.amountsContainer}>
                            <button
                                className={`${styles.amountBtn} ${generationType === 'prompt' ? styles.active : ''}`}
                                onClick={() => {
                                    setGenerationType('prompt');
                                    nextStep();
                                }}
                            >
                                По запросу
                            </button>
                            <button
                                className={`${styles.amountBtn} ${generationType === 'style' ? styles.active : ''}`}
                                onClick={() => {
                                    setGenerationType('style');
                                    nextStep();
                                }}
                            >
                                По стилю
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && generationType === 'style' && (
                    <div className={styles.stepContent}>
                        <h2>Выберите стиль</h2>
                        <div className={styles.amountsContainer} style={{
                            overflowY: "scroll",
                            height: `calc(100vh - ${200 + window?.Telegram?.WebApp?.safeAreaInset?.top * 2}px)`
                        }}>
                            {aiStyles?.map((style) => (
                                <button
                                    key={style.id}
                                    className={`${styles.amountBtn} ${selectedStyle === style.id ? styles.active : ''}`}
                                    onClick={() => {
                                        style.id === selectedStyle ? setSelectedStyle(0) : setSelectedStyle(style.id);
                                        nextStep();
                                    }}
                                >
                                    {style.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {step === 3 && generationType === 'prompt' && (
                    <div className={styles.stepContent}>
                        <h2>Введите промт</h2>
                        <textarea
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder="Опишите, что хотите создать..."
                        />
                        {
                            prompt.length > 0 && (
                                <button className={"btn btn-primary w-100"} onClick={() => nextStep()}>Далее</button>
                            )
                        }
                    </div>
                )}

                {step === 4 && (
                    <div className={styles.stepContent}>
                        <h2>Выберите количество фотографий</h2>
                        <div className={styles.amountsContainer}>
                            {availableQuantities.map((val) => (
                                <button
                                    key={val}
                                    className={`${styles.amountBtn} ${quantity === val ? styles.active : ''}`}
                                    onClick={() => {
                                        sendData(
                                            {
                                                action: "generate/photo/avatar",
                                                data: {
                                                    jwt: token,
                                                    generationType,
                                                    quantity: val,
                                                    selectedModel,
                                                    selectedStyle,
                                                    callback_data: promptId !== undefined ? "repeat_webapp_prompt" : "webapp",
                                                    promptData: promptId !== undefined ? promptId : prompt
                                                }
                                            }
                                        );
                                        navigate('/studio/create');
                                    }}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default GenerateImageAvatar;
