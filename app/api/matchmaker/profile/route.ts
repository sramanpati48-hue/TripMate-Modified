// API Route: /api/matchmaker/profile
// Handles creating/updating user's travel profile for matchmaking

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Fetch user's travel profile
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

    // Fetch travel profile
    const profile = await prisma.travelProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Travel profile not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const profileData = {
      ...profile,
      interests: profile.interests ? JSON.parse(profile.interests) : [],
      destinations: profile.destinations ? JSON.parse(profile.destinations) : [],
      languages: profile.languages ? JSON.parse(profile.languages) : [],
      availability: profile.availability ? JSON.parse(profile.availability) : null,
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Error fetching travel profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel profile" },
      { status: 500 }
    );
  }
}

// POST: Create or update travel profile
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/matchmaker/profile - Start");
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing authorization header");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      console.error("Invalid or expired token");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;
    console.log("Authenticated userId:", userId);

    // Parse request body
    const body = await request.json();
    console.log("Request body received:", {
      ...body,
      avatar: body.avatar ? `${body.avatar.substring(0, 50)}...` : null,
    });
    const {
      gender,
      preferredGender,
      travelStyle,
      groupPreference,
      groupSize,
      interests,
      destinations,
      languages,
      availability,
      bio,
      ageRange,
      isActive,
      avatar,
    } = body;

    // Validate required fields
    if (!gender || !travelStyle) {
      console.error("Missing required fields: gender or travelStyle");
      return NextResponse.json(
        { error: "Gender and travel style are required" },
        { status: 400 }
      );
    }

    console.log("Checking if profile exists...");
    // Check if profile exists
    const existingProfile = await prisma.travelProfile.findUnique({
      where: { userId },
    });
    console.log("Existing profile:", existingProfile ? "found" : "not found");

    // Prepare data with JSON stringification
    const profileData = {
      userId,
      gender,
      preferredGender: preferredGender || "any",
      travelStyle,
      groupPreference: groupPreference || "any",
      groupSize: groupSize || null,
      interests: interests ? JSON.stringify(interests) : null,
      destinations: destinations ? JSON.stringify(destinations) : null,
      languages: languages ? JSON.stringify(languages) : null,
      availability: availability ? JSON.stringify(availability) : null,
      bio: bio || null,
      ageRange: ageRange || null,
      isActive: isActive !== undefined ? isActive : true,
    };

    let profile;
    if (existingProfile) {
      console.log("Updating existing profile...");
      // Update existing profile
      profile = await prisma.travelProfile.update({
        where: { userId },
        data: profileData,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
      console.log("Profile updated successfully");
    } else {
      console.log("Creating new profile...");
      // Create new profile
      profile = await prisma.travelProfile.create({
        data: profileData,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
      console.log("Profile created successfully");
    }

    // Update avatar on User model if provided
    if (avatar !== undefined && avatar) {
      console.log("Updating user avatar...");
      await prisma.user.update({
        where: { id: userId },
        data: { avatar }
      });
      
      console.log("Re-fetching profile with updated avatar...");
      // Re-fetch profile to get updated user data (avatar)
      const freshProfile = await prisma.travelProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
      if (freshProfile) {
        profile = freshProfile;
        console.log("Profile re-fetched with updated avatar");
      }
    }


    // Parse JSON fields for response
    const responseData = {
      ...profile,
      interests: profile.interests ? JSON.parse(profile.interests) : [],
      destinations: profile.destinations ? JSON.parse(profile.destinations) : [],
      languages: profile.languages ? JSON.parse(profile.languages) : [],
      availability: profile.availability ? JSON.parse(profile.availability) : null,
    };

    return NextResponse.json(
      {
        message: existingProfile
          ? "Travel profile updated successfully"
          : "Travel profile created successfully",
        profile: responseData,
      },
      { status: existingProfile ? 200 : 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating/updating travel profile:", errorMessage, error);
    return NextResponse.json(
      { 
        error: "Failed to create/update travel profile",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
