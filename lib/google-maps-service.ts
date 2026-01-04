// Google Maps API Service for finding nearby places
// Note: Replace 'YOUR_GOOGLE_MAPS_API_KEY' with actual API key from Google Cloud Console

export interface PlaceType {
  id: string
  name: string
  category: 'restaurant' | 'hotel' | 'food_stall' | 'atm' | 'hospital' | 'gas_station' | 'pharmacy' | 'tourist_attraction'
  icon: string
}

export const placeTypes: PlaceType[] = [
  { id: 'restaurant', name: 'Restaurants', category: 'restaurant', icon: '🍽️' },
  { id: 'hotel', name: 'Hotels', category: 'hotel', icon: '🏨' },
  { id: 'cafe', name: 'Food Stalls & Cafes', category: 'food_stall', icon: '☕' },
  { id: 'atm', name: 'ATMs', category: 'atm', icon: '🏧' },
  { id: 'hospital', name: 'Hospitals', category: 'hospital', icon: '🏥' },
  { id: 'gas_station', name: 'Gas Stations', category: 'gas_station', icon: '⛽' },
  { id: 'pharmacy', name: 'Pharmacies', category: 'pharmacy', icon: '💊' },
  { id: 'tourist_attraction', name: 'Attractions', category: 'tourist_attraction', icon: '🎯' }
]

export interface NearbyPlace {
  id: string
  name: string
  category: string
  address: string
  rating: number
  totalRatings: number
  distance: string
  isOpen: boolean
  openingHours?: string[]
  priceLevel?: number // 1-4 (₹ to ₹₹₹₹)
  phoneNumber?: string
  website?: string
  photos?: string[]
  location: {
    lat: number
    lng: number
  }
  types: string[]
}

export interface Destination {
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
}

// Simulated Google Maps API responses (replace with actual API calls in production)
const mockNearbyPlaces: Record<string, NearbyPlace[]> = {
  'restaurant': [
    {
      id: '1',
      name: 'Peshawri - ITC Mughal',
      category: 'restaurant',
      address: 'ITC Mughal, Taj Ganj, Agra, Uttar Pradesh 282001',
      rating: 4.6,
      totalRatings: 2340,
      distance: '0.5 km',
      isOpen: true,
      openingHours: ['Mon-Sun: 12:30 PM - 11:30 PM'],
      priceLevel: 4,
      phoneNumber: '+91 562 402 1700',
      website: 'https://www.itchotels.com',
      photos: ['/placeholder.jpg'],
      location: { lat: 27.1752, lng: 78.0422 },
      types: ['restaurant', 'fine_dining', 'north_indian']
    },
    {
      id: '2',
      name: 'Pinch of Spice',
      category: 'restaurant',
      address: 'MG Road, Agra, Uttar Pradesh',
      rating: 4.3,
      totalRatings: 1856,
      distance: '1.2 km',
      isOpen: true,
      openingHours: ['Mon-Sun: 11:00 AM - 11:00 PM'],
      priceLevel: 2,
      phoneNumber: '+91 562 426 0000',
      location: { lat: 27.1766, lng: 78.0430 },
      types: ['restaurant', 'indian', 'casual_dining']
    },
    {
      id: '3',
      name: 'Dasaprakash Restaurant',
      category: 'restaurant',
      address: 'Taj Road, Agra',
      rating: 4.1,
      totalRatings: 980,
      distance: '0.8 km',
      isOpen: true,
      openingHours: ['Mon-Sun: 7:00 AM - 10:30 PM'],
      priceLevel: 2,
      location: { lat: 27.1740, lng: 78.0415 },
      types: ['restaurant', 'south_indian', 'vegetarian']
    }
  ],
  'hotel': [
    {
      id: '4',
      name: 'The Oberoi Amarvilas',
      category: 'hotel',
      address: 'Taj East Gate Road, Agra, Uttar Pradesh 282001',
      rating: 4.9,
      totalRatings: 3450,
      distance: '0.3 km',
      isOpen: true,
      priceLevel: 4,
      phoneNumber: '+91 562 223 1515',
      website: 'https://www.oberoihotels.com',
      location: { lat: 27.1748, lng: 78.0418 },
      types: ['hotel', 'luxury', '5_star']
    },
    {
      id: '5',
      name: 'ITC Mughal',
      category: 'hotel',
      address: 'Taj Ganj, Agra, Uttar Pradesh 282001',
      rating: 4.7,
      totalRatings: 2890,
      distance: '0.6 km',
      isOpen: true,
      priceLevel: 4,
      phoneNumber: '+91 562 402 1700',
      location: { lat: 27.1755, lng: 78.0425 },
      types: ['hotel', 'luxury', '5_star']
    },
    {
      id: '6',
      name: 'Hotel Taj Resorts',
      category: 'hotel',
      address: 'Fatehabad Road, Agra',
      rating: 4.2,
      totalRatings: 1234,
      distance: '1.5 km',
      isOpen: true,
      priceLevel: 3,
      phoneNumber: '+91 562 223 2100',
      location: { lat: 27.1780, lng: 78.0445 },
      types: ['hotel', 'mid_range', '4_star']
    }
  ],
  'cafe': [
    {
      id: '7',
      name: 'Sheroes Hangout Cafe',
      category: 'food_stall',
      address: 'Chowk Kagzi Mohalla, Agra',
      rating: 4.5,
      totalRatings: 567,
      distance: '2.1 km',
      isOpen: true,
      openingHours: ['Mon-Sun: 10:00 AM - 8:00 PM'],
      priceLevel: 1,
      phoneNumber: '+91 8392 929 292',
      location: { lat: 27.1820, lng: 78.0480 },
      types: ['cafe', 'social_enterprise']
    },
    {
      id: '8',
      name: 'Cafe Coffee Day - Taj East Gate',
      category: 'food_stall',
      address: 'Near Taj Mahal East Gate, Agra',
      rating: 3.9,
      totalRatings: 432,
      distance: '0.4 km',
      isOpen: true,
      openingHours: ['Mon-Sun: 8:00 AM - 10:00 PM'],
      priceLevel: 2,
      location: { lat: 27.1745, lng: 78.0412 },
      types: ['cafe', 'coffee_shop']
    }
  ],
  'atm': [
    {
      id: '9',
      name: 'HDFC Bank ATM',
      category: 'atm',
      address: 'Taj Ganj, Near East Gate',
      rating: 3.8,
      totalRatings: 45,
      distance: '0.2 km',
      isOpen: true,
      openingHours: ['24 Hours'],
      location: { lat: 27.1743, lng: 78.0410 },
      types: ['atm', 'bank']
    },
    {
      id: '10',
      name: 'SBI ATM',
      category: 'atm',
      address: 'Fatehabad Road, Agra',
      rating: 3.5,
      totalRatings: 23,
      distance: '0.7 km',
      isOpen: true,
      openingHours: ['24 Hours'],
      location: { lat: 27.1760, lng: 78.0428 },
      types: ['atm', 'bank']
    }
  ],
  'hospital': [
    {
      id: '11',
      name: 'District Hospital Agra',
      category: 'hospital',
      address: 'MG Road, Agra',
      rating: 3.9,
      totalRatings: 234,
      distance: '3.5 km',
      isOpen: true,
      openingHours: ['24 Hours Emergency'],
      phoneNumber: '+91 562 246 3142',
      location: { lat: 27.1850, lng: 78.0510 },
      types: ['hospital', 'emergency']
    },
    {
      id: '12',
      name: 'Pushpanjali Hospital',
      category: 'hospital',
      address: 'Fatehabad Road, Agra',
      rating: 4.2,
      totalRatings: 567,
      distance: '2.8 km',
      isOpen: true,
      phoneNumber: '+91 562 246 0999',
      location: { lat: 27.1820, lng: 78.0470 },
      types: ['hospital', 'multi_specialty']
    }
  ],
  'gas_station': [
    {
      id: '13',
      name: 'Indian Oil Petrol Pump',
      category: 'gas_station',
      address: 'Fatehabad Road, Agra',
      rating: 4.0,
      totalRatings: 89,
      distance: '1.8 km',
      isOpen: true,
      openingHours: ['24 Hours'],
      location: { lat: 27.1790, lng: 78.0450 },
      types: ['gas_station', 'fuel']
    }
  ],
  'pharmacy': [
    {
      id: '14',
      name: 'Apollo Pharmacy',
      category: 'pharmacy',
      address: 'Near Taj Mahal, Agra',
      rating: 4.3,
      totalRatings: 156,
      distance: '0.6 km',
      isOpen: true,
      openingHours: ['Mon-Sun: 8:00 AM - 10:00 PM'],
      phoneNumber: '+91 562 246 8888',
      location: { lat: 27.1758, lng: 78.0426 },
      types: ['pharmacy', 'health']
    }
  ],
  'tourist_attraction': [
    {
      id: '15',
      name: 'Agra Fort',
      category: 'tourist_attraction',
      address: 'Agra Fort, Rakabganj, Agra',
      rating: 4.8,
      totalRatings: 45678,
      distance: '2.5 km',
      isOpen: true,
      openingHours: ['Mon-Sun: 6:00 AM - 6:00 PM'],
      priceLevel: 1,
      location: { lat: 27.1795, lng: 78.0211 },
      types: ['tourist_attraction', 'historical', 'unesco']
    },
    {
      id: '16',
      name: 'Mehtab Bagh',
      category: 'tourist_attraction',
      address: 'Nagla Devjit, Agra',
      rating: 4.5,
      totalRatings: 8934,
      distance: '1.2 km',
      isOpen: true,
      openingHours: ['Mon-Sun: 6:00 AM - 6:30 PM'],
      priceLevel: 1,
      location: { lat: 27.1800, lng: 78.0450 },
      types: ['tourist_attraction', 'garden', 'view_point']
    }
  ]
}

// Geocode destination name to coordinates
export async function geocodeDestination(destinationName: string): Promise<Destination | null> {
  // In production, use: https://maps.googleapis.com/maps/api/geocode/json?address=${destinationName}&key=${API_KEY}
  
  // Validate input
  if (!destinationName || typeof destinationName !== 'string') {
    return null
  }
  
  // Simulated geocoding for Indian destinations
  const destinations: Record<string, Destination> = {
    'taj mahal': {
      name: 'Taj Mahal',
      address: 'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001',
      location: { lat: 27.1751, lng: 78.0421 }
    },
    'agra': {
      name: 'Agra',
      address: 'Agra, Uttar Pradesh',
      location: { lat: 27.1767, lng: 78.0081 }
    },
    'jaipur': {
      name: 'Jaipur',
      address: 'Jaipur, Rajasthan',
      location: { lat: 26.9124, lng: 75.7873 }
    },
    'goa': {
      name: 'Goa',
      address: 'Goa, India',
      location: { lat: 15.2993, lng: 74.1240 }
    },
    'varanasi': {
      name: 'Varanasi',
      address: 'Varanasi, Uttar Pradesh',
      location: { lat: 25.3176, lng: 82.9739 }
    },
    'manali': {
      name: 'Manali',
      address: 'Manali, Himachal Pradesh',
      location: { lat: 32.2396, lng: 77.1887 }
    },
    'kerala': {
      name: 'Kerala',
      address: 'Alleppey, Kerala',
      location: { lat: 9.4981, lng: 76.3388 }
    },
    'leh': {
      name: 'Leh',
      address: 'Leh, Ladakh',
      location: { lat: 34.1526, lng: 77.5771 }
    },
    'rishikesh': {
      name: 'Rishikesh',
      address: 'Rishikesh, Uttarakhand',
      location: { lat: 30.0869, lng: 78.2676 }
    }
  }

  const normalizedQuery = destinationName.toLowerCase().trim()
  
  // Return null if empty after trimming
  if (!normalizedQuery) {
    return null
  }
  
  // Check exact matches first
  if (destinations[normalizedQuery]) {
    return destinations[normalizedQuery]
  }
  
  // Check partial matches
  for (const key in destinations) {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      return destinations[key]
    }
  }
  
  return null
}

// Search nearby places using Google Places API
export async function searchNearbyPlaces(
  location: { lat: number; lng: number },
  placeType: string,
  radius: number = 5000 // meters
): Promise<NearbyPlace[]> {
  // In production, use: https://maps.googleapis.com/maps/api/place/nearbysearch/json
  // ?location=${lat},${lng}&radius=${radius}&type=${placeType}&key=${API_KEY}
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return mock data based on place type
  return mockNearbyPlaces[placeType] || []
}

// Get place details
export async function getPlaceDetails(placeId: string): Promise<NearbyPlace | null> {
  // In production, use: https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}
  
  // Search through all mock places
  for (const category in mockNearbyPlaces) {
    const found = mockNearbyPlaces[category].find(p => p.id === placeId)
    if (found) return found
  }
  
  return null
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }
  return `${km.toFixed(1)} km`
}

// Get directions URL
export function getDirectionsUrl(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`
}

// Price level to rupee symbols
export function getPriceLevelSymbol(level: number = 2): string {
  return '₹'.repeat(Math.min(level, 4))
}
