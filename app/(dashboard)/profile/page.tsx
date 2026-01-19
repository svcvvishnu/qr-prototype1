import { prisma } from '@/lib/prisma';
import { getSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './form';
import LogoutButton from './LogoutButton';

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    });

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    marginBottom: '6px',
                    color: 'var(--text-main)'
                }}>
                    Profile
                </h1>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '14px'
                }}>
                    Manage your account settings and preferences
                </p>
            </div>
            <ProfileForm user={user} />

            <form action={async () => {
                'use server';
                await logout();
                redirect('/login');
            }} style={{ marginTop: '24px' }}>
                <LogoutButton action={async () => {
                    'use server';
                    await logout();
                    redirect('/login');
                }} />
            </form>
        </div>
    );
}
