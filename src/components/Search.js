import React, {useState, useEffect, useRef} from 'react';
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import SearchInput from "./input/SearchInput";
import SettingsHamburger from "./modals/SettingsHamburger";
import {useTranslation} from "react-i18next";
import SearchPage from "../pages/search/SearchPage";
import {FaRegWindowClose, FaWindowClose} from "react-icons/fa";
import {FaFolderClosed} from "react-icons/fa6";
import {CloseSharp} from "@mui/icons-material";
import CloseButton from "./buttons/CloseButton";

const users = ["Komissar1", "Komi", "Alex", "JohnDoe", "Komrad", "Kevin", "Markus"];

const Search = ({ from = 'page', setHideMenu = () => {} }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const { addHandler, deleteHandler, sendData, isConnected } = useWebSocket();
    const { token } = useAuth();
    const navigate = useNavigate();

    const isFetchingRef = useRef(false);
    const lastPageRef = useRef(0);
    const scrollTimeoutRef = useRef(null);
    const [photosPage, setPhotosPage] = useState(0);

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

    const handleOnChangeSearch = (textSearch) => {
        sendData({ action: "get/search/users", data: { jwt: token, param: textSearch } });
    };

    useEffect(() => {
        const handler = async (msg) => {
            setSearchResults(msg.users);
        };

        addHandler('users_search_results', handler);

        return () => {
            deleteHandler('users_search_results');
        };
    }, []);

    const deleteUserFromHistory = (userId) => {
        sendData({
            action: "search/delete/user/" + userId,
            data: {
                jwt: token
            }
        });

        setSearchResults(searchResults.filter(user => user.id !== userId));
    }

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
            <div className={"center-content-block"}>
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
                    searchQuery.length < 0 ? (
                        <>
                            {/*{searchQuery.length < 1 && searchResults.length > 0 && shouldShowResults && (*/}
                            {/*    <div className="w-100 d-flex justify-content-end">*/}
                            {/*        <p*/}
                            {/*            onClick={() => {*/}
                            {/*                sendData({*/}
                            {/*                    action: "clear_user_search_history",*/}
                            {/*                    data: { jwt: token }*/}
                            {/*                });*/}
                            {/*                setSearchResults([]);*/}
                            {/*            }}*/}
                            {/*            className={"text-muted"}*/}
                            {/*            style={{ cursor: "pointer" }}*/}
                            {/*        >*/}
                            {/*            {t('clear_search_history')}*/}
                            {/*        </p>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                            {searchResults.length > 0 && shouldShowResults && (
                                <ul className="search-results">
                                    {searchResults.map((user, index) => (
                                        <li key={index} className={"d-flex justify-content-between align-items-center"}>
                                            <div
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                    sendData({
                                                        action: "search/add/user/" + user.id,
                                                        data: { jwt: token }
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
                                            <div onClick={() => deleteUserFromHistory(user.id)}>
                                                <CloseButton />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <SearchPage userResults={searchResults} setUserResults={setSearchResults} isFetchingRef={isFetchingRef} searchQuery={searchQuery} lastPageRef={lastPageRef} photosPage={photosPage} setPhotosPage={setPhotosPage}  />
                    )
                }
            </div>
        </div>
    );
};

export default Search;
