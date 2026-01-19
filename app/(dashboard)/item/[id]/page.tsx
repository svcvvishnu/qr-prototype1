import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ItemEditor from './item-editor';
import ScanHistory from './ScanHistory';

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
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Back Button */}
            <Link href="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--text-muted)',
                fontWeight: 600,
                textDecoration: 'none',
                width: 'fit-content'
            }}>
                <span>←</span> Back to Dashboard
            </Link>

            {/* Main Content - Two Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                alignItems: 'start'
            }}>
                {/* Left Column - Info & QR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Header Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '6px 12px',
                                background: item.status === 'PUBLISHED' ? '#d1fae5' : '#f3f4f6',
                                color: item.status === 'PUBLISHED' ? '#065f46' : '#374151',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                {item.status === 'PUBLISHED' ? '●' : '○'} {item.status}
                            </span>
                            <span style={{
                                padding: '6px 12px',
                                background: 'var(--primary-subtle)',
                                color: 'var(--primary)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '12px',
                                fontWeight: 600
                            }}>
                                {item.type === 'ID' ? '🪪 ID' : item.type === 'LOST' ? '🔍 Lost' : '✨ Custom'}
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            marginBottom: '6px',
                            color: 'var(--text-main)'
                        }}>
                            {item.name}
                        </h1>

                        <p style={{
                            fontSize: '14px',
                            color: 'var(--text-muted)',
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span style={{ fontSize: '16px' }}>📁</span>
                            {item.category.name}
                        </p>

                        {item.description && (
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                                lineHeight: 1.5,
                                marginTop: '12px',
                                padding: '12px',
                                background: 'var(--bg-subtle)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '3px solid var(--primary)'
                            }}>
                                {item.description}
                            </p>
                        )}
                    </div>

                    {/* QR Code Card */}
                    {item.qrCodeUrl && (
                        <div style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <img
                                src={item.qrCodeUrl}
                                alt="QR Code"
                                style={{
                                    width: '180px',
                                    height: '180px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'white',
                                    padding: '12px',
                                    boxShadow: 'var(--shadow-sm)',
                                    border: '1px solid var(--border-color)'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
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
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        boxShadow: 'var(--shadow-sm)'
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

                    {/* Scan History - Collapsible */}
                    <ScanHistory scans={item.scans} />

                    {/* Messages Section */}
                    {item.messages && item.messages.length > 0 && (
                        <div style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: 700,
                                marginBottom: '16px',
                                color: 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                💬 Messages ({item.messages.length})
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {item.messages.map((message) => (
                                    <div key={message.id} style={{
                                        padding: '12px',
                                        background: message.isRead ? 'var(--bg-subtle)' : '#eff6ff',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: message.isRead ? '3px solid var(--border-color)' : '3px solid var(--primary)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: 'var(--text-main)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                {message.sender?.name || message.senderName || 'Anonymous'}
                                                {message.sender?.isVerified && (
                                                    <span style={{ fontSize: '14px', color: 'var(--primary)' }}>✓</span>
                                                )}
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: 'var(--text-light)'
                                            }}>
                                                {new Date(message.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                        <p style={{
                                            fontSize: '14px',
                                            color: 'var(--text-main)',
                                            lineHeight: 1.5,
                                            marginBottom: message.senderContact ? '8px' : '0'
                                        }}>
                                            {message.content}
                                        </p>
                                        {message.senderContact && (
                                            <div style={{
                                                fontSize: '12px',
                                                color: 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                marginTop: '8px',
                                                padding: '8px',
                                                background: 'white',
                                                borderRadius: 'var(--radius-sm)'
                                            }}>
                                                📧 {message.senderContact}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Editor */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                    position: 'sticky',
                    top: '20px'
                }}>
                    <ItemEditor item={item} user={user} />
                </div>
            </div>
        </div>
    );
}
