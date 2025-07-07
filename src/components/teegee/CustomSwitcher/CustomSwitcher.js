import React, { useState, useRef } from "react";
import style from "./CustomSwitcher.module.css";
import animationGoldStar from "../../../assets/gif/gold_star.gif";

const CustomSwitcher = () => {
    const [enabled, setEnabled] = useState(false);
    const knobRef = useRef(null);

    const toggle = () => {
        setEnabled(prev => !prev);

        // ⚡ триггерим анимацию
        const knob = knobRef.current;
        knob.classList.remove(style.knobAnimate);
        void knob.offsetWidth; // 💡 Форс-перерисовка
        knob.classList.add(style.knobAnimate);
    };

    return (
    <div
        className={`${style.glassCard} ${enabled ? style.enabled : ""}`}
        onClick={toggle}
    >
        <div
            ref={knobRef}
            className={`${style.switcherKnob} ${enabled ? style.knobEnabled : ""}`}
        >
        </div>
        <img src={animationGoldStar} className={style.star} width={20} />
    </div>
    );
};

export default CustomSwitcher;
