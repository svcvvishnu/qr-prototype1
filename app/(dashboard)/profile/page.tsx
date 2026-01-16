import { prisma } from '@/lib/prisma';
import { getSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './form';

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    });

    return (
        <div className="container" style={{ padding: '0', maxWidth: '600px' }}>
            <ProfileForm user={user} />

            <form action={async () => {
                'use server';
                await logout();
                redirect('/login');
            }}>
                <button type="submit" className="btn-secondary" style={{ marginTop: '2rem', width: '100%', borderColor: 'var(--error)', color: 'var(--error)' }}>
                    Log Out
                </button>
            </form>
        </div>
    );
}
