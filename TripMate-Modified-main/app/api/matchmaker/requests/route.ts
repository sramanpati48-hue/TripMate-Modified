// API Route: /api/matchmaker/requests
// Handles travel match requests between users

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Fetch user's travel match requests (sent and received)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;

    // Get query parameter for type (sent or received)
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // all, sent, received

    let sentRequests = [];
    let receivedRequests = [];

    if (type === "all" || type === "sent") {
      // Fetch sent requests
      sentRequests = await prisma.travelMatchRequest.findMany({
        where: { senderId: userId },
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (type === "all" || type === "received") {
      // Fetch received requests
      receivedRequests = await prisma.travelMatchRequest.findMany({
        where: { receiverId: userId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(
      {
        sentRequests,
        receivedRequests,
        total: sentRequests.length + receivedRequests.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching travel requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel requests" },
      { status: 500 }
    );
  }
}

// POST: Send a travel match request
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const senderId = payload.userId as string;

    // Parse request body
    const body = await request.json();
    const { receiverId, message, destination, startDate, endDate } = body;

    // Validate required fields
    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    // Can't send request to yourself
    if (senderId === receiverId) {
      return NextResponse.json(
        { error: "Cannot send request to yourself" },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // Check if request already exists
    const existingRequest = await prisma.travelMatchRequest.findFirst({
      where: {
        senderId,
        receiverId,
        destination: destination || null,
        status: { in: ["pending", "accepted"] },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Request already sent to this user for this destination" },
        { status: 409 }
      );
    }

    // Create travel match request
    const travelRequest = await prisma.travelMatchRequest.create({
      data: {
        senderId,
        receiverId,
        message: message || null,
        destination: destination || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: "pending",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Travel request sent successfully",
        request: travelRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending travel request:", error);
    return NextResponse.json(
      { error: "Failed to send travel request" },
      { status: 500 }
    );
  }
}

// PATCH: Update travel request status (accept/reject/cancel)
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;

    // Parse request body
    const body = await request.json();
    const { requestId, status } = body;

    // Validate required fields
    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    if (!["accepted", "rejected", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: accepted, rejected, or cancelled" },
        { status: 400 }
      );
    }

    // Fetch the request
    const travelRequest = await prisma.travelMatchRequest.findUnique({
      where: { id: requestId },
    });

    if (!travelRequest) {
      return NextResponse.json(
        { error: "Travel request not found" },
        { status: 404 }
      );
    }

    // Authorization check
    if (status === "cancelled" && travelRequest.senderId !== userId) {
      return NextResponse.json(
        { error: "Only the sender can cancel the request" },
        { status: 403 }
      );
    }

    if (
      (status === "accepted" || status === "rejected") &&
      travelRequest.receiverId !== userId
    ) {
      return NextResponse.json(
        { error: "Only the receiver can accept or reject the request" },
        { status: 403 }
      );
    }

    // Update request status
    const updatedRequest = await prisma.travelMatchRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: `Travel request ${status} successfully`,
        request: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating travel request:", error);
    return NextResponse.json(
      { error: "Failed to update travel request" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a travel request
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;

    // Get request ID from query params
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Fetch the request
    const travelRequest = await prisma.travelMatchRequest.findUnique({
      where: { id: requestId },
    });

    if (!travelRequest) {
      return NextResponse.json(
        { error: "Travel request not found" },
        { status: 404 }
      );
    }

    // Only sender or receiver can delete
    if (
      travelRequest.senderId !== userId &&
      travelRequest.receiverId !== userId
    ) {
      return NextResponse.json(
        { error: "Unauthorized to delete this request" },
        { status: 403 }
      );
    }

    // Delete the request
    await prisma.travelMatchRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json(
      { message: "Travel request deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting travel request:", error);
    return NextResponse.json(
      { error: "Failed to delete travel request" },
      { status: 500 }
    );
  }
}
