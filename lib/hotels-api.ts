// Hotel API integration using Google Places Nearby Search (type=lodging)

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
  const placesApiKey =
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // If no Google Places key, return mock data
  if (!placesApiKey || placesApiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
    console.log('⚠️ No Google Places API key configured - Using mock hotel data');
    return generateMockHotels(location);
  }

  try {
    // Search for hotels using Google Places Nearby Search
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: '5000',
      type: 'lodging',
      language: 'en',
      key: placesApiKey,
    });

    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
    
    const response = await fetch(searchUrl, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places error: ${data.status}`);
    }
    
    // Parse the response and convert to our format
    if (data.results && Array.isArray(data.results)) {
      return data.results.slice(0, 8).map((hotel: any) => ({
        name: hotel.name || 'Hotel',
        rating: hotel.rating || 4.0,
        userRatingsTotal: hotel.user_ratings_total || 100,
        address: hotel.vicinity || hotel.formatted_address || location,
        priceLevel: typeof hotel.price_level === 'number' ? hotel.price_level : 2,
        price: estimatePriceFromLevel(hotel.price_level),
        distance: distanceKm(lat, lng, hotel.geometry?.location?.lat || lat, hotel.geometry?.location?.lng || lng),
        coordinates: {
          lat: hotel.geometry?.location?.lat || lat,
          lng: hotel.geometry?.location?.lng || lng
        },
        amenities: inferAmenitiesFromTypes(hotel.types),
        imageUrl: buildPlacePhotoUrl(hotel.photos, placesApiKey)
      }));
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching real hotels:', error);
    console.log('📋 Falling back to mock hotel data');
    return generateMockHotels(location);
  }
}

function estimatePriceFromLevel(level?: number): number | undefined {
  if (typeof level !== 'number') return undefined;
  const map: Record<number, number> = {
    0: 900,
    1: 1500,
    2: 3000,
    3: 6500,
    4: 11000,
  };
  return map[level] || 3000;
}

function distanceKm(fromLat: number, fromLng: number, toLat: number, toLng: number): string {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return `${distance.toFixed(1)} km`;
}

function inferAmenitiesFromTypes(types?: string[]): string[] {
  const base = ['Wi-Fi', 'Front Desk', 'Parking'];
  if (!types || types.length === 0) return base;

  const inferred = [...base];
  if (types.includes('spa')) inferred.push('Spa');
  if (types.includes('restaurant')) inferred.push('Restaurant');
  if (types.includes('gym')) inferred.push('Gym');
  return inferred.slice(0, 5);
}

function buildPlacePhotoUrl(photos: any[] | undefined, key: string): string | undefined {
  const ref = photos?.[0]?.photo_reference;
  if (!ref) return undefined;
  const params = new URLSearchParams({
    maxwidth: '1200',
    photo_reference: ref,
    key,
  });
  return `https://maps.googleapis.com/maps/api/place/photo?${params}`;
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
