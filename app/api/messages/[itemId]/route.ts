import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { itemId } = await params;

        // Verify user owns the item
        const item = await prisma.item.findUnique({
            where: { id: parseInt(itemId) },
            include: {
                category: {
                    select: { userId: true }
                }
            }
        });

        if (!item || item.category.userId !== session.userId) {
            return NextResponse.json(
                { error: 'Item not found or unauthorized' },
                { status: 404 }
            );
        }

        // Fetch all messages for this item
        const messages = await prisma.message.findMany({
            where: {
                itemId: parseInt(itemId),
                receiverId: session.userId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        isVerified: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Mark messages as read
        await prisma.message.updateMany({
            where: {
                itemId: parseInt(itemId),
                receiverId: session.userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });

        return NextResponse.json({
            success: true,
            messages: messages.map(msg => ({
                id: msg.id,
                content: msg.content,
                senderName: msg.sender?.name || msg.senderName || 'Anonymous',
                senderContact: msg.senderContact,
                senderVerified: msg.sender?.isVerified || false,
                isAnonymous: !msg.senderId,
                isRead: msg.isRead,
                createdAt: msg.createdAt
            }))
        });

    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}
