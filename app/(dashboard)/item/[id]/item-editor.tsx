'use client';

import { useActionState, useState } from 'react';
import { updateItem } from './edit/action';

export default function ItemEditor({ item, user }: { item: any, user: any }) {
    const [state, formAction, isPending] = useActionState(updateItem, null);
    const [selectedType, setSelectedType] = useState(item.type);

    // Parse payload safely
    const existingPayload = typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload;

    // Helper to get value: current payload if type matches, OR user profile fallback if applicable
    const getValue = (key: string, typeForField: string) => {
        if (selectedType === item.type) {
            return existingPayload[key] || '';
        }
        // If we switched types, try to prefill from user profile for ID fields
        if (typeForField === 'ID') {
            if (key === 'name') return user?.name || '';
            if (key === 'phone') return user?.mobile || '';
        }
        return '';
    };

    const typeOptions = [
        { value: 'ID', label: '🪪 Identity', icon: '🪪' },
        { value: 'LOST', label: '🔍 Lost Item', icon: '🔍' },
        { value: 'CUSTOM', label: '✨ Custom', icon: '✨' }
    ];

    return (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="name" value={item.name} />
            <input type="hidden" name="description" value={item.description || ''} />
            <input type="hidden" name="category" value={item.categoryId} />
            <input type="hidden" name="type" value={selectedType} />

            {/* Type Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '2px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                margin: '-20px -20px 0 -20px',
                padding: '0 20px'
            }}>
                {typeOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedType(option.value)}
                        style={{
                            flex: 1,
                            padding: '14px 20px',
                            background: selectedType === option.value ? 'white' : 'transparent',
                            border: 'none',
                            borderBottom: selectedType === option.value ? '3px solid var(--primary)' : '3px solid transparent',
                            marginBottom: '-2px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: selectedType === option.value ? 'var(--primary)' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '20px 0' }}>
                {/* ID Type Fields */}
                {selectedType === 'ID' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '8px'
                            }}>
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="payload_name"
                                placeholder="Your Full Name"
                                required
                                defaultValue={getValue('name', 'ID')}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--border-color)',
                                    background: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '8px'
                            }}>
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="payload_phone"
                                placeholder="+91 XXXXX XXXXX"
                                required
                                defaultValue={getValue('phone', 'ID')}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--border-color)',
                                    background: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* LOST Type Fields */}
                {selectedType === 'LOST' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '8px'
                            }}>
                                Message for Finder *
                            </label>
                            <textarea
                                name="payload_message"
                                rows={4}
                                placeholder="Please return this item to..."
                                required
                                defaultValue={getValue('message', 'LOST')}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--border-color)',
                                    background: 'white',
                                    outline: 'none',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '8px'
                            }}>
                                Contact Info (Optional)
                            </label>
                            <input
                                type="text"
                                name="payload_contact"
                                placeholder="Email or Phone Number"
                                defaultValue={getValue('contact', 'LOST')}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--border-color)',
                                    background: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* CUSTOM Type Fields */}
                {selectedType === 'CUSTOM' && (
                    <div>
                        <label style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'block',
                            marginBottom: '8px'
                        }}>
                            Custom Content *
                        </label>
                        <textarea
                            name="payload_content"
                            rows={5}
                            placeholder="Enter any text, links, or information..."
                            required
                            defaultValue={getValue('content', 'CUSTOM')}
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                fontSize: '14px',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--border-color)',
                                background: 'white',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                )}

                {/* Error/Success Messages */}
                {state?.error && (
                    <div style={{
                        padding: '12px 14px',
                        background: '#fee2e2',
                        border: '2px solid #fecaca',
                        borderRadius: 'var(--radius-md)',
                        color: '#991b1b',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginTop: '16px'
                    }}>
                        ⚠️ {state.error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: isPending
                            ? '#9ca3af'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        opacity: isPending ? 0.6 : 1,
                        marginTop: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <span>{isPending ? '⏳' : '🔄'}</span>
                    {isPending ? 'Publishing...' : 'Republish / Update'}
                </button>
            </div>
        </form>
    );
}
