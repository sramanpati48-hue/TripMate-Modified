import { NextRequest, NextResponse } from 'next/server'
import { searchDestinations } from '@/lib/indian-destinations'
import { generateDestinationDataWithGroq } from '@/lib/groq-ai'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length === 0) {
      return NextResponse.json([])
    }

    // First, search in our local database
    const localResults = searchDestinations(query, limit)

    // If we have enough results, return them
    if (localResults.length >= 5) {
      return NextResponse.json(localResults)
    }

    // If API key is available, enhance with AI search
    const API_KEY = process.env.GROQ_API_KEY
    
    if (!API_KEY) {
      return NextResponse.json(localResults)
    }

    // Use Groq to find more destinations
    try {
      const aiResults = await generateDestinationDataWithGroq(query)
        
      // Transform AI results to match the expected format for autocomplete
      const transformedResults = aiResults.map((dest: any) => ({
        name: dest.name,
        state: dest.state,
        type: dest.category || [],
        region: dest.region,
        popularFor: dest.shortDescription || dest.highlights?.[0] || ''
      }))
        
      // Combine local and AI results, remove duplicates
      const combinedResults = [...localResults]
      const existingNames = new Set(localResults.map((r: any) => r.name.toLowerCase()))
      
      for (const result of transformedResults) {
        if (!existingNames.has(result.name.toLowerCase())) {
          combinedResults.push(result)
          existingNames.add(result.name.toLowerCase())
        }
      }
      
      return NextResponse.json(combinedResults.slice(0, limit))
    } catch (aiError) {
      console.error('AI search error:', aiError)
      // Fall back to local results
    }

    return NextResponse.json(localResults)
  } catch (error) {
    console.error('Error searching destinations:', error)
    return NextResponse.json({ error: 'Failed to search destinations' }, { status: 500 })
  }
}
