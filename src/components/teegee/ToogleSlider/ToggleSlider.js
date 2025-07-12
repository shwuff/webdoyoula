import React, { useState } from 'react'
import './ToggleSlider.css'
import {Button} from "@mui/material";

export default function ToggleSlider({ options = ['First', 'Second'], onChange }) {
    const [activeIndex, setActiveIndex] = useState(0)

    const handleClick = i => {
        setActiveIndex(i)
        if (onChange) onChange(i)
    }

    return (
        <div className="toggle-container">
            {options.map((opt, i) => (
                <button
                    key={i}
                    className={`toggle-btn ${activeIndex === i ? 'active' : ''}`}
                    onClick={() => handleClick(i)}
                >
                    {opt}
                </button>
            ))}
            <div
                className="toggle-slider"
                style={{ left: `${(100 / options.length) * activeIndex}%`, width: `${100 / options.length}%` }}
            />
        </div>
    )
}
