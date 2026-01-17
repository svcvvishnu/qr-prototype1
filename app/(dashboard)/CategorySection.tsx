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
                    marginBottom: '16px',
                    padding: '16px 20px',
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
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: 0
                }}>
                    <span style={{ fontSize: '24px' }}>📁</span>
                    {category.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                        padding: '6px 14px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-muted)'
                    }}>
                        {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <span style={{
                        fontSize: '20px',
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                        ▼
                    </span>
                </div>
            </button>

            {/* Items Grid - Collapsible */}
            <div style={{
                display: 'grid',
                gridTemplateRows: isExpanded ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s ease-out',
                overflow: 'hidden'
            }}>
                <div style={{ minHeight: 0 }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '16px',
                        paddingBottom: isExpanded ? '0' : '0'
                    }}>
                        {category.items.map((item: any) => (
                            <Link
                                href={`/item/${item.id}`}
                                key={item.id}
                                style={{
                                    background: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '24px',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'all 0.2s',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px'
                                }}
                            >
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px'
                                    }}>
                                        {item.type === 'LOST' ? '🔍' : item.type === 'ID' ? '🪪' : '✨'}
                                    </div>
                                    {item.status === 'PUBLISHED' && (
                                        <span style={{
                                            padding: '6px 12px',
                                            background: '#d1fae5',
                                            color: '#065f46',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '12px',
                                            fontWeight: 600
                                        }}>
                                            ● Active
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        marginBottom: '6px',
                                        color: 'var(--text-main)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: 'var(--text-muted)',
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {item.description || "No description provided."}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div style={{
                                    paddingTop: '16px',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '13px',
                                    color: 'var(--text-muted)',
                                    fontWeight: 500
                                }}>
                                    <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>View →</span>
                                </div>
                            </Link>
                        ))}

                        {/* Add New Card */}
                        <Link
                            href={`/create?cat=${category.id}`}
                            style={{
                                background: 'transparent',
                                borderRadius: 'var(--radius-lg)',
                                padding: '24px',
                                border: '2px dashed var(--border-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                minHeight: '220px',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                color: 'var(--text-muted)'
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'var(--bg-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                ➕
                            </div>
                            <span style={{ fontSize: '15px', fontWeight: 600 }}>
                                Add to {category.name}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
