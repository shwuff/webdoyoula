import React from 'react';
import {
    Box, Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material";
import {
    Close as CloseIcon, Menu as MenuIcon, MoreVert as MoreVertIcon,
    Settings as SettingsIcon
} from "@mui/icons-material";
import {useAuth} from "../../../../app/providers/UserContext";
import {useNavigate} from "react-router-dom";
import LucideIcon from "../../../../assets/icons/LucideIcon";
import MenuButton from "../button/MenuButton";
import DoyoulaLogo from './../../../../assets/images/doyoula_logo.jpg';
import ChatControl from "../chat/ChatControl";
import SettingsControl from "./SettingsControl";
import {useTranslation} from "react-i18next";

const DRAWER_OPEN_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 64;

const Index = ({ searchQuery, setSearchQuery, isMobile, isDrawerOpen, setIsDrawerOpen, selectedChat, setSelectedChat, chats, currentSubPlan }) => {

    const {t} = useTranslation();

    const navigate = useNavigate();

    const [closeSidebarHover, setCloseSidebarHover] = React.useState(true);

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const drawerContent = (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-color)',
            color: 'white'
        }}
        >
            <Box sx={{ p: 1 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2
                }}>
                    <Box sx={{ gap: 1, width: "100%" }}>
                        <div className={`d-flex ${isDrawerOpen ? "justify-content-between" : "justify-content-center"} w-100`} style={{ marginBottom: "16px", padding: isDrawerOpen ? 2 : 0 }}>

                            {
                                (isDrawerOpen || !closeSidebarHover) && (
                                    <img
                                        src={DoyoulaLogo}
                                        alt={"DoyoulaLogo"}
                                        width={40}
                                        style={{ borderRadius: "50%" }}
                                        onMouseEnter={() => setCloseSidebarHover(true)}
                                        onMouseLeave={() => setCloseSidebarHover(false)}
                                    />
                                )
                            }

                            {
                                (isDrawerOpen || closeSidebarHover) && (
                                    <Tooltip
                                        title={isDrawerOpen ? t("Close menu") : t("Open menu")}
                                        slotProps={{
                                            tooltip: {
                                                sx: {
                                                    color: 'var(--text-color)',
                                                    fontSize: '14px',
                                                }
                                            }
                                        }}
                                    >
                                        <span
                                            onMouseEnter={() => setCloseSidebarHover(true)}
                                            onMouseLeave={() => setCloseSidebarHover(false)}
                                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                                            style={{
                                                color: 'white',
                                                cursor: 'pointer',
                                                height: 40,
                                                width: 40,
                                                display: "flex",
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <MenuIcon />
                                        </span>
                                    </Tooltip>
                                )
                            }

                        </div>

                        <MenuButton open={isDrawerOpen} label={"New Chat"} onClick={() => navigate('/chat')}>
                            <LucideIcon name={'SquarePen'} color={"var(--text-color)"} size={isDrawerOpen ? 18 : 20} />
                            {
                                isDrawerOpen && t('New Chat')
                            }
                        </MenuButton>
                        <MenuButton open={isDrawerOpen} label={"Search"}>
                            <LucideIcon name={'Search'} color={"var(--text-color)"} size={isDrawerOpen ? 18 : 20} />
                            {
                                isDrawerOpen && t('Search Chats')
                            }
                        </MenuButton>
                        <MenuButton open={isDrawerOpen} label={"Image"}>
                            <LucideIcon name={'Images'} color={"var(--text-color)"} size={isDrawerOpen ? 18 : 20} />
                            {
                                isDrawerOpen && t('Media')
                            }
                        </MenuButton>
                        <MenuButton open={isDrawerOpen} onClick={() => window.location.href = '/'} label={"Back to App"}>
                            <img
                                src={DoyoulaLogo}
                                alt={"DoyoulaLogo"}
                                width={18}
                                style={{ borderRadius: "50%" }}
                                onMouseEnter={() => setCloseSidebarHover(true)}
                                onMouseLeave={() => setCloseSidebarHover(false)}
                            />
                            {
                                isDrawerOpen && t('Back to App')
                            }
                        </MenuButton>
                    </Box>
                </Box>
            </Box>

            <List sx={{
                flex: 1,
                overflow: 'auto',
                px: 1
            }}>
                {
                    isDrawerOpen && (
                        <>
                            <Typography variant="span" sx={{ color: "var(--hint-color)", p: 1 }}>
                                {t('Your chats')}
                            </Typography>
                            {filteredChats.map((chat) => (
                                <ListItem
                                    key={chat.uuid}
                                    disablePadding
                                    sx={{
                                        mb: 0.5,
                                        borderRadius: '8px',
                                        background: selectedChat === chat.uuid ? 'var(--hover-bg-color)' : 'transparent'
                                    }}
                                >
                                    <ListItemButton
                                        onClick={() => {
                                            setSelectedChat(chat.uuid);
                                            navigate('/chat/' + chat.uuid);
                                            if (isMobile) setIsDrawerOpen(false);
                                        }}
                                        sx={{
                                            py: 1,
                                            px: 2,
                                            borderRadius: '8px',
                                            '&:hover': {
                                                background: 'var(--hover-bg-color)'
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            flex: 1,
                                                            fontWeight: selectedChat === chat.id ? 500 : 400,
                                                            color: 'var(--text-color)',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {chat.title}
                                                    </Typography>
                                                    {chat.unread && (
                                                        <Box sx={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            background: '#10a37f',
                                                            flexShrink: 0
                                                        }} />
                                                    )}
                                                    <ChatControl chat={chat} />
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </>
                    )
                }
            </List>

            <Box sx={{ p: 1 }}>
                <SettingsControl currentSubPlan={currentSubPlan} isDrawerOpen={isDrawerOpen} />
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: "70%",
                            paddingTop: "var(--safeAreaInset-top)",
                            background: 'var(--bg-color)'
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}


            {!isMobile && (
                <Drawer
                    variant="permanent"
                    open={isDrawerOpen}
                    sx={{
                        width: isDrawerOpen ? DRAWER_OPEN_WIDTH : DRAWER_COLLAPSED_WIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: isDrawerOpen ? DRAWER_OPEN_WIDTH : DRAWER_COLLAPSED_WIDTH,
                            background: 'var(--bg-color)',
                            borderRight: '1px solid var(--glass-border)',
                            transition: 'width 0.2s ease-in-out'
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
};

export default Index;