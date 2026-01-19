import './globals.css';
import { Outfit } from 'next/font/google';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
    title: 'QR Master',
    description: 'Manage your QR codes efficiently',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* PWA Manifest */}
                <link rel="manifest" href="/manifest.json" />

                {/* Theme Colors */}
                <meta name="theme-color" content="#667eea" />
                <meta name="msapplication-TileColor" content="#667eea" />

                {/* Apple Touch Icon */}
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* iOS Meta Tags */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="QR Master" />

                {/* Viewport for Mobile */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

                {/* Favicon */}
                <link rel="icon" href="/icon-192.png" />
            </head>
            <body className={outfit.className}>
                {children}
                <InstallPrompt />
                <OfflineIndicator />
            </body>
        </html>
    );
}
