import React from 'react';
import { Alert, Stack } from '@mui/material';
import {useTranslation} from "react-i18next";

function ErrorList({ error }) {

    const {t} = useTranslation();

    if (!Array.isArray(error) || error.length === 0) return null;

    return (
        <Stack spacing={2}>
            {error.map((err, index) => (
                <Alert key={index} severity="error">
                    {t(err)}
                </Alert>
            ))}
        </Stack>
    );
}

export default ErrorList;