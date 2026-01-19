'use client';

import { useState, useEffect } from 'react';

interface MessageFormProps {
    itemId: number;
    itemName: string;
    onSuccess?: () => void;
}

export default function MessageForm({ itemId, itemName, onSuccess }: MessageFormProps) {
    const [content, setContent] = useState('');
    const [senderName, setSenderName] = useState('');
    const [senderContact, setSenderContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check');
                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated) {
                        setIsLoggedIn(true);
                        setUserName(data.name || 'User');
                    }
                }
            } catch (err) {
                // User not logged in, continue as anonymous
            }
        };
        checkAuth();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId,
                    content,
                    senderName: senderName || undefined,
                    senderContact: senderContact || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setShowSuccess(true);
            setContent('');
            setSenderName('');
            setSenderContact('');

            setTimeout(() => {
                setShowSuccess(false);
                onSuccess?.();
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                textAlign: 'center',
                animation: 'slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#065f46', marginBottom: '8px' }}>
                    Message Sent!
                </h3>
                <p style={{ fontSize: '14px', color: '#047857' }}>
                    The owner will be notified and can respond to you soon.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
        }}>
            <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '16px',
                color: 'var(--text-main)'
            }}>
                💬 Send Message to Owner
            </h3>

            {isLoggedIn && (
                <div style={{
                    padding: '12px',
                    background: '#eff6ff',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: 'var(--primary)',
                    fontWeight: 600
                }}>
                    <span style={{ fontSize: '18px' }}>✓</span>
                    Sending as {userName}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Message Content */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        marginBottom: '6px'
                    }}>
                        Your Message *
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Ask about "${itemName}"...`}
                        required
                        maxLength={500}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-subtle)',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.borderColor = 'var(--primary)';
                            e.target.style.boxShadow = '0 0 0 4px var(--primary-subtle)';
                        }}
                        onBlur={(e) => {
                            e.target.style.background = 'var(--bg-subtle)';
                            e.target.style.borderColor = 'var(--border-color)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    <div style={{
                        fontSize: '12px',
                        color: 'var(--text-light)',
                        marginTop: '4px',
                        textAlign: 'right'
                    }}>
                        {content.length}/500
                    </div>
                </div>

                {/* Optional: Name for anonymous users */}
                {!isLoggedIn && (
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '6px'
                        }}>
                            Your Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="How should we call you?"
                            maxLength={50}
                            className="auth-input"
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                )}

                {/* Optional: Contact for anonymous users */}
                {!isLoggedIn && (
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '6px'
                        }}>
                            Contact Info (Optional)
                        </label>
                        <input
                            type="text"
                            value={senderContact}
                            onChange={(e) => setSenderContact(e.target.value)}
                            placeholder="Email or phone number"
                            maxLength={100}
                            className="auth-input"
                            style={{ marginBottom: 0 }}
                        />
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--text-light)',
                            marginTop: '4px'
                        }}>
                            So the owner can respond to you
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '12px',
                        background: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: 500
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        opacity: (isSubmitting || !content.trim()) ? 0.5 : 1,
                        cursor: (isSubmitting || !content.trim()) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? '📤 Sending...' : '📨 Send Message'}
                </button>
            </div>
        </form>
    );
}
