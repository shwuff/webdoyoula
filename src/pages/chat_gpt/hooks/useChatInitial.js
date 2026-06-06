import React, {useEffect, useCallback} from 'react';
import {useWebSocket} from "../../../app/providers/WebSocketContext";
import {useAuth} from "../../../app/providers/UserContext";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const UseChatInitial = () => {
    const {addHandler, deleteHandler, sendData} = useWebSocket();
    const {token} = useAuth();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const [chats, setChats] = React.useState([]);
    const [currentChat, setCurrentChat] = React.useState([]);
    const [error, setError] = React.useState('');
    const [uploadedMedia, setUploadedMedia] = React.useState([]);
    const [subPlans, setSubPlans] = React.useState([]);
    const [currentSubPlan, setCurrentSubPlan] = React.useState([]);
    const [congratulationWithNewSub, setCongratulationWithNewSub] = React.useState(false);

    const receiveUploadedMedia = useCallback((msg) => {
        setUploadedMedia(prev => {
            const updated = [...prev];

            if (msg.temp_uuid) {
                const index = updated.findIndex(item => item.temp_uuid === msg.temp_uuid);

                if (index !== -1) {
                    updated[index] = {
                        ...updated[index],
                        url: msg.url,
                        updated_at: new Date().toISOString()
                    };
                } else {
                    updated.unshift({
                        temp_uuid: msg.temp_uuid,
                        url: msg.url,
                    });
                }
            } else if (msg.url) {
                updated.unshift({
                    url: msg.url,
                    temp_uuid: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                });
            }

            return updated;
        });
    }, []);

    const handleDeleteTempMedia = useCallback((msg) => {
        setUploadedMedia(prev => {
            return prev.filter(item => item.temp_uuid !== msg.temp_uuid);
        });
    }, []);

    const receiveError = useCallback((msg) => {
        setError(t(msg.error, {display_date: msg.display_date}));
    }, []);

    const receiveNewChat = useCallback((msg) => {
        setChats(prev => {
            const isDuplicate = prev.some(chat => chat.uuid === msg.new_chat.uuid);

            if (isDuplicate) {
                return prev;
            }

            return [
                msg.new_chat,
                ...prev
            ];
        });

        navigate('/chat/' + msg.new_chat.uuid);
    }, [navigate]);

    const receiveNewChatTitle = useCallback((msg) => {
        const { title, chat_id } = msg;

        setChats(prev =>
            prev.map(chat =>
                chat.uuid === chat_id
                    ? { ...chat, title }
                    : chat
            )
        );
    }, []);

    const handleDeleteChat = useCallback((msg) => {
        const { chat_id } = msg;

        setChats((prevChat) => {
            return prevChat.filter((chat) => chat.uuid !== chat_id);
        });

        if(currentChat.data?.uuid === chat_id) {
            navigate('/chat');
        }
    }, [currentChat, navigate]);

    const receiveChatsList = useCallback((msg) => {
        setChats(msg.chats);
    }, []);

    const receiveSingleChat = useCallback((msg) => {
        setCurrentChat({
            data: msg.chat,
            messages: msg.messages,
        });
    }, []);

    const receiveMessageChunk = useCallback((msg) => {
        const chunk = msg.message;
        const messageId = msg.message_id;
        const role = msg.role;

        setCurrentChat((prevChat) => {
            const messages = prevChat.messages.map((m) => {
                if (m.id === messageId) {
                    return {
                        ...m,
                        content: m.content + chunk,
                        ...((role === "assistant" && !msg.last) ? { typing: true } : {typing: false }),
                    };
                }
                return m;
            });

            return { ...prevChat, messages };
        });
    }, []);

    const receiveNewMessage = useCallback((msg) => {
        const message = msg.message;

        setCurrentChat((prevChat) => ({
            ...prevChat,
            messages: [
                ...prevChat?.messages || [],
                {
                    id: message.message_id,
                    role: message.role,
                    content: message.content,
                    media: message.media,
                    ...((message.role === 'assistant' && !message.last) ? { typing: true } : {})
                }
            ]
        }));
    }, []);

    const receiveSubPlans = useCallback((msg) => {
        setSubPlans(msg.plans);
    }, []);

    const receiveCurrentSubPlans = useCallback((msg) => {
        setCurrentSubPlan(msg.plan);
    }, []);

    const receiveCreatedSubscription = useCallback((msg) => {
        setCongratulationWithNewSub(true);
        setCurrentSubPlan(msg.plan);
    }, []);

    useEffect(() => {
        addHandler('media_uploaded', receiveUploadedMedia);
        addHandler('media_deleted', handleDeleteTempMedia);
        addHandler('chat_error', receiveError);
        addHandler('new_chat', receiveNewChat);
        addHandler('new_chat_title', receiveNewChatTitle);
        addHandler('delete_chat', handleDeleteChat);
        addHandler('api/chatgpt/get_chats', receiveChatsList);
        addHandler('api/chatgpt/get_chat', receiveSingleChat);
        addHandler('message_tunnel', receiveMessageChunk);
        addHandler('new_message', receiveNewMessage);
        addHandler('get_subs_plans', receiveSubPlans);
        addHandler('get_current_sub_plan', receiveCurrentSubPlans);
        addHandler('subscription_created', receiveCreatedSubscription);

        return () => {
            deleteHandler('media_uploaded');
            deleteHandler('media_deleted');
            deleteHandler('chat_error');
            deleteHandler('new_chat');
            deleteHandler('new_chat_title');
            deleteHandler('delete_chat');
            deleteHandler('api/chatgpt/get_chats');
            deleteHandler('api/chatgpt/get_chat');
            deleteHandler('message_tunnel');
            deleteHandler('new_message');
            deleteHandler('get_subs_plans');
            deleteHandler('get_current_sub_plan');
            deleteHandler('subscription_created');
        };
    }, [
        addHandler, deleteHandler,
        receiveUploadedMedia, handleDeleteTempMedia,
        receiveError, receiveNewChat,
        receiveNewChatTitle, handleDeleteChat,
        receiveChatsList, receiveSingleChat,
        receiveMessageChunk, receiveNewMessage
    ]);

    // Initial data fetch
    useEffect(() => {
        sendData({
            action: 'chatgpt/get_chats',
            data: {
                jwt: token,
            }
        });
    }, [sendData, token]);

    return {
        chats,
        currentChat,
        setCurrentChat,
        error,
        setError,
        uploadedMedia,
        setUploadedMedia,
        subPlans,
        currentSubPlan,
        setCongratulationWithNewSub,
        congratulationWithNewSub
    };
};

export default UseChatInitial;