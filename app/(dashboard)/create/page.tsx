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
        <div className="container">
            <h1 className="title">Create New QR Code</h1>
            <CreateItemForm categories={categories} user={user} />
        </div>
    );
}
