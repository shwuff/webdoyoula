import {useWebSocket} from "../../../app/providers/WebSocketContext";
import {useAuth} from "../../../app/providers/UserContext";

export const useChatControl = () => {
    const {sendData} = useWebSocket();
    const {token} = useAuth();

    const sendRequest = async (endpoint, options = {}) => {

        sendData({
            action: endpoint,
            data: {
                jwt: token,
                ...options
            }
        });
    };

    const getAvailableModels = async () => {
        return sendRequest('api/chatgpt/models');
    };

    const searchChats = async (query, limit = 10) => {
        return sendRequest(`api/chatgpt/get_chats`, {query, limit});
    };

    const getChat = async (chat_id) => {
        return sendRequest(`chatgpt/get_chat`, {chat_id});
    };

    const createChat = async (content, media_list, model_id = '') => {
        return sendRequest('chatgpt/create', { content, media_list, model_id});
    };

    const sendMessage = async (chatId, content, uploadedMedia) => {
        return sendRequest(`chatgpt/send_message`, { message: content, chat_id: chatId, media_list: uploadedMedia });
    };

    const deleteChat = async (chatId) => {
        return sendRequest(`chatgpt/delete`, {chat_id: chatId});
    };

    const renameChat = async (chatId, title) => {
        return sendRequest(`chatgpt/rename_chat`, {chat_id: chatId, title: title});
    };

    const uploadMedia = async (data, temp_uuid) => {
        return sendRequest('upload/temp_media', { data, temp_uuid });
    };

    const deleteUploadedMedia = async (media_url, temp_uuid) => {
        return sendRequest('delete/temp_media', { media_url, temp_uuid });
    };

    const getCurrentSubPlan = async () => {
        return sendRequest('subscription/get_current_plan');
    };

    const getSubsPlan = async () => {
        return sendRequest('subscription/get_plans');
    };

    const createSubPlan = async (plan_id) => {
        return sendRequest('subscription/create', { plan_id });
    };

    return {
        getAvailableModels,
        searchChats,
        getChat,
        createChat,
        sendMessage,
        deleteChat,
        renameChat,
        uploadMedia,
        deleteUploadedMedia,
        getCurrentSubPlan,
        getSubsPlan,
        createSubPlan
    };
};