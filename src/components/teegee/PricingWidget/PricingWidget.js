import React, { useState, useRef, useEffect } from 'react';
import styles from './css/PricingWidget.module.css';
import gsap from 'gsap';
import {useTranslation} from 'react-i18next';
import GoldStarIcon from './../../../assets/images/gold_star.png';
import StarGif from './../../../assets/gif/gold_star.gif';
import {Box, Button} from "@mui/material";
import {createPortal} from "react-dom";

function BottomBar({ children }) {
    return createPortal(
        <div
            style={{
                position: 'fixed',
                zIndex: 12300,
                maxWidth: "400px"
            }}
        >
            {children}
        </div>,
        document.body
    );
}

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
        <>
            <div className={styles.container}>
                <div className={styles.plansWrapper} style={{ position: 'relative' }}>
                    <div ref={highlightRef} className={styles.movingHighlight}></div>

                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            ref={el => (cardRefs.current[plan.id] = el)}
                            className={`${styles.planCard}${selectedPlan === plan.id ? ` ${styles.activePlanCard}` : ''} d-flex`}
                            style={{ gap: "10px" }}
                            onClick={() => {
                                setSelectedPlan(plan.id);
                                setSelectedPlan(plan.id);
                            }}
                        >
                            <span className={`${styles.radio} ${selectedPlan === plan.id ? ` ${styles.activeRadio}` : ''}`}>
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
                            <div className={"w-100"}>

                                <div className={styles.cardHeader}>
                                    <span className={`${styles.planName} text-shadow`}>
                                        {plan.name} Doyoula Stars
                                        <img src={StarGif} width={16} style={{ marginLeft: 4 }} />
                                    </span>
                                    {plan.popular && <span className={styles.popularTag}>{t('Popular')}</span>}
                                    {plan.benefit && <span className={styles.popularTag}>{t('Most benefit')}</span>}
                                </div>
                                <div className={`${styles.price} text-shadow d-flex`}>
                                    <div className={`${styles.price}`}>
                                        {currency !== 'RUB' && currency !== "XTR" && currency}
                                        { currency === "XTR" && <img src={GoldStarIcon} width={20}  height={20}/> }
                                        {plan.price}
                                        <span className={styles.price}>
                                    {currency === 'RUB' && "₽"}
                                </span>
                                    </div>
                                    {plan.last_price ?
                                        <div>
                                        <span style={{ textDecoration: "line-through", color: "var(--hint-color)", fontSize: 14, marginLeft: 8, bottom: 0 }}>
                                            { currency === "XTR" && <img src={GoldStarIcon} width={14}  height={14}/> }
                                            {plan.last_price}
                                            {currency === 'RUB' && "₽"}
                                        </span>
                                        </div> : ''
                                    }
                                </div>
                                {
                                    selectedPlan === plan.id && (
                                        <p>{t(`pricing.tariff_${index + 1}`)}</p>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {afterBillingButton()}
                <BottomBar>
                    <Button variant={"action"} onClick={billingVoid} sx={{
                        position: 'fixed',
                        bottom: 16,
                        zIndex: 1200,
                        height: 56,
                        borderRadius: 3,
                        boxShadow: '0 8px 30px rgba(0,0,0,.25)',
                        backdropFilter: 'blur(10px)',
                        maxWidth: "370px",
                        width: "calc(100% - 34px)",
                        right: 16,
                        fontSize: "18px"
                    }}>
                        {t('Pay')}
                        {activePlan.stars}
                        <img src={StarGif} width={18} style={{ marginLeft: 4 }} />
                        {/*{currency === 'RUB' ? "₽" : currency === "XTR" ? "Telegram Stars" : ""}*/}
                    </Button>
                </BottomBar>
                <Box sx={{ height: 40 }}>

                </Box>

            </div>
        </>
    );
}