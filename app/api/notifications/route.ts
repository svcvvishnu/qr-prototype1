import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '20');

        const where = {
            userId: session.userId,
            ...(unreadOnly && { isRead: false })
        };

        const [notifications, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit
            }),
            prisma.notification.count({
                where: {
                    userId: session.userId,
                    isRead: false
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { notificationId, markAllAsRead } = body;

        if (markAllAsRead) {
            // Mark all notifications as read
            await prisma.notification.updateMany({
                where: {
                    userId: session.userId,
                    isRead: false
                },
                data: {
                    isRead: true
                }
            });
        } else if (notificationId) {
            // Mark specific notification as read
            await prisma.notification.updateMany({
                where: {
                    id: parseInt(notificationId),
                    userId: session.userId
                },
                data: {
                    isRead: true
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Notifications updated'
        });

    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json(
            { error: 'Failed to update notifications' },
            { status: 500 }
        );
    }
}
