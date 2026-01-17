'use client';

import { useState } from 'react';

export default function ScanHistory({ scans }: { scans: any[] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (scans.length === 0) {
        return (
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>📭</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No scans recorded yet</p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
        }}>
            {/* Header - Clickable */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>📊</span>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        margin: 0
                    }}>
                        Scan History
                    </h3>
                    <span style={{
                        padding: '4px 10px',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 600
                    }}>
                        {scans.length}
                    </span>
                </div>
                <span style={{
                    fontSize: '16px',
                    transition: 'transform 0.2s',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: 'var(--text-muted)'
                }}>
                    ▼
                </span>
            </button>

            {/* Collapsible Content */}
            <div style={{
                display: 'grid',
                gridTemplateRows: isExpanded ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s ease-out'
            }}>
                <div style={{ minHeight: 0, overflow: 'hidden' }}>
                    <div style={{
                        padding: '0 24px 20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {scans.map((scan) => (
                            <div
                                key={scan.id}
                                style={{
                                    padding: '12px 16px',
                                    background: 'var(--bg-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '13px'
                                }}
                            >
                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                    {/* @ts-ignore */}
                                    {scan.scanner ? scan.scanner.name : (scan.scannerId ? `User #${scan.scannerId}` : 'Anonymous')}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                    {new Date(scan.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
