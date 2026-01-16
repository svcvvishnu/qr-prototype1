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
        <div className="animate-in">
            <div className="flex-between" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontWeight: 800 }}>Dashboard</h1>
                    <p style={{ marginTop: '4px' }}>Overview of your active QR codes.</p>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="card flex-col flex-center" style={{ padding: '80px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>✨</div>
                    <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>It's quiet here</h2>
                    <p style={{ maxWidth: '320px', marginBottom: '24px' }}>
                        Transform your items with smart QR codes. Create your first digital identity or lost & found tag.
                    </p>
                    <Link href="/create" className="btn btn-primary">
                        Start Creating
                    </Link>
                </div>
            ) : (
                <div className="flex-col gap-4">
                    {categories.map((cat) => (
                        <div key={cat.id}>
                            {/* Category Header */}
                            <div className="flex-between" style={{ padding: '0 8px', marginBottom: '12px' }}>
                                <h3 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '0.05em' }}>{cat.name}</h3>
                                <span className="badge badge-neutral" style={{ fontSize: '11px', height: '22px' }}>{cat.items.length}</span>
                            </div>

                            {/* Horizontal Scroll Row */}
                            <div className="scroll-row">
                                {cat.items.map((item) => (
                                    <Link href={`/item/${item.id}`} key={item.id} className="card hover-card scroll-item" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', border: '1px solid var(--border-color)' }}>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                                    {item.type === 'LOST' ? '🛑' : item.type === 'ID' ? '🪪' : '📦'}
                                                </div>
                                                {item.status === 'PUBLISHED' && (
                                                    <div title="Active" style={{ padding: '4px 8px', borderRadius: '99px', background: 'var(--status-success-bg)', color: 'var(--status-success-text)', fontSize: '11px', fontWeight: 600 }}>Active</div>
                                                )}
                                            </div>

                                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                                {item.description || "No description provided."}
                                            </p>
                                        </div>

                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                                            <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                                            <span>View &rarr;</span>
                                        </div>
                                    </Link>
                                ))}

                                {/* Add New Card (Inline) */}
                                <Link href={`/create?cat=${cat.id}`} className="card hover-card flex-center scroll-item" style={{
                                    borderStyle: 'dashed',
                                    background: 'transparent',
                                    boxShadow: 'none',
                                    color: 'var(--text-light)',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    minHeight: '180px' // Match visual height roughly
                                }}>
                                    <span style={{ fontSize: '32px', fontWeight: 300 }}>+</span>
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Add to {cat.name}</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Action Button */}
            <div className="fab-container">
                <Link href="/create" className="fab-button">
                    <span style={{ marginRight: '8px', fontSize: '20px' }}>+</span> New Item
                </Link>
            </div>
        </div>
    );
}
