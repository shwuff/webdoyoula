import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";

const LoadingPage = () => {
    return (
        <div>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "80vh"
            }}>
                <CircularProgress />
            </div>
        </div>
    );
};

export default LoadingPage;