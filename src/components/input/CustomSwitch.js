import React from 'react';
import style from './css/CustomSwitch.module.css';
import starGif from '../../assets/gif/gold_star.gif'; // путь к твоей звезде

const CustomSwitch = ({ checked, onChange }) => {
    return (
        <div className={style.customSwitch} onClick={() => onChange(!checked)}>
            <div className={style.customSwitchCircle}>
                {checked && (
                    <img src={starGif} alt="star" className={style.customSwitchStar} />
                )}
            </div>
        </div>
    );
};

export default CustomSwitch;
