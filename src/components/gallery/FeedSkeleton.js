import React from 'react';
import { Grid, Skeleton } from '@mui/material';
import { styled, keyframes } from '@mui/system';

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Placeholder = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '100%',
    paddingTop: '125%',
    overflow: 'hidden',
    borderRadius: 12,
    background:
        `linear-gradient(90deg,
      ${theme.palette.action.hover} 0%,
      ${theme.palette.action.selected} 50%,
      ${theme.palette.action.hover} 100%)`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 1.5s linear infinite`,
}));

export default function FeedSkeleton({ items = 9 }) {
    return (
        <Grid container spacing={2}>
            {Array.from({ length: items }).map((_, i) => (
                <Grid item xs={4} key={i}>
                    <Placeholder />
                </Grid>
            ))}
        </Grid>
    );
}
