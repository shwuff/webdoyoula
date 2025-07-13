import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../config";
import RunsIcon from "../../assets/svg/RunsIcon";
import styles from './css/FeaturesGrid.module.css';
import KeyHintSearch from "../input/KeyHintSearch";
import SearchIcon from "../../assets/svg/SearchIcon";
import {useTranslation} from "react-i18next";
import {Checkbox, IconButton, Input, ListItemText, Menu, MenuItem, TextField} from "@mui/material";
import telegramStar from "../../assets/gif/gold_star.gif";
import {FilterList} from "@mui/icons-material";


const FeaturesGrid = ({ features }) => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const modelFilters = [
        'edit_image', 'creating_image', 'animate_image'
    ];
    const filterRef = useRef(null);

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

                <IconButton
                    className={styles.filterIcon}
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <FilterList fontSize="small" />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    {Object.entries(modelFilters).map(([key, label]) => (
                        <MenuItem
                            key={label}
                            onClick={() => toggleFilter(label)}
                        >
                            <Checkbox
                                edge="start"
                                checked={selectedFilters.includes(label)}
                                tabIndex={-1}
                                disableRipple
                                size="small"
                            />
                            <ListItemText primary={t(label)} />
                        </MenuItem>
                    ))}
                </Menu>

            </div>

            <div className={styles.featuresList}>
                <AnimatePresence>
                    {filteredFeatures.map((feature) => (
                        <motion.div
                            key={feature.slug}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className={`${styles.featureItem}`}
                            onClick={() => navigate('/studio/create/' + feature.slug)}
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
                                    <span className={styles.runs}>
                                    </span>
                                </div>
                                <div className={styles.featureNameDown}>
                                    {/*<p><span className={"text-muted"}>{feature.owner}</span>/{feature.name}</p>*/}
                                    <span className={styles.runs}>
                                        <RunsIcon className={styles.runsIcon} />
                                        {feature.runs}
                                    </span>
                                    <span className={styles.telegramStarIcon}>
                                        <img src={telegramStar} className={styles.telegramStar} />
                                        {parseInt(feature.price)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
};

export default FeaturesGrid;