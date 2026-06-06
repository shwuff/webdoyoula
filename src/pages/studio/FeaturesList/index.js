import React, { useState, useRef, useEffect } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../../app/config/config";
import RunsIcon from "../../../assets/svg/RunsIcon";
import styles from './css/FeaturesGrid.module.css';
import KeyHintSearch from "../../../components/input/KeyHintSearch";
import SearchIcon from "../../../assets/svg/SearchIcon";
import {useTranslation} from "react-i18next";
import {Button, Chip, TextField} from "@mui/material";
import telegramStar from "../../../assets/gif/gold_star.gif";
import newWebp from '../../../assets/gif/new.gif';
import FilterButton from "../../../components/buttons/FilterButton";
import {
    Image,
    Video,
    Music,
    Edit,
    Zap
} from 'lucide-react';
import Create from "../../feed/Create";

const FIVE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const Index = ({ features, repeat_id }) => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const modelFilters = [
        'edit_image', 'creating_image', 'animate_image', 'create_video', 'create_music'
    ];
    const filterRef = useRef(null);

    const cards = [
        {
            id: 2,
            titleKey: 'creating_image',
            icon: <Image className="card-icon" size={24} />,
            color: "#8B5CF6"
        },
        {
            id: 4,
            titleKey: 'create_video',
            icon: <Video className="card-icon" size={24} />,
            color: "#EF4444"
        },
        {
            id: 1,
            titleKey: 'edit_image',
            icon: <Edit className="card-icon" size={24} />,
            color: "#3B82F6"
        },
        {
            id: 3,
            titleKey: 'animate_image',
            icon: <Zap className="card-icon" size={24} />,
            color: "#F59E0B"
        },
        {
            id: 5,
            titleKey: 'create_music',
            icon: <Music className="card-icon" size={24} />,
            color: "#10B981"
        }
    ];

    const [searchParams] = useSearchParams();
    const sortParams = searchParams.get('sort');
    const image_id_animate = searchParams.get('image_id_animate');

    const toggleFilter = (key) => {
        setSelectedFilters((prev) =>
            prev.includes(key)
            ? prev.filter((f) => f !== key)
            : [...prev, key]
        );
    };

    const filteredFeatures = features.filter((feature) => {
        const matchesQuery = feature.name.toLowerCase().includes(query.toLowerCase());

        const matchesFilters =
            selectedFilters.length === 0 ||
            selectedFilters.some((filter) =>
                feature.filter?.includes(filter)
            );

        return matchesQuery && matchesFilters;
    });

    useEffect(() => {
        const handleKey = (e) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

            if (isCmdOrCtrl && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    useEffect(() => {
        if (!sortParams) return;

        const params = sortParams.split(',').map(p => p.trim()); // убираем пробелы

        params.forEach(param => {
            toggleFilter(param);
        });
    }, [sortParams]);

    return (
        <>
            <div className={styles.searchBar}>
                <div className={styles.searchInputWrapper} ref={filterRef}>
                    <span className={styles.searchIcon}>
                        <SearchIcon width={18} color={"var(--text-color)"} />
                    </span>
                    <TextField
                        InputProps={{
                            sx: {
                                paddingLeft: '18px',
                            }
                        }}
                        size="small"
                        inputRef={inputRef}
                        type="text"
                        placeholder={t('Search models...')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={styles.searchInput}
                    />


                    <KeyHintSearch />
                </div>
            </div>


            <div className="myButtonsContainer horizontal-list">
                <Create cards={cards} onClick={(label) => toggleFilter(label)} selected={selectedFilters}  />
            </div>

            {
                repeat_id ? (
                    <div className={"d-flex justify-content-between align-items-center"} style={{ padding: "6px", border: "1px solid red", borderRadius: "8px" }}>
                        <p style={{  }}>{t('Choose model for repeat prompt')}</p>
                        <span style={{ color: "lightgray", fontSize: "14px" }} onClick={() => navigate('/studio/create')}>{t("Cancel repeat")}</span>
                    </div>
                ) : null
            }

            <div className={styles.featuresList}>
                <AnimatePresence>
                    {filteredFeatures.map(feature => {

                        const now = Date.now();

                        const createdTs = new Date(feature.created_at).getTime();
                        const isRecent = (now - createdTs) < FIVE_DAYS_MS;

                        return (
                            <motion.div
                                key={feature.slug}
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.99 }}
                                transition={{ duration: 0.1, ease: "easeInOut" }}
                                className={`${styles.featureItem}`}
                                onClick={() => {
                                    if(repeat_id) {
                                        navigate('/studio/repeat/' + repeat_id + "?selected_model=" + feature.slug)
                                    } else {
                                        navigate('/studio/create/' + feature.slug + (image_id_animate ? "?image_id_animate=" + image_id_animate : ""))
                                    }
                                }}
                                id={"select-ai"}
                            >
                                <div className={styles.featurePresent}>
                                    {feature.logo && (
                                        <img
                                            src={`${config.apiUrl}public/model_logo/${feature.logo}`}
                                            alt={feature.name}
                                            className={styles.featureLogo}
                                        />
                                    )}
                                    <div className={styles.featureName}>
                                        {/*<p><span className={"text-muted"}>{feature.owner}</span>/{feature.name}</p>*/}
                                        <p>{feature.name}</p>
                                        {isRecent && (
                                            <span className="badge-new">
                                                <img src={newWebp} style={{ maxWidth: 20}} />
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.featureName} style={{ display: "block" }}>
                                        {
                                            feature.filter.split(',').map((filter) => {
                                                return (
                                                    <Chip
                                                        key={filter}
                                                        label={t(filter)}
                                                        size="small"
                                                        color={'success'}
                                                        sx={{ background: "var(--glass-bg)", marginTop: "4px", fontSize: "10npx" }}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                    <div className={styles.featureNameDown}>
                                        {/*<p><span className={"text-muted"}>{feature.owner}</span>/{feature.name}</p>*/}
                                        <span className={styles.runs}>
                                            <RunsIcon className={styles.runsIcon} />
                                            {feature.runs}
                                        </span>
                                        <span className={styles.telegramStarIcon}>
                                            <img src={telegramStar} className={styles.telegramStar} />
                                            {feature.paid_options !== null && 'от '}{parseInt(feature.price)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )})
                    }
                </AnimatePresence>
            </div>
        </>
    );
};

export default Index;