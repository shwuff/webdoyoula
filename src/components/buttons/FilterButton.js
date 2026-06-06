import React from 'react';

const FilterButton = ({ children, onClick, selected = false }) => {
    return (
        <span
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 12px",
                border: "1px solid #ccc",
                borderRadius: 14,
                fontSize: 16,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                width: "max-content",
                color: selected ? "#ffffff" : "var(--text-color)",
                background: selected ? "var(--primary-color)" : "var(--glass-bg)",
            }}
        >
            {children}
        </span>
    );
};

export default FilterButton;