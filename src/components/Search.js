import React, {useState, useEffect, useRef} from 'react';
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import SearchInput from "./input/SearchInput";
import SettingsHamburger from "./modals/SettingsHamburger";
import {useTranslation} from "react-i18next";
import SearchPage from "../pages/search/SearchPage";

const users = ["Komissar1", "Komi", "Alex", "JohnDoe", "Komrad", "Kevin", "Markus"];

const Search = ({ from = 'page', setHideMenu = () => {} }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const { addHandler, deleteHandler, sendData, isConnected } = useWebSocket();
    const { token } = useAuth();
    const navigate = useNavigate();

    const {t} = useTranslation();

    const isFetchingRef = useRef(false);
    const lastPageRef = useRef(1);
    const scrollTimeoutRef = useRef(null);
    const [photosPage, setPhotosPage] = useState(1);

    const handleScroll = (e) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {

            const bottom = e.target.scrollHeight < e.target.scrollTop + e.target.clientHeight + 600;

            if (bottom && !isFetchingRef.current) {
                const nextPage = lastPageRef.current + 1;
                // console.log(`📸 Следующая страница: ${nextPage}`);

                isFetchingRef.current = true;
                lastPageRef.current = nextPage;
                setPhotosPage(nextPage);
            }
        }, 100);
    };

    const handleOnChangeSearch = (textSearch) => {
        sendData({ action: "search_users", data: { jwt: token, params: textSearch } });
    };

    useEffect(() => {
        const handler = async (msg) => {
            setSearchResults(msg.users);
        };

        addHandler('receive_search_results', handler);

        return () => {
            deleteHandler('receive_search_results');
        };
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() !== "") {
            const results = users.filter(user =>
                user.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(results);
        } else {
            setFilteredUsers([]);
        }
    };

    useEffect(() => {
        if (searchQuery.length < 1 && isConnected && token) {
            handleOnChangeSearch(searchQuery);
        }
    }, [searchQuery, isConnected, token]);

    const shouldShowResults = from !== 'navbar' || (from === 'navbar' && isInputFocused);

    useEffect(() => {
        if(from === 'navbar' && isInputFocused) {
            setHideMenu(true);
        } else if(from === 'navbar' && !isInputFocused) {
            setHideMenu(false);
            setSearchQuery("");
        }
    }, [isInputFocused, from]);

    return (
        <div className={from != 'navbar' ? "globalBlock" : ""} onScroll={handleScroll}>
            <div className={"center-content-block-search"}>
                <div className={'d-flex align-items-center w-100'} style={{marginTop: 5}}>
                    {/*{*/}
                    {/*    from === 'navbar' && (*/}
                    {/*        <SettingsHamburger style={{marginRight: 5}} />*/}
                    {/*    )*/}
                    {/*}*/}
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => {
                            handleOnChangeSearch(e.target.value);
                            setSearchQuery(e.target.value);
                        }}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                    />
                </div>
                {
                    searchQuery.length < 1 ? (
                        <>
                            {searchQuery.length < 1 && searchResults.length > 0 && shouldShowResults && (
                                <div className="w-100 d-flex justify-content-end">
                                    <p
                                        onClick={() => {
                                            sendData({
                                                action: "clear_user_search_history",
                                                data: { jwt: token }
                                            });
                                            setSearchResults([]);
                                        }}
                                        className={"text-muted"}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {t('clear_search_history')}
                                    </p>
                                </div>
                            )}
                            {searchResults.length > 0 && shouldShowResults && (
                                <ul className="search-results">
                                    {searchResults.map((user, index) => (
                                        <li key={index}>
                                            <div
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                    sendData({
                                                        action: "add_user_search_history",
                                                        data: { jwt: token, searchingUserId: user.id }
                                                    });
                                                    navigate(`/profile/${user.id}`);
                                                }}
                                                className={"search-item"}
                                            >
                                                <img src={user.photo_url} alt="" />
                                                <div className="search-elements">
                                        <span>
                                          {user.first_name} {user.last_name}
                                        </span>
                                                    <br />
                                                    {user.username?.length > 0 ? <span style={{ color: "gray" }}>@{user.username}</span> : "" }
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <SearchPage userResults={searchResults} isFetchingRef={isFetchingRef} searchQuery={searchQuery} lastPageRef={lastPageRef} photosPage={photosPage} setPhotosPage={setPhotosPage}  />
                    )
                }
            </div>
        </div>
    );
};

export default Search;
