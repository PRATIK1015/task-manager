'use client';

import React from 'react';
import { Alert, Snackbar, AlertColor, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAlert } from '@/lib/redux/slice/alertSlice';

const GlobalAlert: React.FC = () => {
    const { open, message, severity, vertical, horizontal, autoHideDuration, showCloseButton, hideAlertMessage } =
        useAlert();

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={hideAlertMessage}
            anchorOrigin={{ vertical, horizontal }}
        >
            <Alert
                onClose={showCloseButton ? hideAlertMessage : undefined}
                severity={severity}
                sx={{
                    '.MuiAlert-message': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    },
                    width: '100%'
                }}
                // variant={variant}
                // elevation={elevation}
                action={
                    showCloseButton ? (
                        <IconButton size="small" aria-label="close" color="inherit" onClick={hideAlertMessage}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    ) : null
                }
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalAlert;
