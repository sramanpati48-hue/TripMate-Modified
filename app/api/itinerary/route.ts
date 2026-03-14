import { NextRequest, NextResponse } from 'next/server'
import { generateItineraryWithClaude } from '@/lib/claude-ai'
import { generateItineraryWithGroq } from '@/lib/groq-ai'

export const dynamic = 'force-dynamic'

function normalizeActivityValue(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function dedupeItineraryActivities(payload: any) {
  if (!payload || !Array.isArray(payload.itinerary)) return payload

  const dedupedDays = payload.itinerary.map((day: any) => {
    if (!day || !Array.isArray(day.activities)) return day

    const seen = new Set<string>()
    const dedupedActivities = day.activities.filter((activity: any) => {
      const key = [
        normalizeActivityValue(activity?.time),
        normalizeActivityValue(activity?.name || activity?.title || activity?.activity),
        normalizeActivityValue(activity?.location),
      ].join('|')

      if (!key.replace(/\|/g, '').trim() || seen.has(key)) return false
      seen.add(key)
      return true
    })

    return {
      ...day,
      activities: dedupedActivities,
    }
  })

  return {
    ...payload,
    itinerary: dedupedDays,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, days, budget, interests = '', model = 'groq' } = body

    console.log('Itinerary request:', { destination, days, budget, interests, model })

    if (!destination || !days || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, days, budget' },
        { status: 400 }
      )
    }

    // Use Groq AI (llama-3.3-70b-versatile) by default.
    let itinerary;
    if (model === 'claude') {
      console.log('🤖 Using Claude Haiku 4.5')
      itinerary = await generateItineraryWithClaude(destination, days, budget)
    } else {
      console.log('🤖 Using Groq AI (llama-3.3-70b-versatile) - Default')
      itinerary = await generateItineraryWithGroq(destination, days, budget, interests)
    }

    const sanitizedItinerary = dedupeItineraryActivities(itinerary)

    return NextResponse.json(sanitizedItinerary)
  } catch (error: any) {
    console.error('Error generating itinerary:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to generate itinerary', details: error.message },
      { status: 500 }
    )
  }
}
