import { useState, useEffect } from 'react';

/**
 * Hook для управления кнопкой прокрутки наверх
 */
export const useScrollToTop = () => {
    const [showButton, setShowButton] = useState(false);
    const selector = '.globalProfileBlock, .globalBlock';

    useEffect(() => {
        let block = document.querySelector(selector);

        const attachScroll = (el) => {
            const onScroll = () => {
                setShowButton(el.scrollTop > window.innerHeight);
            };
            el.addEventListener('scroll', onScroll, { passive: true });
            return () => el.removeEventListener('scroll', onScroll);
        };

        if (!block) {
            const obs = new MutationObserver(() => {
                block = document.querySelector(selector);
                if (block) {
                    const detach = attachScroll(block);
                    obs.disconnect();
                    return detach;
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
            return () => obs.disconnect();
        }

        return attachScroll(block);
    }, []);

    const scrollToTop = () => {
        const el = document.querySelector(selector);
        if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
        setShowButton(false);
    };

    return { showButton, scrollToTop };
};
