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
            <div className="flex-between" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px' }}>Dashboard</h1>
                    <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '14px' }}>Your active QR codes.</p>
                </div>
                {/* User Avatar - Small profile link can be here or just decorative since we have bottom nav */}
                <Link href="/profile" className="avatar">
                    {session.name ? session.name.charAt(0).toUpperCase() : 'U'}
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="card flex-col flex-center" style={{ padding: '60px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>✨</div>
                    <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>It's quiet here</h2>
                    <p style={{ maxWidth: '300px', marginBottom: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Create your first digital identity or lost & found tag.
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
                                <h3 className="section-title" style={{ marginBottom: 0 }}>{cat.name}</h3>
                                <span className="badge badge-neutral">{cat.items.length}</span>
                            </div>

                            {/* Horizontal Scroll Row */}
                            <div className="scroll-row">
                                {cat.items.map((item) => (
                                    <Link href={`/item/${item.id}`} key={item.id} className="card hover-card scroll-item" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                                    {item.type === 'LOST' ? '🛑' : item.type === 'ID' ? '🪪' : '📦'}
                                                </div>
                                                {item.status === 'PUBLISHED' && (
                                                    <div className="badge badge-success">Active</div>
                                                )}
                                            </div>

                                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                                {item.description || "No description provided."}
                                            </p>
                                        </div>

                                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-light)', fontWeight: 500 }}>
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
                                    minHeight: '200px'
                                }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Add to {cat.name}</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
