import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";

const AllPage = () => {
    return (
        <div className={`globalBlock`} style={{ paddingTop: "var(--safeAreaInset-top)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress
                size={48}
                thickness={4}
                sx={{
                    '& .MuiCircularProgress-circle': {
                        stroke: 'var(--glass-bg)',
                    },
                }}
            />
        </div>
    );
};

export default AllPage;