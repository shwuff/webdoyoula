import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chats: [],
    currentChat: null,
    error: null,
    uploadedMedia: [],
    subPlans: [],
    currentSubPlan: null,
    selectedChatId: null,
    selectedModel: 'GPT-4',
    models: ['GPT-4'],
    isDrawerOpen: null, // null означает, что нужно определить из localStorage или по умолчанию
    searchQuery: '',
    prompt: '',
    startMessage: '',
    loading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        addChat: (state, action) => {
            state.chats.unshift(action.payload);
        },
        updateChat: (state, action) => {
            const { chatId, updates } = action.payload;
            const index = state.chats.findIndex(chat => chat.uuid === chatId);
            if (index !== -1) {
                state.chats[index] = { ...state.chats[index], ...updates };
            }
        },
        removeChat: (state, action) => {
            state.chats = state.chats.filter(chat => chat.uuid !== action.payload);
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        updateCurrentChatMessages: (state, action) => {
            if (state.currentChat) {
                state.currentChat.messages = action.payload;
            }
        },
        addMessage: (state, action) => {
            if (state.currentChat) {
                if (!state.currentChat.messages) {
                    state.currentChat.messages = [];
                }
                state.currentChat.messages.push(action.payload);
            }
        },
        updateMessage: (state, action) => {
            const { messageId, updates } = action.payload;
            if (state.currentChat?.messages) {
                const index = state.currentChat.messages.findIndex(m => m.id === messageId);
                if (index !== -1) {
                    state.currentChat.messages[index] = {
                        ...state.currentChat.messages[index],
                        ...updates
                    };
                }
            }
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUploadedMedia: (state, action) => {
            state.uploadedMedia = action.payload;
        },
        addUploadedMedia: (state, action) => {
            state.uploadedMedia.unshift(action.payload);
        },
        updateUploadedMedia: (state, action) => {
            const { temp_uuid, updates } = action.payload;
            const index = state.uploadedMedia.findIndex(item => item.temp_uuid === temp_uuid);
            if (index !== -1) {
                state.uploadedMedia[index] = {
                    ...state.uploadedMedia[index],
                    ...updates
                };
            }
        },
        removeUploadedMedia: (state, action) => {
            state.uploadedMedia = state.uploadedMedia.filter(
                item => item.temp_uuid !== action.payload
            );
        },
        clearUploadedMedia: (state) => {
            state.uploadedMedia = [];
        },
        setSubPlans: (state, action) => {
            state.subPlans = action.payload;
        },
        setCurrentSubPlan: (state, action) => {
            state.currentSubPlan = action.payload;
        },
        setSelectedChatId: (state, action) => {
            state.selectedChatId = action.payload;
        },
        setSelectedModel: (state, action) => {
            state.selectedModel = action.payload;
        },
        setModels: (state, action) => {
            state.models = action.payload;
        },
        setIsDrawerOpen: (state, action) => {
            state.isDrawerOpen = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setPrompt: (state, action) => {
            state.prompt = action.payload;
        },
        setStartMessage: (state, action) => {
            state.startMessage = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setChats,
    addChat,
    updateChat,
    removeChat,
    setCurrentChat,
    updateCurrentChatMessages,
    addMessage,
    updateMessage,
    setError,
    clearError,
    setUploadedMedia,
    addUploadedMedia,
    updateUploadedMedia,
    removeUploadedMedia,
    clearUploadedMedia,
    setSubPlans,
    setCurrentSubPlan,
    setSelectedChatId,
    setSelectedModel,
    setModels,
    setIsDrawerOpen,
    setSearchQuery,
    setPrompt,
    setStartMessage,
    setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
