import { NextRequest, NextResponse } from 'next/server'
import { generateDestinationDataWithGroq } from '@/lib/groq-ai'
import { mockPlaces } from '@/lib/mock-data'
import { getDestinationImages } from '@/lib/image-service'

export const dynamic = 'force-dynamic'

// Function to enhance places with real-time images
async function enhancePlacesWithImages(places: any[]) {
  return Promise.all(places.map(async (place) => {
    try {
      // Fetch fresh images for this destination
      const images = await getDestinationImages(place.name, 3)
      
      if (images && images.length > 0) {
        return {
          ...place,
          image: images[0].url,
          images: images.map((img: any) => img.url)
        }
      }
    } catch (error) {
      console.error(`Error fetching images for ${place.name}:`, error)
    }
    
    // Return original place if image fetch fails
    return place
  }))
}

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
      
      // If we found results, enhance with real-time images
      if (filtered.length > 0) {
        const enhanced = await enhancePlacesWithImages(filtered)
        return NextResponse.json(enhanced)
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

    // Enhance mock places with real-time images
    const enhanced = await enhancePlacesWithImages(mockPlaces)
    return NextResponse.json(enhanced)
  } catch (error) {
    console.error('Error fetching destinations:', error)
    // Fallback to mock data on error
    return NextResponse.json(mockPlaces)
  }
}
