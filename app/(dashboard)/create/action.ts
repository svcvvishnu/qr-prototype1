'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import QRCode from 'qrcode';

export async function createItem(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const categoryIdOrNew = formData.get('category') as string;
    const newCategoryName = formData.get('newCategoryName') as string;
    const type = formData.get('type') as string;

    // Payload fields based on type
    const payloadData: any = {};
    if (type === 'ID') {
        payloadData.name = formData.get('payload_name');
        payloadData.phone = formData.get('payload_phone');
    } else if (type === 'LOST') {
        payloadData.message = formData.get('payload_message');
        payloadData.contact = formData.get('payload_contact'); // Allow reply/contact
    } else {
        // Custom
        payloadData.content = formData.get('payload_content');
    }

    if (!name || !type) {
        return { error: 'Name and Type are required.' };
    }

    try {
        let categoryId: number;

        if (categoryIdOrNew === 'new') {
            if (!newCategoryName) return { error: 'New Category Name is required.' };
            const cat = await prisma.category.create({
                data: {
                    name: newCategoryName,
                    userId: session.userId,
                },
            });
            categoryId = cat.id;
        } else {
            categoryId = parseInt(categoryIdOrNew);
        }

        // 1. Create Item first to get ID
        const item = await prisma.item.create({
            data: {
                name,
                description,
                categoryId,
                type,
                status: 'DRAFT',
                payload: JSON.stringify(payloadData),
            },
        });

        // 2. Generate QR Code containing the public URL
        // For prototype, assuming localhost or deployed URL.
        // Ideally use an ENV var for BASE_URL.
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const publicUrl = `${baseUrl}/q/${item.id}`;

        const qrCodeDataUri = await QRCode.toDataURL(publicUrl);

        // 3. Update Item with QR Code
        await prisma.item.update({
            where: { id: item.id },
            data: {
                qrCodeUrl: qrCodeDataUri,
                status: 'PUBLISHED', // Auto publish for now
            },
        });

    } catch (e) {
        console.error(e);
        return { error: 'Failed to create item.' };
    }

    redirect('/');
}
