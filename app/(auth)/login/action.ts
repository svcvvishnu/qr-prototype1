'use server';

import { prisma } from '@/lib/prisma';
import { comparePassword, setSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please enter both email and password.' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: 'Invalid credentials.' };
        }

        const passwordsMatch = await comparePassword(password, user.password);

        if (!passwordsMatch) {
            return { error: 'Invalid credentials.' };
        }

        await setSession({ userId: user.id, email: user.email, name: user.name });

    } catch (e) {
        console.error(e);
        return { error: 'Something went wrong. Please try again.' };
    }

    redirect('/');
}
