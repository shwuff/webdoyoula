import { useEffect, useState } from 'react';

export const usePlatformKeyHint = () => {
    const [platform, setPlatform] = useState('none');

    useEffect(() => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) {
            setPlatform('none');
        } else {
            setPlatform(isMac ? 'mac' : 'windows');
        }
    }, []);

    return platform;
};