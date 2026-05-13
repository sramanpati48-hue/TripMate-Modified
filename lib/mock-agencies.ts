export type MockVerificationStatus = 'VERIFIED' | 'PENDING' | 'UNDER_REVIEW' | 'REJECTED' | 'SUSPENDED'

export type MockPlan = {
  id: string
  title: string
  duration: number
  pricePerPerson: number
  category: string
  description: string
  imageUrl: string | null
  images: string[]
  destinations: string[]
  itinerary: Array<{ day: number; title: string; activities: string[] }>
}

export type MockReview = {
  id: string
  name: string
  initials: string
  rating: number
  comment: string
  date: string
}

export type MockAgency = {
  id: string
  agencyName: string
  city: string
  state: string
  logoUrl: string | null
  verificationStatus: MockVerificationStatus
  planCount: number
  avgRating: number
  description: string
  categories: string[]
  plans: MockPlan[]
  reviews: MockReview[]
}

const PHOTO_URLS = {
  goaShacks: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=500&fit=crop&auto=format',
  goaBaga: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format',
  goaChurch: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=500&fit=crop&auto=format',
  goaMarket: 'https://images.unsplash.com/photo-1533923156502-be31530547c4?w=800&h=500&fit=crop&auto=format',
  goaCliff: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=500&fit=crop&auto=format',
  goaHouseboat: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop&auto=format',
  mumbaiMarineDrive: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=500&fit=crop&auto=format',
  mumbaiJuhu: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=500&fit=crop&auto=format',
  mumbaiGateway: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=500&fit=crop&auto=format',
  jaipurHawaMahal: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=800&h=500&fit=crop&auto=format',
  jaipurAmberFort: 'https://images.unsplash.com/photo-1524230616393-b28175049e35?w=800&h=500&fit=crop&auto=format',
  jaipurPalace: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=500&fit=crop&auto=format',
  darjeelingTeaGarden: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=500&fit=crop&auto=format',
  darjeelingMountain: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&auto=format',
  darjeelingTeaPicker: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&auto=format',
  keralaBackwaters: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=500&fit=crop&auto=format',
  keralaHouseboat: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&h=500&fit=crop&auto=format',
  kochiHarbour: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=500&fit=crop&auto=format',
  varanasiGhats: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&h=500&fit=crop&auto=format',
  varanasiAarti: 'https://images.unsplash.com/photo-1570127240796-1d08a13e1be2?w=800&h=500&fit=crop&auto=format',
  varanasiLanes: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800&h=500&fit=crop&auto=format',
  assamRhino: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=500&fit=crop&auto=format',
  assamRiver: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=500&fit=crop&auto=format',
  assamTeaEstate: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&auto=format',
}

const LOGO_URLS = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=80&h=80&fit=crop&auto=format',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=80&h=80&fit=crop&auto=format',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=80&h=80&fit=crop&auto=format',
  darjeeling: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=80&h=80&fit=crop&auto=format',
  kochi: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=80&h=80&fit=crop&auto=format',
  varanasi: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=80&h=80&fit=crop&auto=format',
  guwahati: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=80&h=80&fit=crop&auto=format',
}

const GOA_NORTH_BEACH_IMAGES = [PHOTO_URLS.goaBaga, PHOTO_URLS.goaCliff, PHOTO_URLS.goaShacks]
const GOA_SOUTH_SERENITY_IMAGES = [PHOTO_URLS.goaHouseboat, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&auto=format', PHOTO_URLS.goaBaga]
const GOA_HERITAGE_IMAGES = [PHOTO_URLS.goaChurch, PHOTO_URLS.goaMarket, PHOTO_URLS.goaCliff]
const GOA_NIGHTLIFE_IMAGES = [
  'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&h=500&fit=crop&auto=format',
  PHOTO_URLS.goaBaga,
  PHOTO_URLS.goaCliff,
]

const MUMBAI_LUXURY_IMAGES = [PHOTO_URLS.mumbaiGateway, PHOTO_URLS.mumbaiMarineDrive, PHOTO_URLS.mumbaiJuhu]
const MUMBAI_FAMILY_IMAGES = [PHOTO_URLS.mumbaiJuhu, PHOTO_URLS.mumbaiMarineDrive, PHOTO_URLS.mumbaiGateway]
const MUMBAI_NIGHTLIFE_IMAGES = [PHOTO_URLS.mumbaiMarineDrive, PHOTO_URLS.mumbaiGateway, PHOTO_URLS.mumbaiJuhu]

const JAIPUR_HERITAGE_IMAGES = [PHOTO_URLS.jaipurHawaMahal, PHOTO_URLS.jaipurAmberFort, PHOTO_URLS.jaipurPalace]
const JAIPUR_PILGRIMAGE_IMAGES = [PHOTO_URLS.jaipurHawaMahal, PHOTO_URLS.jaipurAmberFort, PHOTO_URLS.jaipurPalace]
const JAIPUR_DESERT_IMAGES = [PHOTO_URLS.jaipurAmberFort, PHOTO_URLS.jaipurHawaMahal, PHOTO_URLS.jaipurPalace]

const DARJEELING_TEA_TRAIL_IMAGES = [PHOTO_URLS.darjeelingTeaGarden, PHOTO_URLS.darjeelingMountain, PHOTO_URLS.darjeelingTeaPicker]
const DARJEELING_FAMILY_IMAGES = [PHOTO_URLS.darjeelingTeaPicker, PHOTO_URLS.darjeelingTeaGarden, PHOTO_URLS.darjeelingMountain]
const DARJEELING_ADVENTURE_IMAGES = [PHOTO_URLS.darjeelingMountain, PHOTO_URLS.darjeelingTeaGarden, PHOTO_URLS.darjeelingTeaPicker]

const KOCHI_BACKWATER_IMAGES = [PHOTO_URLS.keralaBackwaters, PHOTO_URLS.keralaHouseboat, PHOTO_URLS.kochiHarbour]
const KOCHI_LUXURY_IMAGES = [PHOTO_URLS.keralaBackwaters, PHOTO_URLS.keralaHouseboat, PHOTO_URLS.kochiHarbour]
const KOCHI_FAMILY_IMAGES = [PHOTO_URLS.kochiHarbour, PHOTO_URLS.keralaBackwaters, PHOTO_URLS.keralaHouseboat]

const VARANASI_PILGRIMAGE_IMAGES = [PHOTO_URLS.varanasiGhats, PHOTO_URLS.varanasiAarti, PHOTO_URLS.varanasiLanes]
const VARANASI_HERITAGE_IMAGES = [PHOTO_URLS.varanasiLanes, PHOTO_URLS.varanasiGhats, PHOTO_URLS.varanasiAarti]
const VARANASI_FAMILY_IMAGES = [PHOTO_URLS.varanasiGhats, PHOTO_URLS.varanasiAarti, PHOTO_URLS.varanasiLanes]

const ASSAM_WILDLIFE_IMAGES = [PHOTO_URLS.assamRhino, PHOTO_URLS.assamRiver, PHOTO_URLS.assamTeaEstate]
const ASSAM_ADVENTURE_IMAGES = [PHOTO_URLS.assamRhino, PHOTO_URLS.assamRiver, PHOTO_URLS.assamTeaEstate]
const ASSAM_FAMILY_IMAGES = [PHOTO_URLS.assamRiver, PHOTO_URLS.assamTeaEstate, PHOTO_URLS.assamRhino]

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const

export const CATEGORY_FILTERS = [
  'All',
  'ADVENTURE',
  'PILGRIMAGE',
  'BEACH',
  'HILL_STATION',
  'HERITAGE',
  'WILDLIFE',
  'LUXURY',
  'FAMILY',
] as const

const makeReviews = (prefix: string): MockReview[] => [
  {
    id: `${prefix}-review-1`,
    name: 'Ananya Sharma',
    initials: 'AS',
    rating: 5,
    comment: 'Smooth planning, quick support, and exactly the kind of local detail we needed for our trip.',
    date: '2 weeks ago',
  },
  {
    id: `${prefix}-review-2`,
    name: 'Rohan Mehta',
    initials: 'RM',
    rating: 4,
    comment: 'Great itinerary balance with clear pricing and a very responsive team throughout the booking.',
    date: '1 month ago',
  },
  {
    id: `${prefix}-review-3`,
    name: 'Priya Nair',
    initials: 'PN',
    rating: 5,
    comment: 'The experience felt premium from start to finish and every hotel recommendation was spot on.',
    date: '3 months ago',
  },
]

export const MOCK_AGENCIES: MockAgency[] = [
  {
    id: 'mock-goa-sunshine',
    agencyName: 'Goa Sunshine Escapes',
    city: 'Panaji',
    state: 'Goa',
    logoUrl: LOGO_URLS.goa,
    verificationStatus: 'VERIFIED',
    planCount: 4,
    avgRating: 4.7,
    description: 'Sun, sand, seafood, and Portugese heritage — curated Goa experiences for every kind of traveler.',
    categories: ['BEACH', 'HERITAGE', 'FAMILY', 'ADVENTURE'],
    plans: [
      {
        id: 'goa-north-beach-hopper',
        title: 'North Goa Beach Hopper',
        duration: 3,
        pricePerPerson: 8999,
        category: 'BEACH',
        description: 'Beach-hopping getaway across North Goa with resorts, water sports, and sunset cruises.',
        imageUrl: null,
        images: GOA_NORTH_BEACH_IMAGES,
        destinations: ['Baga', 'Calangute', 'Anjuna'],
        itinerary: [
          { day: 1, title: 'Arrival & Baga Beach', activities: ['Check-in resort', 'Baga beach walk', 'Beach shack dinner'] },
          { day: 2, title: 'Water Sports Day', activities: ['Parasailing at Calangute', 'Jet ski', 'Anjuna flea market'] },
          { day: 3, title: 'Sunset Cruise & Departure', activities: ['Chapora Fort visit', 'Sunset dolphin cruise', 'Check-out'] },
        ],
      },
      {
        id: 'goa-south-serenity',
        title: 'South Goa Serenity',
        duration: 4,
        pricePerPerson: 12499,
        category: 'BEACH',
        description: 'A slower South Goa holiday with beach huts, yoga, seafood dinners, and scooter freedom.',
        imageUrl: null,
        images: GOA_SOUTH_SERENITY_IMAGES,
        destinations: ['Palolem', 'Agonda', 'Colva'],
        itinerary: [
          { day: 1, title: 'Palolem Arrival', activities: ['Beach hut check-in', 'Palolem beach stroll', 'Seafood dinner'] },
          { day: 2, title: 'Agonda Slow Day', activities: ['Morning yoga', 'Agonda beach', 'Kayaking'] },
          { day: 3, title: 'Colva & Markets', activities: ['Colva beach', 'Local market shopping', 'Sunset at Benaulim'] },
          { day: 4, title: 'Departure', activities: ['Breakfast', 'Beach walk', 'Check-out'] },
        ],
      },
      {
        id: 'goa-heritage-culture-trail',
        title: 'Goa Heritage & Culture Trail',
        duration: 3,
        pricePerPerson: 7499,
        category: 'CULTURAL',
        description: 'Explore Old Goa, Fontainhas, and Panaji with cuisine workshops and heritage walks.',
        imageUrl: null,
        images: GOA_HERITAGE_IMAGES,
        destinations: ['Panaji', 'Old Goa', 'Fontainhas'],
        itinerary: [
          { day: 1, title: 'Old Goa Churches', activities: ['Basilica of Bom Jesus', 'Se Cathedral', 'Latin Quarter walk'] },
          { day: 2, title: 'Fontainhas Heritage', activities: ['Fontainhas walk', 'Goan cuisine class', 'Mandovi ferry'] },
          { day: 3, title: 'Panaji Markets', activities: ['Municipal market', 'Cafe Bhonsle breakfast', 'Departure'] },
        ],
      },
      {
        id: 'goa-nightlife-adventure',
        title: 'Goa Nightlife & Adventure',
        duration: 4,
        pricePerPerson: 14999,
        category: 'ADVENTURE',
        description: 'A high-energy Goa itinerary with cliff views, nightlife, ATV rides, and beach parties.',
        imageUrl: null,
        images: GOA_NIGHTLIFE_IMAGES,
        destinations: ['Baga', 'Vagator', 'Anjuna'],
        itinerary: [
          { day: 1, title: 'Arrival & Baga Night', activities: ['Check-in', "Tito's Lane", 'Beach bonfire'] },
          { day: 2, title: 'Vagator Cliffs', activities: ['Cliff jumping', 'Chapora Fort', 'Hilltop Observatory party'] },
          { day: 3, title: 'Anjuna Adventure', activities: ['ATV ride', 'Anjuna flea market', 'Silent noise party'] },
          { day: 4, title: 'Sunrise & Departure', activities: ['Sunrise at Baga', 'Breakfast', 'Check-out'] },
        ],
      },
    ],
    reviews: makeReviews('goa-sunshine'),
  },
  {
    id: 'mock-mumbai-horizons',
    agencyName: 'Mumbai Horizons Travel Co.',
    city: 'Mumbai',
    state: 'Maharashtra',
    logoUrl: LOGO_URLS.mumbai,
    verificationStatus: 'VERIFIED',
    planCount: 3,
    avgRating: 4.9,
    description: 'Curated coastal escapes, nightlife weekends, and premium India itineraries.',
    categories: ['BEACH', 'LUXURY', 'FAMILY'],
    plans: [
      {
        id: 'coastal-luxury-weekend',
        title: 'Coastal Luxury Weekend',
        duration: 4,
        pricePerPerson: 18999,
        category: 'BEACH',
        description: 'A polished beach getaway with boutique stays, sunset cruises, and private transfers.',
        imageUrl: null,
        images: MUMBAI_LUXURY_IMAGES,
        destinations: ['Alibaug', 'Mumbai', 'Gateway of India'],
        itinerary: [
          { day: 1, title: 'Arrival and waterfront check-in', activities: ['Private transfer', 'Seaside welcome dinner'] },
          { day: 2, title: 'Beach and cruise day', activities: ['Beach club time', 'Sunset harbour cruise'] },
          { day: 3, title: 'City leisure', activities: ['Cultural walk', 'Fine dining evening'] },
        ],
      },
      {
        id: 'mumbai-family-escape',
        title: 'Mumbai Family Escape',
        duration: 5,
        pricePerPerson: 15999,
        category: 'FAMILY',
        description: 'Family-friendly city and coast itinerary with kid-safe activities and flexible pacing.',
        imageUrl: null,
        images: MUMBAI_FAMILY_IMAGES,
        destinations: ['Mumbai', 'EsselWorld', 'Marine Drive'],
        itinerary: [
          { day: 1, title: 'Arrival and settle in', activities: ['Hotel check-in', 'Marine Drive stroll'] },
          { day: 2, title: 'Theme park day', activities: ['EsselWorld visit', 'Dinner at family restaurant'] },
          { day: 3, title: 'Museum and market day', activities: ['Local museums', 'Shopping stop'] },
        ],
      },
      {
        id: 'mumbai-premium-nightlife',
        title: 'Premium Nightlife & Dining',
        duration: 3,
        pricePerPerson: 12999,
        category: 'LUXURY',
        description: 'A short premium break built around rooftop dining, city lights, and exclusive transfers.',
        imageUrl: null,
        images: MUMBAI_NIGHTLIFE_IMAGES,
        destinations: ['Mumbai', 'Bandra', 'Colaba'],
        itinerary: [
          { day: 1, title: 'Luxury city arrival', activities: ['Airport pickup', 'Rooftop dinner'] },
          { day: 2, title: 'Art and nightlife', activities: ['Gallery hop', 'Signature cocktail trail'] },
          { day: 3, title: 'Departure morning', activities: ['Brunch', 'Late checkout'] },
        ],
      },
    ],
    reviews: makeReviews('mumbai-horizons'),
  },
  {
    id: 'mock-jaipur-royal',
    agencyName: 'Royal Jaipur Journeys',
    city: 'Jaipur',
    state: 'Rajasthan',
    logoUrl: LOGO_URLS.jaipur,
    verificationStatus: 'VERIFIED',
    planCount: 3,
    avgRating: 4.8,
    description: 'Heritage circuits, desert stays, and palace-to-palace travel planning.',
    categories: ['HERITAGE', 'PILGRIMAGE', 'LUXURY'],
    plans: [
      {
        id: 'pink-city-heritage-loop',
        title: 'Pink City Heritage Loop',
        duration: 4,
        pricePerPerson: 14999,
        category: 'HERITAGE',
        description: 'Explore Jaipur’s forts, bazaars, and palace hotels with a polished guided route.',
        imageUrl: null,
        images: JAIPUR_HERITAGE_IMAGES,
        destinations: ['Jaipur', 'Amber Fort', 'City Palace'],
        itinerary: [
          { day: 1, title: 'Arrival in Jaipur', activities: ['Hotel check-in', 'Evening bazaar walk'] },
          { day: 2, title: 'Fort circuit', activities: ['Amber Fort', 'Jal Mahal stop'] },
          { day: 3, title: 'Palace and dining', activities: ['City Palace', 'Rajasthani dinner'] },
        ],
      },
      {
        id: 'rajasthan-pilgrimage-circuit',
        title: 'Rajasthan Pilgrimage Circuit',
        duration: 6,
        pricePerPerson: 17999,
        category: 'PILGRIMAGE',
        description: 'A spiritual route through sacred sites with comfortable travel and devotional pacing.',
        imageUrl: null,
        images: JAIPUR_PILGRIMAGE_IMAGES,
        destinations: ['Ajmer', 'Pushkar', 'Jaipur'],
        itinerary: [
          { day: 1, title: 'Jaipur arrival', activities: ['Pickup', 'Temple briefing'] },
          { day: 2, title: 'Ajmer Sharif visit', activities: ['Dargah visit', 'Local guide'] },
          { day: 3, title: 'Pushkar exploration', activities: ['Lake walk', 'Temple circuit'] },
        ],
      },
      {
        id: 'jaipur-desert-luxury',
        title: 'Jaipur Desert Luxury Stay',
        duration: 5,
        pricePerPerson: 21999,
        category: 'LUXURY',
        description: 'Luxury desert camps, private transfers, and curated dining under the stars.',
        imageUrl: null,
        images: JAIPUR_DESERT_IMAGES,
        destinations: ['Jaipur', 'Sam Sand Dunes', 'Jaisalmer'],
        itinerary: [
          { day: 1, title: 'Arrival and heritage intro', activities: ['Luxury hotel check-in', 'Welcome dinner'] },
          { day: 2, title: 'Desert transfer', activities: ['Private transfer', 'Camp check-in'] },
          { day: 3, title: 'Desert evening', activities: ['Camel sunset ride', 'Cultural show'] },
        ],
      },
    ],
    reviews: makeReviews('jaipur-royal'),
  },
  {
    id: 'mock-darjeeling-peaks',
    agencyName: 'Darjeeling Peaks & Trails',
    city: 'Darjeeling',
    state: 'West Bengal',
    logoUrl: LOGO_URLS.darjeeling,
    verificationStatus: 'PENDING',
    planCount: 3,
    avgRating: 4.5,
    description: 'Tea estate stays, mountain views, and slow-travel Himalayan experiences.',
    categories: ['HILL_STATION', 'ADVENTURE', 'FAMILY'],
    plans: [
      {
        id: 'tea-trail-retreat',
        title: 'Tea Trail Retreat',
        duration: 4,
        pricePerPerson: 13999,
        category: 'HILL_STATION',
        description: 'A relaxed hill-station itinerary with tea gardens, sunrise viewpoints, and heritage stays.',
        imageUrl: null,
        images: DARJEELING_TEA_TRAIL_IMAGES,
        destinations: ['Darjeeling', 'Tiger Hill', 'Batasia Loop'],
        itinerary: [
          { day: 1, title: 'Arrival and tea estate walk', activities: ['Hill check-in', 'Tea tasting'] },
          { day: 2, title: 'Sunrise and local views', activities: ['Tiger Hill sunrise', 'Toy train stop'] },
          { day: 3, title: 'Town exploration', activities: ['Market stroll', 'Café dinner'] },
        ],
      },
      {
        id: 'darjeeling-family-scenic',
        title: 'Darjeeling Family Scenic',
        duration: 5,
        pricePerPerson: 14999,
        category: 'FAMILY',
        description: 'Family-friendly mountain itinerary with easy transfers and flexible sight-seeing.',
        imageUrl: null,
        images: DARJEELING_FAMILY_IMAGES,
        destinations: ['Darjeeling', 'Ghoom', 'Happy Valley'],
        itinerary: [
          { day: 1, title: 'Arrival and settle in', activities: ['Hotel check-in', 'Evening tea'] },
          { day: 2, title: 'Scenic rail and viewpoints', activities: ['Toy train', 'Batasia Loop'] },
          { day: 3, title: 'Leisure day', activities: ['Park time', 'Family dinner'] },
        ],
      },
      {
        id: 'himalayan-adventure-short',
        title: 'Himalayan Adventure Short Break',
        duration: 3,
        pricePerPerson: 10999,
        category: 'ADVENTURE',
        description: 'An active hill-station break with light trekking, viewpoints, and outdoor meals.',
        imageUrl: null,
        images: DARJEELING_ADVENTURE_IMAGES,
        destinations: ['Darjeeling', 'Senchal', 'Sandakphu Base'],
        itinerary: [
          { day: 1, title: 'Arrival and orientation', activities: ['Pickup', 'Adventure briefing'] },
          { day: 2, title: 'Trek and viewpoints', activities: ['Guided walk', 'Picnic lunch'] },
          { day: 3, title: 'Departure', activities: ['Breakfast', 'Drop-off'] },
        ],
      },
    ],
    reviews: makeReviews('darjeeling-peaks'),
  },
  {
    id: 'mock-kochi-tides',
    agencyName: 'Kochi Tides Explorers',
    city: 'Kochi',
    state: 'Kerala',
    logoUrl: LOGO_URLS.kochi,
    verificationStatus: 'VERIFIED',
    planCount: 3,
    avgRating: 4.7,
    description: 'Backwater cruises, Ayurvedic retreats, and tropical escape planning.',
    categories: ['BEACH', 'LUXURY', 'FAMILY'],
    plans: [
      {
        id: 'backwater-lagoon-escape',
        title: 'Backwater Lagoon Escape',
        duration: 4,
        pricePerPerson: 16999,
        category: 'BEACH',
        description: 'A serene Kerala trip with houseboat time, lagoon stays, and tropical dining.',
        imageUrl: null,
        images: KOCHI_BACKWATER_IMAGES,
        destinations: ['Kochi', 'Alleppey', 'Kumarakom'],
        itinerary: [
          { day: 1, title: 'Arrival in Kochi', activities: ['City transfer', 'Seafood dinner'] },
          { day: 2, title: 'Houseboat cruise', activities: ['Backwater sailing', 'Sunset on the deck'] },
          { day: 3, title: 'Lagoon leisure', activities: ['Resort time', 'Ayurveda session'] },
        ],
      },
      {
        id: 'kerala-wellness-luxury',
        title: 'Kerala Wellness Luxury',
        duration: 6,
        pricePerPerson: 23999,
        category: 'LUXURY',
        description: 'Premium wellness-focused itinerary with spa stays and private drivers.',
        imageUrl: null,
        images: KOCHI_LUXURY_IMAGES,
        destinations: ['Kochi', 'Munnar', 'Alleppey'],
        itinerary: [
          { day: 1, title: 'Arrival and spa reset', activities: ['Luxury transfer', 'Spa dinner'] },
          { day: 2, title: 'Munnar hills', activities: ['Tea estate visit', 'Scenic drive'] },
          { day: 3, title: 'Backwater calm', activities: ['Houseboat cruise', 'Sunset tea'] },
        ],
      },
      {
        id: 'kerala-family-coast',
        title: 'Kerala Coast Family Circuit',
        duration: 5,
        pricePerPerson: 15999,
        category: 'FAMILY',
        description: 'A family-friendly mix of beaches, culture, and relaxed coastal hotels.',
        imageUrl: null,
        images: KOCHI_FAMILY_IMAGES,
        destinations: ['Kochi', 'Cherai Beach', 'Alleppey'],
        itinerary: [
          { day: 1, title: 'Arrival', activities: ['Hotel check-in', 'Beach sunset'] },
          { day: 2, title: 'Cultural day', activities: ['Fort Kochi walk', 'Local lunch'] },
          { day: 3, title: 'Backwater day', activities: ['Cruise', 'Family dinner'] },
        ],
      },
    ],
    reviews: makeReviews('kochi-tides'),
  },
  {
    id: 'mock-varanasi-paths',
    agencyName: 'Varanasi Pilgrim Paths',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    logoUrl: LOGO_URLS.varanasi,
    verificationStatus: 'VERIFIED',
    planCount: 3,
    avgRating: 4.8,
    description: 'Spiritual journeys, temple circuits, and guided cultural immersions.',
    categories: ['PILGRIMAGE', 'HERITAGE'],
    plans: [
      {
        id: 'ghat-and-temple-route',
        title: 'Ghat and Temple Route',
        duration: 3,
        pricePerPerson: 9999,
        category: 'PILGRIMAGE',
        description: 'A compact sacred circuit with sunrise boat rides, temple visits, and evening aarti.',
        imageUrl: null,
        images: VARANASI_PILGRIMAGE_IMAGES,
        destinations: ['Varanasi', 'Dashashwamedh Ghat', 'Sarnath'],
        itinerary: [
          { day: 1, title: 'Arrival and ghat walk', activities: ['Hotel check-in', 'Evening aarti'] },
          { day: 2, title: 'Temple circuit', activities: ['Kashi Vishwanath', 'Local guide'] },
          { day: 3, title: 'Sarnath excursion', activities: ['Museum visit', 'Departure'] },
        ],
      },
      {
        id: 'varanasi-heritage-weekend',
        title: 'Varanasi Heritage Weekend',
        duration: 4,
        pricePerPerson: 11999,
        category: 'HERITAGE',
        description: 'Culture-rich itinerary centered on old-city lanes, heritage stays, and local meals.',
        imageUrl: null,
        images: VARANASI_HERITAGE_IMAGES,
        destinations: ['Varanasi', 'Ramnagar', 'Sarnath'],
        itinerary: [
          { day: 1, title: 'Old city intro', activities: ['Heritage hotel', 'Narrow lane walk'] },
          { day: 2, title: 'River morning', activities: ['Boat ride', 'Photo stop'] },
          { day: 3, title: 'Local culture', activities: ['Craft market', 'Dinner'] },
        ],
      },
      {
        id: 'sacred-ganges-family',
        title: 'Sacred Ganges Family Tour',
        duration: 5,
        pricePerPerson: 12999,
        category: 'FAMILY',
        description: 'A calm family-friendly sacred journey with comfortable stays and easy pacing.',
        imageUrl: null,
        images: VARANASI_FAMILY_IMAGES,
        destinations: ['Varanasi', 'Sarnath', 'Assi Ghat'],
        itinerary: [
          { day: 1, title: 'Arrival and rest', activities: ['Hotel check-in', 'Light evening walk'] },
          { day: 2, title: 'Morning on the river', activities: ['Boat ride', 'Breakfast by the ghats'] },
          { day: 3, title: 'Sarnath and leisure', activities: ['Museum visit', 'Family dinner'] },
        ],
      },
    ],
    reviews: makeReviews('varanasi-paths'),
  },
  {
    id: 'mock-guwahati-safaris',
    agencyName: 'Guwahati Wild & River Safaris',
    city: 'Guwahati',
    state: 'Assam',
    logoUrl: LOGO_URLS.guwahati,
    verificationStatus: 'UNDER_REVIEW',
    planCount: 3,
    avgRating: 4.4,
    description: 'Wildlife, river routes, and Northeast India adventure itineraries.',
    categories: ['WILDLIFE', 'ADVENTURE'],
    plans: [
      {
        id: 'brahmaputra-river-safari',
        title: 'Brahmaputra River Safari',
        duration: 4,
        pricePerPerson: 14999,
        category: 'WILDLIFE',
        description: 'A river-focused wildlife route with island stays and scenic boat transfers.',
        imageUrl: null,
        images: ASSAM_WILDLIFE_IMAGES,
        destinations: ['Guwahati', 'Majuli', 'Brahmaputra'],
        itinerary: [
          { day: 1, title: 'Arrival', activities: ['City check-in', 'Riverfront dinner'] },
          { day: 2, title: 'River cruise', activities: ['Boat transfer', 'Wildlife lookout'] },
          { day: 3, title: 'Island exploration', activities: ['Cultural stop', 'Sunset cruise'] },
        ],
      },
      {
        id: 'northeast-adventure-trail',
        title: 'Northeast Adventure Trail',
        duration: 6,
        pricePerPerson: 18999,
        category: 'ADVENTURE',
        description: 'Adventure-first itinerary with forest drives, trekking, and local homestays.',
        imageUrl: null,
        images: ASSAM_ADVENTURE_IMAGES,
        destinations: ['Guwahati', 'Kaziranga', 'Shillong'],
        itinerary: [
          { day: 1, title: 'Arrival and briefing', activities: ['Transfer', 'Adventure briefing'] },
          { day: 2, title: 'Kaziranga wildlife', activities: ['Jeep safari', 'Nature walk'] },
          { day: 3, title: 'Shillong drive', activities: ['Scenic transfer', 'Local food stop'] },
        ],
      },
      {
        id: 'assam-family-river',
        title: 'Assam Family River Circuit',
        duration: 5,
        pricePerPerson: 13999,
        category: 'FAMILY',
        description: 'Gentle family itinerary covering river attractions, culture, and easy sightseeing.',
        imageUrl: null,
        images: ASSAM_FAMILY_IMAGES,
        destinations: ['Guwahati', 'Fancy Bazaar', 'Majuli'],
        itinerary: [
          { day: 1, title: 'Arrival', activities: ['Hotel check-in', 'Evening walk'] },
          { day: 2, title: 'City highlights', activities: ['Temple visit', 'Market stop'] },
          { day: 3, title: 'River outing', activities: ['Cruise', 'Family dinner'] },
        ],
      },
    ],
    reviews: makeReviews('guwahati-safaris'),
  },
]

export function findMockAgencyById(agencyId: string) {
  return MOCK_AGENCIES.find((agency) => agency.id === agencyId) || null
}

export function findMockPlanById(agencyId: string, planId: string) {
  const agency = findMockAgencyById(agencyId)
  if (!agency) return null
  return agency.plans.find((plan) => plan.id === planId) || null
}
