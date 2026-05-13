import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

type RouteParams = Promise<{ agencyId: string }>

export async function GET(req: NextRequest, { params }: { params: RouteParams }) {
  try {
    const { agencyId } = await params
    const agency = await prisma.travelAgency.findUnique({
      where: { id: agencyId } as any,
      include: {
        plans: { where: { isApproved: true, isActive: true } },
      },
    })

    if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: agency })
  } catch (error) {
    console.error('Get agency error:', error)
    return NextResponse.json({ error: 'Failed to fetch agency' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: RouteParams }) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const { agencyId } = await params
    const agency = await prisma.travelAgency.findUnique({ where: { id: agencyId } as any })
    if (!agency || agency.userId !== payload.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const allowed: any = {}
    const fields = [
      'description',
      'website',
      'phone',
      'address',
      'city',
      'state',
      'logoUrl',
      'agencyType',
      'verificationFee',
      'feePaid',
      'feeTransactionId',
      'feeScreenshotUrl',
      'brochureUrl',
      'ownerIdProofUrl',
      'ownerSelfieUrl',
      'licenseDocUrl',
      'registrationStep',
      'submittedAt',
    ]
    for (const f of fields) if (f in body) allowed[f] = body[f]

    if (allowed.submittedAt) {
      allowed.submittedAt = new Date(allowed.submittedAt)
    }

    const updated = await prisma.travelAgency.update({ where: { id: agencyId } as any, data: allowed })

    const documentPayloads = [
      { field: 'brochureUrl', docType: 'BROCHURE', fileName: 'Agency Brochure' },
      { field: 'ownerIdProofUrl', docType: 'OWNER_ID_PROOF', fileName: 'Owner ID Proof' },
      { field: 'ownerSelfieUrl', docType: 'OWNER_SELFIE', fileName: 'Owner Selfie' },
    ] as const

    for (const item of documentPayloads) {
      if (body[item.field] !== undefined) {
        await prisma.agencyDocument.deleteMany({ where: { agencyId, docType: item.docType } as any })
        if (body[item.field]) {
          await prisma.agencyDocument.create({
            data: {
              agencyId,
              docType: item.docType,
              fileUrl: body[item.field],
              fileName: item.fileName,
            },
          })
        }
      }
    }

    if (body.licenseDocUrl !== undefined) {
      await prisma.agencyDocument.deleteMany({ where: { agencyId, docType: 'TOURISM_LICENSE' } as any })
      if (body.licenseDocUrl) {
        await prisma.agencyDocument.create({
          data: {
            agencyId,
            docType: 'TOURISM_LICENSE',
            fileUrl: body.licenseDocUrl,
            fileName: 'Tourism License',
          },
        })
      }
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Patch agency error:', error)
    return NextResponse.json({ error: 'Failed to update agency' }, { status: 500 })
  }
}
