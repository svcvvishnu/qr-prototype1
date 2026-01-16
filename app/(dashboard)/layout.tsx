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

    const userInitials = session.name ? session.name.charAt(0).toUpperCase() : 'U';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            {/* Header */}
            <header style={{
                height: 'var(--header-height)',
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-color)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div className="container flex-between" style={{ height: '100%' }}>
                    <Link href="/" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                        QR Master
                    </Link>

                    <Link href="/profile" style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '14px'
                    }}>
                        {userInitials}
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
                {children}
            </main>
        </div>
    );
}
