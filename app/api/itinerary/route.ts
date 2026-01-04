import { NextRequest, NextResponse } from 'next/server'
import { generateItineraryWithGroq } from '@/lib/groq-ai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, days, budget } = body

    console.log('Itinerary request:', { destination, days, budget })

    if (!destination || !days || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, days, budget' },
        { status: 400 }
      )
    }

    const itinerary = await generateItineraryWithGroq(destination, days, budget)

    return NextResponse.json(itinerary)
  } catch (error: any) {
    console.error('Error generating itinerary:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to generate itinerary', details: error.message },
      { status: 500 }
    )
  }
}
