import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, hashPassword, isValidEmail, isValidPassword, sanitizeUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fullName = String(body.fullName || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const confirmPassword = String(body.confirmPassword || '')
    const phone = String(body.phone || '').trim()

    const errors: Record<string, string> = {}

    if (!fullName || fullName.length < 2) errors.fullName = 'Full name is required'
    if (!email || !isValidEmail(email)) errors.email = 'Valid email is required'
    if (!password) errors.password = 'Password is required'
    if (password && !isValidPassword(password).valid) {
      errors.password = isValidPassword(password).errors.join(', ')
    }
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (!phone || !/^[+\d\s\-()]{7,}$/.test(phone)) errors.phone = 'Valid phone number is required'

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already registered', errors: { email: 'Email already registered' } }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        phone,
        role: 'AGENCY_OWNER',
      },
    })

    const token = await generateToken({ userId: user.id, email: user.email })

    return NextResponse.json(
      {
        success: true,
        message: 'Agency owner account created successfully',
        data: {
          user: sanitizeUser(user),
          token,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Agency signup error:', error)
    return NextResponse.json({ success: false, message: 'Failed to create agency owner account' }, { status: 500 })
  }
}
