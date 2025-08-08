import { Skeleton, Box } from '@mui/material';

export default function LoadingPlaceholder({ width = 0, height = 0, aspectRatio = '1/1' }) {
    return (
        <Box sx={{ width: width, height: height, aspectRatio: aspectRatio }}>
            <Skeleton variant="rectangular" sx={{ borderRadius: "4px" }} width="100%" height="100%" />
        </Box>
    );
}
