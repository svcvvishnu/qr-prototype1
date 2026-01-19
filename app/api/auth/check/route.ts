import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await getSession();

        if (session) {
            return NextResponse.json({
                authenticated: true,
                userId: session.userId,
                name: session.name,
                email: session.email
            });
        }

        return NextResponse.json({ authenticated: false });
    } catch (error) {
        return NextResponse.json({ authenticated: false });
    }
}
