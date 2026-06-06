import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import CustomJoyrideTooltip from "./CustomJoyrideTooltip";
import {useWebSocket} from "../../app/providers/WebSocketContext";
import {useSelector} from "react-redux";
import {useAuth} from "../../app/providers/UserContext";

function Tooltip({ target, content, onNext, onPrev, onSkip, stepNumber, totalSteps, currentStep, currentIndex, steps, skipAvailable }) {
    const [pos, setPos] = useState(null);

    useEffect(() => {
        const el = document.querySelector(target);
        if (!el) return;

        const updatePos = () => {
            const rect = el.getBoundingClientRect();
            setPos({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
            });
        };

        updatePos();
        const observer = new MutationObserver(updatePos);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener("resize", updatePos);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePos);
        };
    }, [target]);

    if (!pos) return null;

    return createPortal(
        <>
            <div
                className="jr-overlay"
                onClick={onNext}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,.45)",
                    zIndex: 9998,
                }}
            />

            <div
                key={currentIndex}
                style={{
                    position: "absolute",
                    top: pos.top,
                    left: pos.left,
                    zIndex: 10000,
                }}
            >
                <div className="jr-anim">
                    <CustomJoyrideTooltip
                        step={currentStep}
                        index={currentIndex}
                        size={steps.length}
                        primaryProps={{ onClick: onNext }}
                        backProps={{ onClick: onPrev }}
                        skipProps={{ onClick: onSkip }}
                        skipAvailable={skipAvailable}
                    />
                </div>
            </div>
        </>,
        document.body
    );

}

// forwardRef + useImperativeHandle чтобы можно было вызвать start()
const StableJoyride = forwardRef(({ steps, skipAvailable }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState(null);
    const [run, setRun] = useState(false);
    const navigate = useNavigate();
    const {sendData} = useWebSocket();
    const {token, userData} = useAuth();

    // Функции управления шагами
    const nextStep = () => setCurrentIndex(i => i + 1);
    const prevStep = () => setCurrentIndex(i => Math.max(0, i - 1));
    const skip = () => {
        setCurrentStep(null);
        setRun(false);
    };

    // expose start() через ref
    useImperativeHandle(ref, () => ({
        start: () => {
            setCurrentIndex(0);
            setRun(true);
        }
    }));

    useEffect(() => {
        if (!run || currentIndex >= steps.length) {
            setCurrentStep(null);
            if(userData.view_instruction === false) {
                sendData({
                    action: "update/view_instruction",
                    data: {
                        jwt: token,
                        view_instruction: true,
                    }
                })
            }
            return;
        }

        const step = steps[currentIndex];

        const waitForTarget = () => {
            if (step.route && step.route !== window.location.pathname) {
                navigate(step.route, { replace: true });
            }

            const check = () => {
                const el = document.querySelector(step.target);
                if (el) {
                    setCurrentStep(step);
                } else {
                    setTimeout(check, 100);
                }
            };

            check();
        };

        waitForTarget();
    }, [run, currentIndex, steps, navigate]);

    if (!currentStep) return null;

    return (
        <Tooltip
            target={currentStep.target}
            content={currentStep.content}
            stepNumber={currentIndex + 1}
            totalSteps={steps.length}
            currentStep={currentStep}
            currentIndex={currentIndex}
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={skip}
            steps={steps}
            skipAvailable={skipAvailable}
        />
    );
});

export default StableJoyride;
