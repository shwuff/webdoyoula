import React from "react";
import styles from "../gallery/css/MyGeneratedPhotosList.module.css";
import { motion, AnimatePresence } from 'framer-motion';

const RightModal = ({ isOpen, onClose, children, style, isFirst = true }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    style={{
                        paddingTop: window.Telegram.WebApp?.safeAreaInset?.top
                            ? `${window.Telegram.WebApp.safeAreaInset.top * 2}px`
                            : '0'
                    }}
                    className={styles.webAppModal}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RightModal;
