import React from "react";

export default function CustomJoyrideTooltip({ step,
        index,
        size,
        primaryProps,
        backProps,
        skipProps,
        tooltipProps, skipAvailable = true }
) {
    return (
        <div {...tooltipProps} className="jr-tooltip">

            <div className="jr-counter">
                {index + 1} / {size}
            </div>

            <div className="jr-arrow">
                <svg width="36" height="24" viewBox="0 0 28 16" fill="none">
                    <path
                        d="M14 0C14 10 4 16 0 16H28C24 16 14 10 14 0Z"
                        fill="var(--glass-bg)"
                    />
                </svg>
            </div>

            <div className="jr-content">
                <h4>{step.title}</h4>
                <p>{step.content}</p>

                <div className="jr-actions">
                    <div>
                        <div className={"d-flex"} style={{marginBottom: "5px", gap: "5px"}}>
                            <button {...backProps}>Назад</button>
                            <button {...primaryProps}>Далее</button>
                        </div>
                        {
                            skipAvailable && (
                                <button {...skipProps}>Пропустить</button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
