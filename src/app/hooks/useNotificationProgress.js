import { useEffect, useState } from 'react';

/**
 * Hook для управления прогрессом уведомлений
 */
export const useNotificationProgress = (notification) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!notification) {
            setProgress(100);
            return;
        }

        const totalDuration = notification.time || 5000;
        let startTime = null;
        let animationFrameId = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const ratio = Math.min(elapsed / totalDuration, 1);

            const currentValue = 100 - ratio * 100;
            setProgress(currentValue);

            if (ratio < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            setProgress(100);
        };
    }, [notification]);

    return progress;
};
