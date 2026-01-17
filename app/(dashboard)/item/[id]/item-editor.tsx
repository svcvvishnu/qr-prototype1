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
        { value: 'ID', label: 'ID Card', icon: '🪪' },
        { value: 'LOST', label: 'Lost & Found', icon: '🔍' },
        { value: 'CUSTOM', label: 'Custom', icon: '✨' }
    ];

    return (
        <div>
            {/* Type Selector */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '16px',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '20px' }}>🎯</span>
                    QR Code Type
                </h3>

                <div style={{ display: 'grid', gap: '12px' }}>
                    {typeOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedType(option.value)}
                            style={{
                                padding: '16px 20px',
                                borderRadius: 'var(--radius-md)',
                                border: selectedType === option.value
                                    ? '3px solid var(--primary)'
                                    : '2px solid var(--border-color)',
                                background: selectedType === option.value
                                    ? 'var(--primary-subtle)'
                                    : 'white',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-sm)',
                                background: selectedType === option.value
                                    ? 'var(--primary)'
                                    : 'var(--bg-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                flexShrink: 0
                            }}>
                                {option.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    color: 'var(--text-main)'
                                }}>
                                    {option.label}
                                </div>
                            </div>
                            {selectedType === option.value && (
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700
                                }}>
                                    ✓
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Form */}
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="name" value={item.name} />
                <input type="hidden" name="description" value={item.description || ''} />
                <input type="hidden" name="category" value={item.categoryId} />
                <input type="hidden" name="type" value={selectedType} />

                <div>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        marginBottom: '16px',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '20px' }}>💬</span>
                        Content Data
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {selectedType === 'ID' && (
                            <>
                                <div>
                                    <label style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        display: 'block',
                                        marginBottom: '10px'
                                    }}>
                                        Display Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="payload_name"
                                        placeholder="Your Full Name"
                                        required
                                        defaultValue={getValue('name', 'ID')}
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
                                    <label style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        display: 'block',
                                        marginBottom: '10px'
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
                            </>
                        )}

                        {selectedType === 'LOST' && (
                            <>
                                <div>
                                    <label style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        display: 'block',
                                        marginBottom: '10px'
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
                                            padding: '14px 16px',
                                            fontSize: '15px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '2px solid var(--border-color)',
                                            background: 'white',
                                            color: 'var(--text-main)',
                                            fontWeight: 500,
                                            transition: 'all 0.2s',
                                            outline: 'none',
                                            resize: 'vertical',
                                            fontFamily: 'inherit'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        display: 'block',
                                        marginBottom: '10px'
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
                            </>
                        )}

                        {selectedType === 'CUSTOM' && (
                            <div>
                                <label style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    display: 'block',
                                    marginBottom: '10px'
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
                                        padding: '14px 16px',
                                        fontSize: '15px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '2px solid var(--border-color)',
                                        background: 'white',
                                        color: 'var(--text-main)',
                                        fontWeight: 500,
                                        transition: 'all 0.2s',
                                        outline: 'none',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        )}
                    </div>
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    <span style={{ fontSize: '18px' }}>
                        {isPending ? '⏳' : '🔄'}
                    </span>
                    {isPending ? 'Publishing...' : 'Republish / Update'}
                </button>
            </form>
        </div>
    );
}
