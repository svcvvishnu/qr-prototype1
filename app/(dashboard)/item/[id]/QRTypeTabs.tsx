'use client';

import { useState } from 'react';

interface QRTypeTabsProps {
    itemType: string;
    payload: string;
}

export default function QRTypeTabs({ itemType, payload }: QRTypeTabsProps) {
    const [activeType, setActiveType] = useState(itemType);

    // Parse payload based on type
    const parsePayload = (type: string, payloadStr: string) => {
        try {
            return JSON.parse(payloadStr);
        } catch {
            return {};
        }
    };

    const data = parsePayload(itemType, payload);

    const types = [
        { id: 'ID', label: '🪪 Identity', icon: '🪪' },
        { id: 'LOST', label: '🔍 Lost Item', icon: '🔍' },
        { id: 'CUSTOM', label: '✨ Custom', icon: '✨' }
    ];

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
            marginBottom: '16px'
        }}>
            {/* Type Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '2px solid var(--border-color)',
                background: 'var(--bg-subtle)'
            }}>
                {types.map(type => (
                    <button
                        key={type.id}
                        onClick={() => setActiveType(type.id)}
                        disabled={itemType !== type.id}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            background: activeType === type.id ? 'white' : 'transparent',
                            border: 'none',
                            borderBottom: activeType === type.id ? '3px solid var(--primary)' : '3px solid transparent',
                            marginBottom: '-2px',
                            cursor: itemType === type.id ? 'pointer' : 'not-allowed',
                            fontWeight: 600,
                            fontSize: '13px',
                            color: activeType === type.id ? 'var(--primary)' : 'var(--text-light)',
                            opacity: itemType === type.id ? 1 : 0.5,
                            transition: 'all 0.2s'
                        }}
                    >
                        {type.icon} {type.label}
                    </button>
                ))}
            </div>

            {/* Type Details */}
            <div style={{ padding: '16px' }}>
                {activeType === 'ID' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            padding: '12px',
                            background: 'var(--bg-subtle)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px'
                        }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-light)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                                Full Name
                            </div>
                            <div style={{ color: 'var(--text-main)' }}>
                                {data.fullName || 'Not provided'}
                            </div>
                        </div>
                        <div style={{
                            padding: '12px',
                            background: 'var(--bg-subtle)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px'
                        }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-light)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                                Contact
                            </div>
                            <div style={{ color: 'var(--text-main)' }}>
                                {data.contact || 'Not provided'}
                            </div>
                        </div>
                        {data.address && (
                            <div style={{
                                padding: '12px',
                                background: 'var(--bg-subtle)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '13px'
                            }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-light)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                                    Address
                                </div>
                                <div style={{ color: 'var(--text-main)' }}>
                                    {data.address}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeType === 'LOST' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            padding: '12px',
                            background: 'var(--bg-subtle)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px'
                        }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-light)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                                Reward
                            </div>
                            <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '16px' }}>
                                {data.reward || 'No reward offered'}
                            </div>
                        </div>
                        {data.lastSeenLocation && (
                            <div style={{
                                padding: '12px',
                                background: 'var(--bg-subtle)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '13px'
                            }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-light)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                                    Last Seen
                                </div>
                                <div style={{ color: 'var(--text-main)' }}>
                                    📍 {data.lastSeenLocation}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeType === 'CUSTOM' && (
                    <div style={{
                        padding: '16px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        textAlign: 'center'
                    }}>
                        Custom QR code with flexible data structure
                    </div>
                )}
            </div>
        </div>
    );
}
