import React from 'react';
import styles from './css/ColorCircle.module.css';

const ColorCircle = ({ color, selectedColor, setSelectedColor }) => {

    return (
        <div onClick={() => setSelectedColor(color)} style={{background: `linear-gradient(135deg, ${color.first_color} 50%, ${color.second_color} 50%)`}} className={`${styles.circleColor}`}>
            {selectedColor.id === color.id && (
                <div
                    style={{
                        content: "''",
                        position: 'absolute',
                        top: '-6px',
                        left: '-6px',
                        width: 'calc(100% + 12px)',
                        height: 'calc(100% + 12px)',
                        background: 'transparent',
                        borderBottom: `3px solid ${color.second_color}`,
                        borderRight: `3px solid ${color.second_color}`,
                        borderTop: `3px solid ${color.first_color}`,
                        borderLeft: `3px solid ${color.first_color}`,
                        borderRadius: '50%',
                    }}
                />
            )}
        </div>
    );
};

export default ColorCircle;