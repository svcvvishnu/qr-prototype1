import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BottomNav from '../components/BottomNav';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) redirect('/login');

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            {/* Main Content */}
            <main className="container" style={{ paddingTop: '24px', paddingBottom: '32px' }}>
                {children}
            </main>

            <BottomNav />
        </div>
    );
}
