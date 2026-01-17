'use client';

import { useActionState } from 'react';
import { uploadAadhar } from './action';

export default function ProfileForm({ user }: { user: any }) {
    const [state, formAction, isPending] = useActionState(uploadAadhar, null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Profile Header Card */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '48px 32px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
            }}>
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(30px)'
                }} />

                {/* Avatar */}
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'white',
                    color: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    fontWeight: 800,
                    margin: '0 auto 24px auto',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                    border: '6px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Name & Email */}
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '8px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {user.name}
                </h1>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '15px',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {user.email}
                </p>

                {/* Verification Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-full)',
                    background: user.isVerified
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(251, 191, 36, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: user.isVerified
                        ? '2px solid rgba(16, 185, 129, 0.3)'
                        : '2px solid rgba(251, 191, 36, 0.3)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    position: 'relative',
                    zIndex: 1
                }}>
                    <span style={{ fontSize: '18px' }}>
                        {user.isVerified ? '✓' : '⚠'}
                    </span>
                    {user.isVerified ? 'Verified Account' : 'Not Verified'}
                </div>
            </div>

            {/* Contact Information */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)'
            }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '20px' }}>📱</span>
                    Contact Information
                </h3>

                <div style={{
                    background: 'var(--bg-subtle)',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <label style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'block',
                        marginBottom: '8px'
                    }}>
                        Mobile Number
                    </label>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>📞</span>
                        {user.mobile}
                    </div>
                </div>
            </div>

            {/* Identity Verification */}
            {!user.isVerified && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '32px',
                    border: '2px solid #fbbf24',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        fontSize: '120px',
                        opacity: 0.1
                    }}>
                        🛡️
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'start',
                            gap: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(251, 191, 36, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                flexShrink: 0
                            }}>
                                🛡️
                            </div>
                            <div>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#92400e',
                                    marginBottom: '8px'
                                }}>
                                    Verify Your Identity
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#78350f',
                                    lineHeight: 1.6
                                }}>
                                    Upload your Aadhar card to get verified and unlock premium features with the Blue Tick badge.
                                </p>
                            </div>
                        </div>

                        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                background: 'white',
                                borderRadius: 'var(--radius-md)',
                                padding: '20px',
                                border: '2px dashed #fbbf24'
                            }}>
                                <input
                                    type="file"
                                    name="aadhar"
                                    accept="image/*"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '14px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #e5e7eb',
                                        background: 'white'
                                    }}
                                />
                            </div>

                            {state?.error && (
                                <div style={{
                                    padding: '12px 16px',
                                    background: '#fee2e2',
                                    border: '1px solid #fecaca',
                                    borderRadius: 'var(--radius-sm)',
                                    color: '#991b1b',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}>
                                    {state.error}
                                </div>
                            )}

                            {state?.success && (
                                <div style={{
                                    padding: '12px 16px',
                                    background: '#d1fae5',
                                    border: '1px solid #a7f3d0',
                                    borderRadius: 'var(--radius-sm)',
                                    color: '#065f46',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}>
                                    {state.success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: isPending ? '#9ca3af' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    cursor: isPending ? 'not-allowed' : 'pointer',
                                    boxShadow: isPending ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    transition: 'all 0.2s',
                                    opacity: isPending ? 0.6 : 1
                                }}
                            >
                                {isPending ? 'Uploading...' : '🚀 Upload & Verify'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
