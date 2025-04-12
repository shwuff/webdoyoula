import React, { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {useTranslation} from "react-i18next";
import SearchIcon from "../../assets/svg/SearchIcon";
import { useNavigate } from "react-router-dom";
import { Switch, FormControlLabel } from '@mui/material';

const FeedFilters = ({ filter, setFilter, dateRange, setDateRange, feed, setFeed, style, setPhotosPage, isMarket, setIsMarket }) => {

    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        if (event.target.value === "date") {
            setDateRange("all_time");
        }
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
                label={t('market_mode')}
                sx={{ ml: 1, mb: 1, fontSize: '0.8rem', marginBottom: "15px" }}
            />
            <div className="w-100 d-flex align-items-center">
                <FormControl
                    sx={{ marginBottom: "15px", fontSize: "0.8rem" }}
                    fullWidth
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
                        <MenuItem value="feed" sx={{ fontSize: "0.8rem" }}>
                            {t('feed')}
                        </MenuItem>
                        <MenuItem value="subs" sx={{ fontSize: "0.8rem" }}>
                            {t('subscribes')}
                        </MenuItem>
                    </Select>
                </FormControl>
                <div style={{marginBottom: "15px"}} onClick={() => navigate('/search')} className="search-icon-feed c-pointer">
                    <SearchIcon />
                </div>
            </div>
            {
                feed === 'feed' && (
                    <div className="filters-container d-flex" style={style}>
                        <div className="w-100" style={{ paddingRight: "5px" }}>
                            <FormControl fullWidth size="small" sx={{ marginBottom: "10px" }}>
                                <InputLabel id="filter-select-label" sx={{ fontSize: "0.8rem" }}>
                                    {t('sort_by')}
                                </InputLabel>
                                <Select
                                    labelId="filter-select-label"
                                    value={filter}
                                    onChange={handleFilterChange}
                                    label={t('sort_by')}
                                    sx={{ fontSize: "0.8rem" }}
                                >
                                    <MenuItem value="repeats" sx={{ fontSize: "0.8rem" }}>
                                        {t('sort_by_repeats')}
                                    </MenuItem>
                                    {/*<MenuItem value="likes">Лайки</MenuItem>*/}
                                    <MenuItem value="date" sx={{ fontSize: "0.8rem", display: 'flex', alignItems: 'center' }}>
                                        {t('publish_date')}
                                        <ArrowDownwardIcon sx={{ ml: 1, fontSize: 12 }} />
                                    </MenuItem>
                                    <MenuItem value="-date" sx={{ fontSize: "0.8rem", display: 'flex', alignItems: 'center' }}>
                                        {t('publish_date')}
                                        <ArrowUpwardIcon sx={{ ml: 1, fontSize: 12 }} />
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
                )
            }
        </>
    );
};

export default FeedFilters;