'use client';

import { useActionState } from 'react';
import { login } from './action';
import Link from 'next/link';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <>
            <div className="card">
                <h1 className="title">Welcome Back</h1>
                <p className="subtitle">Login to access your dashboard</p>

                <form action={formAction}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email Address</label>
                        <input className="input" type="email" id="email" name="email" placeholder="john@example.com" required />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input className="input" type="password" id="password" name="password" placeholder="••••••••" required />
                    </div>

                    {state?.error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{state.error}</p>}

                    <button className="btn" type="submit" disabled={isPending}>
                        {isPending ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Don't have an account? <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign Up</Link>
                </div>
            </div>
        </>
    );
}
