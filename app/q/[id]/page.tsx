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
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
                <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <h2 style={{ color: 'var(--text-light)' }}>Item Unavailable</h2>
                </div>
            </div>
        );
    }

    // Log Scan (Fire and forget)
    logScan(itemId, null);

    const payload = JSON.parse(item.payload);
    const isLostItem = item.type === 'LOST';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px', paddingBottom: '40px' }}>

            <div style={{ marginBottom: '24px', fontWeight: 800, fontSize: '20px', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                QR<span style={{ color: 'var(--text-main)' }}>Master</span>
            </div>

            <div className="card animate-in" style={{ width: '100%', maxWidth: '420px', padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>

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

                {/* Footer */}
                <div style={{ background: 'var(--bg-subtle)', padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                    Powered by QRMaster • Secure & Private
                </div>

            </div>
        </div>
    );
}
