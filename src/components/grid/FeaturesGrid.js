import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../config";
import RunsIcon from "../../assets/svg/RunsIcon";
import styles from './css/FeaturesGrid.module.css';
import KeyHintSearch from "../input/KeyHintSearch";
import SearchIcon from "../../assets/svg/SearchIcon";
import {useTranslation} from "react-i18next";
import {Input, TextField} from "@mui/material";

const FeaturesGrid = ({ features }) => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);

    const filtered = features.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase())
    );

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
                <div className={styles.searchInputWrapper}>
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

            <div className={styles.featuresList}>
                <AnimatePresence>
                    {filtered.map((feature) => (
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
                                    <p>{feature.name}</p>
                                    <span className={styles.runs}>
                                        <RunsIcon />
                                        {feature.runs}
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