import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) redirect('/login');

    return (
        <div style={{ paddingBottom: '80px' }}> {/* Padding for potential bottom nav or just spacing */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                    QR Master
                </Link>
                <Link href="/profile" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border)'
                }}>
                    {/* Simple User Icon SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </Link>
            </header>
            <main className="container" style={{ paddingTop: '1rem', minHeight: 'calc(100vh - 70px)' }}>
                {children}
            </main>
        </div>
    );
}
