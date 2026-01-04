// API Route: Favorites Management
// GET /api/favorites - Get user's favorites
// POST /api/favorites - Add to favorites
// DELETE /api/favorites - Remove from favorites

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

// GET - Fetch all favorites for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    // Fetch user's favorites
    const favorites = await prisma.favorite.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: favorites,
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST - Add place to favorites
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { placeId, placeName, placeImage, placeLocation, placeRating, placeCategory } = body

    // Validate required fields
    if (!placeId || !placeName) {
      return NextResponse.json(
        { success: false, message: 'Place ID and name are required' },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: payload.userId,
        placeId: placeId,
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Already in favorites' },
        { status: 409 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: payload.userId,
        placeId,
        placeName,
        placeImage: placeImage || null,
        placeLocation: placeLocation || null,
        placeRating: placeRating || null,
        placeCategory: placeCategory || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
      data: favorite,
    })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const placeId = searchParams.get('placeId')

    if (!placeId) {
      return NextResponse.json(
        { success: false, message: 'Place ID is required' },
        { status: 400 }
      )
    }

    // Delete favorite
    await prisma.favorite.deleteMany({
      where: {
        userId: payload.userId,
        placeId: placeId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
