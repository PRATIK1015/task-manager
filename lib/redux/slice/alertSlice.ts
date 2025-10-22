import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material';

interface AlertState {
    open: boolean;
    message: string;
    severity: AlertColor;
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
    autoHideDuration: number;
    showCloseButton: boolean;
    variant: 'filled' | 'outlined' | 'standard';
    elevation: number;
    maxWidth: string | number;
}

const initialState: AlertState = {
    open: false,
    message: '',
    severity: 'info',
    vertical: 'top',
    horizontal: 'center',
    autoHideDuration: 6000,
    showCloseButton: true,
    variant: 'outlined',
    elevation: 6,
    maxWidth: '400px'
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        showAlert: (
            state,
            action: PayloadAction<{
                message: string;
                severity?: AlertColor;
                vertical?: 'top' | 'bottom';
                horizontal?: 'left' | 'center' | 'right';
                autoHideDuration?: number;
                showCloseButton?: boolean;
                variant?: 'filled' | 'outlined' | 'standard';
                elevation?: number;
                maxWidth?: string | number;
            }>
        ) => {
            state.open = true;
            state.message = action.payload.message;
            state.severity = action.payload.severity || 'info';
            state.vertical = action.payload.vertical || 'top';
            state.horizontal = action.payload.horizontal || 'center';
            state.autoHideDuration = action.payload.autoHideDuration || 6000;
            state.showCloseButton = action.payload.showCloseButton ?? true;
            state.variant = action.payload.variant || 'outlined';
            state.elevation = action.payload.elevation || 6;
            state.maxWidth = action.payload.maxWidth || '400px';
        },
        hideAlert: (state) => {
            state.open = false;
        }
    }
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store'; 

export const useAlert = () => {
    const dispatch = useDispatch();
    const alertState = useSelector((state: RootState) => state.alert);

    const showAlertMessage = (
        message: string,
        severity?: AlertColor,
        options?: {
            vertical?: 'top' | 'bottom';
            horizontal?: 'left' | 'center' | 'right';
            autoHideDuration?: number;
            showCloseButton?: boolean;
            variant?: 'filled' | 'outlined' | 'standard';
            elevation?: number;
            maxWidth?: string | number;
        }
    ) => {
        dispatch(showAlert({ message, severity, ...options }));
    };

    const hideAlertMessage = () => {
        dispatch(hideAlert());
    };

    return {
        ...alertState,
        showAlertMessage,
        hideAlertMessage
    };
};
