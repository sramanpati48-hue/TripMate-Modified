// Real hotel API integration using RapidAPI Booking.com

export interface HotelData {
  name: string;
  rating: number;
  userRatingsTotal: number;
  address: string;
  priceLevel: number;
  price?: number;
  distance?: string;
  coordinates?: { lat: number; lng: number };
  amenities?: string[];
  imageUrl?: string;
}

export async function getRealHotels(
  location: string,
  lat: number,
  lng: number
): Promise<HotelData[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  // If no API key, return mock data
  if (!rapidApiKey || rapidApiKey === 'YOUR_RAPIDAPI_KEY_HERE') {
    console.log('⚠️ No RapidAPI key configured - Using mock hotel data');
    return generateMockHotels(location);
  }

  try {
    // Search for hotels using Booking.com API
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      adults_number: '2',
      checkin_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkout_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      filter_by_currency: 'INR',
      locale: 'en-us',
      room_number: '1',
      units: 'metric',
      order_by: 'popularity',
      page_number: '0'
    });
    
    const searchUrl = `https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates?${params}`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response and convert to our format
    if (data.result && Array.isArray(data.result)) {
      return data.result.slice(0, 8).map((hotel: any) => ({
        name: hotel.hotel_name || 'Hotel',
        rating: hotel.review_score ? hotel.review_score / 2 : 4.0, // Convert 10-scale to 5-scale
        userRatingsTotal: hotel.review_nr || 100,
        address: hotel.address || location,
        priceLevel: getPriceLevel(hotel.min_total_price),
        price: hotel.min_total_price ? Math.round(hotel.min_total_price) : undefined,
        distance: hotel.distance ? `${hotel.distance} km` : undefined,
        coordinates: {
          lat: hotel.latitude || lat,
          lng: hotel.longitude || lng
        },
        amenities: hotel.hotel_facilities?.slice(0, 5) || ['Wi-Fi', 'Restaurant'],
        imageUrl: hotel.max_photo_url || hotel.main_photo_url
      }));
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching real hotels:', error);
    console.log('📋 Falling back to mock hotel data');
    return generateMockHotels(location);
  }
}

function getPriceLevel(price?: number): number {
  if (!price) return 2;
  if (price < 2000) return 1;
  if (price < 5000) return 2;
  if (price < 10000) return 3;
  return 4;
}

function generateMockHotels(location: string): HotelData[] {
  const hotelNames = [
    'The Grand Palace Hotel',
    'Heritage Boutique Resort',
    'Royal Comfort Inn',
    'Sunrise Heights',
    'Majestic Garden Resort',
    'Crown Plaza Suites',
    'Golden Gate Hotel',
    'Paradise Valley Resort'
  ];

  return hotelNames.map((name, index) => ({
    name,
    rating: 3.8 + Math.random() * 1.2,
    userRatingsTotal: Math.floor(100 + Math.random() * 1900),
    address: `${location} Center, Near Main Market`,
    priceLevel: Math.floor(1 + Math.random() * 3),
    price: Math.floor(900 + Math.random() * 7600),
    distance: `${(0.5 + Math.random() * 4.5).toFixed(1)} km`,
    amenities: [
      'Free Wi-Fi',
      'Restaurant',
      'Room Service',
      'Parking',
      'Air Conditioning'
    ].slice(0, 3 + Math.floor(Math.random() * 3))
  }));
}
