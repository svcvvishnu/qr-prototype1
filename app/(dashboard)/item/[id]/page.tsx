import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

async function getItem(id: number, userId: number) {
    const item = await prisma.item.findUnique({
        where: { id },
        include: { category: true, scans: { orderBy: { timestamp: 'desc' }, take: 10 } }
    });

    if (!item || item.category.userId !== userId) return null;
    return item;
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { id } = await params;

    const item = await getItem(parseInt(id), session.userId);
    if (!item) notFound();

    const payload = JSON.parse(item.payload);

    return (
        <div>
            <div className="mb-4">
                <Link href="/" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>&larr; Back to Dashboard</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                {/* Main Info Card */}
                <div className="card">
                    <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <span className={`badge ${item.status === 'PUBLISHED' ? 'badge-success' : 'badge-neutral'}`}>{item.status}</span>
                                <span className="badge badge-neutral">{item.type}</span>
                            </div>
                            <h1 style={{ marginBottom: '4px' }}>{item.name}</h1>
                            <p>{item.category.name}</p>
                        </div>
                        {item.qrCodeUrl && (
                            <div style={{ textAlign: 'center' }}>
                                <img src={item.qrCodeUrl} alt="QR" style={{ width: '80px', height: '80px', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px' }} />
                                <a href={item.qrCodeUrl} download="qr.png" style={{ display: 'block', fontSize: '11px', marginTop: '4px', color: 'var(--primary)', fontWeight: 500 }}>Download</a>
                            </div>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-light)' }}>Content Data</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {Object.entries(payload).map(([key, value]) => (
                                <div key={key}>
                                    <div className="label" style={{ textTransform: 'capitalize' }}>{key}</div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-main)', padding: '8px 12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px' }}>
                                        {String(value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4" style={{ display: 'flex', gap: '12px' }}>
                        <Link href={`/q/${item.id}`} className="btn btn-secondary" target="_blank" style={{ flex: 1 }}>
                            Preview Public Page
                        </Link>
                    </div>
                </div>

                {/* Stats / History Card */}
                <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>Scan History</h3>

                    {item.scans.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-light)' }}>
                            No scans recorded yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {item.scans.map((scan, i) => (
                                <div key={scan.id} style={{
                                    padding: '12px 0',
                                    borderBottom: i < item.scans.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '14px'
                                }}>
                                    <span style={{ fontWeight: 500 }}>
                                        {scan.scannerId ? `User #${scan.scannerId}` : 'Anonymous Scan'}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                        {new Date(scan.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
