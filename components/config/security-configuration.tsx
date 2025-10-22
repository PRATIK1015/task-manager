'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { isExpired } from '../../client-lib/jwt-service';

const publicPaths = ['/login', '/signup'];

interface SecurityConfigurationProps {
    children: ReactNode;
}

export default function SecurityConfiguration({ children }: SecurityConfigurationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const isPublic = publicPaths.includes(pathname);

            if (token && !isExpired(token) && isPublic) {
                router.replace('/');
                return;
            }

            if ((!token || isExpired(token)) && !isPublic) {
                localStorage.removeItem('token');
                router.replace('/login');
                return;
            }

            setAuthChecked(true);
        };

        const timeout = setTimeout(checkAuth, 100);

        return () => clearTimeout(timeout);
    }, [pathname, router]);

    if (!authChecked) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    return <>{children}</>;
}
