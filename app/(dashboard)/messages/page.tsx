import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getMessages(userId: number) {
    // Get all items owned by the user with their messages
    const items = await prisma.item.findMany({
        where: {
            category: {
                userId
            }
        },
        include: {
            messages: {
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: {
                            name: true,
                            isVerified: true
                        }
                    }
                }
            },
            category: true
        }
    });

    // Filter items that have messages
    return items.filter(item => item.messages.length > 0);
}

export default async function MessagesPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const itemsWithMessages = await getMessages(session.userId);
    const totalMessages = itemsWithMessages.reduce((sum, item) => sum + item.messages.length, 0);
    const unreadMessages = itemsWithMessages.reduce(
        (sum, item) => sum + item.messages.filter(m => !m.isRead).length,
        0
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'white' }}>
                    💬 Messages
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '16px' }}>
                    Messages from people who scanned your QR codes
                </p>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '2px' }}>
                            {totalMessages}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                            Total Messages
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '2px' }}>
                            {unreadMessages}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                            Unread
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            {itemsWithMessages.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '80px 32px',
                    textAlign: 'center',
                    border: '2px dashed var(--border-color)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>📭</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                        No Messages Yet
                    </h2>
                    <p style={{ maxWidth: '400px', margin: '0 auto 32px', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        When someone scans your QR codes and sends you a message, they'll appear here.
                    </p>
                    <Link href="/" style={{
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
                        Go to Dashboard
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {itemsWithMessages.map((item) => (
                        <div key={item.id} style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {/* Item Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: '16px',
                                paddingBottom: '16px',
                                borderBottom: '1px solid var(--border-color)'
                            }}>
                                <div>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        marginBottom: '4px',
                                        color: 'var(--text-main)'
                                    }}>
                                        {item.name}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        📁 {item.category.name}
                                    </p>
                                </div>
                                <Link
                                    href={`/item/${item.id}`}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'var(--primary-subtle)',
                                        color: 'var(--primary)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        textDecoration: 'none'
                                    }}
                                >
                                    View Item →
                                </Link>
                            </div>

                            {/* Messages */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {item.messages.slice(0, 3).map((message) => (
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
                                                    <span style={{ fontSize: '14px' }}>✓</span>
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
                                                gap: '4px'
                                            }}>
                                                📧 {message.senderContact}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {item.messages.length > 3 && (
                                    <Link
                                        href={`/item/${item.id}`}
                                        style={{
                                            fontSize: '13px',
                                            color: 'var(--primary)',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                            padding: '8px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        View all {item.messages.length} messages →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
