import React, { useEffect, useState } from 'react';
import LucideIcon from "../../../../assets/icons/LucideIcon";
import styles from './Modal.module.css';

const SettingsModal = ({ open, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (open) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('resize', checkMobile);
        };
    }, [open]);

    const handleClose = () => {
        setIsVisible(false);
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            document.body.style.overflow = 'auto';
        }, 300);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!open && !isClosing) return null;

    const menuItems = [
        { id: 'general', label: 'Основные', icon: 'Settings' },
        { id: 'account', label: 'Аккаунт', icon: 'User' },
        { id: 'security', label: 'Безопасность', icon: 'Shield' },
        { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
        { id: 'privacy', label: 'Конфиденциальность', icon: 'Lock' },
        { id: 'appearance', label: 'Внешний вид', icon: 'Palette' },
        { id: 'language', label: 'Язык', icon: 'Globe' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className={styles.tabContent}>
                        <h3 className={styles.tabTitle}>Основные настройки</h3>
                        <p className={styles.tabDescription}>
                            Общие настройки приложения и поведения системы
                        </p>
                        <div className={styles.settingsGroup}>
                            <h4 className={styles.groupTitle}>Поведение приложения</h4>
                            {/* Добавь настройки здесь */}
                        </div>
                    </div>
                );
            case 'account':
                return (
                    <div className={styles.tabContent}>
                        <h3 className={styles.tabTitle}>Настройки аккаунта</h3>
                        <p className={styles.tabDescription}>
                            Управление профилем и персональными данными
                        </p>
                        <div className={styles.settingsGroup}>
                            <h4 className={styles.groupTitle}>Информация профиля</h4>
                            {/* Добавь настройки здесь */}
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className={styles.tabContent}>
                        <h3 className={styles.tabTitle}>Безопасность</h3>
                        <p className={styles.tabDescription}>
                            Настройки безопасности и доступа
                        </p>
                        <div className={styles.settingsGroup}>
                            <h4 className={styles.groupTitle}>Защита аккаунта</h4>
                            {/* Добавь настройки здесь */}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className={styles.tabContent}>
                        <h3 className={styles.tabTitle}>{menuItems.find(item => item.id === activeTab)?.label}</h3>
                        <p className={styles.tabDescription}>
                            Настройки раздела
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            {/* Бэкдроп с анимацией */}
            <div
                className={`${styles.backdrop} ${
                    isVisible ? styles.backdropVisible : styles.backdropHidden
                }`}
            />

            {/* Крестик для мобилок - фиксированный поверх всего */}
            {isMobile && (
                <button
                    onClick={handleClose}
                    className={styles.mobileCloseButton}
                    aria-label="Закрыть"
                >
                    <LucideIcon name="X" className={styles.closeIcon} />
                </button>
            )}

            {/* Модальное окно */}
            <div className={styles.modalContainer}>
                <div
                    className={`${styles.modalContent} ${
                        isVisible ? styles.modalVisible : styles.modalHidden
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Крестик для десктопа */}
                    {!isMobile && (
                        <button
                            onClick={handleClose}
                            className={styles.desktopCloseButton}
                            aria-label="Закрыть"
                        >
                            <LucideIcon name="X" className={styles.closeIcon} />
                        </button>
                    )}

                    {/* Заголовок */}
                    <div className={styles.header}>
                        <h2 className={styles.title}>Настройки</h2>
                        <p className={styles.subtitle}>
                            Управление настройками вашего аккаунта и приложения
                        </p>
                    </div>

                    {/* Основной контент с левым меню */}
                    <div className={styles.settingsLayout}>
                        {/* Левое меню */}
                        <div className={styles.sidebar}>
                            <nav className={styles.navMenu}>
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`${styles.navItem} ${
                                            activeTab === item.id ? styles.navItemActive : ''
                                        }`}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <LucideIcon
                                            name={item.icon}
                                            className={styles.navIcon}
                                            style={{
                                                color: activeTab === item.id ? 'var(--primary-color, #3b82f6)' : 'var(--text-color, #374151)'
                                            }}
                                        />
                                        <span className={styles.navLabel}>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Правая часть - контент */}
                        <div className={styles.content}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;