'use client';

import { useEffect, ReactNode } from 'react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fade-in"
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 999
                }}
            />

            {/* Bottom Sheet */}
            <div
                className="slide-up"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderTopLeftRadius: 'var(--radius-lg)',
                    borderTopRightRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1000,
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Handle */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '12px 0'
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '4px',
                            background: 'var(--bg-accents)',
                            borderRadius: 'var(--radius-full)'
                        }}
                    />
                </div>

                {/* Title */}
                {title && (
                    <div
                        style={{
                            padding: '0 20px 16px 20px',
                            borderBottom: '1px solid var(--border-color)'
                        }}
                    >
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: 'var(--text-main)'
                        }}>
                            {title}
                        </h3>
                    </div>
                )}

                {/* Content */}
                <div
                    style={{
                        padding: '20px',
                        overflowY: 'auto',
                        flex: 1
                    }}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
