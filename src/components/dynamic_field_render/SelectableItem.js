// SelectableItem.jsx
import React from "react";
import styles from "./SelectableItem.module.css";
import { useTranslation } from "react-i18next";
import LucideIcon from './../../assets/icons/LucideIcon';

export default function SelectableItem({ renderSettings, onChange, value, mini = false }) {
    const { t } = useTranslation();

    const count = renderSettings.length;

    const gridStyle = !mini
        ? { gridTemplateColumns: `repeat(${count}, 1fr)` }
        : { gridTemplateColumns: `repeat(auto-fill, minmax(60px, 1fr))` };

    return (
        <div className={styles.selectableList} style={gridStyle}>
            {renderSettings.map((setting) => {
                const selected = value === setting.value;

                return (
                    <div
                        className={`${mini ? styles.selectableItemMini : styles.selectableItem} ${selected ? styles.selected : ""}`}
                        onClick={() => onChange(setting.value)}
                        key={setting.value}
                    >
                        <div className={styles.icon}>
                            {
                                setting.icon ? (
                                    <LucideIcon
                                        name={setting.icon}
                                        size={14}
                                        color={selected ? "#2ad0ea" : "#6b7280"}
                                    />
                                ) : setting.element ? (
                                    <>{setting.element}</>
                                ) : null
                            }
                        </div>
                        <div className={styles.title}>{setting.title.includes(':') ? setting.title : t(setting.title)}</div>
                        {setting.description && (
                            <div className={styles.description}>{t(setting.description)}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
