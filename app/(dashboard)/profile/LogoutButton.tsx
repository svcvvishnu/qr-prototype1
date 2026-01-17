'use client';

export default function LogoutButton({ action }: { action: () => void }) {
    return (
        <button
            type="submit"
            style={{
                width: '100%',
                padding: '16px',
                background: 'white',
                color: '#dc2626',
                border: '2px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fee2e2';
                e.currentTarget.style.borderColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#fecaca';
            }}
        >
            <span style={{ fontSize: '18px' }}>🚪</span>
            Log Out
        </button>
    );
}
