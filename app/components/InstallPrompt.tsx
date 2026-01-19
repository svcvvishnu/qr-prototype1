'use client';

import { useEffect, useState } from 'react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after 30 seconds or on second visit
            const installPromptShown = localStorage.getItem('installPromptShown');
            if (!installPromptShown) {
                setTimeout(() => setShowPrompt(true), 30000);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowPrompt(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            localStorage.setItem('installPromptShown', 'true');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptShown', 'true');
    };

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="slide-up" style={{
            position: 'fixed',
            bottom: 'calc(var(--nav-height) + 16px)',
            left: '16px',
            right: '16px',
            zIndex: 1000
        }}>
            <div className="glass-strong elevation-4" style={{
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0, 0, 0, 0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    ✕
                </button>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        flexShrink: 0,
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        📱
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            marginBottom: '6px',
                            color: 'var(--text-main)'
                        }}>
                            Install QR App
                        </h3>
                        <p style={{
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            lineHeight: 1.5,
                            marginBottom: '12px'
                        }}>
                            Add to your home screen for quick access and offline support
                        </p>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleInstall}
                                className="hover-lift transition-smooth"
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    background: 'var(--gradient-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                Install
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="transition-smooth"
                                style={{
                                    padding: '12px 20px',
                                    background: 'var(--bg-subtle)',
                                    color: 'var(--text-main)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
