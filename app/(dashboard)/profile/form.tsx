'use client';

import { useActionState } from 'react';
import { uploadAadhar } from './action';

export default function ProfileForm({ user }: { user: any }) {
    const [state, formAction] = useActionState(uploadAadhar, null);

    return (
        <div className="flex-col gap-4">
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    fontWeight: 700,
                    margin: '0 auto 20px auto',
                    boxShadow: 'var(--shadow-lg)',
                    border: '4px solid white'
                }}>
                    {user.name.charAt(0)}
                </div>

                <h1 className="title" style={{ fontSize: '24px', marginBottom: '4px' }}>{user.name}</h1>
                <p className="subtitle" style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{user.email}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {user.isVerified ? (
                        <span className="badge badge-success" style={{ padding: '6px 16px' }}>
                            ✓ Verified Account
                        </span>
                    ) : (
                        <span className="badge badge-warning" style={{ padding: '6px 16px' }}>
                            ⚠ Not Verified
                        </span>
                    )}
                </div>
            </div>

            <div className="card">
                <h3 className="section-title">Contact Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="label">Mobile Number</label>
                        <div className="input" style={{ backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center' }}>
                            {user.mobile}
                        </div>
                    </div>
                </div>
            </div>

            {!user.isVerified && (
                <div className="card" style={{ borderColor: 'var(--primary-subtle)', backgroundColor: 'var(--primary-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                        <div style={{ fontSize: '24px' }}>🛡️</div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>Identity Verification</h3>
                            <p className="subtitle" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                Upload your Aadhar card to get the Blue Tick and unlock premium features.
                            </p>

                            <form action={formAction}>
                                <div style={{ marginBottom: '12px' }}>
                                    <input
                                        type="file"
                                        name="aadhar"
                                        accept="image/*"
                                        className="input"
                                        required
                                        style={{ height: 'auto', padding: '12px' }}
                                    />
                                </div>
                                {state?.error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>{state.error}</p>}
                                {state?.success && <p style={{ color: '#166534', fontSize: '13px', marginBottom: '8px' }}>{state.success}</p>}

                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                    Upload & Verify
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
