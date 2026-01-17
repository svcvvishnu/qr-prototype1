'use client';

import { useActionState, useState } from 'react';
import { createItem } from './action';

export default function CreateItemForm({ categories, user }: { categories: any[], user?: any }) {
    const [state, formAction, isPending] = useActionState(createItem, null);
    const [selectedType, setSelectedType] = useState('ID');
    const [isNewCategory, setIsNewCategory] = useState(categories.length === 0);

    const typeOptions = [
        { value: 'ID', label: 'ID Card', icon: '🪪', desc: 'Name & Phone Number' },
        { value: 'LOST', label: 'Lost & Found', icon: '🔍', desc: 'Recovery Message' },
        { value: 'CUSTOM', label: 'Custom', icon: '✨', desc: 'Any Content' }
    ];

    return (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Basic Information Card */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)'
            }}>
                <h2 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '24px',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '20px' }}>📝</span>
                    Basic Information
                </h2>

                {/* Category Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'block',
                        marginBottom: '10px'
                    }}>
                        Category
                    </label>
                    <select
                        name="category"
                        onChange={(e) => setIsNewCategory(e.target.value === 'new')}
                        defaultValue={categories.length > 0 ? categories[0].id : 'new'}
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            fontSize: '15px',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--border-color)',
                            background: 'white',
                            color: 'var(--text-main)',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        <option value="new">➕ Create New Category</option>
                    </select>
                </div>

                {/* New Category Name */}
                {isNewCategory && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'block',
                            marginBottom: '10px'
                        }}>
                            New Category Name
                        </label>
                        <input
                            type="text"
                            name="newCategoryName"
                            placeholder="e.g., Office, Personal, Travel"
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
                )}

                {/* Item Name */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'block',
                        marginBottom: '10px'
                    }}>
                        Item Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="e.g., My Wallet, Office Laptop, Car Keys"
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

                {/* Description */}
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
                        Description (Optional)
                    </label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Add any additional details about this item..."
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
            </div>

            {/* Type Selection Card */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)'
            }}>
                <h2 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '20px' }}>🎯</span>
                    Select QR Type
                </h2>

                <input type="hidden" name="type" value={selectedType} />

                <div style={{ display: 'grid', gap: '12px' }}>
                    {typeOptions.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => setSelectedType(option.value)}
                            style={{
                                padding: '20px',
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
                                gap: '16px',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-md)',
                                background: selectedType === option.value
                                    ? 'var(--primary)'
                                    : 'var(--bg-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                flexShrink: 0
                            }}>
                                {option.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    color: 'var(--text-main)',
                                    marginBottom: '4px'
                                }}>
                                    {option.label}
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: 'var(--text-muted)'
                                }}>
                                    {option.desc}
                                </div>
                            </div>
                            {selectedType === option.value && (
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 700
                                }}>
                                    ✓
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Display Content Card */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)'
            }}>
                <h2 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '20px' }}>💬</span>
                    Display Content
                </h2>

                {selectedType === 'ID' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                                defaultValue={user?.name || ''}
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
                                defaultValue={user?.mobile || ''}
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
                    </div>
                )}

                {selectedType === 'LOST' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                                placeholder="Please return this item to... Include any reward information if applicable."
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
                    </div>
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
                            placeholder="Enter any text, links, or information you want to display..."
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

            {/* Error Message */}
            {state?.error && (
                <div style={{
                    padding: '16px 20px',
                    background: '#fee2e2',
                    border: '2px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    color: '#991b1b',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    {state.error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isPending}
                style={{
                    width: '100%',
                    padding: '18px',
                    background: isPending
                        ? '#9ca3af'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '17px',
                    fontWeight: 700,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    boxShadow: isPending
                        ? 'none'
                        : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    transition: 'all 0.2s',
                    opacity: isPending ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}
            >
                <span style={{ fontSize: '20px' }}>
                    {isPending ? '⏳' : '🚀'}
                </span>
                {isPending ? 'Generating QR Code...' : 'Create & Generate QR Code'}
            </button>
        </form>
    );
}
