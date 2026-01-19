'use client';

import { useEffect, useState } from 'react';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [showOffline, setShowOffline] = useState(false);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            setShowOffline(false);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Show reconnected message briefly
    useEffect(() => {
        if (isOnline && showOffline) {
            const timer = setTimeout(() => setShowOffline(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, showOffline]);

    if (!showOffline && isOnline) return null;

    return (
        <div className="slide-down" style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1001
        }}>
            <div
                className="glass-strong elevation-3"
                style={{
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: isOnline
                        ? 'rgba(16, 185, 129, 0.9)'
                        : 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: 'var(--shadow-lg)',
                    whiteSpace: 'nowrap'
                }}
            >
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white',
                    animation: isOnline ? 'none' : 'pulse 2s infinite'
                }} />
                {isOnline ? '✓ Back online' : '⚠️ No internet connection'}
            </div>
        </div>
    );
}
