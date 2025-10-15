import React, { useState, useRef, useEffect } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../config";
import RunsIcon from "../../assets/svg/RunsIcon";
import styles from './css/FeaturesGrid.module.css';
import KeyHintSearch from "../input/KeyHintSearch";
import SearchIcon from "../../assets/svg/SearchIcon";
import {useTranslation} from "react-i18next";
import {Chip, TextField} from "@mui/material";
import telegramStar from "../../assets/gif/gold_star.gif";
import newWebp from '../../assets/gif/new.gif';

const FIVE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const FeaturesGrid = ({ features }) => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const modelFilters = [
        'edit_image', 'creating_image', 'animate_image', 'create_video', 'with_face', 'create_music'
    ];
    const filterRef = useRef(null);

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
                        <SearchIcon width={18} />
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

                {Object.entries(modelFilters).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => toggleFilter(label)}
                        className={`btn no-wrap ${selectedFilters.includes(label) ? 'btn-primary' : 'btn-glass'}`}
                        style={{ animationDelay: `${key * 0.05}s` }}
                    >
                        {t(label)}
                    </button>
                ))}
            </div>

            <div className={styles.featuresList} style={{ marginTop: 5 }}>
                <AnimatePresence>
                    {filteredFeatures.map(feature => {

                        const now = Date.now();

                        const createdTs = new Date(feature.created_at).getTime();
                        const isRecent = (now - createdTs) < FIVE_DAYS_MS;

                        return (
                            <motion.div
                                key={feature.slug}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className={`${styles.featureItem}`}
                                onClick={() => {
                                    navigate('/studio/create/' + feature.slug + (image_id_animate ? "?image_id_animate=" + image_id_animate : ""))
                                }}
                            >
                                <div className={styles.featurePresent}>
                                    {feature.logo && (
                                        <img
                                            src={`${config.apiUrl}public/models_logo/${feature.logo}`}
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

export default FeaturesGrid;