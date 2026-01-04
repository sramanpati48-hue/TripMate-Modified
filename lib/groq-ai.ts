// Groq AI integration for trip planner (FREE and FAST!)

export async function generateItineraryWithGroq(
  destination: string,
  days: number,
  budget: string
): Promise<any> {
  const API_KEY = process.env.GROQ_API_KEY;

  // If no API key, return mock itinerary
  if (!API_KEY || API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
    console.log('⚠️ No Groq API key configured - Using mock itinerary data');
    return generateMockItinerary(destination, days, budget);
  }

  const prompt = `Generate a detailed ${days}-day travel itinerary for ${destination}, India with a ${budget} budget.

Create a full day schedule from morning (6-7 AM) to evening (8-9 PM) with 5-7 activities per day.

Return a JSON object with this exact structure:
{
  "destination": "${destination}",
  "days": ${days},
  "budget": "${budget}",
  "totalCost": estimated total cost in INR,
  "overview": "Brief 2-3 sentence overview of the trip",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "07:00 AM",
          "activity": "Morning activity (e.g., Sunrise visit)",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": 200,
          "location": "Location name"
        },
        {
          "time": "10:00 AM",
          "activity": "Mid-morning activity (e.g., Temple/Monument visit)",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": 300,
          "location": "Location name"
        },
        {
          "time": "01:00 PM",
          "activity": "Afternoon activity (e.g., Local cuisine lunch)",
          "description": "Brief description",
          "duration": "1.5 hours",
          "cost": 500,
          "location": "Location name"
        },
        {
          "time": "03:00 PM",
          "activity": "Post-lunch activity (e.g., Museum/Shopping)",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": 400,
          "location": "Location name"
        },
        {
          "time": "06:00 PM",
          "activity": "Evening activity (e.g., Sunset point/Market)",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": 300,
          "location": "Location name"
        },
        {
          "time": "08:00 PM",
          "activity": "Night activity (e.g., Dinner at famous restaurant)",
          "description": "Brief description",
          "duration": "1.5 hours",
          "cost": 800,
          "location": "Location name"
        }
      ],
      "accommodation": "Hotel recommendation",
      "meals": ["Breakfast place", "Lunch place", "Dinner place"],
      "tips": ["Useful tip 1", "Useful tip 2"]
    }
  ],
  "essentialInfo": {
    "bestTimeToVisit": "Months",
    "howToReach": "Transportation details",
    "accommodation": ["3-4 hotel recommendations"],
    "localTransport": "Transport options",
    "thingsToPack": ["Essential items"]
  }
}

Only return valid JSON without markdown formatting.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and free model
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner for India. Always return valid JSON without markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    console.log('✅ Groq API Success - Generated itinerary!');
    
    // Clean the response to extract JSON
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating itinerary with Groq:', error);
    console.log('📋 Falling back to mock itinerary data');
    return generateMockItinerary(destination, days, budget);
  }
}

function generateMockItinerary(destination: string, days: number, budget: string) {
  const budgetMultiplier = budget === 'budget' ? 0.7 : budget === 'luxury' ? 1.5 : 1;
  const baseCost = 3000;

  return {
    destination,
    days,
    budget,
    totalCost: Math.round(baseCost * days * budgetMultiplier),
    overview: `Experience the best of ${destination} in ${days} days with a perfect ${budget} budget trip covering iconic landmarks, local cuisine, and cultural experiences.`,
    itinerary: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1} - ${i === 0 ? 'Arrival & Exploration' : i === days - 1 ? 'Final Day & Departure' : 'Local Sightseeing'}`,
      activities: [
        {
          time: '07:00 AM',
          activity: 'Sunrise & Morning Walk',
          description: 'Start your day early with a beautiful sunrise view and morning walk',
          duration: '1.5 hours',
          cost: Math.round(100 * budgetMultiplier),
          location: `${destination} Viewpoint`
        },
        {
          time: '09:00 AM',
          activity: 'Breakfast & Temple Visit',
          description: 'Enjoy local breakfast followed by spiritual vibes at the temple',
          duration: '2 hours',
          cost: Math.round(300 * budgetMultiplier),
          location: `${destination} Main Temple`
        },
        {
          time: '12:00 PM',
          activity: 'Local Cuisine Experience',
          description: 'Try authentic local dishes at popular restaurants',
          duration: '1.5 hours',
          cost: Math.round(500 * budgetMultiplier),
          location: 'City Center'
        },
        {
          time: '02:00 PM',
          activity: 'Historical Monument Tour',
          description: 'Explore the rich history and architecture',
          duration: '3 hours',
          cost: Math.round(300 * budgetMultiplier),
          location: `${destination} Fort/Palace`
        },
        {
          time: '05:30 PM',
          activity: 'Sunset at Scenic Point',
          description: 'Witness breathtaking sunset views at the best viewpoint',
          duration: '1.5 hours',
          cost: Math.round(200 * budgetMultiplier),
          location: 'Sunset Point'
        },
        {
          time: '07:30 PM',
          activity: 'Evening Market Shopping',
          description: 'Shop for local handicrafts and souvenirs at the vibrant evening market',
          duration: '2 hours',
          cost: Math.round(800 * budgetMultiplier),
          location: 'Local Bazaar'
        },
        {
          time: '09:30 PM',
          activity: 'Dinner at Rooftop Restaurant',
          description: 'End your day with delicious dinner and city lights view',
          duration: '1.5 hours',
          cost: Math.round(900 * budgetMultiplier),
          location: 'Rooftop Restaurant'
        }
      ],
      accommodation: budget === 'luxury' ? 'The Grand Palace Hotel' : budget === 'budget' ? 'Comfort Stay Inn' : 'Royal Heritage Hotel',
      meals: ['Morning Breakfast at Hotel', 'Local Restaurant for Lunch', 'Rooftop Dinner with City View'],
      tips: [
        'Carry sunscreen and water bottle',
        'Bargain at local markets for best prices',
        'Respect local customs and dress modestly at religious sites'
      ]
    })),
    essentialInfo: {
      bestTimeToVisit: 'October to March (pleasant weather)',
      howToReach: `${destination} is well connected by air, rail, and road. Nearest airport is ${destination} International Airport.`,
      accommodation: [
        'The Grand Heritage Hotel (Luxury)',
        'Comfort Stay (Mid-range)',
        'Budget Inn (Economy)',
        'Backpacker Hostel (Budget)'
      ],
      localTransport: 'Auto-rickshaws, taxis, and local buses available. Consider booking a day cab for sightseeing.',
      thingsToPack: [
        'Comfortable walking shoes',
        'Light cotton clothes',
        'Sunglasses and hat',
        'Camera',
        'Personal medications',
        'Power bank'
      ]
    }
  };
}

export async function generateDestinationDataWithGroq(searchQuery: string) {
  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY || API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
    console.log('⚠️ No Groq API key configured - Cannot generate destinations');
    throw new Error('Groq API key not configured');
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
- Include authentic, factual descriptions
- Price should be in "₹min-max" format
- Only return valid JSON without markdown formatting
- DO NOT include image URLs (they will be added separately)`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel guide for India. Always return valid JSON without markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    console.log(`✅ Groq API Success - Generated destinations for "${searchQuery}"`);
    
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }
    
    const destinations = JSON.parse(jsonText);
    
    // Use the curated image service for consistent, high-quality images
    const { getDestinationImages } = await import('./image-service')
    const destinationsWithImages = await Promise.all(
      destinations.map(async (dest: any) => {
        try {
          // Use destination name for more accurate image matching
          const images = await getDestinationImages(dest.name, 3)
          
          if (images && images.length > 0) {
            return {
              ...dest,
              image: images[0].url,
              images: images.map((img: any) => img.url)
            }
          }
        } catch (error) {
          console.error(`Error fetching images for ${dest.name}:`, error)
        }
        
        // Fallback to high-quality generic India tourism images
        const fallbackImages = [
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop'
        ]
        
        return {
          ...dest,
          image: fallbackImages[0],
          images: fallbackImages
        }
      })
    )
    
    return destinationsWithImages;
  } catch (error) {
    console.error('Error generating destinations with Groq:', error);
    throw error;
  }
}
