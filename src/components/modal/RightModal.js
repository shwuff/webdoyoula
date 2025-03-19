// RightModal.jsx
import React from "react";
import styles from "../gallery/css/MyGeneratedPhotosList.module.css";
import { motion, AnimatePresence } from 'framer-motion';
import CloseButton from "../buttons/CloseButton";

const RightModal = ({
    isOpen,
    onClose,
    onBack,
    isBackButton = false,
    children
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    style={{
                        paddingTop: window.Telegram.WebApp?.safeAreaInset?.top
                            ? `${window.Telegram.WebApp.safeAreaInset.top * 2}px`
                            : '0'
                    }}
                    className={styles.rightModalContent}
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.rightModalHeader}>
                        <CloseButton onClick={isBackButton ? onBack : onClose} isBack={isBackButton} />
                    </div>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RightModal;
