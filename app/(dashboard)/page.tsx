import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getData(userId: number) {
    const categories = await prisma.category.findMany({
        where: { userId },
        include: {
            items: true,
        },
        orderBy: { createdAt: 'desc' }
    });
    return categories;
}

export default async function DashboardHome() {
    const session = await getSession();
    if (!session) redirect('/login');

    const categories = await getData(session.userId);

    return (
        <div>
            <div className="flex-between mb-6">
                <div>
                    <h1>Dashboard</h1>
                    <p>Manage your QR codes and items</p>
                </div>
                <Link href="/create" className="btn btn-primary">
                    + New Item
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--text-light)' }}>📭</div>
                    <h3>No Items Yet</h3>
                    <p style={{ maxWidth: '300px', margin: '8px auto 24px' }}>
                        Get started by creating your first item. You can create ID cards, Lost & Found tags, or Custom QRs.
                    </p>
                    <Link href="/create" className="btn btn-primary">
                        Create First Item
                    </Link>
                </div>
            ) : (
                <div className="flex-col gap-4">
                    {categories.map((cat) => (
                        <section key={cat.id} className="card" style={{ padding: '20px' }}>
                            <div className="flex-between" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                <h3>{cat.name}</h3>
                                <span className="badge badge-neutral">{cat.items.length} Items</span>
                            </div>

                            {cat.items.length === 0 ? (
                                <p style={{ fontStyle: 'italic' }}>No items in this category.</p>
                            ) : (
                                <div className="grid-layout">
                                    {cat.items.map((item) => (
                                        <Link href={`/item/${item.id}`} key={item.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '12px',
                                            borderRadius: '6px',
                                            border: '1px solid var(--border-color)',
                                            transition: 'all 0.2s',
                                            backgroundColor: 'white'
                                        }} className="hover-effect">
                                            {/* Thumb */}
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                backgroundColor: '#f8fafc',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '16px',
                                                flexShrink: 0
                                            }}>
                                                {item.qrCodeUrl ? (
                                                    <img src={item.qrCodeUrl} alt="QR" style={{ width: '32px', height: '32px' }} />
                                                ) : (
                                                    <span>📱</span>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <div style={{ fontWeight: 500, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item.name}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span>{item.type.replace('_', ' ')}</span>
                                                    {item.status === 'PUBLISHED' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-success-text)' }}></span>}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link href={`/create?cat=${cat.id}`} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        border: '1px dashed var(--border-color)',
                                        color: 'var(--text-muted)',
                                        fontSize: '13px',
                                        fontWeight: 500
                                    }}>
                                        + Add to {cat.name}
                                    </Link>
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
