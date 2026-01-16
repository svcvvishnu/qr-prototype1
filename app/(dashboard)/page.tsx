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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="title">My QR Codes</h1>
                <Link href="/create" className="btn" style={{ width: 'auto' }}>
                    + New Item
                </Link>
            </div>

            {categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    <p>You haven't created any categories or items yet.</p>
                    <p style={{ marginTop: '0.5rem' }}>Click "+ New Item" to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {categories.map((cat) => (
                        <section key={cat.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{cat.name}</h2>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{cat.items.length} items</span>
                            </div>

                            {/* Horizontally scrollable list */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                overflowX: 'auto',
                                paddingBottom: '1rem',
                                marginRight: '-1rem', // bleeding logic if needed, simplify for now
                                paddingRight: '1rem'
                            }}>
                                {cat.items.map((item) => (
                                    <Link href={`/item/${item.id}`} key={item.id} style={{
                                        minWidth: '160px',
                                        width: '160px',
                                        backgroundColor: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                        padding: '1rem',
                                        flexShrink: 0,
                                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                                    }}>
                                        <div style={{
                                            aspectRatio: '1',
                                            backgroundColor: '#f1f5f9',
                                            borderRadius: '0.5rem',
                                            marginBottom: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            {/* Placeholder for QR Code Thumbnail or Icon */}
                                            {item.qrCodeUrl ? (
                                                <img src={item.qrCodeUrl} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <span style={{ fontSize: '2rem' }}>📱</span>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.status}</p>
                                    </Link>
                                ))}
                                {cat.items.length === 0 && (
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>No items in this category.</div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
