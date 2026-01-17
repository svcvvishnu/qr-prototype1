import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import CreateItemForm from './form';
import { redirect } from 'next/navigation';

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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    marginBottom: '8px',
                    color: 'var(--text-main)'
                }}>
                    Create New QR Code
                </h1>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '15px'
                }}>
                    Generate a unique QR code for your asset or information
                </p>
            </div>
            <CreateItemForm categories={categories} user={user} />
        </div>
    );
}
