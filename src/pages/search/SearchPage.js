import React, { useState } from 'react';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from '@mui/material';
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";
import {useTranslation} from "react-i18next";
import CloseButton from '../../components/buttons/CloseButton';

const ShowUsersResult = ({ searchResults, sendData, token, max = 1000, showUsersPage = () => {}, searchQuery, setUserResults }) => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    const deleteUserFromHistory = (userId) => {
        sendData({
            action: "search/delete/user/" + userId,
            data: {
                jwt: token
            }
        });

        setUserResults(searchResults.filter(user => user.id !== userId));
    }

    return (
        <>
            {Array.isArray(searchResults) && searchResults?.length > 0 && (
                <ul className="search-results">
                    {searchResults.slice(0, max).map((user, index) => (
                        <li key={index} className="d-flex justify-content-between align-items-center">
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
                            {
                                searchQuery.length < 1 && (
                                    <div onClick={() => deleteUserFromHistory(user.id)}>
                                        <CloseButton />
                                    </div>
                                )
                            }
                        </li>
                    ))}
                    {
                        max === 5 && Array.isArray(searchResults) && searchResults?.length > 0 && (
                            <div style={{marginBottom: "10px"}} className={"d-flex justify-content-end"}>
                                <span onClick={showUsersPage} className={"text-muted c-pointer"}>Посмотреть все результаты</span>
                            </div>
                        )
                    }
                </ul>
            )}
            {
                Array.isArray(searchResults) && searchResults.length < 1 && max !== 5 && (
                    <div className="d-flex justify-content-center w-100">
                        <p className={"text-muted"}>{t("results_not_found")}</p>
                    </div>
                )
            }
        </>
    );
};

const ShowImagesResult = ({ photosPage, setPhotosPage, resetFetchingRef, resetLastPageRef, searchQuery }) => {
    return (
        <div className="images-results">
            <MyGeneratedPhotosList
                profileGallery={true}
                resetLastPageRef={resetLastPageRef}
                resetFetchingRef={resetFetchingRef}
                photosPage={photosPage}
                setPhotosPage={setPhotosPage}
                from={"feedPage"}
                searchQuery={searchQuery}
                filter={"repeats"}
                dateRange={"last_7_days"}
            />
        </div>
    );
};

const SearchPage = ({ userResults, isFetchingRef, lastPageRef, photosPage, setPhotosPage, searchQuery, setUserResults }) => {
    const { sendData } = useWebSocket();
    const { token } = useAuth();
    const [value, setValue] = useState(0);

    const {t} = useTranslation();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const resetLastPageRef = () => {
        lastPageRef.current = 1;
    };

    const resetFetchingRef = () => {
        isFetchingRef.current = false;
    };

    return (
        <div>
            <Box sx={{ width: '100%', marginBottom: "7px" }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs for users and images">
                    <Tab label={t('all')} sx={{fontSize: 12}} />
                    <Tab label={t('users')} sx={{fontSize: 12}} />
                    <Tab label={t('images')} sx={{fontSize: 12}} />
                </Tabs>
            </Box>

            {value === 0 && (
                <>
                    <ShowUsersResult searchResults={userResults} setUserResults={setUserResults} sendData={sendData} token={token} max={5} showUsersPage={() => setValue(1)} searchQuery={searchQuery} />
                    <ShowImagesResult photosPage={photosPage} setPhotosPage={setPhotosPage} searchQuery={searchQuery} resetLastPageRef={resetLastPageRef} resetFetchingRef={resetFetchingRef} />
                </>
            )}

            {value === 1 && <ShowUsersResult setUserResults={setUserResults} searchResults={userResults} sendData={sendData} token={token} searchQuery={searchQuery} />}

            {value === 2 && <ShowImagesResult photosPage={photosPage} setPhotosPage={setPhotosPage} searchQuery={searchQuery} resetLastPageRef={resetLastPageRef} resetFetchingRef={resetFetchingRef} />}
        </div>
    );
};

export default SearchPage;
