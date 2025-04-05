import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [myModels, setMyModels] = useState(null);
    const [myPhotos, setMyPhotos] = useState(null);

    const updateUserData = (newData) => {
        setUserData((prev) => (
            {
                ...prev,
                newData
            }
        ))
    }

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, setUserData, userData, myModels, setMyModels, setMyPhotos, myPhotos, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
