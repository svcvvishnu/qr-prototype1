import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ItemEditor from './item-editor';
import ItemTabs from './ItemTabs';
import QRTypeTabs from './QRTypeTabs';

async function getItem(id: number, userId: number) {
    const item = await prisma.item.findUnique({
        where: { id },
        include: {
            category: true,
            scans: {
                orderBy: { timestamp: 'desc' },
                take: 10,
                include: {
                    scanner: { select: { name: true } }
                }
            },
            messages: {
                where: {
                    OR: [
                        { receiverId: userId }, // Messages received by this user
                        { senderId: userId }     // Messages sent by this user
                    ]
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: { name: true, isVerified: true }
                    },
                    receiver: {
                        select: { name: true, isVerified: true }
                    }
                }
            }
        }
    });

    if (!item || item.category.userId !== userId) return null;
    return item;
}

async function getUser(userId: number) {
    return await prisma.user.findUnique({
        where: { id: userId },
    });
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { id } = await params;

    const [item, user] = await Promise.all([
        getItem(parseInt(id), session.userId),
        getUser(session.userId)
    ]);

    if (!item) notFound();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            {/* Compact Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <Link href="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    textDecoration: 'none'
                }}>
                    ← Back
                </Link>
            </div>

            {/* Hero Section - Compact with Stats */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative blob */}
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
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{
                            padding: '4px 10px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            {item.status}
                        </span>
                        <span style={{
                            padding: '4px 10px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            {item.type === 'ID' ? '🪪 ID' : item.type === 'LOST' ? '🔍 Lost' : '✨ Custom'}
                        </span>
                        {/* Compact Stats Badges */}
                        <span style={{
                            padding: '4px 10px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            �️ {item.scans.length}
                        </span>
                        <span style={{
                            padding: '4px 10px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            💬 {item.messages.length}
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '6px'
                    }}>
                        {item.name}
                    </h1>

                    <p style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: item.description ? '12px' : '0'
                    }}>
                        📁 {item.category.name}
                    </p>

                    {item.description && (
                        <p style={{
                            fontSize: '13px',
                            color: 'rgba(255, 255, 255, 0.85)',
                            lineHeight: 1.5,
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            {item.description}
                        </p>
                    )}
                </div>
            </div>

            {/* QR Code Section - Compact */}
            {item.qrCodeUrl && (
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <img
                        src={item.qrCodeUrl}
                        alt="QR Code"
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: 'var(--radius-md)',
                            flexShrink: 0
                        }}
                    />
                    <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                        <a
                            href={item.qrCodeUrl}
                            download={`${item.name}-qr.png`}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            <span>⬇️</span> Download
                        </a>
                        <Link
                            href={`/q/${item.id}`}
                            target="_blank"
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                background: 'white',
                                color: 'var(--primary)',
                                border: '2px solid var(--primary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            <span>👁️</span> Preview
                        </Link>
                    </div>
                </div>
            )}

            {/* QR Type Editor - Editable Tabs */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                padding: '20px',
                marginBottom: '16px'
            }}>
                <ItemEditor item={item} user={user} />
            </div>

            {/* Scan History & Messages Tabs */}
            <ItemTabs
                scans={item.scans}
                messages={item.messages}
                itemId={item.id}
                currentUserId={session.userId}
            />
        </div>
    );
}
