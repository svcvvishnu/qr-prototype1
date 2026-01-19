import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { itemId, content, senderName, senderContact } = body;

        // Validate required fields
        if (!itemId || !content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Item ID and message content are required' },
                { status: 400 }
            );
        }

        // Check if item exists and is published
        const item = await prisma.item.findUnique({
            where: { id: parseInt(itemId) },
            include: {
                category: {
                    select: { userId: true }
                }
            }
        });

        if (!item || item.status !== 'PUBLISHED') {
            return NextResponse.json(
                { error: 'Item not found or not published' },
                { status: 404 }
            );
        }

        const receiverId = item.category.userId;

        // Get session to check if user is logged in
        const session = await getSession();
        const senderId = session?.userId || null;

        // Prevent owner from messaging themselves
        if (senderId === receiverId) {
            return NextResponse.json(
                { error: 'You cannot send messages to your own items' },
                { status: 400 }
            );
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                itemId: parseInt(itemId),
                senderId,
                receiverId,
                senderName: senderId ? null : senderName?.trim() || 'Anonymous',
                senderContact: senderId ? null : senderContact?.trim() || null,
            }
        });

        // Create notification for the receiver
        await prisma.notification.create({
            data: {
                userId: receiverId,
                type: 'MESSAGE',
                title: 'New Message',
                content: `You have a new message about "${item.name}"`,
                relatedItemId: parseInt(itemId),
            }
        });

        // Update analytics
        await prisma.analytics.upsert({
            where: { itemId: parseInt(itemId) },
            update: {
                messageCount: { increment: 1 }
            },
            create: {
                itemId: parseInt(itemId),
                messageCount: 1,
                totalScans: 0,
                uniqueScanners: 0,
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
            messageId: message.id
        });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
