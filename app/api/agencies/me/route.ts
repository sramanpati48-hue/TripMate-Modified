import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const agency = await prisma.travelAgency.findUnique({ where: { userId: payload.userId } as any, include: { plans: true, documentsSubmitted: true, reviews: true } })
    return NextResponse.json({ success: true, data: agency })
  } catch (error) {
    console.error('Get my agency error:', error)
    return NextResponse.json({ error: 'Failed to fetch agency' }, { status: 500 })
  }
}
