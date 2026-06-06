import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, Divider } from "@mui/material";
import MenuButton from "./../button/MenuButton";
import { useAuth } from "./../../../../app/providers/UserContext";
import SettingsModal from './../modals/SettingsModal';
import LucideIcon from "./../../../../assets/icons/LucideIcon";
import SubscriptionModal from "../modals/SubscriptionModal";
import {useTranslation} from "react-i18next";

const SettingsControl = ({ isDrawerOpen, currentSubPlan }) => {
    const { userData, logout } = useAuth();
    const {t} = useTranslation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [subPlansOpen, setSubPlansOpen] = useState(false);
    const menuRef = useRef(null);

    const menuItems = [
        // {
        //     id: 'settings',
        //     label: t("Settings"),
        //     icon: 'Settings',
        //     color: 'var(--text-color)',
        //     onClick: () => {
        //         setSettingsOpen(true);
        //         setMenuOpen(false);
        //     }
        // },
        {
            id: 'subscription',
            label: t("Subscription"),
            icon: 'CreditCard',
            color: 'var(--text-color)',
            onClick: () => {
                setSubPlansOpen(true);
                setMenuOpen(false);
            }
        },
        // {
        //     id: 'divider',
        //     type: 'divider'
        // },
        // {
        //     id: 'logout',
        //     label: 'Выйти',
        //     icon: 'LogOut',
        //     color: '#ef4444',
        //     onClick: () => {
        //         logout();
        //         setMenuOpen(false);
        //     }
        // }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <Box ref={menuRef}>
                {menuOpen && (
                    <div
                        style={{
                            position: "fixed",
                            marginTop: '-160px',
                            width: "calc(100% - 16px)",
                            minWidth: "120px",
                            maxWidth: "263px",
                            zIndex: 13000,
                            animation: 'slideDown 0.2s ease-out'
                        }}
                    >
                        <Box sx={{
                            backgroundColor: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid var(--border-color)' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--text-color)' }}>
                                    {userData.first_name} {userData.last_name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                    {userData.username}
                                </Typography>
                            </Box>

                            <Box sx={{ py: 1 }}>
                                {menuItems.map((item) => {
                                    if (item.type === 'divider') {
                                        return (
                                            <Divider
                                                key={item.id}
                                                sx={{
                                                    my: 1,
                                                    borderColor: 'var(--border-color)'
                                                }}
                                            />
                                        );
                                    }

                                    return (
                                        <Box
                                            key={item.id}
                                            onClick={item.onClick}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                px: 2,
                                                py: 1.5,
                                                gap: "8px",
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    backgroundColor: 'var(--hover-color)'
                                                }
                                            }}
                                        >
                                            <LucideIcon
                                                name={item.icon}
                                                size={18}
                                                style={{
                                                    marginRight: '12px',
                                                    color: item.color
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: item.color,
                                                    fontWeight: item.id === 'logout' ? 500 : 400
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>

                    </div>
                )}
                <MenuButton
                    open={isDrawerOpen}
                    label={`${userData.first_name || ''} ${userData.last_name || ''}`}
                    onClick={handleMenuToggle}
                    isActive={menuOpen}
                >
                    <img
                        src={userData.photo_url}
                        style={{
                            marginRight: isDrawerOpen ? "8px" : "0",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            cursor: 'pointer'
                        }}
                        alt="User avatar"
                    />
                    {isDrawerOpen && (
                        <Typography variant="body2" sx={{ color: 'var(--text-color)', fontWeight: 500 }}>
                            {userData.first_name} {userData.last_name}
                        </Typography>
                    )}
                </MenuButton>
                <SubscriptionModal currentSubPlan={currentSubPlan} open={subPlansOpen} setOpen={setSubPlansOpen} />
            </Box>

            <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    );
};

export default SettingsControl;