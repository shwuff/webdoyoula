import React, { useState, useRef, useEffect } from 'react';
import styles from './css/SmartDropdown.module.css';
import { gsap } from 'gsap';

export default function SmartDropdown({ options = [], selected, setSelected }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dropdownRef = useRef(null);
    const iconRefs = useRef({});
    const dropdownContainerRef = useRef(null);

    const selectedOption = options.find((opt) => opt.value === selected);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeDropdown = () => {
        if (!dropdownContainerRef.current) return;

        setIsAnimating(true);
        gsap.to(dropdownContainerRef.current, {
            opacity: 0,
            scale: 0.95,
            y: -5,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                setIsOpen(false);
                setIsAnimating(false);
            },
        });
    };

    useEffect(() => {
        if (isOpen && dropdownContainerRef.current) {
            gsap.fromTo(
                dropdownContainerRef.current,
                { opacity: 0, scale: 0.95, y: -5 },
                { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' }
            );

            gsap.fromTo(
                dropdownRef.current.querySelectorAll(`.${styles.option}`),
                { opacity: 0, y: -8 },
                { opacity: 1, y: 0, stagger: 0.04, duration: 0.2, ease: 'power2.out' }
            );
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedOption?.icon && iconRefs.current[selectedOption?.label]) {
            gsap.fromTo(iconRefs.current[selectedOption.label],
                { rotation: -5 },
                { rotation: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
            );
        }
    }, [selected]);

    return (
        <div className={styles.wrapper} ref={dropdownRef}>
            <button className={styles.trigger} onClick={() => {
                if (isOpen) {
                    closeDropdown();
                } else {
                    setIsOpen(true);
                }
            }}>
                {selectedOption?.icon && (
                    <img
                        ref={(el) => (iconRefs.current[selectedOption.label] = el)}
                        src={selectedOption.icon}
                        alt={selectedOption.label}
                        className={styles.icon}
                    />
                )}
                <span className={styles.label}>{selectedOption?.label}</span>
                <svg
                    className={`${styles.chevron} ${isOpen ? styles.rotate : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            {(isOpen || isAnimating) && (
                <div className={styles.dropdown} ref={dropdownContainerRef}>
                    {options.map((option) => (
                        <div
                            key={option.label}
                            className={`${styles.option} ${selected === option.value ? styles.active : ''}`}
                            onClick={() => {
                                setSelected(option.value);
                                closeDropdown();
                            }}
                        >
                            {option.icon && (
                                <img
                                    ref={(el) => (iconRefs.current[option.label] = el)}
                                    src={option.icon}
                                    alt={option.label}
                                    className={styles.icon}
                                />
                            )}
                            <span className={styles.optionLabel}>{option.label}</span>
                            {selected === option.value && <span className={styles.check}>✔</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}