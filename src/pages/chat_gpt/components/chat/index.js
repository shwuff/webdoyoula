import React, { useState, useRef, useEffect } from 'react';
import {
    IconButton,
    Tooltip,
    Chip
} from '@mui/material';
import {
    ContentCopy as CopyIcon,
    Check as CheckIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatStyles.css';
import LucideIcon from "../../../../assets/icons/LucideIcon";
import InputContainer from "./InputContainer";
import {useTheme} from "../../../../app/providers/ThemeContext";
import {useTranslation} from "react-i18next";

const CodeBlock = ({ language, content }) => {
    const [copied, setCopied] = React.useState(false);

    const { isDarkTheme } = useTheme();

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="code-block">
            <div className="code-header">
                <Chip label={language} size="small" />
                <IconButton size="small" onClick={handleCopy}>
                    {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                </IconButton>
            </div>

            <SyntaxHighlighter
                language={language}
                style={isDarkTheme ? oneDark : oneLight}
                showLineNumbers
            >
                {content}
            </SyntaxHighlighter>
        </div>
    );
};


const MessageBubble = ({ message, isUser, isMobile }) => {
    const [copied, setCopied] = useState(false);
    const {t} = useTranslation();

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isImage = message.type === 'image';
    const hasMedia = message.media && message.media.length > 0;

    const parseInline = (text) => {
        const parts = [];

        const headerMatch = text.match(/^(#{1,6})\s+(.*)/);
        if (headerMatch) {
            const level = headerMatch[1].length;
            parts.push({
                type: 'header',
                level,
                content: headerMatch[2]
            });
            return parts;
        }

        let buffer = '';
        let mode = null;

        for (let i = 0; i < text.length; i++) {
            if (text.slice(i, i + 2) === '**') {
                if (mode === 'bold') {
                    if (buffer) {
                        parts.push({ type: 'bold', content: buffer });
                        buffer = '';
                    }
                    mode = null;
                } else if (mode === null) {
                    mode = 'bold';
                }
                i++;
                continue;
            }

            if (text[i] === '`') {
                if (mode === 'code') {
                    if (buffer) {
                        parts.push({ type: 'code', content: buffer });
                        buffer = '';
                    }
                    mode = null;
                } else if (mode === null) {
                    if (buffer) {
                        parts.push({ type: 'text', content: buffer });
                        buffer = '';
                    }
                    mode = 'code';
                }
                continue;
            }

            buffer += text[i];
        }

        if (buffer) {
            parts.push({
                type: mode || 'text',
                content: buffer
            });
        }

        return parts;
    };

    const parseMessage = (text) => {
        const parts = text.split('```');

        return parts.map((part, index) => {
            if (index % 2 === 1) {
                const lines = part.split('\n');
                const language = lines[0]?.trim() || 'text';
                let code = lines.slice(1).join('\n');

                const cleanCodeBlock = (code) => {
                    if (code.endsWith('\n')) {
                        return code.slice(0, -1);
                    }
                    return code;
                };


                code = cleanCodeBlock(code);

                return {
                    type: 'code',
                    language,
                    content: code
                };
            }

            return {
                type: 'text',
                content: part.replace(/\n+$/, '')
            };
        });
    };

    const blocks = parseMessage(message.content);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`message-wrapper ${isUser ? 'user-wrapper' : 'assistant-wrapper'}`}
        >
            <div className="message-content-wrapper">
                <div className="message-body" >
                    <motion.div
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        {
                            hasMedia && (
                                <div
                                    className={`d-flex`}
                                    style={{
                                        justifyContent: isUser ? 'end' : 'start',
                                        gap: "2px",
                                        paddingRight: "16px"
                                    }}
                                >
                                    {
                                        message.media.map((mediaItem, i) => {
                                            if (mediaItem.type === 'image_url') {
                                                return (
                                                    <div key={i} className="image-container">
                                                        <img
                                                            src={mediaItem.image_url.url}
                                                            alt={t("Image")}
                                                            className="message-image"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })
                                    }
                                </div>
                            )
                        }
                        <div
                            className={`message-bubble d-flex`}
                            style={{
                                justifyContent: isUser ? 'end' : 'start',
                            }}
                        >
                            {isImage ? (
                                <div className="image-container">
                                    <img
                                        src={message.content}
                                        alt={t("Image")}
                                        className="message-image"
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                <div className={`message-text ${isUser ? 'user-message-block' : ''}`}>
                                    {blocks.map((block, i) => {
                                        if (block.type === 'code') {
                                            return (
                                                <CodeBlock
                                                    key={i}
                                                    language={block.language}
                                                    content={block.content}
                                                />
                                            );
                                        }

                                        if (block.type === 'header') {
                                            const Tag = `h${block.level}`;
                                            return <Tag key={i} className="message-header">{block.content}</Tag>;
                                        }

                                        return (
                                            <span key={i}>
                                                {block.content.split('\n').map((line, idx, arr) => (
                                                    <React.Fragment key={idx}>
                                                        {parseInline(line).map((part, j) => {
                                                            if (part.type === 'bold') return <strong key={j}>{part.content}</strong>;
                                                            if (part.type === 'code') return <code key={j} className="inline-code">{part.content}</code>;
                                                            return <span key={j}>{part.content}</span>;
                                                        })}
                                                        {idx < arr.length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}

                                                {message.typing && i === blocks.length - 1 && (
                                                    <span className="typing-wrapper">
                                                        <span className="typing-dot" />
                                                    </span>
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className={`w-100 d-flex align-items-center${isUser ? ' user-actions' : ''}`}>
                {
                    !message.typing && (
                        <Tooltip title={copied ? t("Copied!") : t("Copy text")}>
                            <IconButton
                                size="small"
                                onClick={handleCopy}
                                className="action-button"
                            >
                                {copied
                                    ?
                                    <LucideIcon name={"Check"} color={"var(--text-color)"} size={isMobile ? 14 : 18} />
                                    :
                                    <LucideIcon name={"Copy"} color={"var(--text-color)"} size={isMobile ? 14 : 18} />
                                }
                            </IconButton>
                        </Tooltip>
                    )
                }
            </div>
        </motion.div>
    );
};

const Index = ({ chat, isMobile, handleNewMessage, prompt, setPrompt, uploadedMedia, handleFileSelect }) => {
    const messages = chat.messages || [];
    const chatData = chat.data || {};
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-page">

            <div className="chat-container" ref={containerRef}>
                <div className="messages-scroll-area">
                    <AnimatePresence>
                        <div className="messages-container">
                            {messages.map((message, index) => (
                                <MessageBubble
                                    key={message.id || index}
                                    message={message}
                                    isUser={message.role === 'user'}
                                    isMobile={isMobile}
                                />
                            ))}
                            <div ref={messagesEndRef} className="scroll-anchor" />
                        </div>
                    </AnimatePresence>
                </div>
            </div>
            <InputContainer
                onSendMessage={handleNewMessage}
                message={prompt}
                setMessage={setPrompt}
                uploadedMedia={uploadedMedia}
                handleFileSelect={handleFileSelect}
            />
        </div>
    );
};

export default Index;