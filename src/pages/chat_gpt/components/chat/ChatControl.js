import React, { useState, useEffect, useRef } from 'react';
import LucideIcon from "../../../../assets/icons/LucideIcon";
import { useChatControl } from "../../hooks/useChatControl";
import "./ChatControl.css";
import {useTranslation} from "react-i18next"; // Создадим CSS файл для стилей

const ChatControl = ({ handleDeleteChat, chat }) => {

    const {t} = useTranslation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [newChatTitle, setNewChatTitle] = useState("");
    const menuRef = useRef(null);
    const modalRef = useRef(null);
    const inputRef = useRef(null);

    const { deleteChat, renameChat } = useChatControl();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideModal = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && isRenameModalOpen) {
                setIsRenameModalOpen(false);
                setNewChatTitle("");
            }
        };

        if (isRenameModalOpen) {
            document.addEventListener('mousedown', handleClickOutsideModal);
            // Фокусируемся на инпуте при открытии
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        };
    }, [isRenameModalOpen]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
                if (isRenameModalOpen) {
                    setIsRenameModalOpen(false);
                    setNewChatTitle("");
                }
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isRenameModalOpen]);

    useEffect(() => {
        const handleEnter = (event) => {
            if (event.key === 'Enter' && isRenameModalOpen && newChatTitle.trim()) {
                handleRenameSubmit();
            }
        };

        document.addEventListener('keydown', handleEnter);
        return () => {
            document.removeEventListener('keydown', handleEnter);
        };
    }, [isRenameModalOpen, newChatTitle]);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        deleteChat(chat.uuid);
        setIsMenuOpen(false);
    };

    const handleRenameClick = (e) => {
        e.stopPropagation();
        setNewChatTitle(chat.title || "");
        setIsMenuOpen(false);
        setIsRenameModalOpen(true);
    };

    const handleRenameSubmit = async () => {
        if (!newChatTitle.trim()) return;

        try {
            renameChat(chat.uuid, newChatTitle.trim());

            setIsRenameModalOpen(false);
            setNewChatTitle("");
        } catch (error) {
            console.error("Ошибка при переименовании чата:", error);
        }
    };

    const handleCancelRename = () => {
        setIsRenameModalOpen(false);
        setNewChatTitle("");
    };

    return (
        <>
            <div ref={menuRef} style={{ position: 'relative', height: "10px" }}>
                <span
                    style={{
                        height: "100%",
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={handleMenuClick}
                >
                    <LucideIcon name={"Ellipsis"} color={"var(--text-color)"} />
                </span>

                {isMenuOpen && (
                    <div
                        className="chat-control-menu"
                        style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            backgroundColor: "var(--bg-color)",
                            border: "1px solid var(--glass-border)",
                            borderRadius: "6px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            zIndex: 1000,
                            minWidth: "120px",
                            padding: "4px 0",
                        }}
                    >
                        <div
                            className="chat-control-menu-item"
                            style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                color: "var(--text-color)",
                                fontSize: "14px",
                                whiteSpace: "nowrap",
                                transition: 'background-color 0.2s',
                                display: "flex",
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onClick={handleRenameClick}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            <LucideIcon name={"Pencil"} color={"var(--text-color)"} size={16} />
                            {t("Rename")}
                        </div>
                        <div
                            className="chat-control-menu-item"
                            style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                color: "var(--danger-color)",
                                fontSize: "14px",
                                whiteSpace: "nowrap",
                                transition: 'background-color 0.2s',
                                display: "flex",
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onClick={handleDeleteClick}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            <LucideIcon name={"Trash"} color={"var(--danger-color)"} size={16} />
                            {t("Delete chat")}
                        </div>
                    </div>
                )}
            </div>

            {isRenameModalOpen && (
                <div className="modal-overlay">
                    <div
                        ref={modalRef}
                        className="rename-modal"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            border: "1px solid var(--glass-border)",
                            borderRadius: "8px",
                            padding: "20px",
                            width: "400px",
                            maxWidth: "90%",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        }}
                    >
                        <h3 style={{
                            marginBottom: "16px",
                            color: "var(--text-color)",
                            fontSize: "16px",
                            fontWeight: "500"
                        }}>
                            {t("Rename Chat")}
                        </h3>

                        <input
                            ref={inputRef}
                            type="text"
                            value={newChatTitle}
                            onChange={(e) => setNewChatTitle(e.target.value)}
                            placeholder={t('Input New Title')}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                marginBottom: "20px",
                                backgroundColor: "var(--input-bg-color, rgba(0,0,0,0.1))",
                                border: "1px solid var(--glass-border)",
                                borderRadius: "6px",
                                color: "var(--text-color)",
                                fontSize: "14px",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "var(--primary-color)"}
                            onBlur={(e) => e.target.style.borderColor = "var(--glass-border)"}
                        />

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "8px"
                        }}>
                            <button
                                onClick={handleCancelRename}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "transparent",
                                    border: "1px solid var(--glass-border)",
                                    borderRadius: "6px",
                                    color: "var(--text-color)",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                {t("Cancel")}
                            </button>
                            <button
                                onClick={handleRenameSubmit}
                                disabled={!newChatTitle.trim()}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "var(--text-color)",
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "var(--bg-color)",
                                    fontSize: "14px",
                                    cursor: newChatTitle.trim() ? "pointer" : "not-allowed",
                                    transition: "background-color 0.2s",
                                }}
                            >
                                {t("Save")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatControl;