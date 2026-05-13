import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null

    if (!payload) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const {
      agencyType,
      agencyName,
      registrationNo,
      gstNumber,
      panNumber,
      licenseNumber,
      address,
      city,
      state,
      website,
      description,
      verificationFee,
      feePaid,
      feeTransactionId,
      feeScreenshotUrl,
      brochureUrl,
      ownerIdProofUrl,
      ownerSelfieUrl,
      licenseDocUrl,
      submittedAt,
    } = body

    // Basic validation
    if (!agencyName || !registrationNo || !panNumber || !licenseNumber || !address || !city || !state || !agencyType) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already has an agency
    const existing = await prisma.travelAgency.findUnique({ where: { userId: payload.userId } as any })
    if (existing) {
      return NextResponse.json({ success: false, error: 'User already has an agency' }, { status: 409 })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Create agency
    const agency = await prisma.travelAgency.create({
      data: {
        userId: payload.userId,
        agencyType,
        agencyName,
        registrationNo,
        gstNumber: gstNumber || null,
        panNumber,
        licenseNumber,
        website: website || null,
        description: description || null,
        phone: user.phone || '',
        address,
        city,
        state,
        verificationFee: typeof verificationFee === 'number' ? verificationFee : 999,
        feePaid: Boolean(feePaid),
        feeTransactionId: feeTransactionId || null,
        feeScreenshotUrl: feeScreenshotUrl || null,
        brochureUrl: brochureUrl || null,
        ownerIdProofUrl: ownerIdProofUrl || null,
        ownerSelfieUrl: ownerSelfieUrl || null,
        registrationStep: 4,
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
      },
    })

    const documentCreates = []
    if (brochureUrl) {
      documentCreates.push(
        prisma.agencyDocument.create({
          data: {
            agencyId: agency.id,
            docType: 'BROCHURE',
            fileUrl: brochureUrl,
            fileName: 'Agency Brochure',
          },
        })
      )
    }
    if (ownerIdProofUrl) {
      documentCreates.push(
        prisma.agencyDocument.create({
          data: {
            agencyId: agency.id,
            docType: 'OWNER_ID_PROOF',
            fileUrl: ownerIdProofUrl,
            fileName: 'Owner ID Proof',
          },
        })
      )
    }
    if (ownerSelfieUrl) {
      documentCreates.push(
        prisma.agencyDocument.create({
          data: {
            agencyId: agency.id,
            docType: 'OWNER_SELFIE',
            fileUrl: ownerSelfieUrl,
            fileName: 'Owner Selfie',
          },
        })
      )
    }
    if (licenseDocUrl) {
      documentCreates.push(
        prisma.agencyDocument.create({
          data: {
            agencyId: agency.id,
            docType: 'TOURISM_LICENSE',
            fileUrl: licenseDocUrl,
            fileName: 'Tourism License',
          },
        })
      )
    }

    if (documentCreates.length > 0) {
      await prisma.$transaction(documentCreates)
    }

    return NextResponse.json({ success: true, data: agency }, { status: 201 })
  } catch (error) {
    console.error('Agency register error:', error)
    return NextResponse.json({ success: false, error: 'Failed to register agency' }, { status: 500 })
  }
}
