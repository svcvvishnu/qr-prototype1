'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    const isActive = (path: string) => pathname === path;

    // Fetch unread message count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch('/api/notifications?unreadOnly=true');
                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.unreadCount || 0);
                }
            } catch (error) {
                console.error('Failed to fetch unread count:', error);
            }
        };

        fetchUnreadCount();
        // Poll every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="glass-strong" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'var(--nav-height)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
            {/* Home */}
            <Link href="/" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive('/') || isActive('/dashboard') ? 'var(--primary)' : 'var(--text-light)',
                transition: 'color 0.2s',
                padding: '10px'
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive('/') || isActive('/dashboard') ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span style={{ fontSize: '10px', fontWeight: 600 }}>Home</span>
            </Link>

            {/* Messages */}
            <Link href="/messages" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive('/messages') ? 'var(--primary)' : 'var(--text-light)',
                transition: 'color 0.2s',
                padding: '10px',
                position: 'relative'
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive('/messages') ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                <span style={{ fontSize: '10px', fontWeight: 600 }}>Messages</span>
            </Link>

            {/* Scan QR - Center FAB */}
            <div style={{ position: 'relative', top: '-24px' }}>
                <Link href="/scan" style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow)',
                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    textDecoration: 'none'
                }}
                    className="hover-scale"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                </Link>
            </div>

            {/* Create */}
            <Link href="/create" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive('/create') ? 'var(--primary)' : 'var(--text-light)',
                transition: 'color 0.2s',
                padding: '10px'
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive('/create') ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span style={{ fontSize: '10px', fontWeight: 600 }}>Create</span>
            </Link>

            {/* Profile */}
            <Link href="/profile" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive('/profile') ? 'var(--primary)' : 'var(--text-light)',
                transition: 'color 0.2s',
                padding: '10px'
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive('/profile') ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span style={{ fontSize: '10px', fontWeight: 600 }}>Profile</span>
            </Link>
        </nav>
    );
}
