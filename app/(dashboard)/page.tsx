import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CategorySection from './CategorySection';

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {categories.map((cat) => (
                        <CategorySection key={cat.id} category={cat} />
                    ))}
                </div>
            )}
        </div>
    );
}
