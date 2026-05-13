import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { agencyId: string; planId: string } }) {
  try {
    const { planId } = params
    const plan = await prisma.agencyPlan.findUnique({ where: { id: planId } as any })
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: plan })
  } catch (error) {
    console.error('Get plan error:', error)
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { agencyId: string; planId: string } }) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const { agencyId, planId } = params
    const plan = await prisma.agencyPlan.findUnique({ where: { id: planId } as any })
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

    const agency = await prisma.travelAgency.findUnique({ where: { id: agencyId } as any })
    if (!agency || agency.userId !== payload.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const allowedFields = ['title','description','destinations','duration','pricePerPerson','maxGroupSize','inclusions','exclusions','itinerary','images','startDates','category','isActive']
    const data: any = {}
    for (const f of allowedFields) if (f in body) data[f] = body[f]

    const updated = await prisma.agencyPlan.update({ where: { id: planId } as any, data })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Patch plan error:', error)
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { agencyId: string; planId: string } }) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const { agencyId, planId } = params
    const plan = await prisma.agencyPlan.findUnique({ where: { id: planId } as any })
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

    const agency = await prisma.travelAgency.findUnique({ where: { id: agencyId } as any })
    if (!agency || agency.userId !== payload.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const soft = await prisma.agencyPlan.update({ where: { id: planId } as any, data: { isActive: false } })
    return NextResponse.json({ success: true, data: soft })
  } catch (error) {
    console.error('Delete plan error:', error)
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
  }
}
