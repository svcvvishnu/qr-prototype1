import './globals.css';
import { Outfit } from 'next/font/google';

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
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#6366f1" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            </head>
            <body className={outfit.className}>
                {children}
            </body>
        </html>
    );
}
