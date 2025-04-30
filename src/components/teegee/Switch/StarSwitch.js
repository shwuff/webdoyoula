import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import animationGoldStar from '../../../assets/gif/gold_star.gif'; 

const StarSwitch = ({ isMarket, setIsMarket }) => {
    const sliderRef = useRef(null);
    const [internalX, setInternalX] = useState(0); // текущее положение (0 или 26)

    useEffect(() => {
        const targetX = isMarket ? 0 : 0; // позиция в px (контейнер 56 - ползунок 30 = 26)

        // Эффект жвачки: сначала — выход за границу, потом — назад
        gsap.fromTo(
            sliderRef.current,
            {
                x: internalX,
                scaleX: 1,
            },
            {
                x: targetX + (isMarket ? 6 : -6), // выход за границу
                scaleX: 1.3,
                duration: 0.12,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(sliderRef.current, {
                        x: targetX,
                        scaleX: 1,
                        duration: 0.2,
                        ease: "power3.out",
                        onComplete: () => setInternalX(targetX)
                    });
                }
            }
        );
    }, [isMarket]);

    return (
        <div
            onClick={() => setIsMarket(prev => !prev)}
            style={{
                width: 56,
                height: 32,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 999,
                padding: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                cursor: "pointer",
                border: "1px solid rgba(0,0,0,0.1)",
                transition: "background-color 0.3s ease",
                backdropFilter: "blur(4px)",
                overflow: "visible" // 💥 позволяет выходить за границы!
            }}
        >
            <div style={{ flex: 1 }} />

            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <img
                    src={animationGoldStar}
                    alt="star"
                    style={{
                        width: 18,
                        height: 18,
                        filter: "drop-shadow(0 0 2px gold)",
                        transition: "filter 0.3s ease"
                    }}
                />
            </div>

            <div
                ref={sliderRef}
                style={{
                    position: "absolute",
                    top: "0px",
                    left: isMarket ? "calc(100% - 30px)" : "0px",
                    width: 30,
                    height: 30,
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    borderRadius: "50%",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                    transform: `translateX(${internalX}px)`,
                    transition: "left 0.25s ease, background-color 0.25s ease",
                    transformOrigin: "center",
                }}
            />
        </div>
    );
};

export default StarSwitch;
