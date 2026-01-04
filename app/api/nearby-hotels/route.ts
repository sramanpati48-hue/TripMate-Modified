import { NextRequest, NextResponse } from 'next/server'
import { getRealHotels } from '@/lib/hotels-api'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const location = searchParams.get('location') || ''
  
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
  }
  
  try {
    const hotels = await getRealHotels(location, lat, lng)
    return NextResponse.json(hotels)
  } catch (error: any) {
    console.error('Hotels API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotels', message: error.message },
      { status: 500 }
    )
  }
}
