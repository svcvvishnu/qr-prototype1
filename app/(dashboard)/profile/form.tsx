'use client';

import { useActionState } from 'react';
import { uploadAadhar } from './action';

export default function ProfileForm({ user }: { user: any }) {
    const [state, formAction] = useActionState(uploadAadhar, null);

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h1 className="title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.name}</h1>
                    <p className="subtitle" style={{ marginBottom: '0.5rem' }}>{user.email}</p>
                    {user.isVerified ? (
                        <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            ✓ Verified Account
                        </span>
                    ) : (
                        <span style={{
                            backgroundColor: '#fef9c3',
                            color: '#854d0e',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>
                            ⚠ Not Verified
                        </span>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label className="input-label">Mobile Number</label>
                <div className="input" style={{ backgroundColor: '#f1f5f9' }}>{user.mobile}</div>
            </div>

            {!user.isVerified && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Identity Verification</h3>
                    <p className="subtitle" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Upload your Aadhar card to get the Blue Tick.
                    </p>

                    <form action={formAction}>
                        <div className="input-group">
                            <input type="file" name="aadhar" accept="image/*" className="input" required />
                        </div>
                        {state?.error && <p className="error-msg">{state.error}</p>}
                        {state?.success && <p style={{ color: 'var(--success)', marginTop: '0.5rem' }}>{state.success}</p>}

                        <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
                            Upload & Verify
                        </button>
                    </form>
                </div>
            )}


        </div>
    );
}
