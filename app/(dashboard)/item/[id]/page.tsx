import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ItemEditor from './item-editor';

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

            {/* Header Card with QR */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '32px',
                    alignItems: 'start'
                }}>
                    {/* Info Section */}
                    <div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '8px 16px',
                                background: item.status === 'PUBLISHED' ? '#d1fae5' : '#f3f4f6',
                                color: item.status === 'PUBLISHED' ? '#065f46' : '#374151',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '13px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                {item.status === 'PUBLISHED' ? '●' : '○'} {item.status}
                            </span>
                            <span style={{
                                padding: '8px 16px',
                                background: 'var(--primary-subtle)',
                                color: 'var(--primary)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '13px',
                                fontWeight: 600
                            }}>
                                {item.type === 'ID' ? '🪪 ID Card' : item.type === 'LOST' ? '🔍 Lost & Found' : '✨ Custom'}
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 800,
                            marginBottom: '8px',
                            color: 'var(--text-main)'
                        }}>
                            {item.name}
                        </h1>

                        <p style={{
                            fontSize: '15px',
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '18px' }}>📁</span>
                            {item.category.name}
                        </p>

                        {item.description && (
                            <p style={{
                                fontSize: '15px',
                                color: 'var(--text-muted)',
                                lineHeight: 1.6,
                                marginTop: '16px',
                                padding: '16px',
                                background: 'var(--bg-subtle)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '4px solid var(--primary)'
                            }}>
                                {item.description}
                            </p>
                        )}
                    </div>

                    {/* QR Code Section */}
                    {item.qrCodeUrl && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '24px',
                            background: 'var(--bg-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            border: '2px dashed var(--border-color)'
                        }}>
                            <img
                                src={item.qrCodeUrl}
                                alt="QR Code"
                                style={{
                                    width: '220px',
                                    height: '220px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'white',
                                    padding: '16px',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            />
                            <a
                                href={item.qrCodeUrl}
                                download={`${item.name}-qr.png`}
                                style={{
                                    padding: '12px 24px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                <span>⬇️</span> Download QR Code
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Section */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)'
            }}>
                <ItemEditor item={item} user={user} />
            </div>

            {/* Actions & Scan History */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {/* Quick Actions */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '32px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        marginBottom: '20px',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '20px' }}>⚡</span>
                        Quick Actions
                    </h3>

                    <Link
                        href={`/q/${item.id}`}
                        target="_blank"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            background: 'var(--bg-subtle)',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            color: 'var(--text-main)',
                            fontWeight: 600,
                            fontSize: '15px',
                            transition: 'all 0.2s',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '20px' }}>👁️</span>
                            Preview Public Page
                        </span>
                        <span style={{ color: 'var(--primary)' }}>→</span>
                    </Link>
                </div>

                {/* Scan History */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '32px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        marginBottom: '20px',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '20px' }}>📊</span>
                        Scan History
                    </h3>

                    {item.scans.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: 'var(--text-muted)',
                            fontSize: '14px'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>📭</div>
                            No scans recorded yet
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {item.scans.map((scan) => (
                                <div
                                    key={scan.id}
                                    style={{
                                        padding: '16px',
                                        background: 'var(--bg-subtle)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '14px'
                                    }}
                                >
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                        {/* @ts-ignore */}
                                        {scan.scanner ? scan.scanner.name : (scan.scannerId ? `User #${scan.scannerId}` : 'Anonymous')}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                        {new Date(scan.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
