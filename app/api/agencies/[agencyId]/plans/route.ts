import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { agencyId: string } }) {
  try {
    const { agencyId } = params
    const plans = await prisma.agencyPlan.findMany({ where: { agencyId, isActive: true, isApproved: true } })
    return NextResponse.json({ success: true, data: plans })
  } catch (error) {
    console.error('Get plans error:', error)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { agencyId: string } }) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const { agencyId } = params
    const agency = await prisma.travelAgency.findUnique({ where: { id: agencyId } as any })
    if (!agency || agency.userId !== payload.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    // Basic required fields
    const { title, description, destinations = [], duration = 1, pricePerPerson = 0, maxGroupSize = 1, inclusions = [], exclusions = [], itinerary = [], images = [], startDates = [], category } = body
    if (!title || !description || !category) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const plan = await prisma.agencyPlan.create({
      data: {
        agencyId,
        title,
        description,
        destinations,
        duration,
        pricePerPerson: Number(pricePerPerson),
        maxGroupSize: Number(maxGroupSize),
        inclusions,
        exclusions,
        itinerary: itinerary as any,
        images,
        startDates,
        category,
        isApproved: false,
      },
    })

    return NextResponse.json({ success: true, data: plan }, { status: 201 })
  } catch (error) {
    console.error('Create plan error:', error)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}
