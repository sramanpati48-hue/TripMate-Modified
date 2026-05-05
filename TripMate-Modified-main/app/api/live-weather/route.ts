import { NextRequest, NextResponse } from 'next/server'
import { getRealWeather, get5DayForecast } from '@/lib/weather-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get('city')
  const state = searchParams.get('state') || ''
  const includeForecast = searchParams.get('forecast') === 'true'
  
  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 })
  }
  
  try {
    const weather = await getRealWeather(city, state)
    
    if (!weather) {
      return NextResponse.json({ 
        error: 'Weather data not available. OpenWeather API key may not be configured.' 
      }, { status: 503 })
    }
    
    if (includeForecast) {
      const forecast = await get5DayForecast(city, state)
      return NextResponse.json({ current: weather, forecast })
    }
    
    return NextResponse.json(weather)
  } catch (error: any) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
