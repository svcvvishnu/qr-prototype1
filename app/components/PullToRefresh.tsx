'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [startY, setStartY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const PULL_THRESHOLD = 80;
    const MAX_PULL = 120;

    const handleTouchStart = (e: TouchEvent) => {
        if (window.scrollY === 0) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (isRefreshing || startY === 0) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0 && window.scrollY === 0) {
            const pull = Math.min(distance * 0.5, MAX_PULL);
            setPullDistance(pull);

            if (pull > 10) {
                e.preventDefault();
            }
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance > PULL_THRESHOLD && !isRefreshing) {
            setIsRefreshing(true);

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            try {
                await onRefresh();
            } finally {
                setTimeout(() => {
                    setIsRefreshing(false);
                    setPullDistance(0);
                }, 500);
            }
        } else {
            setPullDistance(0);
        }
        setStartY(0);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [startY, pullDistance, isRefreshing]);

    const getRefreshText = () => {
        if (isRefreshing) return 'Refreshing...';
        if (pullDistance > PULL_THRESHOLD) return 'Release to refresh';
        if (pullDistance > 0) return 'Pull to refresh';
        return '';
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Pull Indicator */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: pullDistance,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '10px',
                    transition: isRefreshing ? 'height 0.3s ease' : 'none',
                    overflow: 'hidden',
                    zIndex: 10
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: Math.min(pullDistance / PULL_THRESHOLD, 1)
                }}>
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '3px solid var(--primary)',
                            borderTopColor: 'transparent',
                            animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                            transform: `rotate(${pullDistance * 3}deg)`,
                            transition: 'transform 0.1s ease'
                        }}
                    />
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--primary)'
                    }}>
                        {getRefreshText()}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease' : 'none'
                }}
            >
                {children}
            </div>
        </div>
    );
}
