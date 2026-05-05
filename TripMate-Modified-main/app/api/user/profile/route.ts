// API Route: GET/PATCH /api/user/profile
// Handles user profile retrieval and updates

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader, sanitizeUser } from '@/lib/auth'

// Middleware to get authenticated user
async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  })

  return user
}

// GET - Retrieve user profile
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Please login again.',
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: sanitizeUser(user),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching profile.',
      },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Please login again.',
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Fields that can be updated
    const allowedFields = [
      'name',
      'phone',
      'avatar',
      'dateOfBirth',
      'gender',
      'nationality',
      'address',
      'city',
      'country',
      'preferences',
    ]

    // Filter only allowed fields
    const updateData: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Convert dateOfBirth to Date if provided
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth)
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        data: sanitizeUser(updatedUser),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while updating profile.',
      },
      { status: 500 }
    )
  }
}
