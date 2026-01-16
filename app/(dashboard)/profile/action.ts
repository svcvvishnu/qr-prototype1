'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function uploadAadhar(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    // In a real app, we would upload to S3/Blob storage.
    // Here we just simulate it by setting a dummy URL string if a file is present.
    const file = formData.get('aadhar') as File;

    if (!file || file.size === 0) {
        return { error: 'Please select a file.' };
    }

    try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update user with "uploaded" status URL (mock)
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                aadharUrl: 'https://via.placeholder.com/300x200?text=Aadhar+Card+Uploaded',
                // Simulate immediate verification for prototype demo
                isVerified: true
            }
        });

        revalidatePath('/profile');
        return { success: 'Documents uploaded successfully. Verification complete!' };

    } catch (e) {
        console.error(e);
        return { error: 'Upload failed.' };
    }
}
