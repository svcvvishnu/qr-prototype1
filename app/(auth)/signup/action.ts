'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword, setSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function signup(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !mobile || !password) {
        return { error: 'All fields are required.' };
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { mobile }],
            },
        });

        if (existingUser) {
            return { error: 'User with this email or mobile already exists.' };
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                mobile,
                password: hashedPassword,
            },
        });

        await setSession({ userId: user.id, email: user.email, name: user.name });

    } catch (e) {
        console.error(e);
        return { error: 'Something went wrong. Please try again.' };
    }

    redirect('/');
}
