import React, { useState, useRef } from "react";
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import FeedFilters from "../../components/input/FeedFilters";
import Create from "./Create";

const FeedPage = () => {
    const [filter, setFilter] = useState("repeats");
    const [searchingAiModel, setSearchingAiModel] = useState(0);
    const [dateRange, setDateRange] = useState("last_1_day");
    const [feed, setFeed] = useState('feed');
    const [photosPage, setPhotosPage] = useState(0);
    const [isMarket, setIsMarket] = useState(false);
    const [showPaidPrompts, setShowPaidPrompts] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const isFetchingRef = useRef(false);
    const lastPageRef = useRef(0);
    const scrollTimeoutRef = useRef(null);

    const handleScroll = (e) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            const { scrollHeight, scrollTop, clientHeight } = e.target;

            const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

            if (distanceToBottom <= 2500 && !isFetchingRef.current) {
                const nextPage = lastPageRef.current + 1;
                isFetchingRef.current = true;
                lastPageRef.current = nextPage;
                setPhotosPage(nextPage);
            }
        }, 0);
    };

    const resetLastPageRef = () => {
        lastPageRef.current = 0;
    };

    const resetFetchingRef = () => {
        isFetchingRef.current = false;
    };

    return (
        <div className={"globalBlock"} onScroll={handleScroll}>
            <div className={"center-content-block"}>
                <Create />
                <FeedFilters
                    filter={filter}
                    setFilter={setFilter}
                    searchingAiModel={searchingAiModel}
                    setSearchingAiModel={setSearchingAiModel}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    feed={feed}
                    setFeed={setFeed}
                    style={{ marginBottom: "10px" }}
                    setPhotosPage={setPhotosPage}
                    isMarket={showPaidPrompts}
                    setIsMarket={setShowPaidPrompts}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <MyGeneratedPhotosList
                    profileGallery={true}
                    resetLastPageRef={resetLastPageRef}
                    resetFetchingRef={resetFetchingRef}
                    photosPage={photosPage}
                    setPhotosPage={setPhotosPage}
                    from={"feedPage"}
                    filter={filter}
                    searchingAiModel={searchingAiModel}
                    dateRange={dateRange}
                    feed={feed}
                    isMarket={isMarket}
                    showPaidPrompts={showPaidPrompts}
                    searchQuery={searchQuery}
                />

                {/*<div style={{ position: "absolute", bottom: "100px", right: "20px", padding: "10px", borderRadius: "50%", cursor: "pointer" }} onClick={() => window.location.href = 'https://t.me/doyoulachat'}>*/}
                {/*    <img src={ChatPng} width={100} />*/}
                {/*</div>*/}
            </div>

        </div>
    );
};

export default FeedPage;
