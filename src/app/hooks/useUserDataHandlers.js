import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWebSocket } from '../providers/WebSocketContext';
import { useAuth } from '../providers/UserContext';
import { updateImage } from '../store/slices/imageSlice';
import { setModels } from '../store/slices/modelSlice';

/**
 * Hook для обработки событий обновления данных пользователя через WebSocket
 */
export const useUserDataHandlers = () => {
    const { addHandler, deleteHandler } = useWebSocket();
    const { setUserData, setMyLoras } = useAuth();
    const dispatch = useDispatch();

    // Обработка обновления Lora данных
    useEffect(() => {
        const handleUpdate = (msg) => {
            setMyLoras(prev =>
                prev.map(lora =>
                    lora.id === msg.lora_id
                        ? { ...lora, ...msg.data }
                        : lora
                )
            );
        };

        const handleDelete = (msg) => {
            setMyLoras(prev =>
                prev.filter(lora => lora.id !== msg.lora_id)
            );
        };

        addHandler('update_lora_data', handleUpdate);
        addHandler('delete_lora', handleDelete);

        return () => {
            deleteHandler('update_lora_data');
            deleteHandler('delete_lora');
        };
    }, [addHandler, deleteHandler, setMyLoras]);

    // Обработка обновления количества фото
    useEffect(() => {
        const handleUpdatePhotosLeft = (msg) => {
            setUserData(prev => ({
                ...prev,
                photos_left: msg.stars_count
            }));
        };

        addHandler('update_stars_count', handleUpdatePhotosLeft);
        return () => deleteHandler('update_stars_count');
    }, [addHandler, deleteHandler, setUserData]);

    // Обработка обновления выбранной модели
    useEffect(() => {
        const updateSelectedModel = (msg) => {
            setUserData((prev) => ({
                ...prev,
                current_model_id: msg.model_id
            }));
        };

        addHandler("update_selected_model", updateSelectedModel);
        return () => deleteHandler('update_selected_model');
    }, [addHandler, deleteHandler, setUserData]);

    // Обработка обновления выбранной Lora
    useEffect(() => {
        const updateSelectedLora = (msg) => {
            setUserData((prev) => ({
                ...prev,
                current_lora_id: msg.lora_id
            }));
        };

        addHandler("update_selected_lora", updateSelectedLora);
        return () => deleteHandler('update_selected_lora');
    }, [addHandler, deleteHandler, setUserData]);

    // Обработка обновления цены повтора
    useEffect(() => {
        const updateRepeatPrice = (msg) => {
            dispatch(updateImage({ id: msg.media_id, newImageData: { repeat_price: msg.repeat_price } }));
        };

        addHandler("update_repeat_price", updateRepeatPrice);
        return () => deleteHandler('update_repeat_price');
    }, [addHandler, deleteHandler, dispatch]);

    // Обработка обновления количества генерируемых изображений
    useEffect(() => {
        const handleUpdateCountImagesGenerate = (msg) => {
            setUserData((prev) => ({
                ...prev,
                count_images_generate: msg.count_images_generate
            }));
        };

        addHandler("update_count_images_generate", handleUpdateCountImagesGenerate);
        return () => deleteHandler("update_count_images_generate");
    }, [addHandler, deleteHandler, setUserData]);

    // Обработка общего обновления данных пользователя
    useEffect(() => {
        const handleUpdateUserData = (msg) => {
            setUserData(prev => {
                const next = { ...prev, ...msg.user };
                return next;
            });
        };

        addHandler("update_user_data", handleUpdateUserData);
        return () => deleteHandler("update_user_data");
    }, [addHandler, deleteHandler, setUserData]);

    // Загрузка доступных моделей
    useEffect(() => {
        const receiveAvailableModels = (msg) => {
            dispatch(setModels(msg.models));
        };

        addHandler("receive_available_models", receiveAvailableModels);
        return () => deleteHandler("receive_available_models");
    }, [addHandler, deleteHandler, dispatch]);
};
