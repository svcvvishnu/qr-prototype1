'use client';

import { useActionState } from 'react';
import { uploadAadhar } from './action';

export default function ProfileForm({ user }: { user: any }) {
    const [state, formAction, isPending] = useActionState(uploadAadhar, null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Grid Layout for Info Tiles */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
            }}>
                {/* Name Tile */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    gridColumn: 'span 2'
                }}>
                    <div style={{
                        fontSize: '24px',
                        marginBottom: '8px'
                    }}>
                        👤
                    </div>
                    <div style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600
                    }}>
                        Name
                    </div>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'white'
                    }}>
                        {user.name}
                    </div>
                </div>
                {/* Email Tile */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        fontSize: '24px',
                        marginBottom: '8px'
                    }}>
                        📧
                    </div>
                    <div style={{
                        fontSize: '10px',
                        color: 'var(--text-light)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600
                    }}>
                        Email
                    </div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        wordBreak: 'break-word'
                    }}>
                        {user.email}
                    </div>
                </div>

                {/* Mobile Tile */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        fontSize: '24px',
                        marginBottom: '8px'
                    }}>
                        📱
                    </div>
                    <div style={{
                        fontSize: '10px',
                        color: 'var(--text-light)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600
                    }}>
                        Mobile
                    </div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-main)'
                    }}>
                        {user.mobile}
                    </div>
                </div>

                {/* Verification Status Tile */}
                <div style={{
                    background: user.isVerified
                        ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                        : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    border: user.isVerified ? '1px solid #10b981' : '1px solid #fbbf24',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        fontSize: '24px',
                        marginBottom: '8px'
                    }}>
                        {user.isVerified ? '✅' : '⚠️'}
                    </div>
                    <div style={{
                        fontSize: '10px',
                        color: user.isVerified ? '#065f46' : '#92400e',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600
                    }}>
                        Status
                    </div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: user.isVerified ? '#065f46' : '#92400e'
                    }}>
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                    </div>
                </div>

                {/* Account Created Tile */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        fontSize: '24px',
                        marginBottom: '8px'
                    }}>
                        📅
                    </div>
                    <div style={{
                        fontSize: '10px',
                        color: 'var(--text-light)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600
                    }}>
                        Member Since
                    </div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-main)'
                    }}>
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Verification Upload - Full Width Tile */}
            {!user.isVerified && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    border: '2px solid #fbbf24'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            fontSize: '28px'
                        }}>
                            🛡️
                        </div>
                        <div>
                            <h3 style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#92400e',
                                marginBottom: '2px'
                            }}>
                                Verify Your Identity
                            </h3>
                            <p style={{
                                fontSize: '11px',
                                color: '#78350f',
                                lineHeight: 1.4
                            }}>
                                Upload Aadhar to get verified
                            </p>
                        </div>
                    </div>

                    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="file"
                            name="aadhar"
                            accept="image/*"
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #fbbf24',
                                background: 'white'
                            }}
                        />

                        {state?.error && (
                            <div style={{
                                padding: '8px 10px',
                                background: '#fee2e2',
                                border: '1px solid #fecaca',
                                borderRadius: 'var(--radius-sm)',
                                color: '#991b1b',
                                fontSize: '11px'
                            }}>
                                {state.error}
                            </div>
                        )}

                        {state?.success && (
                            <div style={{
                                padding: '8px 10px',
                                background: '#d1fae5',
                                border: '1px solid #a7f3d0',
                                borderRadius: 'var(--radius-sm)',
                                color: '#065f46',
                                fontSize: '11px'
                            }}>
                                {state.success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: isPending ? '#9ca3af' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: isPending ? 'not-allowed' : 'pointer',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                opacity: isPending ? 0.6 : 1
                            }}
                        >
                            {isPending ? 'Uploading...' : '🚀 Upload & Verify'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
