import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';

async function logScan(itemId: number, scannerId: number | null) {
    await prisma.scan.create({
        data: {
            itemId,
            scannerId,
            timestamp: new Date(),
        }
    });
}

export default async function PublicQRPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const itemId = parseInt(id);
    const session = await getSession();



    // Re-fetch with relation if needed or just use separate query. 
    // Schema: Item has categoryId. Category has userId.
    const itemWithUser = await prisma.item.findUnique({
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

    if (!itemWithUser || itemWithUser.status !== 'PUBLISHED') {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h1 className="title">Item Not Found</h1>
                <p>This QR code is either invalid or private.</p>
            </div>
        );
    }

    // Log Scan
    await logScan(itemId, session ? session.userId : null);

    const payload = JSON.parse(itemWithUser.payload);

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>

            {/* Profile / Owner Badge optional */}
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <span>Owned by {itemWithUser.category.user.name}</span>
                {itemWithUser.category.user.isVerified && (
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓ Verified</span>
                )}
            </div>

            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 className="title" style={{ marginBottom: '1.5rem' }}>{itemWithUser.type === 'LOST' ? '⚠️ Lost Item' : itemWithUser.name}</h1>

                {itemWithUser.type === 'ID' && (
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="input-label">Name</label>
                            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{payload.name}</div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="input-label">Phone</label>
                            <div style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                                <a href={`tel:${payload.phone}`}>{payload.phone}</a>
                            </div>
                        </div>
                    </div>
                )}

                {itemWithUser.type === 'LOST' && (
                    <div>
                        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            "{payload.message}"
                        </p>
                        {payload.contact && (
                            <a href={`mailto:${payload.contact}`} className="btn">
                                Contact Owner
                            </a>
                        )}
                    </div>
                )}

                {itemWithUser.type === 'CUSTOM' && (
                    <p style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
                        {payload.content}
                    </p>
                )}

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Scanned via QR Master
                </div>
            </div>
        </div>
    );
}
