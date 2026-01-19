import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CategorySection from './CategorySection';
import DashboardWrapper from './DashboardWrapper';

async function getData(userId: number) {
    const [categories, analytics, messages] = await Promise.all([
        prisma.category.findMany({
            where: { userId },
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.analytics.findMany({
            where: {
                item: {
                    category: {
                        userId
                    }
                }
            }
        }),
        prisma.message.count({
            where: {
                receiverId: userId
            }
        })
    ]);

    const totalScans = analytics.reduce((sum, a) => sum + a.totalScans, 0);
    const unreadMessages = await prisma.message.count({
        where: {
            receiverId: userId,
            isRead: false
        }
    });

    return { categories, totalScans, totalMessages: messages, unreadMessages };
}

export default async function DashboardHome() {
    const session = await getSession();
    if (!session) redirect('/login');

    const { categories, totalScans, totalMessages, unreadMessages } = await getData(session.userId);
    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

    return (
        <DashboardWrapper>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Header with Stats */}
                <div className="hover-lift transition-smooth" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                            <div>
                                <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px', color: 'white' }}>
                                    Welcome back, {session.name}! 👋
                                </h1>
                                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                                    Manage your QR codes and track scans
                                </p>
                            </div>
                            <Link href="/profile" className="hover-glow transition-smooth" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'white',
                                color: '#667eea',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: 700,
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                textDecoration: 'none'
                            }}>
                                {session.name ? session.name.charAt(0).toUpperCase() : 'U'}
                            </Link>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
                            <div className="glass transition-smooth hover-lift" style={{
                                borderRadius: 'var(--radius-md)',
                                padding: '16px'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '2px' }}>
                                    {totalItems}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                                    QR Codes
                                </div>
                            </div>
                            <div className="glass transition-smooth hover-lift" style={{
                                borderRadius: 'var(--radius-md)',
                                padding: '16px'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '2px' }}>
                                    {totalScans}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                                    Total Scans
                                </div>
                            </div>
                            <Link href="/messages" className="glass transition-smooth hover-lift" style={{
                                background: unreadMessages > 0 ? 'rgba(239, 68, 68, 0.2)' : undefined,
                                borderRadius: 'var(--radius-md)',
                                padding: '16px',
                                border: unreadMessages > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : undefined,
                                textDecoration: 'none',
                                color: 'white',
                                position: 'relative'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '2px' }}>
                                    {totalMessages}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                                    Messages
                                </div>
                                {unreadMessages > 0 && (
                                    <div className="pulse" style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {unreadMessages > 9 ? '9+' : unreadMessages}
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {categories.length === 0 ? (
                    <div className="scale-in" style={{
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        padding: '80px 32px',
                        textAlign: 'center',
                        border: '2px dashed var(--border-color)',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div className="bounce" style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>✨</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                            Let's Create Your First QR Code
                        </h2>
                        <p style={{ maxWidth: '400px', margin: '0 auto 32px', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            Start by creating a digital identity card, lost & found tag, or custom QR code for any purpose.
                        </p>
                        <Link href="/create" className="hover-lift transition-smooth" style={{
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
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}>
                            <span style={{ fontSize: '20px' }}>🚀</span>
                            Start Creating
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {categories.map((cat, index) => (
                            <div key={cat.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <CategorySection category={cat} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardWrapper>
    );
}
