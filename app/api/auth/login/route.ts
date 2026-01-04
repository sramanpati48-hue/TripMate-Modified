// API Route: POST /api/auth/login
// Handles user authentication and returns JWT token

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  validateLoginInput,
  verifyPassword,
  generateToken,
  sanitizeUser,
  type LoginInput,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginInput = await request.json()

    // Validate input
    const validation = validateLoginInput(body)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(body.password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    })

    // Remove sensitive data
    const sanitizedUser = sanitizeUser(user)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: sanitizedUser,
          token,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during login. Please try again.',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
