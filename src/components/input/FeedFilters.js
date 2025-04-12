import React, { useState, useRef } from "react";
import {
    MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel
} from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useTranslation } from "react-i18next";
import SearchIcon from "../../assets/svg/SearchIcon";
import { useNavigate } from "react-router-dom";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import gsap from "gsap";
import Button from "../teegee/Button/Button";

const FeedFilters = ({
                         filter, setFilter, dateRange, setDateRange,
                         feed, setFeed, style, setPhotosPage,
                         isMarket, setIsMarket
                     }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [filtersVisible, setFiltersVisible] = useState(false);
    const filtersWrapperRef = useRef(null);

    const showFilters = () => {
        gsap.killTweensOf(filtersWrapperRef.current);
        gsap.set(filtersWrapperRef.current, { height: 'auto', display: 'block' });

        const fullHeight = filtersWrapperRef.current.scrollHeight;

        gsap.fromTo(filtersWrapperRef.current,
            {
                width: "0%",
                height: 0,
                opacity: 0,
                scale: 0.7,
                autoAlpha: 0,
                overflow: "hidden"
            },
            {
                height: fullHeight,
                opacity: 1,
                width: "100%",
                scale: 1,
                autoAlpha: 1,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(filtersWrapperRef.current, { height: 'auto', overflow: "visible" });
                }
            }
        );
    };

    const hideFilters = () => {
        gsap.killTweensOf(filtersWrapperRef.current);
        gsap.to(filtersWrapperRef.current, {
            height: 0,
            opacity: 0,
            scale: 0.7,
            autoAlpha: 0,
            overflow: "hidden",
            width: "0%",
            duration: 0.3,
            ease: "power2.in"
        });
    };

    const toggleFilters = () => {
        if (filtersVisible) {
            hideFilters();
        } else {
            showFilters();
        }
        setFiltersVisible(!filtersVisible);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        if (event.target.value === "date") setDateRange("all_time");
        setPhotosPage(1);
    };

    const handleFeedChange = (event) => {
        setFeed(event.target.value);
        setPhotosPage(1);
    };

    const handleDateRangeChange = (event) => {
        setDateRange(event.target.value);
        setPhotosPage(1);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center w-100 mb-2">
                <div className="c-pointer w-100 d-flex align-items-center justify-content-between" style={{gap: "15px", paddingLeft: "15px", paddingRight: "15px"}}>
                    <div className={"d-flex align-items-center"}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isMarket}
                                    onChange={(e) => {
                                        setIsMarket(e.target.checked);
                                        setPhotosPage(1);
                                    }}
                                    size="small"
                                />
                            }
                            sx={{ mr: 0, mb: 0, fontSize: '0.8rem' }}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" fill="none">
                            <path fill="var(--text-color)" fillRule="evenodd" d="M9.522 14.866a1 1 0 0 0 1.1.653l12.766-2.036a1 1 0 0 0 .823-.792l1.355-6.792a1 1 0 0 0-.964-1.196l-17.36-.28a1 1 0 0 0-.958 1.335l3.238 9.108ZM10.326 23.052a2.326 2.326 0 1 0 0-4.652 2.326 2.326 0 0 0 0 4.652ZM21.957 23.052a2.326 2.326 0 1 0 0-4.652 2.326 2.326 0 0 0 0 4.652Z" clipRule="evenodd"></path>
                            <path fill="var(--text-color)" d="M6.169.9h-4.71a1.31 1.31 0 1 0 0 2.618h3.337a1 1 0 0 1 .945.672l.942 2.71L9.35 5.6 8.035 2.182A2 2 0 0 0 6.17.9Z"></path>
                        </svg>
                    </div>

                    <Button style={{ marginBottom: "10px" }} onClick={toggleFilters}>
                        <FilterAltIcon style={{ fill: "white", width: "14px", marginRight: "2px" }} />
                        {t('Open filters')}
                    </Button>
                    <div className="c-pointer" onClick={() => navigate('/search')}>
                        <SearchIcon />
                    </div>
                </div>
            </div>

            <div
                ref={filtersWrapperRef}
                style={{ overflow: 'hidden', height: 0, opacity: 0, transform: 'scale(0.95)', margin: "auto" }}
            >

                <div className="w-100 d-flex align-items-center justify-content-between mb-2" style={{marginBottom: "10px"}}>
                    <FormControl
                        sx={{ fontSize: "0.8rem", flexGrow: 1, marginRight: 1 }}
                        size="small"
                    >
                        <InputLabel id="filter-select-label" sx={{ fontSize: "0.8rem" }}>
                            {t('feed_type')}
                        </InputLabel>
                        <Select
                            labelId="filter-select-label"
                            value={feed}
                            onChange={handleFeedChange}
                            label={t('feed_type')}
                            sx={{ fontSize: "0.8rem" }}
                        >
                            <MenuItem value="feed">{t('feed')}</MenuItem>
                            <MenuItem value="subs">{t('subscribes')}</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="d-flex" style={style}>
                    <div className="w-100" style={{ paddingRight: "5px" }}>
                        <FormControl fullWidth size="small" sx={{ marginBottom: "10px" }}>
                            <InputLabel id="sort-label">{t('sort_by')}</InputLabel>
                            <Select
                                labelId="sort-label"
                                value={filter}
                                onChange={handleFilterChange}
                                label={t('sort_by')}
                            >
                                <MenuItem value="repeats">{t('sort_by_repeats')}</MenuItem>
                                <MenuItem value="date">
                                    {t('publish_date')} <ArrowDownwardIcon fontSize="small" />
                                </MenuItem>
                                <MenuItem value="-date">
                                    {t('publish_date')} <ArrowUpwardIcon fontSize="small" />
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="w-100" style={{ paddingLeft: "5px" }}>
                        {filter === "date" || filter === "-date" ? (
                            <FormControl fullWidth size="small" sx={{ marginBottom: "10px" }}>
                                <InputLabel id="date-range-select-label" sx={{ fontSize: "0.8rem" }}>
                                    {t('type_interval')}
                                </InputLabel>
                                <Select
                                    labelId="date-range-select-label"
                                    value="all_time"
                                    onChange={handleDateRangeChange}
                                    label="Промежуток"
                                    sx={{ fontSize: "0.8rem" }}
                                >
                                    <MenuItem value="all_time" sx={{ fontSize: "0.8rem" }}>
                                        {t('all_time')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <FormControl fullWidth size="small" sx={{ marginBottom: "10px" }}>
                                <InputLabel id="date-range-select-label" sx={{ fontSize: "0.8rem" }}>
                                    {t('type_interval')}
                                </InputLabel>
                                <Select
                                    labelId="date-range-select-label"
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    label={t('type_interval')}
                                    sx={{ fontSize: "0.8rem" }}
                                >
                                    <MenuItem value="last_1_day" sx={{ fontSize: "0.8rem" }}>
                                        {t('last_1_day')}
                                    </MenuItem>
                                    <MenuItem value="last_7_days" sx={{ fontSize: "0.8rem" }}>
                                        {t('last_7_days')}
                                    </MenuItem>
                                    <MenuItem value="last_30_days" sx={{ fontSize: "0.8rem" }}>
                                        {t('last_30_days')}
                                    </MenuItem>
                                    <MenuItem value="all_time" sx={{ fontSize: "0.8rem" }}>
                                        {t('all_time')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedFilters;
