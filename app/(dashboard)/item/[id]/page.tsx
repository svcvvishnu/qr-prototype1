import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

async function getItem(id: number, userId: number) {
    const item = await prisma.item.findUnique({
        where: { id },
        include: { category: true, scans: { orderBy: { timestamp: 'desc' }, take: 5 } }
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
        <div className="container">
            <Link href="/" style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '999px',
                            backgroundColor: item.status === 'PUBLISHED' ? '#dcfce7' : '#f1f5f9',
                            color: item.status === 'PUBLISHED' ? '#166534' : '#64748b',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem'
                        }}>
                            {item.status}
                        </span>
                        <h1 className="title">{item.name}</h1>
                        <p className="subtitle">{item.category.name} • {item.type}</p>
                    </div>
                    {/* QR Code Display */}
                    {item.qrCodeUrl && (
                        <div style={{ width: '100px', height: '100px' }}>
                            <img src={item.qrCodeUrl} alt="QR Code" style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                        </div>
                    )}
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Content Data</h3>
                    <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                        {Object.entries(payload).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}: </span>
                                <span>{String(value)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Recent Scans</h3>
                    {item.scans.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No scans yet.</p>
                    ) : (
                        <ul style={{ listStyle: 'none' }}>
                            {item.scans.map(scan => (
                                <li key={scan.id} style={{
                                    padding: '0.75rem',
                                    borderBottom: '1px solid var(--border)',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>{scan.scannerId ? `User #${scan.scannerId}` : 'Anonymous'}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        {new Date(scan.timestamp).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}
