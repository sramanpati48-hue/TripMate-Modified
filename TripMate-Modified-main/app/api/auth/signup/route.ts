// API Route: POST /api/auth/signup
// Handles user registration with validation and secure password storage

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  validateSignupInput,
  hashPassword,
  generateToken,
  sanitizeUser,
  type SignupInput,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SignupInput = await request.json()

    // Validate input
    const validation = validateSignupInput(body)
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    })

    // Hash password
    const hashedPassword = await hashPassword(body.password)

    let user;

    if (existingUser) {
      // If the existing user has no password (e.g. former OAuth account),
      // allow them to set a password now
      if (!existingUser.password) {
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            name: body.name.trim() || existingUser.name,
            phone: body.phone?.trim() || existingUser.phone,
          },
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'User with this email already exists',
            errors: { email: 'Email already registered' },
          },
          { status: 409 }
        )
      }
    } else {
      // Create new user in database
      user = await prisma.user.create({
        data: {
          email: body.email.toLowerCase(),
          password: hashedPassword,
          name: body.name.trim(),
          phone: body.phone?.trim() || null,
        },
      })
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
        message: 'Account created successfully',
        data: {
          user: sanitizedUser,
          token,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during signup. Please try again.',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
