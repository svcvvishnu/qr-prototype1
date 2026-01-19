import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import CreateItemForm from './form';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function getCategories(userId: number) {
    return await prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
    });
}

async function getUser(userId: number) {
    return await prisma.user.findUnique({
        where: { id: userId },
    });
}

export default async function CreateItemPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const [categories, user] = await Promise.all([
        getCategories(session.userId),
        getUser(session.userId)
    ]);

    return (
        <div className="page-enter" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* Modern Hero Section */}
            <div className="fade-in-up" style={{
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-colored)'
            }}>
                {/* Decorative blob */}
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(40px)'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Back button */}
                    <Link href="/" className="transition-smooth" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        fontWeight: 600,
                        marginBottom: '16px',
                        textDecoration: 'none'
                    }}>
                        ← Back to Dashboard
                    </Link>

                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        marginBottom: '8px',
                        color: 'white'
                    }}>
                        Create New QR Code 🚀
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '15px',
                        lineHeight: 1.5
                    }}>
                        Generate a unique QR code for your asset or information
                    </p>
                </div>
            </div>

            <CreateItemForm categories={categories} user={user} />
        </div>
    );
}
