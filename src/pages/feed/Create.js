import React from 'react';
import { useTranslation } from 'react-i18next';
import './Create.css';

const Create = ({ cards = [], onClick = () => {}, selected }) => {
    const { t } = useTranslation();

    const isSelected = (titleKey) => {
        if (Array.isArray(selected)) {
            return selected.includes(titleKey);
        }
        return selected === titleKey;
    };

    return (
        <div className="create-container">
            {/*<h4 className="create-title">{t("Create")}</h4>*/}

            <div className="cards-scroll-container">
                <div className="cards-wrapper">
                    {cards.map((card) => (
                        <div key={card.id} className={`create-card ${isSelected(card.titleKey) ? 'active' : ''}`} onClick={() => {onClick(card.titleKey)}}>
                            <div className="card-icon-wrapper" style={{ color: card.color }}>
                                {card.icon}
                            </div>
                            <div className="card-title">{t(card.titleKey)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Create;