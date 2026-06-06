import React, { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import LucideIcon from "../../../../assets/icons/LucideIcon";
import {useTranslation} from "react-i18next";
import {useChatControl} from "../../hooks/useChatControl";
import starsIcon from './../../../../assets/gif/gold_star.gif';

const SubscriptionModal = ({ open, setOpen, currentSubPlan }) => {

    const {t} = useTranslation();

    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { createSubPlan } = useChatControl();

    const [confirmPlanId, setConfirmPlanId] = useState(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
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
        // setIsClosing(true);
        // setIsClosing(false);
        setConfirmPlanId(false);
        document.body.style.overflow = 'auto';
    };

    const handleSelectPlan = (planId) => {
        setConfirmPlanId(planId);
    };

    const handleConfirm = () => {
        if (confirmPlanId) {
            createSubPlan(confirmPlanId === 'plus' ? 1 : 0);
            setConfirmPlanId(null);
            handleClose();
            handleCloseChoosePlanId();
        }
    };

    const handleCloseChoosePlanId = () => {
        setIsVisible(false);
        setIsClosing(true);
        setTimeout(() => {
            setOpen(false);
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

    const subscriptions = [
        {
            id: 'free',
            name: t("chatPlans.free.title"),
            price: '₽0',
            description: t("chatPlans.free.description"),
            features: [
                {text: t("chatPlans.free.feature_1"), icon: <LucideIcon name={"MessageCircle"}/>},
                {text: t("chatPlans.free.feature_2"), icon: <LucideIcon name={"Scroll"}/>},
                {text: t("chatPlans.free.feature_3"), icon: <LucideIcon name={"File"}/>},
                {text: t("chatPlans.free.feature_4"), icon: <LucideIcon name={"Brain"}/>},
            ],
        },
        {
            id: 'plus',
            name: t("chatPlans.plus.title"),
            price: '₽499',
            description: t("chatPlans.plus.description"),
            features: [
                {text: t("chatPlans.plus.feature_1"), icon: <LucideIcon name={"Infinity"}/>},
                {text: t("chatPlans.plus.feature_2"), icon: <LucideIcon name={"Sparkles"}/>},
                {text: t("chatPlans.plus.feature_3"), icon: <LucideIcon name={"ScrollText"}/>},
                {text: t("chatPlans.plus.feature_4"), icon: <LucideIcon name={"Files"}/>},
                {text: t("chatPlans.plus.feature_5"), icon: <LucideIcon name={"BrainCircuit"}/>},
                {text: t("chatPlans.plus.feature_6"), icon: <LucideIcon name={"Bot"}/>},
            ],
            popular: true,
        },
    ];

    const splitFeaturesIntoColumns = (features) => {
        const half = Math.ceil(features.length / 2);
        return {
            leftColumn: features.slice(0, half),
            rightColumn: features.slice(half),
        };
    };

    return (
        <>
            <div className={styles.overlay} onClick={handleBackdropClick}>
                <div
                    className={`${styles.backdrop} ${
                        isVisible ? styles.backdropVisible : styles.backdropHidden
                    }`}
                />

                {isMobile && (
                    <button
                        onClick={handleCloseChoosePlanId}
                        className={styles.mobileCloseButton}
                        aria-label="Закрыть"
                        style={{ marginTop: "max(var(--safeAreaInset-top), 0.5rem)" }}
                    >
                        <svg
                            className={styles.closeIcon}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}

                <div className={styles.modalContainer}>
                    <div
                        className={`${styles.modalContent} ${
                            isVisible ? styles.modalVisible : styles.modalHidden
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!isMobile && (
                            <button
                                onClick={handleCloseChoosePlanId}
                                className={styles.desktopCloseButton}
                                aria-label={t("Close")}
                            >
                                <svg
                                    className={styles.closeIcon}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}

                        {/* Заголовок */}
                        <div className={styles.header}>
                            <h2 className={styles.title}>
                                {t("chatPlans.common.choose_plan")}
                            </h2>
                            <p className={styles.subtitle}>
                                {t("chatPlans.common.start_free")}
                            </p>
                            {((currentSubPlan && (currentSubPlan.type === '1' || currentSubPlan.type === 1) && currentSubPlan.expires_at)) && (
                                t(
                                    currentSubPlan.expired === false
                                        ? "chatPlans.common.expires_on"
                                        : "chatPlans.common.expired_on",
                                    { date: new Date(currentSubPlan.expires_at).toLocaleDateString('ru-RU') }
                                )
                            )}
                        </div>

                        <div className={styles.plansGrid}>
                            {subscriptions.map((plan) => {
                                const { leftColumn, rightColumn } = splitFeaturesIntoColumns(plan.features);

                                return (
                                    <div key={plan.id} >
                                        <div
                                            className={`${styles.planCard} ${
                                                plan.popular ? styles.popularCard : ''
                                            }`}
                                        >
                                            {plan.popular && (
                                                <div className={styles.badge}>
                                                <span className={styles.badgeText}>
                                                    {t("chatPlans.common.most_popular")}
                                                </span>
                                                </div>
                                            )}

                                            <div className={styles.planHeader}>
                                                <h3 className={styles.planName}>{plan.name}</h3>
                                                <div className={styles.priceContainer}>
                                                    <span className={styles.price}>{plan.price}</span>
                                                    {plan.id === 'plus' && (
                                                        <span className={styles.period}>/месяц</span>
                                                    )}
                                                </div>
                                                <p className={styles.planDescription}>
                                                    {plan.description}
                                                </p>
                                            </div>

                                            <div className={styles.featuresGrid}>
                                                <div className={styles.featuresColumn}>
                                                    <ul className={styles.featuresList}>
                                                        {leftColumn.map((feature, index) => (
                                                            <li key={index} className={styles.featureItem}>
                                                                <span className={styles.checkmark}>{feature.icon}</span>
                                                                <span className={styles.featureText}>
                                                                {feature.text}
                                                            </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className={styles.featuresColumn}>
                                                    <ul className={styles.featuresList}>
                                                        {rightColumn.map((feature, index) => (
                                                            <li key={index} className={styles.featureItem}>
                                                            <span className={styles.checkmark}>
                                                                {feature.icon}
                                                            </span>
                                                                <span className={styles.featureText}>
                                                                {feature.text}
                                                            </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <button
                                                className={`${styles.selectButton} ${
                                                    plan.popular
                                                        ? styles.primaryButton
                                                        : styles.secondaryButton
                                                }`}
                                                disabled={plan.id === 'free' ? false : (currentSubPlan && (currentSubPlan.type === '1' || currentSubPlan.type === 1) && currentSubPlan.expired === false)}
                                                onClick={() => {
                                                    if(plan.id === 'free') {
                                                        handleClose();
                                                    } else {
                                                        handleSelectPlan(plan.id);
                                                    }
                                                }}
                                            >
                                                {plan.id === 'free'
                                                    ? t("chatPlans.common.start_free_button")
                                                    : (currentSubPlan && (currentSubPlan.type === '1' || currentSubPlan.type === 1) && currentSubPlan.expired === true)
                                                        ?
                                                        t("chatPlans.common.resume")
                                                        :
                                                        (currentSubPlan && (currentSubPlan.type === '1' || currentSubPlan.type === 1) && currentSubPlan.expired === false)
                                                            ?
                                                            t("chatPlans.common.active")
                                                            :
                                                            t("chatPlans.common.choose_plus_button")
                                                }
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Футер */}
                        <div className={styles.footer}>
                            <p
                                className={styles.footerText}
                                dangerouslySetInnerHTML={{ __html: t('chatPlans.common.footer') }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {confirmPlanId && (
                <div className={styles.overlay}>
                    <div
                        className={`${styles.backdrop} ${
                            isVisible ? styles.backdropVisible : styles.backdropHidden
                        }`}
                    />
                    <div className={styles.confirmModal} style={{ position: 'fixed' }}>
                        <h3>{t("chatPlans.common.confirm_title")}</h3>
                        <p>{t("chatPlans.common.confirm_text", { plan: confirmPlanId })}</p>
                        <div className={styles.confirmButtons}>
                            <button onClick={handleConfirm} className={styles.primaryButton}>
                                {t("chatPlans.common.confirm")} <img src={starsIcon} style={{ marginLeft: "2px" }} width={12} alt={"Stars Icon"} />
                            </button>
                            <button onClick={() => {
                                handleClose()
                            }} className={styles.secondaryButton}>
                                {t("chatPlans.common.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SubscriptionModal;