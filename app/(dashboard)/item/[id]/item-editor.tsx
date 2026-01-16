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

    const isEditing = selectedType !== item.type;

    return (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-light)', margin: 0 }}>Content Data</h3>

                {/* Type Switcher / Label Selector */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['ID', 'LOST', 'CUSTOM'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedType(type)}
                            style={{
                                padding: '4px 12px',
                                borderRadius: '999px',
                                border: '1px solid',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                backgroundColor: selectedType === type ? 'var(--primary)' : 'transparent',
                                color: selectedType === type ? 'white' : 'var(--text-muted)',
                                borderColor: selectedType === type ? 'var(--primary)' : 'var(--border-color)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {type === 'ID' && 'ID Card'}
                            {type === 'LOST' && 'Lost & Found'}
                            {type === 'CUSTOM' && 'Custom'}
                        </button>
                    ))}
                </div>
            </div>

            {/* If type matches DB, show read-only view. UNLESS user explicitly wants to edit? 
               The prompt says "once selected, then missing field should popup". 
               So if I select the *current* type, I should just see the current data?
               But how do I edit the current data then? 
               Maybe "missing fields" implies only when switching?
               "Instead of edit item button... option to select a label... once selected... missing field should popup".
               This phrasing suggests the "Select a Label" IS the edit entry point.
               If I click the label I'm already on, it should probably stay as is.
               But if I want to edit the current text?
               Let's assume "Select a Label" acts as a tab switcher. 
               If I'm on "ID", I see the ID form. If I'm on "Lost", I see the Lost form.
               If the form matches the DB, I show the values. 
               If I change values, I can republish.
               
               Actually, "missing field should popup" suggests the fields are HIDDEN until I switch?
               Let's make it intuitive. Always show the fields for the Selected Type.
               If it matches DB, it's just the current values.
               If it's a new type, it's empty/prefilled.
               And because it's "Editor", let's make them inputs. 
            */}

            <form action={formAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="name" value={item.name} />
                <input type="hidden" name="description" value={item.description || ''} />
                <input type="hidden" name="category" value={item.categoryId} />
                <input type="hidden" name="type" value={selectedType} />

                <div style={{ display: 'grid', gap: '12px' }}>

                    {selectedType === 'ID' && (
                        <>
                            <div className="input-group">
                                <label className="input-label">Display Name</label>
                                <input
                                    type="text"
                                    name="payload_name"
                                    className="input"
                                    placeholder="Your Name"
                                    required
                                    defaultValue={getValue('name', 'ID')}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="payload_phone"
                                    className="input"
                                    placeholder="+91..."
                                    required
                                    defaultValue={getValue('phone', 'ID')}
                                />
                            </div>
                        </>
                    )}

                    {selectedType === 'LOST' && (
                        <>
                            <div className="input-group">
                                <label className="input-label">Message for Finder</label>
                                <textarea
                                    name="payload_message"
                                    className="input"
                                    rows={3}
                                    placeholder="Please return this item to..."
                                    required
                                    defaultValue={getValue('message', 'LOST')}
                                ></textarea>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Contact Info (Optional)</label>
                                <input
                                    type="text"
                                    name="payload_contact"
                                    className="input"
                                    placeholder="Email or Phone to show"
                                    defaultValue={getValue('contact', 'LOST')}
                                />
                            </div>
                        </>
                    )}

                    {selectedType === 'CUSTOM' && (
                        <div className="input-group">
                            <label className="input-label">Custom Content</label>
                            <textarea
                                name="payload_content"
                                className="input"
                                rows={4}
                                placeholder="Any text or info..."
                                required
                                defaultValue={getValue('content', 'CUSTOM')}
                            ></textarea>
                        </div>
                    )}

                </div>

                {state?.error && <p className="error-msg" style={{ marginTop: '1rem' }}>{state.error}</p>}

                {/* Only show Republish if something changed or we effectively want to save edits */}
                <button
                    type="submit"
                    className="btn"
                    disabled={isPending}
                    style={{
                        marginTop: '1.5rem',
                        width: '100%',
                        display: 'block' // Always allow republishing/editing
                    }}
                >
                    {isPending ? 'Publishing...' : 'Republish / Update'}
                </button>
            </form>
        </div>
    );
}
