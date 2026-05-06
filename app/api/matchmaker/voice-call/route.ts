import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const userId = verifyToken(token);

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, action, offer, answer, candidate } = body;

    // Validate required fields
    if (!receiverId) {
      return NextResponse.json({ error: 'Receiver ID is required' }, { status: 400 });
    }

    // Check if both users exist
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Store signaling data (in production, use WebSocket for real-time)
    // This is a simplified implementation using REST polling
    // For production, consider using Pusher, Socket.io, or similar services

    switch (action) {
      case 'initiate':
        // Store the offer from caller
        // In production, you would send a real-time notification here
        console.log(`Voice call initiated from ${userId} to ${receiverId}`);
        console.log('Offer:', offer);

        // You could store this in a temporary collection or cache
        // and send a notification to the receiver
        break;

      case 'answer':
        // Store the answer from receiver
        console.log(`Voice call answered by ${receiverId}`);
        console.log('Answer:', answer);
        break;

      case 'ice-candidate':
        // Store ICE candidates for NAT traversal
        console.log(`ICE candidate from ${userId}:`, candidate);
        break;

      case 'end':
        // Clean up call data
        console.log(`Voice call ended between ${userId} and ${receiverId}`);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Voice call error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice call' },
      { status: 500 }
    );
  }
}
