'use client';

import { useState } from 'react';
import ScanHistory from './ScanHistory';
import MessagesList from './MessagesList';

interface ItemTabsProps {
    scans: any[];
    messages: any[];
    itemId: number;
    currentUserId: number;
}

export default function ItemTabs({ scans, messages, itemId, currentUserId }: ItemTabsProps) {
    const [activeTab, setActiveTab] = useState<'scans' | 'messages'>('scans');

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
        }}>
            {/* Tab Headers */}
            <div style={{
                display: 'flex',
                borderBottom: '2px solid var(--border-color)',
                background: 'var(--bg-subtle)'
            }}>
                <button
                    onClick={() => setActiveTab('scans')}
                    style={{
                        flex: 1,
                        padding: '14px 20px',
                        background: activeTab === 'scans' ? 'white' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'scans' ? '3px solid var(--primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: activeTab === 'scans' ? 'var(--primary)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <span>📊</span> Scan History ({scans.length})
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    style={{
                        flex: 1,
                        padding: '14px 20px',
                        background: activeTab === 'messages' ? 'white' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'messages' ? '3px solid var(--primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: activeTab === 'messages' ? 'var(--primary)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <span>💬</span> Messages ({messages.length})
                </button>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '20px' }}>
                {activeTab === 'scans' && (
                    <ScanHistory scans={scans} />
                )}
                {activeTab === 'messages' && (
                    messages.length > 0 ? (
                        <MessagesList
                            messages={messages}
                            itemId={itemId}
                            currentUserId={currentUserId}
                        />
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: 'var(--text-muted)',
                            fontSize: '14px'
                        }}>
                            No messages yet
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
