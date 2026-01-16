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
                <Link href="/create" className="btn btn-primary">
                    <span style={{ marginRight: '6px', fontSize: '18px' }}>+</span> New Item
                </Link>
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

                            {/* Grid */}
                            <div className="grid-layout">
                                {cat.items.map((item) => (
                                    <Link href={`/item/${item.id}`} key={item.id} className="card hover-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                        {/* QR Preview Area */}
                                        <div style={{
                                            background: 'var(--bg-subtle)',
                                            height: '140px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderBottom: '1px solid var(--border-color)'
                                        }}>
                                            {item.qrCodeUrl ? (
                                                <img src={item.qrCodeUrl} alt="QR" style={{ height: '80px', width: '80px', mixBlendMode: 'multiply' }} />
                                            ) : (
                                                <span style={{ fontSize: '24px', opacity: 0.3 }}>📱</span>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                                <h3 style={{ fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{item.name}</h3>
                                            </div>

                                            <div className="flex-between">
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    {item.type === 'LOST' ? '🛑 Lost & Found' : item.type === 'ID' ? '🪪 ID Card' : '📦 Custom'}
                                                </span>
                                                {item.status === 'PUBLISHED' && (
                                                    <div title="Active" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-success-text)', boxShadow: '0 0 0 2px var(--status-success-bg)' }}></div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {/* Add New Card */}
                                <Link href={`/create?cat=${cat.id}`} className="card hover-card flex-center" style={{
                                    borderStyle: 'dashed',
                                    background: 'transparent',
                                    boxShadow: 'none',
                                    minHeight: '220px',
                                    color: 'var(--text-light)',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <span style={{ fontSize: '32px', fontWeight: 300 }}>+</span>
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Add Item</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
