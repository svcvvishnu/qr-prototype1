import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

async function logScan(itemId: number, scannerId: number | null) {
    try {
        await prisma.scan.create({
            data: {
                itemId,
                scannerId,
                timestamp: new Date(),
            }
        });
    } catch (e) {
        console.error("Scan logging failed", e);
    }
}

export default async function PublicQRPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const itemId = parseInt(id);
    const session = await getSession();

    const item = await prisma.item.findUnique({
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
    });

    if (!item || item.status !== 'PUBLISHED') {
        return (
            <div className="public-wrapper">
                <div className="card public-card">
                    <h1 style={{ color: 'var(--status-error-text)' }}>Item Not Found</h1>
                    <p>This item is private or does not exist.</p>
                </div>
            </div>
        );
    }

    // Log Scan
    await logScan(itemId, session ? session.userId : null);

    const payload = JSON.parse(item.payload);
    const isLostItem = item.type === 'LOST';

    return (
        <div className="public-wrapper">

            <div style={{ marginBottom: '24px', fontWeight: 700, color: 'var(--text-light)', fontSize: '14px', letterSpacing: '0.05em' }}>
                QR MASTER VERIFIED
            </div>

            <div className="card public-card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Header Banner */}
                <div style={{
                    backgroundColor: isLostItem ? 'var(--status-warning-bg)' : 'var(--primary)',
                    padding: '32px 20px',
                    color: isLostItem ? 'var(--status-warning-text)' : 'white'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        {isLostItem ? '⚠️' : item.type === 'ID' ? '🪪' : '📦'}
                    </div>
                    <h1 style={{ color: 'inherit', marginBottom: '8px' }}>
                        {isLostItem ? "Help! I am Lost." : item.name}
                    </h1>
                    {isLostItem && <p style={{ color: 'inherit', opacity: 0.9 }}>Please help return this item to its owner.</p>}
                </div>

                {/* Content Body */}
                <div style={{ padding: '32px 24px', textAlign: 'left' }}>

                    {/* Owner Info */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                        <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>Owned by</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.category.user.name}</span>
                        {item.category.user.isVerified && (
                            <span style={{ marginLeft: '6px', color: 'var(--primary)', fontSize: '16px' }}>✓</span>
                        )}
                    </div>

                    {/* Dynamic Content */}
                    {item.type === 'ID' && (
                        <div className="flex-col gap-4">
                            <div>
                                <div className="label">Full Name</div>
                                <div style={{ fontSize: '18px', fontWeight: 500 }}>{payload.name}</div>
                            </div>
                            <div>
                                <div className="label">Contact</div>
                                <a href={`tel:${payload.phone}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                                    📞 {payload.phone}
                                </a>
                            </div>
                        </div>
                    )}

                    {item.type === 'LOST' && (
                        <div>
                            <div style={{
                                backgroundColor: '#fffbeb',
                                borderLeft: '4px solid #f59e0b',
                                padding: '16px',
                                borderRadius: '4px',
                                marginBottom: '24px',
                                color: '#92400e',
                                fontStyle: 'italic'
                            }}>
                                "{payload.message}"
                            </div>

                            <div className="label">Contact Owner</div>
                            <div className="flex-col gap-2">
                                {payload.phone && (
                                    <a href={`tel:${payload.phone}`} className="btn btn-primary" style={{ width: '100%' }}>
                                        Call {payload.phone}
                                    </a>
                                )}
                                {payload.contact && payload.contact.includes('@') && (
                                    <a href={`mailto:${payload.contact}`} className="btn btn-secondary" style={{ width: '100%' }}>
                                        Email {payload.contact}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {item.type === 'CUSTOM' && (
                        <div style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                            {payload.content}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
