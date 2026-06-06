import React, { useState, useRef, useEffect } from 'react';
import "./InputContainer.css";
import LucideIcon from "../../../../assets/icons/LucideIcon";
import MediaList from "../mediaList";
import {useTranslation} from "react-i18next";

const InputContainer = ({ onSendMessage, message, setMessage, uploadedMedia, handleFileSelect }) => {

    const {t} = useTranslation();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        if (value.length > 0 && !isExpanded) {
            setIsExpanded(true);
        } else if (value.length === 0 && isExpanded) {
            setIsExpanded(false);
        }
    };

    const handleSend = () => {
        if (message.trim()) {
            setMessage('');
            onSendMessage();
            setIsExpanded(false);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e) => {
        const relatedTarget = e.relatedTarget;
        const isClickOnButton = relatedTarget?.closest('.leftButton') ||
            relatedTarget?.closest('.rightButton');

        if (!isClickOnButton && message.length === 0) {
            setIsFocused(false);
            setIsExpanded(false);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';

            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 250;

            const newHeight = Math.min(35, maxHeight);

            textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
        }
    }, [message, isExpanded]);

    return (
        <div className="inputContainer">
            <div className="inputWrapper">
                <div className={`inputField ${isExpanded ? 'expanded' : ''} ${isFocused ? 'focused' : ''}`}>
                    <MediaList mediaList={uploadedMedia} />
                    <div className="inputRow" style={{ display: 'flex', alignItems: 'center' }}>

                        {
                            !isExpanded && (
                                <span
                                    className={"d-flex align-items-center justify-content-center"}
                                    style={{ borderRadius: "50%", width: 32, height: 32, cursor: 'pointer' }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <LucideIcon name={"Plus"} color={"var(--text-color)"} />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileSelect}
                                    />
                                </span>
                            )
                        }

                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder={t("Ask Anything...")}
                            rows="1"
                            className="messageInput"
                        />
                        {
                            !isExpanded && (
                                <span onClick={() => {}} className={"d-flex align-items-center justify-content-center"} style={{ backgroundColor: (false || message.length < 1) ? 'var(--hover-bg-color)' : 'var(--text-color)', borderRadius: "50%", width: 32, height: 32, cursor: (false) ? 'wait' : message.length < 1 ? 'not-allowed' : 'pointer' }} >
                                    <LucideIcon name={"ArrowUp"} color={"var(--bg-color)"} />
                                </span>
                            )
                        }
                    </div>

                    {
                        isExpanded && (
                            <div className="d-flex justify-content-between">
                                <div className="leftButton">
                                    <span onClick={() => {}} className={"rightButton d-flex align-items-center justify-content-center"} style={{ borderRadius: "50%", width: 32, height: 32, cursor: (false) ? 'wait' : message.length < 1 ? 'not-allowed' : 'pointer' }} >
                                        <LucideIcon name={"Plus"} color={"var(--text-color)"} />
                                    </span>
                                </div>
                                <span onClick={() => {
                                    handleSend();
                                }} className={"d-flex align-items-center justify-content-center"} style={{ backgroundColor: (false || message.length < 1) ? 'var(--hover-bg-color)' : 'var(--text-color)', borderRadius: "50%", width: 32, height: 32, cursor: (false) ? 'wait' : message.length < 1 ? 'not-allowed' : 'pointer' }} >
                                    <LucideIcon name={"ArrowUp"} color={"var(--bg-color)"} />
                                </span>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default InputContainer;