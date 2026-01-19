import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: 'You must be logged in to reply to messages' },
                { status: 401 }
            );
        }

        const { content, parentMessageId, itemId } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: 'Message content is required' },
                { status: 400 }
            );
        }

        if (!parentMessageId || !itemId) {
            return NextResponse.json(
                { error: 'Parent message ID and item ID are required' },
                { status: 400 }
            );
        }

        // Get the parent message to find the thread
        const parentMessage = await prisma.message.findUnique({
            where: { id: parseInt(parentMessageId) },
            include: { item: { include: { category: true } } }
        });

        if (!parentMessage) {
            return NextResponse.json(
                { error: 'Parent message not found' },
                { status: 404 }
            );
        }

        // Verify user is either the sender or receiver of the parent message
        const isParticipant =
            parentMessage.senderId === session.userId ||
            parentMessage.receiverId === session.userId;

        if (!isParticipant) {
            return NextResponse.json(
                { error: 'You are not authorized to reply to this message' },
                { status: 403 }
            );
        }

        // Determine receiver (the other person in the conversation)
        const receiverId = parentMessage.senderId === session.userId
            ? parentMessage.receiverId
            : parentMessage.senderId;

        if (!receiverId) {
            return NextResponse.json(
                { error: 'Cannot reply to anonymous messages' },
                { status: 400 }
            );
        }

        // Use existing threadId or create new one
        const threadId = parentMessage.threadId || `thread_${parentMessage.id}_${Date.now()}`;

        // Create the reply
        const reply = await prisma.message.create({
            data: {
                content: content.trim(),
                itemId: parseInt(itemId),
                senderId: session.userId,
                receiverId,
                threadId,
                parentMessageId: parseInt(parentMessageId),
                isRead: false
            },
            include: {
                sender: {
                    select: { name: true, isVerified: true }
                }
            }
        });

        // Update parent message with threadId if it didn't have one
        if (!parentMessage.threadId) {
            await prisma.message.update({
                where: { id: parseInt(parentMessageId) },
                data: { threadId }
            });
        }

        // Create notification for receiver
        await prisma.notification.create({
            data: {
                userId: receiverId,
                type: 'MESSAGE',
                title: 'New Reply',
                content: `${session.name} replied to your message`,
                relatedItemId: parseInt(itemId)
            }
        });

        return NextResponse.json({
            success: true,
            message: reply
        });

    } catch (error: any) {
        console.error('Reply error:', error);
        return NextResponse.json(
            { error: 'Failed to send reply' },
            { status: 500 }
        );
    }
}
