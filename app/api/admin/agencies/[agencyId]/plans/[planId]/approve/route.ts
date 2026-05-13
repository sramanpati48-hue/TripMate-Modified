import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

function isAdmin(userId: string | undefined) {
  return process.env.ADMIN_USER_ID && userId === process.env.ADMIN_USER_ID
}

export async function PATCH(req: NextRequest, { params }: { params: { agencyId: string; planId: string } }) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload || !isAdmin(payload.userId)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { planId } = params
    const body = await req.json()
    const { isApproved } = body
    if (typeof isApproved !== 'boolean') return NextResponse.json({ error: 'isApproved boolean required' }, { status: 400 })

    const updated = await prisma.agencyPlan.update({ where: { id: planId } as any, data: { isApproved } })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Admin approve plan error:', error)
    return NextResponse.json({ error: 'Failed to approve plan' }, { status: 500 })
  }
}
