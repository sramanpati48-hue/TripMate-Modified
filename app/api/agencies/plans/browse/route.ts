import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const category = url.searchParams.get('category')
    const destination = url.searchParams.get('destination')
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')
    const duration = url.searchParams.get('duration')
    const sort = url.searchParams.get('sort')

    // Base filter: active, approved plans whose agency is VERIFIED
    const where: any = {
      isActive: true,
      isApproved: true,
      agency: { verificationStatus: 'VERIFIED' },
    }

    if (category) where.category = category
    if (destination) where.destinations = { has: destination }
    if (duration) where.duration = Number(duration)
    if (minPrice || maxPrice) where.pricePerPerson = {}
    if (minPrice) where.pricePerPerson.gte = Number(minPrice)
    if (maxPrice) where.pricePerPerson.lte = Number(maxPrice)

    const orderBy: any = {}
    if (sort === 'price_asc') orderBy.pricePerPerson = 'asc'
    else if (sort === 'price_desc') orderBy.pricePerPerson = 'desc'
    else orderBy.createdAt = 'desc'

    const plans = await prisma.agencyPlan.findMany({
      where,
      orderBy,
      include: {
        agency: { select: { id: true, agencyName: true, logoUrl: true, city: true, state: true } },
      },
    })

    return NextResponse.json({ success: true, data: plans })
  } catch (error) {
    console.error('Browse plans error:', error)
    return NextResponse.json({ error: 'Failed to browse plans' }, { status: 500 })
  }
}
