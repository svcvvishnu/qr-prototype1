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
    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header with Stats */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            }}>
                {/* Decorative elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(40px)'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: 'white' }}>
                                Welcome back, {session.name}! 👋
                            </h1>
                            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '15px' }}>
                                Manage your QR codes and track scans
                            </p>
                        </div>
                        <Link href="/profile" style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'white',
                            color: '#667eea',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 700,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            textDecoration: 'none'
                        }}>
                            {session.name ? session.name.charAt(0).toUpperCase() : 'U'}
                        </Link>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-md)',
                            padding: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>
                                {totalItems}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                                Total QR Codes
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-md)',
                            padding: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>
                                {categories.length}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                                Categories
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {categories.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '80px 32px',
                    textAlign: 'center',
                    border: '2px dashed var(--border-color)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>✨</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                        Let's Create Your First QR Code
                    </h2>
                    <p style={{ maxWidth: '400px', margin: '0 auto 32px', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Start by creating a digital identity card, lost & found tag, or custom QR code for any purpose.
                    </p>
                    <Link href="/create" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '16px 32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '16px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        transition: 'transform 0.2s'
                    }}>
                        <span style={{ fontSize: '20px' }}>🚀</span>
                        Start Creating
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {categories.map((cat) => (
                        <div key={cat.id}>
                            {/* Category Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px',
                                padding: '0 4px'
                            }}>
                                <h2 style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: 'var(--text-main)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <span style={{ fontSize: '24px' }}>📁</span>
                                    {cat.name}
                                </h2>
                                <span style={{
                                    padding: '6px 14px',
                                    background: 'var(--bg-subtle)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)'
                                }}>
                                    {cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}
                                </span>
                            </div>

                            {/* Items Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '16px'
                            }}>
                                {cat.items.map((item) => (
                                    <Link
                                        href={`/item/${item.id}`}
                                        key={item.id}
                                        style={{
                                            background: 'white',
                                            borderRadius: 'var(--radius-lg)',
                                            padding: '24px',
                                            border: '1px solid var(--border-color)',
                                            boxShadow: 'var(--shadow-sm)',
                                            transition: 'all 0.2s',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px'
                                        }}
                                    >
                                        {/* Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: 'var(--radius-md)',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '28px'
                                            }}>
                                                {item.type === 'LOST' ? '🔍' : item.type === 'ID' ? '🪪' : '✨'}
                                            </div>
                                            {item.status === 'PUBLISHED' && (
                                                <span style={{
                                                    padding: '6px 12px',
                                                    background: '#d1fae5',
                                                    color: '#065f46',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '12px',
                                                    fontWeight: 600
                                                }}>
                                                    ● Active
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h3 style={{
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                marginBottom: '6px',
                                                color: 'var(--text-main)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {item.name}
                                            </h3>
                                            <p style={{
                                                fontSize: '14px',
                                                color: 'var(--text-muted)',
                                                lineHeight: 1.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {item.description || "No description provided."}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div style={{
                                            paddingTop: '16px',
                                            borderTop: '1px solid var(--border-color)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '13px',
                                            color: 'var(--text-muted)',
                                            fontWeight: 500
                                        }}>
                                            <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>View →</span>
                                        </div>
                                    </Link>
                                ))}

                                {/* Add New Card */}
                                <Link
                                    href={`/create?cat=${cat.id}`}
                                    style={{
                                        background: 'transparent',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '24px',
                                        border: '2px dashed var(--border-color)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        minHeight: '220px',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: 'var(--bg-subtle)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px'
                                    }}>
                                        ➕
                                    </div>
                                    <span style={{ fontSize: '15px', fontWeight: 600 }}>
                                        Add to {cat.name}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
