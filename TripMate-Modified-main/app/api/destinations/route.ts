import { NextRequest, NextResponse } from 'next/server'
import { generateDestinationDataWithGroq } from '@/lib/groq-ai'
import { mockPlaces } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const region = searchParams.get('region')
    const search = searchParams.get('search')
    const useRealtime = searchParams.get('realtime') === 'true'

    // If there's a search query, filter mock data first
    if (search && search.trim().length > 0) {
      const searchLower = search.toLowerCase().trim()
      const filtered = mockPlaces.filter(place => 
        place.name.toLowerCase().includes(searchLower) ||
        place.location.toLowerCase().includes(searchLower) ||
        place.state.toLowerCase().includes(searchLower) ||
        place.category.some(cat => cat.toLowerCase().includes(searchLower))
      )
      
      // If we found results, return curated place data as-is.
      if (filtered.length > 0) {
        return NextResponse.json(filtered)
      }
      
      // If no results and realtime is enabled, try AI search
      if (useRealtime && process.env.GROQ_API_KEY) {
        try {
          // Generate destinations specifically matching the search query
          const aiDestinations = await generateDestinationDataWithGroq(search)
          if (aiDestinations && aiDestinations.length > 0) {
            return NextResponse.json(aiDestinations)
          }
        } catch (error) {
          console.error('Error with AI search:', error)
        }
      }
      
      // Return empty if no matches found
      return NextResponse.json([])
    }

    // Return curated mock places without runtime image replacement.
    return NextResponse.json(mockPlaces)
  } catch (error) {
    console.error('Error fetching destinations:', error)
    // Fallback to mock data on error
    return NextResponse.json(mockPlaces)
  }
}
