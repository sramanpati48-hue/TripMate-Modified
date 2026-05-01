// API Route: /api/matchmaker/matches
// Finds compatible travel companions based on preferences

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Find matching travel companions
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

    // Get query parameters for filters
    const { searchParams } = new URL(request.url);
    const genderFilter = searchParams.get("gender");
    const groupPreferenceFilter = searchParams.get("groupPreference");
    const travelStyleFilter = searchParams.get("travelStyle");
    const destinationFilter = searchParams.get("destination");

    // Fetch user's own profile for matching
    const userProfile = await prisma.travelProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Please create your travel profile first" },
        { status: 400 }
      );
    }

    // Build where clause for filtering
    const whereClause: any = {
      userId: { not: userId }, // Exclude own profile
      isActive: true, // Only active profiles
    };

    // Apply gender preference filter
    if (userProfile.preferredGender && userProfile.preferredGender !== "any") {
      if (userProfile.preferredGender === "same-as-me") {
        whereClause.gender = userProfile.gender;
      } else {
        whereClause.gender = userProfile.preferredGender;
      }
    }

    // Apply manual gender filter (from search)
    if (genderFilter && genderFilter !== "any") {
      whereClause.gender = genderFilter;
    }

    // Apply group preference filter
    if (groupPreferenceFilter && groupPreferenceFilter !== "any") {
      whereClause.groupPreference = groupPreferenceFilter;
    }

    // Apply travel style filter
    if (travelStyleFilter) {
      whereClause.travelStyle = travelStyleFilter;
    }

    // Fetch matching profiles
    const matches = await prisma.travelProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to 50 results
    });

    // Parse JSON fields and filter by destination if provided
    let matchedProfiles = matches.map((profile) => ({
      ...profile,
      interests: profile.interests ? JSON.parse(profile.interests) : [],
      destinations: profile.destinations ? JSON.parse(profile.destinations) : [],
      languages: profile.languages ? JSON.parse(profile.languages) : [],
      availability: profile.availability ? JSON.parse(profile.availability) : null,
    }));

    // Filter by destination if provided
    if (destinationFilter) {
      matchedProfiles = matchedProfiles.filter((profile) =>
        profile.destinations.some((dest: string) =>
          dest.toLowerCase().includes(destinationFilter.toLowerCase())
        )
      );
    }

    // Calculate compatibility score (optional enhancement)
    const userInterests = userProfile.interests
      ? JSON.parse(userProfile.interests)
      : [];
    
    matchedProfiles = matchedProfiles.map((profile) => {
      let score = 0;
      
      // Same travel style: +30 points
      if (profile.travelStyle === userProfile.travelStyle) {
        score += 30;
      }
      
      // Same group preference: +20 points
      if (profile.groupPreference === userProfile.groupPreference) {
        score += 20;
      }
      
      // Shared interests: +5 points each (max 50)
      const sharedInterests = profile.interests.filter((interest: string) =>
        userInterests.includes(interest)
      );
      score += Math.min(sharedInterests.length * 5, 50);
      
      return {
        ...profile,
        compatibilityScore: score,
        sharedInterests: sharedInterests,
      };
    });

    // Sort by compatibility score
    matchedProfiles.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return NextResponse.json(
      {
        matches: matchedProfiles,
        total: matchedProfiles.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error finding matches:", error);
    return NextResponse.json(
      { error: "Failed to find matches" },
      { status: 500 }
    );
  }
}
