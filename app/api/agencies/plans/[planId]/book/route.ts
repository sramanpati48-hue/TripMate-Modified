import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { planId: string } }) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const { planId } = params
    const plan = await prisma.agencyPlan.findUnique({ where: { id: planId } as any })
    if (!plan || !plan.isActive || !plan.isApproved) return NextResponse.json({ error: 'Plan not available' }, { status: 404 })

    const body = await req.json()
    const { startDate, groupSize } = body
    if (!startDate || !groupSize) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    if (Number(groupSize) > plan.maxGroupSize) return NextResponse.json({ error: 'Group size exceeds maximum' }, { status: 400 })

    const totalPrice = Number(plan.pricePerPerson) * Number(groupSize)

    const booking = await prisma.planBooking.create({
      data: {
        planId,
        userId: payload.userId,
        startDate,
        groupSize: Number(groupSize),
        totalPrice,
      },
    })

    return NextResponse.json({ success: true, data: booking }, { status: 201 })
  } catch (error) {
    console.error('Book plan error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
