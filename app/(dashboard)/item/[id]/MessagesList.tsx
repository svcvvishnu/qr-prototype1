'use client';

import { useState } from 'react';
import ReplyForm from './ReplyForm';

interface Message {
    id: number;
    content: string;
    createdAt: Date;
    isRead: boolean;
    senderId: number | null;
    receiverId: number;
    senderName: string | null;
    senderContact: string | null;
    sender: {
        name: string;
        isVerified: boolean;
    } | null;
    receiver: {
        name: string;
        isVerified: boolean;
    } | null;
}

interface MessagesListProps {
    messages: Message[];
    itemId: number;
    currentUserId: number;
}

export default function MessagesList({ messages, itemId, currentUserId }: MessagesListProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((message) => {
                // Determine if this is a sent or received message
                const isSentByCurrentUser = message.senderId === currentUserId;
                const otherUser = isSentByCurrentUser ? message.receiver : message.sender;
                const otherUserId = isSentByCurrentUser ? message.receiverId : message.senderId;

                // Can reply if message is from a logged-in user and not sent by current user
                const canReply = !isSentByCurrentUser && message.senderId !== null;

                return (
                    <div key={message.id} style={{
                        padding: '12px',
                        background: isSentByCurrentUser
                            ? '#f0f9ff' // Light blue for sent messages
                            : (message.isRead ? 'var(--bg-subtle)' : '#eff6ff'),
                        borderRadius: 'var(--radius-md)',
                        borderLeft: isSentByCurrentUser
                            ? '3px solid #0ea5e9' // Blue for sent
                            : (message.isRead ? '3px solid var(--border-color)' : '3px solid var(--primary)')
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                {isSentByCurrentUser ? (
                                    <span style={{ color: '#0ea5e9' }}>You → {otherUser?.name || 'User'}</span>
                                ) : (
                                    <>
                                        {otherUser?.name || message.senderName || 'Anonymous'}
                                        {otherUser?.isVerified && (
                                            <span style={{ fontSize: '14px' }}>✓</span>
                                        )}
                                    </>
                                )}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-light)'
                            }}>
                                {new Date(message.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--text-main)',
                            lineHeight: 1.5,
                            marginBottom: message.senderContact ? '8px' : '0'
                        }}>
                            {message.content}
                        </p>
                        {message.senderContact && (
                            <div style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginBottom: '8px'
                            }}>
                                📧 {message.senderContact}
                            </div>
                        )}

                        {/* Reply Button */}
                        {canReply && (
                            <ReplyForm
                                messageId={message.id}
                                itemId={itemId}
                                senderName={otherUser?.name || 'User'}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
