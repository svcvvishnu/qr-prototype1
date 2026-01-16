'use client';

import { useActionState, useState } from 'react';
import { createItem } from './action';

export default function CreateItemForm({ categories }: { categories: any[] }) {
    const [state, formAction, isPending] = useActionState(createItem, null);
    const [selectedType, setSelectedType] = useState('ID');
    const [isNewCategory, setIsNewCategory] = useState(categories.length === 0);

    return (
        <form action={formAction} className="card">
            <div className="input-group">
                <label className="input-label">Category</label>
                <select
                    name="category"
                    className="input"
                    onChange={(e) => setIsNewCategory(e.target.value === 'new')}
                    defaultValue={categories.length > 0 ? categories[0].id : 'new'}
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                    <option value="new">+ Create New Category</option>
                </select>
            </div>

            {isNewCategory && (
                <div className="input-group">
                    <label className="input-label">New Category Name</label>
                    <input type="text" name="newCategoryName" className="input" placeholder="e.g., Office, Personal" />
                </div>
            )}

            <div className="input-group">
                <label className="input-label">Item Name</label>
                <input type="text" name="name" className="input" placeholder="e.g., My Wallet" required />
            </div>

            <div className="input-group">
                <label className="input-label">Description (Optional)</label>
                <textarea name="description" className="input" rows={3} placeholder="Additional details..."></textarea>
            </div>

            <div className="input-group">
                <label className="input-label">Type</label>
                <select
                    name="type"
                    className="input"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="ID">ID Card (Name & Phone)</option>
                    <option value="LOST">Lost & Found (Message)</option>
                    <option value="CUSTOM">Custom</option>
                </select>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Display Content</h3>

            {selectedType === 'ID' && (
                <>
                    <div className="input-group">
                        <label className="input-label">Display Name</label>
                        <input type="text" name="payload_name" className="input" placeholder="Your Name" required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Phone Number</label>
                        <input type="tel" name="payload_phone" className="input" placeholder="+91..." required />
                    </div>
                </>
            )}

            {selectedType === 'LOST' && (
                <>
                    <div className="input-group">
                        <label className="input-label">Message for Finder</label>
                        <textarea name="payload_message" className="input" rows={3} placeholder="Please return this item to..." required></textarea>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Contact Info (Optional)</label>
                        <input type="text" name="payload_contact" className="input" placeholder="Email or Phone to show" />
                    </div>
                </>
            )}

            {selectedType === 'CUSTOM' && (
                <div className="input-group">
                    <label className="input-label">Custom Content</label>
                    <textarea name="payload_content" className="input" rows={4} placeholder="Any text or info..." required></textarea>
                </div>
            )}

            {state?.error && <p className="error-msg">{state.error}</p>}

            <button type="submit" className="btn" disabled={isPending} style={{ marginTop: '1rem' }}>
                {isPending ? 'Generatng QR...' : 'Create & Generate QR'}
            </button>
        </form>
    );
}
