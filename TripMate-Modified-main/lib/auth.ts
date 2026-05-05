// Authentication utility functions
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

// Environment variables (add to .env.local)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET)

// Password validation rules
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false,
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`)
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// Verify password against hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export async function generateToken(payload: { userId: string; email: string }): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(JWT_SECRET_KEY)

  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// Sanitize user data (remove sensitive fields)
export function sanitizeUser(user: any) {
  const { password, ...sanitizedUser } = user
  return sanitizedUser
}

// Validate user input for signup
export interface SignupInput {
  email: string
  password: string
  name: string
  phone?: string
}

export function validateSignupInput(data: any): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  // Validate email
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format'
  }

  // Validate password
  if (!data.password) {
    errors.password = 'Password is required'
  } else {
    const passwordValidation = isValidPassword(data.password)
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.errors.join(', ')
    }
  }

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  }

  // Validate phone (optional)
  if (data.phone && !/^\+?[\d\s\-()]+$/.test(data.phone)) {
    errors.phone = 'Invalid phone number format'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate login input
export interface LoginInput {
  email: string
  password: string
}

export function validateLoginInput(data: any): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!data.password) {
    errors.password = 'Password is required'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
