'use client';

import { useState } from 'react';

interface ReplyFormProps {
    messageId: number;
    itemId: number;
    senderName: string;
    onSuccess?: () => void;
}

export default function ReplyForm({ messageId, itemId, senderName, onSuccess }: ReplyFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Please enter a message');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/messages/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content.trim(),
                    parentMessageId: messageId,
                    itemId
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send reply');
            }

            // Success
            setContent('');
            setShowForm(false);
            if (onSuccess) onSuccess();

            // Reload page to show new reply
            window.location.reload();
        } catch (err: any) {
            setError(err.message || 'Failed to send reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    background: 'transparent',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary-subtle)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                }}
            >
                💬 Reply
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{
            marginTop: '12px',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
        }}>
            <div style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                fontWeight: 500
            }}>
                Replying to {senderName}
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your reply..."
                maxLength={500}
                rows={3}
                style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                }}
                disabled={isSubmitting}
            />

            <div style={{
                fontSize: '11px',
                color: 'var(--text-light)',
                marginTop: '4px',
                marginBottom: '8px'
            }}>
                {content.length}/500 characters
            </div>

            {error && (
                <div style={{
                    padding: '8px 12px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    marginBottom: '8px'
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: isSubmitting || !content.trim() ? 'var(--text-light)' : 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: isSubmitting || !content.trim() ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? 'Sending...' : 'Send Reply'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setShowForm(false);
                        setContent('');
                        setError('');
                    }}
                    style={{
                        padding: '10px 16px',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
