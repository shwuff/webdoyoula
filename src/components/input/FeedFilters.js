import React, { useState, useEffect, useRef } from "react";
import {
    Button, TextField, InputAdornment,
    Dialog, List, ListItemText, useMediaQuery, Box, ListItemButton, Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import SearchIcon from "../../assets/svg/SearchIcon";
import animationGoldStar from './../../assets/gif/gold_star.gif';
import { ChevronDown } from 'lucide-react';
import {useSelector} from "react-redux";
import FilterButton from "../buttons/FilterButton";
import Switch from "../../components/teegee/Switch";
import {useAuth} from "../../app/providers/UserContext";

const CustomSelect = ({ value, onChange, options, label }) => {
    const [open, setOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const {t} = useTranslation();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleApply = () => {
        onChange(tempValue);
        handleClose();
    };

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    return (
        <>
            <FilterButton onClick={handleOpen}>
                <span>{options.find(o => o.value === value)?.label || label}</span>
                <span style={{ marginLeft: 8, display: "flex", alignItems: "center" }}><ChevronDown size={14} /></span>
            </FilterButton>


            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    style: isMobile
                        ? {
                            position: 'fixed',
                            bottom: 0,
                            margin: 0,
                            width: '100%',
                            height: '50%',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            background: "var(--glass-bg)"
                        }
                        : {background: "var(--glass-bg)"}
                }}
            >
                <Box sx={{ flex: 1, overflowY: 'auto', backdropFilter: "blur(8px)" }}>
                    <List>
                        {options.map((o) => (
                            <ListItemButton
                                key={o.value}
                                selected={tempValue === o.value}
                                onClick={() => setTempValue(o.value)}
                                sx={{
                                    background: tempValue === o.value ? 'var(--primary-color) !important' : 'transparent',
                                    '&:hover': { background: tempValue === o.value ? 'var(--primary-color)' : 'rgba(0,0,0,0.08)' }
                                }}
                            >
                                {/*<ListItemText primary={o.label} sx={{color: tempValue === o.value ? 'var(--button-text-color)' : 'var(--text-color)'}} />*/}
                                <ListItemText
                                    primary={
                                        <Typography sx={{ color: tempValue === o.value ? 'var(--button-text-color)' : 'var(--text-color)' }}>
                                            {o.label}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
                <Box sx={{ p: 1, borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'flex-end', backdropFilter: "blur(8px)" }}>
                    <Button variant="contained" onClick={handleApply}>{t('Show')}</Button>
                </Box>
            </Dialog>
        </>
    );
};

const FeedFilters = ({
                         filter, setFilter,
                         searchingAiModel, setSearchingAiModel,
                         dateRange, setDateRange,
                         feed, setFeed,
                         style, setPhotosPage,
                         isMarket, setIsMarket,
                         fromProfile = false,
                         searchQuery, setSearchQuery
                     }) => {
    const { t } = useTranslation();
    const {userData} = useAuth();

    const [tempQuery, setTempQuery] = useState(searchQuery || "");

    const availableModels = useSelector(state => state.model.models);

    useEffect(() => {
        const handler = setTimeout(() => setSearchQuery(tempQuery), 1500);
        return () => clearTimeout(handler);
    }, [tempQuery, setSearchQuery]);

    useEffect(() => {
        if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
            window.Telegram.WebApp?.HapticFeedback?.impactOccurred('light');
        }
    }, [isMarket]);

    const feedOptions = [
        { value: "feed", label: t('recommendations') },
        { value: "subs", label: t('subscribes') }
    ];

    const filterOptions = [
        { value: "repeats", label: t('sort_by_repeats') },
        { value: "date", label: `${t('publish_date')} ↓` },
        { value: "-date", label: `${t('publish_date')} ↑` }
    ];

    const dateRangeOptions = [
        { value: "last_1_day", label: t('last_1_day') },
        { value: "last_7_days", label: t('last_7_days') },
        { value: "last_30_days", label: t('last_30_days') },
        { value: "all_time", label: t('all_time') }
    ];

    const modelOptions = Object.values(availableModels).map(m => ({ value: m.id, label: m.name }));

    const [placeholder, setPlaceholder] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const placeholderIndexRef = useRef(null);

    const animationStateRef = useRef({
        currentIndex: 0,
        isTyping: true,
        timer: null
    });

    const typingSpeed = 100;
    const erasingSpeed = 50;
    const pauseBeforeErase = 2000;
    const pauseBeforeType = 500;

    const getPlaceholders = React.useCallback(() => [
        t('search_title_1'),
        t('search_title_2'),
        t('search_title_3'),
        t('search_title_4'),
        t('search_title_5'),
        t('search_title_6'),
        t('search_title_7'),
        t('search_title_8'),
        t('search_title_9'),
        t('search_title_10')
    ], [t]);

    useEffect(() => {
        const placeholders = getPlaceholders();
        if (placeholders.length === 0) return;

        if (animationStateRef.current.timer) {
            clearTimeout(animationStateRef.current.timer);
        }

        placeholderIndexRef.current = Math.floor(Math.random() * placeholders.length);
        setPlaceholder(placeholders[placeholderIndexRef.current]);

        animationStateRef.current = {
            currentIndex: 0,
            isTyping: true,
            timer: null
        };
        setDisplayedText('');
    }, [getPlaceholders, userData]);

    const selectNextPlaceholder = React.useCallback(() => {
        const placeholders = getPlaceholders();
        if (placeholders.length === 0) return;

        let nextIndex;
        if (placeholders.length === 1) {
            nextIndex = 0;
        } else {
            do {
                nextIndex = Math.floor(Math.random() * placeholders.length);
            } while (nextIndex === placeholderIndexRef.current);
        }

        placeholderIndexRef.current = nextIndex;
        return placeholders[nextIndex];
    }, [getPlaceholders]);

    useEffect(() => {
        if (!placeholder) return;

        if (animationStateRef.current.timer) {
            clearTimeout(animationStateRef.current.timer);
        }

        animationStateRef.current = {
            currentIndex: 0,
            isTyping: true,
            timer: null
        };
        setDisplayedText('');

        const type = () => {
            const state = animationStateRef.current;

            if (state.isTyping) {
                if (state.currentIndex < placeholder.length) {
                    setDisplayedText(prev => {
                        const expectedChar = placeholder.charAt(state.currentIndex);
                        state.currentIndex++;
                        return prev + expectedChar;
                    });
                    state.timer = setTimeout(type, typingSpeed);
                } else {
                    state.isTyping = false;
                    state.timer = setTimeout(type, pauseBeforeErase);
                }
            } else {
                if (state.currentIndex > 0) {
                    setDisplayedText(prev => {
                        state.currentIndex--;
                        return prev.slice(0, -1);
                    });
                    state.timer = setTimeout(type, erasingSpeed);
                } else {
                    const newPlaceholder = selectNextPlaceholder();
                    if (newPlaceholder) {
                        if (state.timer) {
                            clearTimeout(state.timer);
                        }
                        setPlaceholder(newPlaceholder);
                    }
                }
            }
        };

        animationStateRef.current.timer = setTimeout(type, pauseBeforeType);

        return () => {
            if (animationStateRef.current.timer) {
                clearTimeout(animationStateRef.current.timer);
            }
        };
    }, [placeholder, selectNextPlaceholder]);

    return (
        <div style={{ marginBottom: "12px" }} id={"feed-page"}>
            {/* поиск */}
            <div style={{ marginBottom: "10px" }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={displayedText}
                    value={tempQuery}
                    onChange={(e) => setTempQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color={'var(--text-color)'} />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div className="feed-filter-scroll" style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: 4,
            }}>
                {!fromProfile && (
                    <CustomSelect value={feed} onChange={setFeed} options={feedOptions} label={t('feed_type')} />
                )}

                <CustomSelect
                    value={searchingAiModel}
                    onChange={setSearchingAiModel}
                    options={[{ label: t('All AI'), value: 0 }, ...modelOptions]}
                    label={t('Select AI Model')}
                />

                <CustomSelect value={filter} onChange={setFilter} options={filterOptions} label={t('sort_by')} />

                {(filter === "date" || filter === "-date") ? (
                    <CustomSelect value="all_time" onChange={setDateRange} options={[{ value: 'all_time', label: t('all_time') }]} label={t('type_interval')} />
                ) : (
                    <CustomSelect value={dateRange} onChange={setDateRange} options={dateRangeOptions} label={t('type_interval')} />
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 2,marginLeft: "8px" }}>
                    <Switch
                        checked={isMarket}
                        onChange={(e) => { setIsMarket(e.target.checked); setPhotosPage(0); }}
                    />
                    <img src={animationGoldStar} width={18} />
                </div>
            </div>
        </div>
    );
};

export default FeedFilters;
