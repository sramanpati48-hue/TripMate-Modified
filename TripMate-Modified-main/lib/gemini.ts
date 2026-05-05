export async function generateDestinationData(category?: string, region?: string) {
  const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  
  if (!API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const prompt = `Generate detailed travel destination data for India${category ? ` in the ${category} category` : ''}${region ? ` in the ${region} region` : ''}.

Return a JSON array of 6-10 destinations with the following structure:
[
  {
    "id": "unique-id",
    "name": "Destination Name",
    "location": "City Name",
    "state": "State Name",
    "region": "North/South/East/West/Central/Northeast",
    "category": ["Spiritual", "Adventure", "Heritage", "Nature", "Beach", "Hill Station", "Wildlife"],
    "description": "Detailed 200-word description with history, significance, and unique features",
    "shortDescription": "One-line catchy description",
    "rating": 4.5-4.9,
    "reviewCount": realistic number,
    "price": base price in INR,
    "duration": "recommended duration",
    "bestSeason": ["Season names"],
    "weather": {
      "temperature": current temp in celsius,
      "condition": "weather condition",
      "humidity": percentage,
      "bestTimeToVisit": "months"
    },
    "highlights": ["4-5 key attractions"],
    "activities": ["5-7 activities"],
    "nearbyAttractions": ["3-4 nearby places with distances"],
    "coordinates": {
      "lat": actual latitude,
      "lng": actual longitude
    },
    "monthlyVisitors": realistic number,
    "featured": true/false
  }
]

Make sure all data is factually accurate, use real coordinates, realistic visitor numbers, and authentic descriptions. Only return valid JSON without any markdown formatting.`

  try {
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
      if (response.status === 429) {
        console.log('⚠️ Gemini API Rate Limit - Please wait 1-2 minutes')
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Gemini API Success - Generated destination data!')
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Clean the response to extract JSON
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '')
    }
    
    const destinations = JSON.parse(jsonText)
    return destinations
  } catch (error) {
    console.error('Error generating destination data:', error)
    throw error
  }
}

export async function generateDestinationDataForSearch(searchQuery: string) {
  const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  
  if (!API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const prompt = `Find and generate detailed travel destination data for Indian destinations matching the search query: "${searchQuery}"

Search could be:
- A city/town name (e.g., "Hampi", "Pondicherry")
- A state name (e.g., "Kerala", "Himachal Pradesh")
- A type of destination (e.g., "waterfalls", "beaches", "temples")
- Famous landmarks (e.g., "Taj Mahal", "Golden Temple")

Return a JSON array of 3-6 matching destinations with this EXACT structure:
[
  {
    "id": "unique-id",
    "name": "Destination Name",
    "location": "City Name",
    "state": "State Name",
    "region": "North/South/East/West/Central/Northeast",
    "category": ["Spiritual", "Adventure", "Heritage", "Nature", "Beach", "Hill Station", "Wildlife"],
    "description": "Detailed 200-word description with history, significance, and unique features",
    "shortDescription": "One-line catchy description (50-80 characters)",
    "image": "https://images.unsplash.com/photo-1234567890123?w=1200&h=800&fit=crop",
    "images": ["https://images.unsplash.com/photo-1234567890123?w=1200&h=800&fit=crop", "url2", "url3"],
    "rating": 4.5,
    "reviewCount": 5000,
    "price": "₹3000-6000",
    "duration": "2-3 days",
    "bestSeason": ["Winter", "Spring"],
    "weather": {
      "temperature": 25,
      "condition": "Pleasant",
      "humidity": 60,
      "bestTimeToVisit": "October to March"
    },
    "highlights": ["Main attraction 1", "Main attraction 2", "Main attraction 3", "Main attraction 4"],
    "activities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4", "Activity 5"],
    "nearbyAttractions": ["Place 1 (distance)", "Place 2 (distance)", "Place 3 (distance)"],
    "coordinates": {
      "lat": 12.3456,
      "lng": 78.9012
    },
    "monthlyVisitors": 50000,
    "featured": false
  }
]

IMPORTANT:
- Use REAL, accurate coordinates for each destination
- Use realistic visitor numbers and ratings
- Use Unsplash image URLs (use real photo IDs if possible)
- Include authentic, factual descriptions
- Price should be in "₹min-max" format
- Only return valid JSON without markdown formatting`

  try {
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
        console.log('⚠️ Gemini API Rate Limit - Please wait 1-2 minutes')
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✅ Gemini API Success - Generated destinations for "${searchQuery}"`)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Clean the response to extract JSON
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '')
    }
    
    const destinations = JSON.parse(jsonText)
    return destinations
  } catch (error) {
    console.error('Error generating destination data for search:', error)
    throw error
  }
}

export async function generateItinerary(destination: string, days: number, budget: string) {
  const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  
  if (!API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const prompt = `Generate a detailed ${days}-day travel itinerary for ${destination}, India with a ${budget} budget.

Return a JSON object with the following structure:
{
  "destination": "${destination}",
  "duration": ${days},
  "budget": "${budget}",
  "totalCost": "₹XX,XXX estimated",
  "days": [
    {
      "day": 1,
      "title": "Day 1: Arrival and Initial Exploration",
      "activities": [
        {
          "time": "09:00 AM",
          "name": "Activity name",
          "description": "Brief description of what to do",
          "duration": "2 hours",
          "location": "Specific location name",
          "category": "Sightseeing/Food/Activity/Transport",
          "cost": "₹500",
          "tips": "Helpful tip for this activity"
        }
      ],
      "meals": {
        "breakfast": "Recommended place with cost",
        "lunch": "Recommended place with cost",
        "dinner": "Recommended place with cost"
      },
      "accommodation": "Hotel/stay recommendation with approximate cost"
    }
  ],
  "tips": ["Practical travel tips for ${destination}"],
  "essentials": ["Essential items to pack"]
}

IMPORTANT: 
- Include 3-5 activities per day
- Use real place names in ${destination}
- Include realistic Indian prices
- Make descriptions engaging and practical
- Only return valid JSON, no markdown`

  try {
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
      if (response.status === 429) {
        console.log('⚠️ Gemini API Rate Limit - Please wait 1-2 minutes')
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    console.log('✅ Gemini API Success - Generated itinerary!')
    console.log('Gemini raw response:', text.substring(0, 200))
    
    // Clean the response to extract JSON
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '')
    }
    
    const itinerary = JSON.parse(jsonText)
    console.log('Parsed itinerary for:', destination)
    return itinerary
  } catch (error: any) {
    console.error('Error generating itinerary:', error.message)
    console.error('Error details:', error)
    throw error
  }
}

export async function getWeatherData(location: string) {
  const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  
  if (!API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const prompt = `Provide current weather information for ${location}, India.

Return a JSON object with:
{
  "location": "${location}",
  "temperature": current temperature in celsius,
  "condition": "Sunny/Cloudy/Rainy/etc",
  "humidity": percentage,
  "windSpeed": "speed in km/h",
  "forecast": [
    {
      "day": "Today/Tomorrow/Day name",
      "high": temperature,
      "low": temperature,
      "condition": "weather condition"
    }
  ]
}

Only return valid JSON without any markdown formatting.`

  try {
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
      if (response.status === 429) {
        console.log('⚠️ Gemini API Rate Limit - Please wait 1-2 minutes')
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Gemini API Success - Generated weather data!')
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '')
    }
    
    const weather = JSON.parse(jsonText)
    return weather
  } catch (error) {
    console.error('Error getting weather data:', error)
    throw error
  }
}
