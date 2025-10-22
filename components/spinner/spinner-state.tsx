'use client';
import React, { createContext, useContext, useReducer } from 'react';
import SpinnerReducer from './spinner-reducer';
import { SHOW_SPINNER } from '../types';

const SpinnerContext = createContext<ContextProps>({} as ContextProps);

export default function SpinnerWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const initialStates: any = { show: false };

    const [state, dispatch] = useReducer(SpinnerReducer, initialStates);

    const setSpinner = (show: any) => {
        dispatch({
            type: SHOW_SPINNER,
            payload: { show },
        });
    };

    return (
        <SpinnerContext.Provider
            value={{
                spinner: state,
                setSpinner,
            }}
        >
            {children}
        </SpinnerContext.Provider>
    );
}

export function useSpinnerContext() {
    if (typeof window !== 'undefined') {
        (window as any).useSpinnerContext = useContext(SpinnerContext);
    }
    return useContext(SpinnerContext);
}

interface ContextProps {
    spinner: Spinner;
    setSpinner: (show: any) => void;
}

interface Spinner {
    show: boolean;
}
