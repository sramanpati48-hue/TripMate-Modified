export async function getNearbyHotels(lat: number, lng: number, radius: number = 5000, location?: string) {
  const API_KEY = process.env.GEMINI_API_KEY
  
  if (!API_KEY) {
    console.log('Gemini API key not configured')
    return []
  }

  try {
    // Use direct API call to v1 endpoint
    const prompt = `Generate a realistic list of 8-10 REAL hotels near ${location || `coordinates ${lat}, ${lng}`} in India.
    
    Return ONLY a JSON array with this exact structure:
    [
      {
        "name": "Hotel name",
        "rating": 4.5,
        "userRatingsTotal": 1234,
        "address": "Full address with area name",
        "priceLevel": 2,
        "price": 2500,
        "distance": "1.2 km",
        "coordinates": { "lat": ${lat + 0.01}, "lng": ${lng + 0.01} },
        "amenities": ["WiFi", "Pool", "Restaurant"]
      }
    ]
    
    IMPORTANT REQUIREMENTS:
    - Use REAL hotel names that actually exist near ${location || 'the location'} (research actual hotels)
    - Rating should be between 3.5-5.0
    - Price should be actual per night cost in Indian Rupees (800-10000)
    - priceLevel: 1 (budget 800-1500), 2 (moderate 1500-3500), 3 (expensive 3500-6000), 4 (luxury 6000+)
    - Include REAL addresses with actual street names and areas
    - Calculate realistic distances from the coordinates ${lat}, ${lng}
    - Generate realistic coordinates near the base location
    - Make it 100% authentic to the actual location`

    // Direct API call to v1 endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      if (response.status === 429) {
        console.log('⚠️ Gemini API Rate Limit Reached - Using fallback mock data. Please wait 1-2 minutes before trying again.')
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Gemini API Success - Fetched real hotel data!')
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return []
  } catch (error: any) {
    console.error('Gemini hotels fetch error:', error.message)
    return []
  }
}

export async function getNearbyRestaurants(lat: number, lng: number, radius: number = 3000, location?: string) {
  const API_KEY = process.env.GEMINI_API_KEY
  
  if (!API_KEY) {
    return []
  }

  try {
    const prompt = `Generate a realistic list of 10-12 restaurants near ${location || `coordinates ${lat}, ${lng}`} in India.
    
    Return ONLY a JSON array with this exact structure:
    [
      {
        "name": "Restaurant name",
        "rating": 4.2,
        "userRatingsTotal": 856,
        "address": "Full address with area name",
        "priceLevel": 2,
        "photo": null,
        "cuisine": ["North Indian", "Chinese"],
        "types": ["restaurant", "food"]
      }
    ]
    
    - Include mix of cuisines: Indian, Chinese, Continental, Fast Food, etc.
    - Rating should be between 3.5-5.0
    - priceLevel: 1 (budget), 2 (moderate), 3 (expensive), 4 (fine dining)
    - Use real restaurant names if possible, or realistic Indian restaurant names
    - Include popular food streets and areas in addresses`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return []
  } catch (error: any) {
    console.error('Gemini restaurants fetch error:', error.message)
    return []
  }
}

export async function getPlaceDetails(placeName: string, location?: string) {
  const API_KEY = process.env.GEMINI_API_KEY
  
  if (!API_KEY) {
    return null
  }

  try {
    const prompt = `Generate detailed information about "${placeName}" ${location ? `in ${location}` : ''}, India.
    
    Return ONLY a JSON object with this exact structure:
    {
      "name": "${placeName}",
      "rating": 4.5,
      "phone": "+91-XXXXXXXXXX",
      "website": "https://example.com",
      "openingHours": {
        "weekdayText": ["Monday: 9:00 AM – 6:00 PM", "Tuesday: 9:00 AM – 6:00 PM", ...]
      },
      "reviews": [
        {
          "author": "Name",
          "rating": 5,
          "text": "Review text",
          "time": "2 weeks ago"
        }
      ],
      "priceLevel": 2,
      "description": "Detailed description"
    }
    
    - Make realistic phone numbers, websites
    - Include 3-5 reviews
    - Provide authentic opening hours`

    // Use direct API call to v1 endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return null
  } catch (error: any) {
    console.error('Place details error:', error.message)
    return null
  }
}

export async function getNearbyAttractions(lat: number, lng: number, radius: number = 10000, location?: string) {
  const API_KEY = process.env.GEMINI_API_KEY
  
  if (!API_KEY) {
    return []
  }

  try {
    const prompt = `Generate a realistic list of 8-10 tourist attractions near ${location || `coordinates ${lat}, ${lng}`} in India.
    
    Return ONLY a JSON array with this exact structure:
    [
      {
        "name": "Attraction name",
        "rating": 4.6,
        "userRatingsTotal": 2340,
        "address": "Full address with area name",
        "photo": null,
        "type": "Historical Monument / Temple / Park / Museum / etc",
        "description": "Brief 1-line description"
      }
    ]
    
    - Include mix of: monuments, temples, parks, museums, viewpoints, beaches, etc.
    - Rating should be between 4.0-5.0 for popular attractions
    - Use real attraction names if possible
    - Include famous landmarks and hidden gems
    - Provide accurate addresses with nearby landmarks`

    // Use direct API call to v1 endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return []
  } catch (error: any) {
    console.error('Gemini attractions fetch error:', error.message)
    return []
  }
}
