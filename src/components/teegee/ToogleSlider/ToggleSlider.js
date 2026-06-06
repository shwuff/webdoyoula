import React, { useState } from 'react'
import styles from './ToggleSlider.module.css'

export default function ToggleSlider({
                                         options = ['First', 'Second'],
                                         onChange,
                                         defaultValue = 0
                                     }) {
    const [activeIndex, setActiveIndex] = useState(defaultValue)

    const handleClick = i => {
        setActiveIndex(i)
        if (onChange) onChange(i)
    }

    return (
        <div className={styles.container}>
            <div className={styles.toggleWrapper}>
                <div
                    className={styles.toggleSlider}
                    style={{
                        transform: `translateX(calc(${(99) * activeIndex}%))`,
                        width: `${100 / options.length}%`
                    }}
                />
                {options.map((opt, i) => (
                    <span
                        key={i}
                        onClick={() => handleClick(i)}
                        className={`${styles.toggleButton} ${activeIndex === i ? styles.activeToggle : ''}`}
                    >
                        {opt}
                    </span>
                ))}
            </div>
        </div>
    )
}