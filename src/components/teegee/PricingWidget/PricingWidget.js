import React, { useState, useRef, useEffect } from 'react';
import styles from './css/PricingWidget.module.css';
import gsap from 'gsap';
import {useTranslation} from 'react-i18next';
import GoldStarIcon from './../../../assets/images/gold_star.png';
import {Button} from "@mui/material";

export default function PricingWidget({ billingOptions = [], plansByCycle = {}, currency, selectedOption, setSelectedOption, billingVoid = () => {}, afterBillingButton = () => {} }) {
    const [billingCycle, setBillingCycle] = useState(billingOptions[0]);
    const [selectedPlan, setSelectedPlan] = useState(
        plansByCycle[billingCycle] && plansByCycle[billingCycle][0]?.id || ''
    );

    const {t} = useTranslation();

    const plans = plansByCycle[billingCycle] || [];
    const highlightRef = useRef(null);
    const cardRefs = useRef({});

    useEffect(() => {
        const el = highlightRef.current;
        const selected = cardRefs.current[selectedPlan];
        setSelectedOption(selectedPlan);
        if (el && selected) {
            const top = selected.offsetTop;
            const height = selected.offsetHeight;

            gsap.to(el, {
                y: top,
                height: height,
                duration: 0.4,
                ease: 'power2.out',
            });
        }
    }, [selectedPlan, plans]);

    const activePlan = plans.find(p => p.id === selectedPlan);

    return (
        <div className={styles.container}>
            {
                billingOptions.length > 0 && (
                    <div className={styles.toggleWrapper}>
                        <div
                            className={styles.toggleSlider}
                            style={{
                                transform: billingCycle === billingOptions[0] ? 'translateX(0%)' : 'translateX(calc(100% - 8px))',
                            }}
                        />
                        {billingOptions.map((label) => (
                            <button
                                key={label}
                                onClick={() => {
                                    setBillingCycle(label);
                                    const newPlans = plansByCycle[label] || [];
                                    if (newPlans.length > 0) {
                                        setSelectedPlan(newPlans[0].id);
                                    }
                                }}
                                className={`${styles.toggleButton} ${billingCycle === label ? styles.activeToggle : ''} text-shadow`}
                            >
                                {t(label)}
                            </button>
                        ))}
                    </div>
                )
            }

            <div className={styles.plansWrapper} style={{ position: 'relative' }}>
                <div ref={highlightRef} className={styles.movingHighlight}></div>

                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        ref={el => (cardRefs.current[plan.id] = el)}
                        className={`${styles.planCard}${selectedPlan === plan.id ? ` ${styles.activePlanCard}` : ''}`}
                        onClick={() => {
                            setSelectedPlan(plan.id);
                            setSelectedPlan(plan.id);
                        }}
                    >
                        <div className={styles.cardHeader}>
                            <span className={`${styles.planName} text-shadow`}>{plan.name}</span>
                            {plan.popular && <span className={styles.popularTag}>Popular</span>}
                            <span className={`${styles.radio}${selectedPlan === plan.id ? ` ${styles.activeRadio}` : ''}`}>
                                {selectedPlan === plan.id && (
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </span>
                        </div>
                        <div className={`${styles.price} text-shadow`}>{currency !== 'RUB' && currency !== "XTR" && currency} { currency === "XTR" && <img src={GoldStarIcon} width={20}  height={20}/> } {plan.price} <span className={styles.price}>{currency === 'RUB' && "₽"}</span></div>
                    </div>
                ))}
            </div>

            <Button variant={"action"} onClick={billingVoid} className={styles.ctaButton}>{t('Pay')} {activePlan.price} {currency === 'RUB' ? "₽" : currency === "XTR" ? "Telegram Stars" : ""}</Button>

            {afterBillingButton()}

        </div>
    );
}