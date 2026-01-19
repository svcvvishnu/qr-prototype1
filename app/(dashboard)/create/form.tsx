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
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Basic Information Card */}
            <div className="fade-in-up hover-lift transition-smooth" style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)',
                animationDelay: '0.1s'
            }}>
                <h2 style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '18px' }}>📝</span>
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

            {/* QR Type & Content - Tabbed Interface */}
            <div className="fade-in-up hover-lift transition-smooth" style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)',
                animationDelay: '0.2s',
                overflow: 'hidden'
            }}>
                <input type="hidden" name="type" value={selectedType} />

                {/* Type Tabs */}
                <div style={{
                    display: 'flex',
                    borderBottom: '2px solid var(--border-color)',
                    background: 'var(--bg-subtle)'
                }}>
                    {typeOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedType(option.value)}
                            className="transition-smooth"
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
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>{option.icon}</span>
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ padding: '24px' }}>
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
                                    defaultValue={user?.name || ''}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
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
                                    defaultValue={user?.mobile || ''}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
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
                                    placeholder="Please return this item to... Include any reward information if applicable."
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
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
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
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
                                placeholder="Enter any text, links, or information you want to display..."
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
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
                className="hover-lift transition-smooth fade-in-up"
                style={{
                    width: '100%',
                    padding: '16px',
                    background: isPending
                        ? '#9ca3af'
                        : 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    boxShadow: isPending
                        ? 'none'
                        : 'var(--shadow-colored)',
                    opacity: isPending ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    animationDelay: '0.3s'
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
