import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const payload = token ? await verifyToken(token) : null

    if (!payload) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const body = await req.json()
    const { agencyId, docType, fileUrl, fileName } = body

    if (!agencyId || !docType || !fileUrl || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify ownership
    const agency = await prisma.travelAgency.findUnique({ where: { id: agencyId } as any })
    if (!agency || agency.userId !== payload.userId) {
      return NextResponse.json({ error: 'Agency not found or unauthorized' }, { status: 403 })
    }

    const doc = await prisma.agencyDocument.create({
      data: {
        agencyId,
        docType,
        fileUrl,
        fileName,
      },
    })

    return NextResponse.json({ success: true, data: doc }, { status: 201 })
  } catch (error) {
    console.error('Agency document error:', error)
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 })
  }
}
