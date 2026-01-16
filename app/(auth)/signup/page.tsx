'use client';

import { useActionState } from 'react';
import { signup } from './action';
import Link from 'next/link';

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, null);

    return (
        <>
            <div className="card">
                <h1 className="title">Create Account</h1>
                <p className="subtitle">Sign up to manage your QR codes</p>

                <form action={formAction}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="name">Full Name (As per Aadhar)</label>
                        <input className="input" type="text" id="name" name="name" placeholder="John Doe" required />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email Address</label>
                        <input className="input" type="email" id="email" name="email" placeholder="john@example.com" required />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="mobile">Mobile Number</label>
                        <input className="input" type="tel" id="mobile" name="mobile" placeholder="9876543210" required />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input className="input" type="password" id="password" name="password" placeholder="••••••••" required />
                    </div>

                    {state?.error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{state.error}</p>}

                    <button className="btn" type="submit" disabled={isPending}>
                        {isPending ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log In</Link>
                </div>
            </div>
        </>
    );
}
