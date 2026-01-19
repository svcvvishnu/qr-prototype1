import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import MessageForm from '@/app/components/MessageForm';

async function logScan(itemId: number, scannerId: number | null) {
    try {
        await prisma.scan.create({
            data: {
                itemId,
                scannerId,
                timestamp: new Date(),
            }
        });

        // Update analytics
        const analytics = await prisma.analytics.findUnique({
            where: { itemId }
        });

        if (analytics) {
            await prisma.analytics.update({
                where: { itemId },
                data: {
                    totalScans: { increment: 1 },
                    lastScannedAt: new Date()
                }
            });
        } else {
            await prisma.analytics.create({
                data: {
                    itemId,
                    totalScans: 1,
                    uniqueScanners: 0,
                    messageCount: 0,
                    lastScannedAt: new Date()
                }
            });
        }
    } catch (e) {
        console.error("Scan logging failed", e);
    }
}

export default async function PublicQRPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const itemId = parseInt(id);

    const [item, analytics] = await Promise.all([
        prisma.item.findUnique({
            where: { id: itemId },
            include: {
                category: {
                    include: {
                        user: {
                            select: { name: true, isVerified: true }
                        }
                    }
                }
            }
        }),
        prisma.analytics.findUnique({
            where: { itemId }
        })
    ]);

    if (!item || item.status !== 'PUBLISHED') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
                <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <h2 style={{ color: 'var(--text-light)' }}>Item Unavailable</h2>
                </div>
            </div>
        );
    }

    // Log Scan (Fire and forget), BUT skip if owner
    const session = await getSession();
    const isOwner = session && session.userId === item.category.userId;

    if (!isOwner) {
        logScan(itemId, session?.userId || null);
    }

    const payload = JSON.parse(item.payload);
    const isLostItem = item.type === 'LOST';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', paddingBottom: '40px', padding: '40px 20px' }}>

            <div style={{ marginBottom: '24px', fontWeight: 800, fontSize: '20px', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                QR<span style={{ color: 'var(--text-main)' }}>Master</span>
            </div>

            <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Main Card */}
                <div className="card animate-in" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>

                    {/* Verification Status Banner */}
                    {item.category.user.isVerified && (
                        <div style={{ background: 'var(--status-success-bg)', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: 'var(--status-success-text)', fontWeight: 600 }}>
                            <span>✓ Verified Owner</span>
                        </div>
                    )}

                    {/* Hero Section */}
                    <div style={{
                        padding: '40px 32px',
                        textAlign: 'center',
                        background: isLostItem ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' : 'white'
                    }}>
                        <div style={{ fontSize: '56px', marginBottom: '16px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                            {isLostItem ? '🚨' : item.type === 'ID' ? '👋' : '📦'}
                        </div>
                        <h1 style={{ fontSize: '28px', marginBottom: '8px', color: isLostItem ? '#92400e' : 'var(--text-main)' }}>
                            {isLostItem ? "I'm Lost." : item.name}
                        </h1>
                        <p style={{ color: isLostItem ? '#b45309' : 'var(--text-muted)' }}>
                            {isLostItem ? "Please help me get back home." : "Scan successful."}
                        </p>
                    </div>

                    {/* Content Body */}
                    <div style={{ padding: '32px' }}>

                        {/* Owner badge */}
                        <div className="flex-center" style={{ marginBottom: '32px' }}>
                            <span className="badge badge-neutral" style={{ padding: '8px 16px' }}>
                                Owned by {item.category.user.name}
                            </span>
                        </div>

                        <div className="flex-col gap-4">
                            {isLostItem && (
                                <>
                                    <blockquote style={{
                                        fontSize: '16px',
                                        lineHeight: '1.6',
                                        color: 'var(--text-main)',
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        "{payload.message}"
                                    </blockquote>

                                    {payload.phone && (
                                        <a href={`tel:${payload.phone}`} className="btn btn-primary" style={{ height: '52px', fontSize: '16px' }}>
                                            📞 Call Owner Now
                                        </a>
                                    )}
                                </>
                            )}

                            {item.type === 'ID' && (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 600 }}>{payload.name}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>{payload.phone}</div>
                                    </div>
                                    <div className="flex-center gap-2">
                                        <a href={`tel:${payload.phone}`} className="btn btn-secondary" style={{ flex: 1 }}>
                                            Call
                                        </a>
                                        <a href={`sms:${payload.phone}`} className="btn btn-secondary" style={{ flex: 1 }}>
                                            Message
                                        </a>
                                    </div>
                                </>
                            )}

                            {item.type === 'CUSTOM' && (
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-main)' }}>
                                    {payload.content}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Stats Section */}
                    {analytics && (
                        <div style={{
                            background: 'var(--bg-subtle)',
                            padding: '16px 32px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px',
                            borderTop: '1px solid var(--border-color)'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {analytics.totalScans}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    Total Scans
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {analytics.messageCount}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    Messages
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ background: 'var(--bg-subtle)', padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                        Powered by QRMaster • Secure & Private
                    </div>

                </div>

                {/* Message Form - Only show if not owner */}
                {!isOwner && (
                    <MessageForm itemId={itemId} itemName={item.name} />
                )}

                {/* Owner Notice */}
                {isOwner && (
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        padding: '20px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>👤</div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                            This is your item. Scans from you are not logged.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
