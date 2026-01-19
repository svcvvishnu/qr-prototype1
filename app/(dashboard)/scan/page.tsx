import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import QRScanner from '@/app/components/QRScanner';

export default async function ScanPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <QRScanner />
        </div>
    );
}
