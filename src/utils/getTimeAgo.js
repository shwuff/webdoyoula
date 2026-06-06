/**
 * Форматирует timestamp в относительное время (например, "2 часа назад")
 * @param {number|string|Date} timestamp - Временная метка
 * @returns {string} Отформатированная строка времени
 */
export const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: "год", seconds: 31536000 },
        { label: "мес.", seconds: 2592000 },
        { label: "дн.", seconds: 86400 },
        { label: "ч.", seconds: 3600 },
        { label: "м.", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label} назад`;
        }
    }

    return "только что";
};
