import React, { useState } from 'react';
import { useWebSocket } from "../../context/WebSocketContext";
import { useAuth } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from '@mui/material';
import MyGeneratedPhotosList from "../../components/gallery/MyGeneratedPhotosList";

const ShowUsersResult = ({ searchResults, sendData, token }) => {
    const navigate = useNavigate();

    return (
        <>
            {searchResults.length > 0 && (
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
            />
        </div>
    );
};

const SearchPage = ({ userResults, isFetchingRef, lastPageRef, photosPage, setPhotosPage, searchQuery }) => {
    const { sendData } = useWebSocket();
    const { token } = useAuth();
    const [value, setValue] = useState(0);

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
            <Box sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs for users and images">
                    <Tab label="Все" />
                    <Tab label="Пользователи" />
                    <Tab label="Фотографии" />
                </Tabs>
            </Box>

            {value === 1 && <ShowUsersResult searchResults={userResults} sendData={sendData} token={token} />}

            {value === 2 && <ShowImagesResult photosPage={photosPage} setPhotosPage={setPhotosPage} searchQuery={searchQuery} resetLastPageRef={resetLastPageRef} resetFetchingRef={resetFetchingRef} />}
        </div>
    );
};

export default SearchPage;
