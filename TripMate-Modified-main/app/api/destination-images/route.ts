import { NextRequest, NextResponse } from 'next/server'
import { getDestinationImages } from '@/lib/image-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const count = parseInt(searchParams.get('count') || '3')
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }
  
  try {
    const images = await getDestinationImages(query, count)
    
    return NextResponse.json(images)
  } catch (error: any) {
    console.error('Image API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}
