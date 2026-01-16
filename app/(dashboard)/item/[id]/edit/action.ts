'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import QRCode from 'qrcode';

export async function updateItem(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const id = parseInt(formData.get('id') as string);
    const categoryId = parseInt(formData.get('category') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;

    // Payload fields based on type
    const payloadData: any = {};
    if (type === 'ID') {
        payloadData.name = formData.get('payload_name');
        payloadData.phone = formData.get('payload_phone');
    } else if (type === 'LOST') {
        payloadData.message = formData.get('payload_message');
        payloadData.contact = formData.get('payload_contact');
    } else {
        // Custom
        payloadData.content = formData.get('payload_content');
    }

    if (!type || !id) {
        return { error: 'Type and ID are required.' };
    }

    try {
        // Verify ownership
        const existingItem = await prisma.item.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!existingItem || existingItem.category.userId !== session.userId) {
            return { error: 'Item not found or unauthorized.' };
        }

        // Regenerate QR Code to ensure URL is up to date (e.g. if BASE_URL changes)
        const baseUrl = process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        const publicUrl = `${baseUrl}/q/${id}`;
        const qrCodeDataUri = await QRCode.toDataURL(publicUrl);

        await prisma.item.update({
            where: { id },
            data: {
                name,
                description,
                categoryId,
                type,
                payload: JSON.stringify(payloadData),
                qrCodeUrl: qrCodeDataUri
            },
        });

    } catch (e) {
        console.error(e);
        return { error: 'Failed to update item.' };
    }

    redirect(`/item/${id}`);
}
