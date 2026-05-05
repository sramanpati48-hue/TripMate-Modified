import { NextRequest, NextResponse } from 'next/server'
import { getNearbyAttractions } from '@/lib/places-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const radius = parseInt(searchParams.get('radius') || '10000')
  const location = searchParams.get('location') || ''
  
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
  }
  
  try {
    const attractions = await getNearbyAttractions(lat, lng, radius, location)
    
    return NextResponse.json(attractions)
  } catch (error: any) {
    console.error('Attractions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attractions' },
      { status: 500 }
    )
  }
}
