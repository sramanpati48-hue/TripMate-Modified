// API Route: /api/matchmaker/chat
// Handles private chat messages between matched travel buddies

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// Helper: verify JWT from Authorization header
async function authenticate(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Helper: check if two users have an accepted travel match request
async function hasAcceptedMatch(userA: string, userB: string) {
  const match = await prisma.travelMatchRequest.findFirst({
    where: {
      status: "accepted",
      OR: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA },
      ],
    },
  });
  return !!match;
}

// GET /api/matchmaker/chat
// ?partnerId=xxx -> get messages between current user and partner
// (no partnerId)  -> get list of chat partners (users with accepted requests)
export async function GET(request: NextRequest) {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = payload.userId as string;
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get("partnerId");

    // If no partnerId, return list of chat partners
    if (!partnerId) {
      // Find all accepted requests involving the current user
      const acceptedRequests = await prisma.travelMatchRequest.findMany({
        where: {
          status: "accepted",
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true, city: true, country: true } },
          receiver: { select: { id: true, name: true, avatar: true, city: true, country: true } },
        },
        orderBy: { updatedAt: "desc" },
      });

      // Build a unique list of partners
      const partnersMap = new Map<string, any>();
      for (const req of acceptedRequests) {
        const partner = req.senderId === userId ? req.receiver : req.sender;
        if (!partnersMap.has(partner.id)) {
          // Get the last message between the two
          const lastMessage = await prisma.chatMessage.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: partner.id },
                { senderId: partner.id, receiverId: userId },
              ],
            },
            orderBy: { createdAt: "desc" },
          });

          // Count unread messages from this partner
          const unreadCount = await prisma.chatMessage.count({
            where: {
              senderId: partner.id,
              receiverId: userId,
              read: false,
            },
          });

          partnersMap.set(partner.id, {
            ...partner,
            lastMessage: lastMessage?.content || null,
            lastMessageTime: lastMessage?.createdAt || req.updatedAt,
            unreadCount,
            destination: req.destination,
          });
        }
      }

      const partners = Array.from(partnersMap.values()).sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

      return NextResponse.json({ partners }, { status: 200 });
    }

    // partnerId provided – return messages between current user and partner
    const isMatched = await hasAcceptedMatch(userId, partnerId);
    if (!isMatched) {
      return NextResponse.json(
        { error: "You can only chat with accepted travel buddies" },
        { status: 403 }
      );
    }

    // Mark messages from partner as read
    await prisma.chatMessage.updateMany({
      where: { senderId: partnerId, receiverId: userId, read: false },
      data: { read: true },
    });

    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error in chat GET:", error);
    return NextResponse.json({ error: "Failed to fetch chat data" }, { status: 500 });
  }
}

// POST /api/matchmaker/chat
// Body: { receiverId, content }
export async function POST(request: NextRequest) {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const senderId = payload.userId as string;
    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content?.trim()) {
      return NextResponse.json(
        { error: "Receiver ID and message content are required" },
        { status: 400 }
      );
    }

    if (senderId === receiverId) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    // Verify accepted match exists
    const isMatched = await hasAcceptedMatch(senderId, receiverId);
    if (!isMatched) {
      return NextResponse.json(
        { error: "You can only chat with accepted travel buddies" },
        { status: 403 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        content: content.trim(),
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error in chat POST:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
