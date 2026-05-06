import type { Category } from './mock-data';

export interface TravelAgency {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  verified: boolean;
  featured: boolean;
  adTier: 'basic' | 'premium' | 'elite';
  rating: number;
  reviewCount: number;
  specializations: Category[];
  destinations: string[];
  priceRange: { min: number; max: number };
  contactEmail: string;
  contactPhone: string;
  website: string;
  location: string;
  founded: string;
  totalBookings: number;
  commissionRate: number;
  monthlyAdFee: number;
  matchScore?: number;
  trips: AgencyTrip[];
  reviews: AgencyReview[];
}

export interface AgencyTrip {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  highlights: string[];
}

export interface AgencyReview {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  tripDestination: string;
}

export const mockAgencies: TravelAgency[] = [
  {
    id: "ag-1",
    name: "Himalayan Trails",
    tagline: "Conquer the peaks, discover yourself",
    description: "Premier adventure travel agency specializing in Himalayan expeditions since 2008. We offer guided treks, mountain biking, and cultural immersion tours across Ladakh, Spiti, and Nepal. Our expert guides are certified mountaineers with 10+ years of experience.",
    logo: "/agencies/himalayan-trails-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=500&fit=crop",
    verified: true,
    featured: true,
    adTier: "elite",
    rating: 4.9,
    reviewCount: 2847,
    specializations: ["Adventure", "Nature"],
    destinations: ["Leh-Ladakh", "Manali", "Spiti Valley", "Rishikesh"],
    priceRange: { min: 15000, max: 85000 },
    contactEmail: "info@himalayantrails.in",
    contactPhone: "+91 98100 45678",
    website: "https://himalayantrails.in",
    location: "Manali, Himachal Pradesh",
    founded: "2008",
    totalBookings: 12450,
    commissionRate: 8,
    monthlyAdFee: 25000,
    trips: [
      { id: "t1", title: "Ladakh Bike Expedition", destination: "Leh-Ladakh", duration: "10 Days", price: 45000, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", highlights: ["Khardung La Pass", "Pangong Lake", "Nubra Valley"] },
      { id: "t2", title: "Spiti Valley Circuit", destination: "Spiti", duration: "8 Days", price: 35000, image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop", highlights: ["Key Monastery", "Chandratal Lake", "Kibber Village"] },
    ],
    reviews: [
      { id: "r1", userName: "Amit Kapoor", avatar: "", rating: 5, comment: "Best trekking experience of my life! The guides were incredibly knowledgeable.", date: "2026-03-15", tripDestination: "Ladakh" },
      { id: "r2", userName: "Sarah Chen", avatar: "", rating: 5, comment: "Perfectly organized Spiti trip. Every detail was taken care of.", date: "2026-02-20", tripDestination: "Spiti Valley" },
    ],
  },
  {
    id: "ag-2",
    name: "Kerala Voyages",
    tagline: "Experience God's Own Country",
    description: "Award-winning Kerala tourism specialist offering luxury houseboat cruises, Ayurveda wellness retreats, and curated backwater experiences. We bring you the authentic flavors of Kerala with personalized itineraries.",
    logo: "/agencies/kerala-voyages-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&h=500&fit=crop",
    verified: true,
    featured: true,
    adTier: "premium",
    rating: 4.8,
    reviewCount: 1923,
    specializations: ["Nature", "Beach"],
    destinations: ["Alleppey", "Munnar", "Wayanad", "Kochi", "Kovalam"],
    priceRange: { min: 12000, max: 75000 },
    contactEmail: "hello@keralavoyages.com",
    contactPhone: "+91 94470 12345",
    website: "https://keralavoyages.com",
    location: "Kochi, Kerala",
    founded: "2012",
    totalBookings: 8920,
    commissionRate: 10,
    monthlyAdFee: 18000,
    trips: [
      { id: "t3", title: "Luxury Houseboat Retreat", destination: "Alleppey", duration: "3 Days", price: 25000, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop", highlights: ["Private Houseboat", "Kerala Cuisine", "Village Tour"] },
    ],
    reviews: [
      { id: "r3", userName: "Neha Joshi", avatar: "", rating: 5, comment: "The houseboat experience was magical. Food was absolutely divine!", date: "2026-01-10", tripDestination: "Alleppey" },
    ],
  },
  {
    id: "ag-3",
    name: "Rajasthan Royal Tours",
    tagline: "Live like royalty, travel like legends",
    description: "Luxury heritage tours across Rajasthan featuring palace stays, desert safaris, and private dining experiences. We specialize in creating bespoke royal Rajasthan itineraries for discerning travelers.",
    logo: "/agencies/rajasthan-royal-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1400&h=500&fit=crop",
    verified: true,
    featured: true,
    adTier: "elite",
    rating: 4.9,
    reviewCount: 3156,
    specializations: ["Heritage"],
    destinations: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
    priceRange: { min: 20000, max: 150000 },
    contactEmail: "book@rajasthanroyal.in",
    contactPhone: "+91 98290 67890",
    website: "https://rajasthanroyal.in",
    location: "Jaipur, Rajasthan",
    founded: "2005",
    totalBookings: 15600,
    commissionRate: 8,
    monthlyAdFee: 30000,
    trips: [
      { id: "t4", title: "Royal Rajasthan Circuit", destination: "Jaipur-Udaipur-Jodhpur", duration: "7 Days", price: 65000, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop", highlights: ["Palace Stay", "Desert Safari", "Private Dining"] },
    ],
    reviews: [
      { id: "r4", userName: "Michael Brown", avatar: "", rating: 5, comment: "A truly royal experience. The palace hotels were breathtaking!", date: "2026-04-05", tripDestination: "Jaipur" },
    ],
  },
  {
    id: "ag-4",
    name: "Goa Beach Escapes",
    tagline: "Sun, sand, and soul",
    description: "Your go-to agency for the perfect Goa getaway. From vibrant beach parties to serene South Goa retreats, water sports packages to heritage walks through Old Goa — we cover it all.",
    logo: "/agencies/goa-beach-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&h=500&fit=crop",
    verified: true,
    featured: false,
    adTier: "premium",
    rating: 4.6,
    reviewCount: 4521,
    specializations: ["Beach", "Adventure"],
    destinations: ["North Goa", "South Goa", "Dudhsagar"],
    priceRange: { min: 8000, max: 45000 },
    contactEmail: "fun@goabeachescapes.com",
    contactPhone: "+91 98230 11223",
    website: "https://goabeachescapes.com",
    location: "Panaji, Goa",
    founded: "2015",
    totalBookings: 22100,
    commissionRate: 7,
    monthlyAdFee: 12000,
    trips: [
      { id: "t5", title: "Ultimate Goa Adventure", destination: "Goa", duration: "5 Days", price: 18000, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop", highlights: ["Scuba Diving", "Beach Hopping", "Nightlife Tour"] },
    ],
    reviews: [
      { id: "r5", userName: "Priya Mehra", avatar: "", rating: 4, comment: "Great organization, amazing water sports. Will definitely come back!", date: "2026-03-22", tripDestination: "Goa" },
    ],
  },
  {
    id: "ag-5",
    name: "Sacred India Journeys",
    tagline: "Pilgrimage paths to inner peace",
    description: "Specialized in spiritual and pilgrimage tours across India. We organize Char Dham Yatra, Varanasi spiritual walks, temple tours, and meditation retreats with expert spiritual guides.",
    logo: "/agencies/sacred-india-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1400&h=500&fit=crop",
    verified: true,
    featured: false,
    adTier: "basic",
    rating: 4.7,
    reviewCount: 1678,
    specializations: ["Spiritual"],
    destinations: ["Varanasi", "Rishikesh", "Amritsar", "Haridwar", "Tirupati"],
    priceRange: { min: 5000, max: 35000 },
    contactEmail: "namaste@sacredindia.in",
    contactPhone: "+91 95550 44556",
    website: "https://sacredindia.in",
    location: "Varanasi, Uttar Pradesh",
    founded: "2010",
    totalBookings: 9870,
    commissionRate: 6,
    monthlyAdFee: 5000,
    trips: [
      { id: "t6", title: "Varanasi Spiritual Immersion", destination: "Varanasi", duration: "4 Days", price: 12000, image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop", highlights: ["Ganga Aarti", "Temple Tour", "Boat Ride"] },
    ],
    reviews: [
      { id: "r6", userName: "Rekha Devi", avatar: "", rating: 5, comment: "A transformative spiritual experience. The guides were so knowledgeable.", date: "2026-02-14", tripDestination: "Varanasi" },
    ],
  },
  {
    id: "ag-6",
    name: "Northeast Untold",
    tagline: "Discover India's hidden frontier",
    description: "Pioneering tourism in India's Northeast — Meghalaya, Arunachal Pradesh, Nagaland, and Sikkim. We organize tribal culture tours, living root bridge treks, and festivals like Hornbill Festival.",
    logo: "/agencies/northeast-untold-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?w=1400&h=500&fit=crop",
    verified: true,
    featured: true,
    adTier: "premium",
    rating: 4.8,
    reviewCount: 987,
    specializations: ["Nature", "Adventure"],
    destinations: ["Meghalaya", "Arunachal Pradesh", "Nagaland", "Sikkim"],
    priceRange: { min: 18000, max: 65000 },
    contactEmail: "explore@northeastuntold.com",
    contactPhone: "+91 97740 88990",
    website: "https://northeastuntold.com",
    location: "Shillong, Meghalaya",
    founded: "2018",
    totalBookings: 3450,
    commissionRate: 9,
    monthlyAdFee: 15000,
    trips: [
      { id: "t7", title: "Meghalaya Explorer", destination: "Meghalaya", duration: "6 Days", price: 28000, image: "https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?w=600&h=400&fit=crop", highlights: ["Living Root Bridges", "Dawki River", "Caves"] },
    ],
    reviews: [
      { id: "r7", userName: "Rohan Das", avatar: "", rating: 5, comment: "Northeast India is a gem and this agency showed us the best of it!", date: "2026-01-28", tripDestination: "Meghalaya" },
    ],
  },
  {
    id: "ag-7",
    name: "WildIndia Safaris",
    tagline: "Where the wild things roam",
    description: "Premium wildlife safari operator covering India's top national parks. Tiger safaris, bird watching expeditions, and jungle lodges. Our naturalists have 15+ years of wildlife tracking experience.",
    logo: "/agencies/wildindia-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1400&h=500&fit=crop",
    verified: true,
    featured: false,
    adTier: "basic",
    rating: 4.7,
    reviewCount: 2340,
    specializations: ["Wildlife", "Nature"],
    destinations: ["Ranthambore", "Jim Corbett", "Kaziranga", "Bandhavgarh"],
    priceRange: { min: 15000, max: 60000 },
    contactEmail: "safari@wildindia.co",
    contactPhone: "+91 98111 77889",
    website: "https://wildindia.co",
    location: "New Delhi",
    founded: "2011",
    totalBookings: 7650,
    commissionRate: 8,
    monthlyAdFee: 8000,
    trips: [
      { id: "t8", title: "Tiger Trail Safari", destination: "Ranthambore", duration: "4 Days", price: 32000, image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&h=400&fit=crop", highlights: ["Tiger Sighting", "Jungle Lodge", "Nature Walks"] },
    ],
    reviews: [
      { id: "r8", userName: "David Wilson", avatar: "", rating: 5, comment: "Saw 3 tigers in 2 days! Incredible experience with expert naturalists.", date: "2026-04-10", tripDestination: "Ranthambore" },
    ],
  },
  {
    id: "ag-8",
    name: "Coastal Karnataka Tours",
    tagline: "Temples, beaches, and Western Ghats",
    description: "Explore Karnataka's stunning coastline, ancient temple towns, and lush Western Ghats. From Hampi's ruins to Gokarna's beaches, and Coorg's coffee plantations — we curate the perfect Karnataka experience.",
    logo: "/agencies/coastal-karnataka-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=1400&h=500&fit=crop",
    verified: true,
    featured: false,
    adTier: "basic",
    rating: 4.5,
    reviewCount: 1456,
    specializations: ["Heritage", "Beach", "Nature"],
    destinations: ["Hampi", "Gokarna", "Coorg", "Mysore", "Chikmagalur"],
    priceRange: { min: 8000, max: 40000 },
    contactEmail: "info@coastalkarnataka.in",
    contactPhone: "+91 98450 22334",
    website: "https://coastalkarnataka.in",
    location: "Bangalore, Karnataka",
    founded: "2016",
    totalBookings: 5230,
    commissionRate: 7,
    monthlyAdFee: 6000,
    trips: [
      { id: "t9", title: "Hampi Heritage Walk", destination: "Hampi", duration: "3 Days", price: 15000, image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&h=400&fit=crop", highlights: ["Temple Ruins", "Coracle Ride", "Sunset Point"] },
    ],
    reviews: [
      { id: "r9", userName: "Kavya Nair", avatar: "", rating: 4, comment: "Hampi was magical! Well-planned itinerary with great local guides.", date: "2026-03-05", tripDestination: "Hampi" },
    ],
  },
  {
    id: "ag-9",
    name: "Golden Triangle Express",
    tagline: "Delhi · Agra · Jaipur in style",
    description: "India's most popular tourist circuit made effortless. Luxury cars, 5-star stays, and private guides for the iconic Golden Triangle route. Perfect for first-time visitors to India.",
    logo: "/agencies/golden-triangle-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&h=500&fit=crop",
    verified: true,
    featured: true,
    adTier: "elite",
    rating: 4.8,
    reviewCount: 5678,
    specializations: ["Heritage"],
    destinations: ["Delhi", "Agra", "Jaipur"],
    priceRange: { min: 25000, max: 120000 },
    contactEmail: "luxury@goldentriangle.in",
    contactPhone: "+91 98100 99887",
    website: "https://goldentriangle.in",
    location: "New Delhi",
    founded: "2003",
    totalBookings: 28900,
    commissionRate: 10,
    monthlyAdFee: 35000,
    trips: [
      { id: "t10", title: "Luxury Golden Triangle", destination: "Delhi-Agra-Jaipur", duration: "6 Days", price: 75000, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop", highlights: ["Taj Mahal Sunrise", "Amber Fort", "Chandni Chowk Walk"] },
    ],
    reviews: [
      { id: "r10", userName: "Emma Thompson", avatar: "", rating: 5, comment: "Absolutely world-class service. The Taj Mahal at sunrise was unforgettable!", date: "2026-04-18", tripDestination: "Agra" },
    ],
  },
  {
    id: "ag-10",
    name: "Andaman Blues",
    tagline: "Island dreams come true",
    description: "Exclusive Andaman & Nicobar Islands tour operator. Pristine beaches, world-class scuba diving, snorkeling with sea turtles, and bioluminescence night kayaking. We make island fantasies reality.",
    logo: "/agencies/andaman-blues-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1400&h=500&fit=crop",
    verified: true,
    featured: false,
    adTier: "premium",
    rating: 4.7,
    reviewCount: 1890,
    specializations: ["Beach", "Adventure"],
    destinations: ["Havelock Island", "Neil Island", "Port Blair", "Baratang"],
    priceRange: { min: 20000, max: 80000 },
    contactEmail: "dive@andamanblues.com",
    contactPhone: "+91 97440 55667",
    website: "https://andamanblues.com",
    location: "Port Blair, Andaman",
    founded: "2014",
    totalBookings: 6780,
    commissionRate: 9,
    monthlyAdFee: 14000,
    trips: [
      { id: "t11", title: "Andaman Island Hopper", destination: "Andaman", duration: "6 Days", price: 42000, image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=400&fit=crop", highlights: ["Scuba Diving", "Radhanagar Beach", "Sea Walking"] },
    ],
    reviews: [
      { id: "r11", userName: "Vikram Singh", avatar: "", rating: 5, comment: "Best dive experience in India! Crystal clear waters and amazing marine life.", date: "2026-02-28", tripDestination: "Havelock" },
    ],
  },
  {
    id: "ag-11",
    name: "Darjeeling & Beyond",
    tagline: "Where the clouds kiss the tea gardens",
    description: "Specialists in Eastern Himalayan tourism — Darjeeling, Sikkim, and Kalimpong. Toy train rides, tea estate tours, monastery visits, and Kanchenjunga sunrise experiences.",
    logo: "/agencies/darjeeling-beyond-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1400&h=500&fit=crop",
    verified: true,
    featured: false,
    adTier: "basic",
    rating: 4.6,
    reviewCount: 1234,
    specializations: ["Hill Station", "Nature"],
    destinations: ["Darjeeling", "Gangtok", "Kalimpong", "Pelling"],
    priceRange: { min: 10000, max: 45000 },
    contactEmail: "tea@darjeelingandbeyond.in",
    contactPhone: "+91 98320 44556",
    website: "https://darjeelingandbeyond.in",
    location: "Darjeeling, West Bengal",
    founded: "2013",
    totalBookings: 4560,
    commissionRate: 7,
    monthlyAdFee: 7000,
    trips: [
      { id: "t12", title: "Darjeeling Tea Trail", destination: "Darjeeling", duration: "4 Days", price: 18000, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&fit=crop", highlights: ["Tiger Hill Sunrise", "Toy Train", "Tea Tasting"] },
    ],
    reviews: [
      { id: "r12", userName: "Sunita Rao", avatar: "", rating: 4, comment: "Beautiful trip! The sunrise at Tiger Hill was worth waking up at 3 AM.", date: "2026-03-30", tripDestination: "Darjeeling" },
    ],
  },
  {
    id: "ag-12",
    name: "Tamil Heritage Tours",
    tagline: "Ancient temples, timeless culture",
    description: "Deep dive into Tamil Nadu's 2000-year-old temple architecture, Chettinad cuisine, and classical arts. We offer heritage walks, temple circuit tours, and traditional cooking classes.",
    logo: "/agencies/tamil-heritage-logo.svg",
    coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1400&h=500&fit=crop",
    verified: true,
    featured: false,
    adTier: "basic",
    rating: 4.5,
    reviewCount: 876,
    specializations: ["Heritage", "Spiritual"],
    destinations: ["Madurai", "Thanjavur", "Mahabalipuram", "Pondicherry", "Rameswaram"],
    priceRange: { min: 8000, max: 35000 },
    contactEmail: "explore@tamilheritage.in",
    contactPhone: "+91 98410 33445",
    website: "https://tamilheritage.in",
    location: "Chennai, Tamil Nadu",
    founded: "2017",
    totalBookings: 3200,
    commissionRate: 6,
    monthlyAdFee: 5000,
    trips: [
      { id: "t13", title: "Temple Circuit of Tamil Nadu", destination: "Tamil Nadu", duration: "5 Days", price: 22000, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop", highlights: ["Meenakshi Temple", "Brihadeeswarar Temple", "Shore Temple"] },
    ],
    reviews: [
      { id: "r13", userName: "Anand Kumar", avatar: "", rating: 5, comment: "Mind-blowing architecture and the most knowledgeable guides I've ever had.", date: "2026-01-20", tripDestination: "Madurai" },
    ],
  },
];

// Helper functions
export const getAgencyById = (id: string) => mockAgencies.find(a => a.id === id);
export const getFeaturedAgencies = () => mockAgencies.filter(a => a.featured);
export const getEliteAgencies = () => mockAgencies.filter(a => a.adTier === 'elite');
export const getVerifiedAgencies = () => mockAgencies.filter(a => a.verified);

export const getAgenciesBySpecialization = (spec: Category) =>
  mockAgencies.filter(a => a.specializations.includes(spec));

export const getAgenciesByDestination = (destination: string) =>
  mockAgencies.filter(a =>
    a.destinations.some(d => d.toLowerCase().includes(destination.toLowerCase()))
  );

export function computeMatchScore(
  agency: TravelAgency,
  userDestination?: string,
  userBudget?: number,
): number {
  let score = 0;
  // Destination match (40%)
  if (userDestination) {
    const destMatch = agency.destinations.some(d =>
      d.toLowerCase().includes(userDestination.toLowerCase())
    );
    score += destMatch ? 40 : 5;
  } else {
    score += 20;
  }
  // Budget match (30%)
  if (userBudget) {
    if (userBudget >= agency.priceRange.min && userBudget <= agency.priceRange.max) {
      score += 30;
    } else if (userBudget >= agency.priceRange.min * 0.7) {
      score += 15;
    } else {
      score += 5;
    }
  } else {
    score += 15;
  }
  // Rating (20%)
  score += (agency.rating / 5) * 20;
  // Reviews (10%)
  score += Math.min(agency.reviewCount / 5000, 1) * 10;
  return Math.round(Math.min(score, 100));
}

export const platformStats = {
  totalAgencies: mockAgencies.length,
  totalBookings: mockAgencies.reduce((sum, a) => sum + a.totalBookings, 0),
  totalRevenue: "₹2.5Cr+",
  avgRating: (mockAgencies.reduce((sum, a) => sum + a.rating, 0) / mockAgencies.length).toFixed(1),
};
