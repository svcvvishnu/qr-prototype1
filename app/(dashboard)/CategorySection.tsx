'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CategorySection({ category }: { category: any }) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div>
            {/* Category Header - Clickable */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    padding: '12px 16px',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
            >
                <h2 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: 0
                }}>
                    <span style={{ fontSize: '20px' }}>📁</span>
                    {category.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                        padding: '4px 10px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-muted)'
                    }}>
                        {category.items.length}
                    </span>
                    <span style={{
                        fontSize: '16px',
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                        ▼
                    </span>
                </div>
            </button>

            {/* Items Horizontal Scroll - Collapsible */}
            <div style={{
                display: 'grid',
                gridTemplateRows: isExpanded ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s ease-out',
                overflow: 'hidden'
            }}>
                <div style={{ minHeight: 0 }}>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        overflowX: 'auto',
                        paddingBottom: '8px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'var(--border-color) transparent'
                    }}>
                        {category.items.map((item: any) => (
                            <Link
                                href={`/item/${item.id}`}
                                key={item.id}
                                style={{
                                    background: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '16px',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'all 0.2s',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    minWidth: '240px',
                                    maxWidth: '240px',
                                    flexShrink: 0
                                }}
                            >
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '22px'
                                    }}>
                                        {item.type === 'LOST' ? '🔍' : item.type === 'ID' ? '🪪' : '✨'}
                                    </div>
                                    {item.status === 'PUBLISHED' && (
                                        <span style={{
                                            padding: '4px 8px',
                                            background: '#d1fae5',
                                            color: '#065f46',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '11px',
                                            fontWeight: 600
                                        }}>
                                            ● Active
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 style={{
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        marginBottom: '4px',
                                        color: 'var(--text-main)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'var(--text-muted)',
                                        lineHeight: 1.4,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        minHeight: '36px'
                                    }}>
                                        {item.description || "No description provided."}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div style={{
                                    paddingTop: '12px',
                                    borderTop: '1px solid var(--border-color)',
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    fontWeight: 500,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span>{new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>→</span>
                                </div>
                            </Link>
                        ))}

                        {/* Add New Card */}
                        <Link
                            href={`/create?cat=${category.id}`}
                            style={{
                                background: 'transparent',
                                borderRadius: 'var(--radius-lg)',
                                padding: '16px',
                                border: '2px dashed var(--border-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                minWidth: '240px',
                                maxWidth: '240px',
                                minHeight: '180px',
                                flexShrink: 0,
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                color: 'var(--text-muted)'
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'var(--bg-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                ➕
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>
                                Add Item
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
