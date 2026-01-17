'use client';

import { useActionState } from 'react';
import { login } from './action';
import Link from 'next/link';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative elements */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(60px)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-100px',
                left: '-100px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(50px)'
            }} />

            {/* Login Card */}
            <div style={{
                width: '100%',
                maxWidth: '440px',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '48px',
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Logo/Brand */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    marginBottom: '24px',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    📱
                </div>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    marginBottom: '8px',
                    color: 'var(--text-main)'
                }}>
                    Welcome Back
                </h1>
                <p style={{
                    fontSize: '15px',
                    color: 'var(--text-muted)',
                    marginBottom: '32px'
                }}>
                    Login to access your QR dashboard
                </p>

                <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label htmlFor="email" style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'block',
                            marginBottom: '10px'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="john@example.com"
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                fontSize: '15px',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--border-color)',
                                background: 'white',
                                color: 'var(--text-main)',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'block',
                            marginBottom: '10px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                fontSize: '15px',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--border-color)',
                                background: 'white',
                                color: 'var(--text-main)',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    {state?.error && (
                        <div style={{
                            padding: '14px 16px',
                            background: '#fee2e2',
                            border: '2px solid #fecaca',
                            borderRadius: 'var(--radius-md)',
                            color: '#991b1b',
                            fontSize: '14px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span>⚠️</span>
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: isPending
                                ? '#9ca3af'
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            fontWeight: 700,
                            cursor: isPending ? 'not-allowed' : 'pointer',
                            boxShadow: isPending
                                ? 'none'
                                : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            transition: 'all 0.2s',
                            opacity: isPending ? 0.6 : 1,
                            marginTop: '8px'
                        }}
                    >
                        {isPending ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: 'var(--text-muted)'
                }}>
                    Don't have an account?{' '}
                    <Link href="/signup" style={{
                        color: 'var(--primary)',
                        fontWeight: 700,
                        textDecoration: 'none'
                    }}>
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
