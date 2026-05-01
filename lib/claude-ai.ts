// Claude AI integration for trip planner using Anthropic API
// Claude Haiku 4.5 - Fast, efficient, and cost-effective

export async function generateItineraryWithClaude(
  destination: string,
  days: number,
  budget: string
): Promise<any> {
  const API_KEY = process.env.ANTHROPIC_API_KEY;

  // If no API key, return mock itinerary
  if (!API_KEY || API_KEY === 'YOUR_ANTHROPIC_API_KEY_HERE') {
    console.log('⚠️ No Anthropic API key configured - Using mock itinerary data');
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
          "duration": "1 hour",
          "cost": 400,
          "location": "Restaurant name"
        },
        {
          "time": "03:00 PM",
          "activity": "Post-lunch activity (e.g., Market/Shopping)",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": 500,
          "location": "Location name"
        },
        {
          "time": "06:00 PM",
          "activity": "Evening activity (e.g., Beach/Viewpoint)",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": 0,
          "location": "Location name"
        }
      ]
    }
  ],
  "tips": [
    "Travel tip 1",
    "Travel tip 2",
    "Travel tip 3"
  ]
}

Important:
- Use realistic Indian travel costs
- Include diverse activities (cultural, adventure, food, relaxation)
- Suggest authentic local experiences
- Consider travel time between locations
- Budget Low: ₹2000-3000/day, Medium: ₹4000-6000/day, High: ₹8000+/day
- Return only valid JSON without markdown formatting or code blocks`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4.5-20250110', // Claude Haiku 4.5 model
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    
    console.log('✅ Claude Haiku 4.5 API Success - Generated itinerary!');

    // Parse the JSON response
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/g, '');
    }

    const itinerary = JSON.parse(cleanText);
    return itinerary;

  } catch (error) {
    console.error('Error generating itinerary with Claude:', error);
    console.log('⚠️ Falling back to mock itinerary data');
    return generateMockItinerary(destination, days, budget);
  }
}

// Mock itinerary fallback
function generateMockItinerary(destination: string, days: number, budget: string) {
  const budgetMultiplier = budget === 'High' ? 1.5 : budget === 'Medium' ? 1 : 0.6;
  const dailyCost = Math.round(5000 * budgetMultiplier);
  
  return {
    destination,
    days,
    budget,
    totalCost: dailyCost * days,
    overview: `Explore the best of ${destination} over ${days} unforgettable days. Experience authentic Indian culture, cuisine, and hospitality.`,
    itinerary: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1} - Exploring ${destination}`,
      activities: [
        {
          time: '07:00 AM',
          activity: 'Morning Temple Visit',
          description: 'Start your day with spiritual serenity',
          duration: '2 hours',
          cost: Math.round(200 * budgetMultiplier),
          location: `${destination} Temple`
        },
        {
          time: '10:00 AM',
          activity: 'Historical Monument Tour',
          description: 'Discover rich heritage and architecture',
          duration: '2 hours',
          cost: Math.round(300 * budgetMultiplier),
          location: `${destination} Fort`
        },
        {
          time: '01:00 PM',
          activity: 'Traditional Lunch',
          description: 'Savor authentic local cuisine',
          duration: '1 hour',
          cost: Math.round(400 * budgetMultiplier),
          location: 'Local Restaurant'
        },
        {
          time: '03:00 PM',
          activity: 'Shopping & Markets',
          description: 'Browse local crafts and souvenirs',
          duration: '2 hours',
          cost: Math.round(500 * budgetMultiplier),
          location: 'Local Market'
        },
        {
          time: '06:00 PM',
          activity: 'Sunset Viewing',
          description: 'Enjoy breathtaking evening views',
          duration: '2 hours',
          cost: 0,
          location: `${destination} Viewpoint`
        }
      ]
    })),
    tips: [
      'Book accommodations in advance for better rates',
      'Try local street food for authentic experiences',
      'Respect local customs and dress codes at religious sites',
      'Carry cash as many small vendors don\'t accept cards',
      'Stay hydrated and use sunscreen'
    ]
  };
}
