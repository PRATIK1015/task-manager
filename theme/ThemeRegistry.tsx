'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {
    createTheme,
    Shadows,
    ThemeOptions,
    ThemeProvider,
} from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import { NextAppDirEmotionCacheProvider } from './EmotionCache';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
});

const themeOptions: ThemeOptions = {
    typography: {
        fontSize: 12,
        fontFamily: roboto.style.fontFamily,
    },
    palette: {
        background: {
            default: '#ffffff',
        },
        primary: {
            main: '#0094ff',
        },
        secondary: {
            main: '#d9d9d9',
        },
        text: {
            primary: '#272727',
            secondary: '#818181',
        },
    },
    shadows: Array(25).fill('none') as Shadows,
};

const theme = createTheme(themeOptions);

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
    );
}
