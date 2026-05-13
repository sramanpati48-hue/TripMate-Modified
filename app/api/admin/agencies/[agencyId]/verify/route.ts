import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

function isAdmin(userId: string | undefined) {
  return process.env.ADMIN_USER_ID && userId === process.env.ADMIN_USER_ID
}

type RouteParams = Promise<{ agencyId: string }>

export async function PATCH(req: NextRequest, { params }: { params: RouteParams }) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload || !isAdmin(payload.userId)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { agencyId } = await params
    const body = await req.json()
    const { verificationStatus, verificationNotes, approveAllDocuments, documentId, reviewStatus, reviewNotes } = body

    const agency = await prisma.travelAgency.findUnique({ where: { id: agencyId } as any, include: { documentsSubmitted: true } })
    if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 })

    if (approveAllDocuments) {
      await prisma.agencyDocument.updateMany({
        where: { agencyId } as any,
        data: { reviewStatus: 'APPROVED', reviewNotes: null, reviewedAt: new Date() },
      })
    }

    if (documentId && reviewStatus) {
      await prisma.agencyDocument.update({
        where: { id: documentId } as any,
        data: { reviewStatus, reviewNotes: reviewNotes || null, reviewedAt: new Date() },
      })
    }

    if (!verificationStatus) {
      const refreshed = await prisma.travelAgency.findUnique({ where: { id: agencyId } as any, include: { documentsSubmitted: true, plans: true, reviews: true, user: true } })
      return NextResponse.json({ success: true, data: refreshed })
    }

    const updated = await prisma.travelAgency.update({ where: { id: agencyId } as any, data: { verificationStatus, verificationNotes: verificationNotes || null } })

    if (verificationStatus === 'VERIFIED') {
      // Approve all pending plans
      await prisma.agencyPlan.updateMany({ where: { agencyId, isApproved: false }, data: { isApproved: true } })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Verify agency error:', error)
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 })
  }
}
