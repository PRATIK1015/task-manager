'use client';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import SecurityConfiguration from '../config/security-configuration';
import PageHeader from './header';

const notIncludePaths = ['/login', '/signup'];

export default function PageLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const pathName = usePathname();

    return (
        <>
            {!notIncludePaths.includes(pathName) ? (
                <SecurityConfiguration>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '100vh',
                                backgroundColor: '#f8f9fa'
                            }}
                        >
                            <CssBaseline />
                            <PageHeader open={open} onDrawerOpen={handleDrawerOpen} />
                            <Box
                                component="main"
                                sx={{
                                    flexGrow: 1,
                                    marginTop: '64px',
                                    backgroundColor: '#f8f9fa'
                                }}
                            >
                                {children}
                            </Box>
                        </Box>
                </SecurityConfiguration>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            backgroundColor: '#f8f9fa'
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            )}
        </>
    );
}
