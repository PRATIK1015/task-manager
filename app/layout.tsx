import type { Metadata, Viewport } from 'next';
import './globals.css';
import PageLayout from '@/components/layout/page-layout';
import ThemeRegistry from '@/theme/ThemeRegistry';
import SpinnerWrapper from '@/components/spinner/spinner-state';
import SpinnerComponent from '@/components/global/spinner';
import GlobalAlert from '@/components/global/alert';
import StoreProvider from './StoreProvider';


export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
};

export const metadata: Metadata = {
    title: 'Task-Manager',
    description: 'Task-Manager',
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.svg'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <ThemeRegistry>
                <SpinnerWrapper>
                    <body suppressHydrationWarning={true}>
                        <StoreProvider>
                            <PageLayout>{children}</PageLayout>
                            <SpinnerComponent />
                            <GlobalAlert />
                        </StoreProvider>
                    </body>
                </SpinnerWrapper>
            </ThemeRegistry>
        </html>
    );
}
