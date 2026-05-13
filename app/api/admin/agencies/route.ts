import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

function isAdmin(userId: string | undefined) {
  return process.env.ADMIN_USER_ID && userId === process.env.ADMIN_USER_ID
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload || !isAdmin(payload.userId)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const agencies = await prisma.travelAgency.findMany({ include: { documentsSubmitted: true, plans: true, reviews: true, user: true } })
    return NextResponse.json({ success: true, data: agencies })
  } catch (error) {
    console.error('Admin agencies error:', error)
    return NextResponse.json({ error: 'Failed to fetch agencies' }, { status: 500 })
  }
}
