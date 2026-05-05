// Mock data for the Indian Travel Companion app

import { calculateDynamicPrice } from './pricing';

// TypeScript Types
export type Region = 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
export type Category = 'Spiritual' | 'Adventure' | 'Heritage' | 'Nature' | 'Beach' | 'Hill Station' | 'Wildlife';
export type Season = 'Summer' | 'Winter' | 'Monsoon' | 'Spring' | 'Autumn';

export interface Weather {
  temperature: number;
  condition: string;
  humidity: number;
  bestTimeToVisit: string;
}

export interface Place {
  id: string;
  name: string;
  location: string;
  state: string;
  region: Region;
  category: Category[];
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  price: string;
  duration: string;
  bestSeason: Season[];
  weather: Weather;
  highlights: string[];
  activities: string[];
  nearbyAttractions: string[];
  coordinates: { lat: number; lng: number };
  monthlyVisitors: number;
  featured: boolean;
}

export interface TravelBuddy {
  id: string;
  name: string;
  avatar: string;
  location: string;
  interests: Category[];
  upcomingTrip: string;
  bio: string;
}

export interface MonthlyVisitorData {
  month: string;
  visitors: number;
}

// Real Places Data - Indian Tourist Destinations (Accurate Information)
export const mockPlaces: Place[] = [
  {
    id: "1",
    name: "Taj Mahal",
    location: "Agra",
    state: "Uttar Pradesh",
    region: "North",
    category: ["Heritage"],
    description: "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra. Commissioned in 1631 by the Mughal emperor Shah Jahan to house the tomb of his beloved wife Mumtaz Mahal, it stands as the jewel of Muslim art in India and one of the universally admired masterpieces of world heritage. Built over 22 years by 20,000 artisans.",
    shortDescription: "UNESCO World Heritage Site - Symbol of eternal love",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=1200&h=800&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 847532,
    price: calculateDynamicPrice(1050, 1050, ["Winter", "Spring"]),
    duration: "3-4 hours",
    bestSeason: ["Winter", "Spring"],
    weather: { temperature: 28, condition: "Sunny", humidity: 45, bestTimeToVisit: "October to March" },
    highlights: ["UNESCO World Heritage Site", "Mughal Architecture", "Mehtab Bagh sunset view", "Pietra Dura inlay work"],
    activities: ["Photography", "Heritage Walk", "Guided Tours", "Night viewing (full moon)"],
    nearbyAttractions: ["Agra Fort (2.5 km)", "Fatehpur Sikri (40 km)", "Mehtab Bagh", "Itmad-ud-Daulah"],
    coordinates: { lat: 27.1751, lng: 78.0421 },
    monthlyVisitors: 600000,
    featured: true
  },
  {
    id: "2",
    name: "Jaipur - The Pink City",
    location: "Jaipur",
    state: "Rajasthan",
    region: "North",
    category: ["Heritage"],
    description: "Jaipur, the capital of Rajasthan, is a vibrant city known as the Pink City due to its distinctive colored buildings. Founded in 1727 by Maharaja Sawai Jai Singh II, it's part of India's Golden Triangle. UNESCO World Heritage Site featuring magnificent forts, opulent palaces, and colorful bazaars.",
    shortDescription: "UNESCO Heritage - The Pink City of royal palaces",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&h=800&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 523847,
    price: calculateDynamicPrice(2500, 8000, ["Winter"]),
    duration: "2-3 days",
    bestSeason: ["Winter"],
    weather: { temperature: 22, condition: "Pleasant", humidity: 35, bestTimeToVisit: "November to February" },
    highlights: ["Amber Fort", "Hawa Mahal (Palace of Winds)", "City Palace", "Jantar Mantar Observatory"],
    activities: ["Fort Exploration", "Shopping at Johari Bazaar", "Heritage Walks", "Elephant ride at Amber Fort"],
    nearbyAttractions: ["Nahargarh Fort (14 km)", "Jaigarh Fort (15 km)", "Jal Mahal (5 km)"],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    monthlyVisitors: 450000,
    featured: true
  },
  {
    id: "3",
    name: "Goa Beaches",
    location: "Goa",
    state: "Goa",
    region: "West",
    category: ["Beach"],
    description: "Goa, India's smallest state, is world-famous for its 101 km coastline featuring pristine beaches from Arambol to Palolem. The state showcases 450 years of Portuguese heritage in its baroque churches, Latin quarters, and cuisine. Goa hosts Asia's biggest beach parties, water sports, and the vibrant Sunburn Festival. Divided into North Goa (party central) and South Goa (peaceful beaches).",
    shortDescription: "Beach paradise with Portuguese heritage and nightlife",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587693266063-e5f0f98e4ec7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1599852518062-e197f7623e06?w=1200&h=800&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 1234567,
    price: calculateDynamicPrice(3500, 12000, ["Winter"]),
    duration: "4-7 days",
    bestSeason: ["Winter"],
    weather: { temperature: 28, condition: "Sunny", humidity: 72, bestTimeToVisit: "November to February" },
    highlights: ["101 km coastline", "Portuguese churches (UNESCO)", "Dudhsagar Falls", "Beach parties and nightlife"],
    activities: ["Swimming", "Parasailing", "Scuba diving", "Beach parties", "Water sports", "Heritage walks"],
    nearbyAttractions: ["Dudhsagar Falls (60 km)", "Fort Aguada", "Basilica of Bom Jesus", "Anjuna Flea Market"],
    coordinates: { lat: 15.2993, lng: 74.1240 },
    monthlyVisitors: 650000,
    featured: true
  },
  {
    id: "4",
    name: "Varanasi - Kashi",
    location: "Varanasi",
    state: "Uttar Pradesh",
    region: "North",
    category: ["Spiritual"],
    description: "Varanasi, also known as Kashi and Banaras, is one of the world's oldest continuously inhabited cities (3,000+ years). Situated on the banks of the holy Ganges, it's the spiritual capital of India and most sacred city for Hindus. The city has 88 ghats, with Dashashwamedh Ghat's evening Ganga Aarti attracting thousands daily. Mark Twain called it 'older than history, older than tradition, older even than legend.'",
    shortDescription: "World's oldest living city - Spiritual capital on Ganges",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1580492542976-33d36efeb8c4?w=1200&h=800&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 456789,
    price: calculateDynamicPrice(2000, 6000, ["Winter"]),
    duration: "2-3 days",
    bestSeason: ["Winter"],
    weather: { temperature: 24, condition: "Clear", humidity: 58, bestTimeToVisit: "October to March" },
    highlights: ["Ganga Aarti ceremony", "Kashi Vishwanath Temple", "88 ghats", "Boat ride at sunrise", "Sarnath Buddhist site"],
    activities: ["Ganga Aarti", "Boat Ride at dawn", "Temple visits", "Silk shopping", "Food walks"],
    nearbyAttractions: ["Sarnath (10 km)", "Ramnagar Fort (14 km)", "Assi Ghat", "Dashashwamedh Ghat"],
    coordinates: { lat: 25.3176, lng: 82.9739 },
    monthlyVisitors: 320000,
    featured: true
  },
  {
    id: "5",
    name: "Manali",
    location: "Manali",
    state: "Himachal Pradesh",
    region: "North",
    category: ["Hill Station"],
    description: "Manali is a high-altitude Himalayan resort town at 2,050m in the Kullu Valley, named after Hindu lawgiver Manu. Gateway to Lahaul-Spiti, Rohtang Pass (13,050 ft), and Solang Valley. Famous for adventure sports, apple orchards, and the ancient Hadimba Temple. Old Manali offers cafes and Israeli cuisine. Manali experiences heavy snowfall from December to February, transforming into a winter wonderland.",
    shortDescription: "Himalayan adventure hub - Gateway to Rohtang Pass",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571847230-c7a8b5cf8512?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 678912,
    price: calculateDynamicPrice(4000, 15000, ["Summer", "Winter"]),
    duration: "4-6 days",
    bestSeason: ["Summer", "Winter"],
    weather: { temperature: 15, condition: "Cool", humidity: 45, bestTimeToVisit: "October to June" },
    highlights: ["Rohtang Pass (51 km)", "Solang Valley", "Hadimba Temple (500 years old)", "Old Manali cafes"],
    activities: ["Skiing", "Paragliding", "Trekking", "River rafting", "Zorbing", "Cable car rides"],
    nearbyAttractions: ["Solang Valley (14 km)", "Rohtang Pass (51 km)", "Vashisht Hot Springs (3 km)", "Manikaran (80 km)"],
    coordinates: { lat: 32.2396, lng: 77.1887 },
    monthlyVisitors: 550000,
    featured: true
  },
  {
    id: "6",
    name: "Kerala Backwaters - Alleppey",
    location: "Alappuzha (Alleppey)",
    state: "Kerala",
    region: "South",
    category: ["Nature"],
    description: "The Kerala Backwaters are a network of 900 km of interconnected canals, rivers, lakes, and inlets along the Arabian Sea coast. Alappuzha, called 'Venice of the East,' is the hub for houseboat cruises on Vembanad Lake (India's longest lake). The backwaters showcase unique ecosystem with coconut palms, paddy fields, traditional kettuvallams (houseboats), and village life. Experience Kerala's traditional cuisine, toddy tapping, and Kuttanad farming (below sea level).",
    shortDescription: "Venice of the East - Serene houseboat cruises",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1588409992621-2f1b9ee23ef2?w=1200&h=800&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 234567,
    price: calculateDynamicPrice(10000, 25000, ["Winter"]),
    duration: "2-3 days",
    bestSeason: ["Winter"],
    weather: { temperature: 29, condition: "Humid", humidity: 78, bestTimeToVisit: "November to February" },
    highlights: ["900 km waterway network", "Traditional houseboat cruise", "Vembanad Lake", "Kuttanad below-sea-level farming"],
    activities: ["Houseboat Cruise", "Canoeing", "Village tours", "Toddy tapping experience", "Bird watching"],
    nearbyAttractions: ["Vembanad Lake", "Kumarakom Bird Sanctuary (30 km)", "Marari Beach (11 km)", "Ambalapuzha Temple"],
    coordinates: { lat: 9.4981, lng: 76.3388 },
    monthlyVisitors: 280000,
    featured: true
  },
  {
    id: "7",
    name: "Leh-Ladakh",
    location: "Leh",
    state: "Ladakh",
    region: "North",
    category: ["Adventure"],
    description: "Leh-Ladakh is the 'Land of High Passes' in the Trans-Himalayan region at 11,500 feet elevation. Home to ancient Buddhist monasteries (Hemis, Thiksey), pristine high-altitude lakes (Pangong Tso at 14,270 ft, Tso Moriri), and challenging mountain passes including Khardung La (18,380 ft - one of world's highest motorable roads). Accessible only 6 months a year. Experience Tibetan Buddhist culture, moonscapes of Nubra Valley, and Magnetic Hill phenomenon.",
    shortDescription: "Land of High Passes - Trans-Himalayan adventure paradise",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=1200&h=800&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 543210,
    price: calculateDynamicPrice(25000, 50000, ["Summer"]),
    duration: "7-12 days",
    bestSeason: ["Summer"],
    weather: { temperature: 10, condition: "Cold", humidity: 12, bestTimeToVisit: "May to September" },
    highlights: ["Pangong Tso Lake", "Khardung La Pass (18,380 ft)", "Nubra Valley sand dunes", "Ancient Buddhist monasteries", "Magnetic Hill"],
    activities: ["Bike touring", "High-altitude trekking", "Monastery visits", "Camping", "Double-hump camel rides"],
    nearbyAttractions: ["Khardung La (39 km)", "Pangong Lake (160 km)", "Nubra Valley (118 km)", "Tso Moriri Lake"],
    coordinates: { lat: 34.1526, lng: 77.5771 },
    monthlyVisitors: 280000,
    featured: true
  },
  {
    id: "8",
    name: "Rishikesh",
    location: "Rishikesh",
    state: "Uttarakhand",
    region: "North",
    category: ["Spiritual"],
    description: "Rishikesh, the 'Yoga Capital of the World,' sits at the Himalayan foothills where the Ganges emerges from mountains at 340m elevation. UNESCO World Heritagecity known for ashrams, yoga centers, and the Beatles Ashram (where they studied transcendental meditation in 1968). Offers unique combination of spirituality and adventure sports. Home to two iconic suspension bridges: Laxman Jhula (450 ft, built 1929) and Ram Jhula. Gateway to Char Dham pilgrimage.",
    shortDescription: "Yoga Capital of the World - Adventure on holy Ganges",
    image: "https://images.unsplash.com/photo-1558430452-18c6980090c2?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558430452-18c6980090c2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606217883254-5658f7c77bd4?w=1200&h=800&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 456123,
    price: calculateDynamicPrice(2500, 8000, ["Spring", "Autumn"]),
    duration: "3-5 days",
    bestSeason: ["Spring", "Autumn"],
    weather: { temperature: 25, condition: "Pleasant", humidity: 52, bestTimeToVisit: "March to May, September to November" },
    highlights: ["International Yoga Festival (March)", "Beatles Ashram", "Laxman Jhula suspension bridge", "Ganga Aarti at Parmarth Niketan"],
    activities: ["Yoga retreats", "White water rafting (Grade III-IV)", "Bungee jumping (83m India's highest)", "Cliff jumping", "Meditation"],
    nearbyAttractions: ["Beatles Ashram (5 km)", "Neelkanth Mahadev Temple (32 km)", "Rajaji National Park (18 km)", "Kunjapuri Temple"],
    coordinates: { lat: 30.0869, lng: 78.2676 },
    monthlyVisitors: 420000,
    featured: true
  },
  // ARUNACHAL PRADESH - Off-beat destinations
  {
    id: "9",
    name: "Ziro Valley",
    location: "Ziro",
    state: "Arunachal Pradesh",
    region: "Northeast",
    category: ["Nature"],
    description: "Ziro Valley is a UNESCO World Heritage Site nominee known for its pine hills, rice fields, and the unique Apatani tribal culture. Located at 1500m elevation, it hosts the famous Ziro Music Festival. The Apatani people practice sustainable agriculture and have distinct facial tattoos and nose plugs. The valley offers breathtaking views of paddy fields with a backdrop of blue mountains.",
    shortDescription: "UNESCO nominee - Tribal culture and music festival hub",
    image: "https://images.unsplash.com/photo-1580654712603-eb43273aff33?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1580654712603-eb43273aff33?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&h=800&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 3421,
    price: calculateDynamicPrice(3000, 7000, ["Spring", "Autumn"]),
    duration: "3-4 days",
    bestSeason: ["Spring", "Autumn"],
    weather: { temperature: 18, condition: "Pleasant", humidity: 65, bestTimeToVisit: "March to October" },
    highlights: ["Apatani tribal villages", "Ziro Music Festival (September)", "Talle Valley Wildlife Sanctuary", "Sustainable paddy-cum-fish farming"],
    activities: ["Village walks", "Bird watching", "Music festival", "Photography", "Tribal culture experience"],
    nearbyAttractions: ["Talley Valley (25 km)", "Kile Pakho", "Dolo Mando", "Hapoli"],
    coordinates: { lat: 27.5450, lng: 93.8317 },
    monthlyVisitors: 5500,
    featured: true
  },
  {
    id: "10",
    name: "Mechuka (Menchukha)",
    location: "Mechuka",
    state: "Arunachal Pradesh",
    region: "Northeast",
    category: ["Nature"],
    description: "Mechuka, also called Menchukha, is a pristine valley at 6,000 feet elevation, often compared to Switzerland. The Siyom River flows through this hidden paradise, surrounded by snow-capped mountains. Home to the Memba tribe, it features the 400-year-old Samten Yongcha Monastery. Opened to tourists only in recent years, it remains one of India's most untouched destinations.",
    shortDescription: "Hidden Himalayan paradise - India's Switzerland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=800&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 1256,
    price: calculateDynamicPrice(5000, 10000, ["Summer"]),
    duration: "4-5 days",
    bestSeason: ["Summer"],
    weather: { temperature: 15, condition: "Cold", humidity: 55, bestTimeToVisit: "April to October" },
    highlights: ["Samten Yongcha Monastery (400 years old)", "Siyom River", "Hanging bridge", "Snow-capped peaks"],
    activities: ["Trekking", "River rafting", "Monastery visits", "Camping", "Photography"],
    nearbyAttractions: ["Dorjeeling village", "Floating Island", "Hanging Bridge"],
    coordinates: { lat: 28.7844, lng: 94.2581 },
    monthlyVisitors: 2100,
    featured: true
  },
  {
    id: "11",
    name: "Dong Valley",
    location: "Dong",
    state: "Arunachal Pradesh",
    region: "Northeast",
    category: ["Nature"],
    description: "Dong Valley holds the distinction of being where India's first sunrise occurs. Located near the India-China border at 2,655m elevation, this remote village is home to just three families. The village is inhabited by the Mishmi tribe. Visitors need special permits (Protected Area Permit and Inner Line Permit) to visit. The journey itself is an adventure through pristine forests and rivers.",
    shortDescription: "India's easternmost point - First sunrise destination",
    image: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1200&h=800&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 892,
    price: calculateDynamicPrice(6000, 12000, ["Winter", "Spring"]),
    duration: "3-4 days",
    bestSeason: ["Winter", "Spring"],
    weather: { temperature: 12, condition: "Cold", humidity: 60, bestTimeToVisit: "November to March" },
    highlights: ["India's first sunrise point", "Mishmi tribal culture", "Pristine natural beauty", "Remote border village"],
    activities: ["Sunrise viewing", "Trekking", "Cultural immersion", "Photography"],
    nearbyAttractions: ["Walong (45 km)", "Kibithu", "Lohit River"],
    coordinates: { lat: 27.9881, lng: 97.0403 },
    monthlyVisitors: 1200,
    featured: true
  },
  // MEGHALAYA - Wettest place on Earth region
  {
    id: "12",
    name: "Nongriat - Double Decker Living Root Bridge",
    location: "Nongriat",
    state: "Meghalaya",
    region: "Northeast",
    category: ["Nature"],
    description: "Nongriat village is famous for the spectacular Double Decker Living Root Bridge, a UNESCO World Heritage Site nominee. These bridges are grown from Ficus elastica tree roots by the Khasi tribe, taking 15-20 years to form. Located deep in the rainforest, it requires descending 3,500+ stone steps. The village is completely off-grid with minimal facilities, offering an authentic jungle experience.",
    shortDescription: "UNESCO nominee - Famous living root bridge destination",
    image: "https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 8934,
    price: calculateDynamicPrice(2000, 5000, ["Winter"]),
    duration: "2-3 days",
    bestSeason: ["Winter"],
    weather: { temperature: 20, condition: "Humid", humidity: 85, bestTimeToVisit: "October to March" },
    highlights: ["Double Decker Living Root Bridge (180 years old)", "Rainbow Falls", "3,500 stone steps trek", "Natural rock pools"],
    activities: ["Trekking", "Swimming in natural pools", "Photography", "Bridge exploration"],
    nearbyAttractions: ["Rainbow Falls (1.5 km)", "Single Decker Root Bridge", "Blue Lagoon"],
    coordinates: { lat: 25.2100, lng: 91.7116 },
    monthlyVisitors: 12000,
    featured: true
  },
  {
    id: "13",
    name: "Shnongpdeng",
    location: "Shnongpdeng",
    state: "Meghalaya",
    region: "Northeast",
    category: ["Adventure"],
    description: "Shnongpdeng is a pristine riverside village on the banks of the crystal-clear Umngot River, often called India's clearest river. The water is so transparent that boats appear to float in mid-air. Located near the Indo-Bangladesh border, it offers thrilling water activities. The village offers camping experiences and is part of the Dawki region, gaining popularity for adventure tourism.",
    shortDescription: "Crystal-clear river - India's cleanest river experience",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&h=800&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 6754,
    price: calculateDynamicPrice(2500, 6000, ["Winter", "Spring"]),
    duration: "2-3 days",
    bestSeason: ["Winter", "Spring"],
    weather: { temperature: 22, condition: "Pleasant", humidity: 70, bestTimeToVisit: "November to May" },
    highlights: ["Crystal-clear Umngot River", "Floating boat illusion", "Riverside camping", "Cliff jumping spots"],
    activities: ["Kayaking", "Cliff jumping", "Snorkeling", "Camping", "Boating"],
    nearbyAttractions: ["Dawki (3 km)", "Krang Suri Waterfall (30 km)", "Living Root Bridges"],
    coordinates: { lat: 25.1633, lng: 92.0156 },
    monthlyVisitors: 8500,
    featured: true
  },
  {
    id: "14",
    name: "Mawsynram",
    location: "Mawsynram",
    state: "Meghalaya",
    region: "Northeast",
    category: ["Nature"],
    description: "Mawsynram holds the Guinness World Record for being the wettest place on Earth, receiving an average annual rainfall of 11,872 mm. Located 60 km from Shillong at 1,400m elevation, this village is famous for its perpetual mist, lush greenery, and unique 'knups' (grass raincoats worn by locals). The Mawjymbuin Cave with a natural Shivalinga formation is a major attraction.",
    shortDescription: "World's wettest place - Perpetual rain and mist",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1200&h=800&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 4231,
    price: calculateDynamicPrice(1500, 4000, ["Monsoon"]),
    duration: "1-2 days",
    bestSeason: ["Monsoon"],
    weather: { temperature: 18, condition: "Rainy", humidity: 95, bestTimeToVisit: "June to September (for rain lovers)" },
    highlights: ["Wettest place on Earth", "Mawjymbuin Cave with natural Shivalinga", "Living root bridges nearby", "Traditional 'knup' culture"],
    activities: ["Cave exploration", "Rain experiencing", "Photography", "Village walks"],
    nearbyAttractions: ["Mawjymbuin Cave (1 km)", "Nohkalikai Falls (25 km)", "Cherrapunji (15 km)"],
    coordinates: { lat: 25.2975, lng: 91.5825 },
    monthlyVisitors: 6200,
    featured: false
  },
  {
    id: "15",
    name: "Nartiang",
    location: "Nartiang",
    state: "Meghalaya",
    region: "Northeast",
    category: ["Heritage"],
    description: "Nartiang is an ancient village in the Jaintia Hills, home to the Nartiang Durga Temple and the largest collection of monoliths in Meghalaya. The site features over 700 megalithic stones erected between 1500-1835 AD, with the tallest standing monolith at 27 feet. It was once the summer capital of the Jaintia Kings and holds immense historical significance in tribal culture.",
    shortDescription: "Ancient monolith site - Historical Jaintia Kingdom capital",
    image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 2187,
    price: calculateDynamicPrice(1000, 3000, ["Winter"]),
    duration: "1-2 days",
    bestSeason: ["Winter"],
    weather: { temperature: 20, condition: "Pleasant", humidity: 70, bestTimeToVisit: "October to April" },
    highlights: ["700+ megalithic monoliths", "Tallest monolith (27 feet/8.2m)", "Nartiang Durga Temple", "Jaintia tribal heritage"],
    activities: ["Heritage walk", "Photography", "Temple visits", "Cultural exploration"],
    nearbyAttractions: ["Thadlaskein Lake (30 km)", "Nartiang Waterfalls", "Jaintia Hills viewpoints"],
    coordinates: { lat: 25.4333, lng: 92.2167 },
    monthlyVisitors: 3400,
    featured: false
  },
  {
    id: "16",
    name: "Krang Suri Waterfall",
    location: "Amlarem",
    state: "Meghalaya",
    region: "Northeast",
    category: ["Nature"],
    description: "Krang Suri Waterfall is a stunning three-tiered waterfall with turquoise blue natural pools in the Jaintia Hills. The waterfall cascades from 45 feet, creating pristine swimming pools surrounded by lush forests. Discovered relatively recently by tourists, it remains less crowded than other waterfalls. The water is crystal clear, and the natural rock formations create perfect diving and swimming spots.",
    shortDescription: "Turquoise waterfall with natural swimming pools",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1537923149051-1c0df1daf2a4?w=1200&h=800&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 5632,
    price: calculateDynamicPrice(500, 2000, ["Spring", "Summer"]),
    duration: "4-6 hours",
    bestSeason: ["Spring", "Summer"],
    weather: { temperature: 23, condition: "Pleasant", humidity: 75, bestTimeToVisit: "March to June" },
    highlights: ["Turquoise blue water pools", "Three-tiered waterfall", "Natural diving spots", "Picnic-friendly location"],
    activities: ["Swimming", "Cliff diving", "Photography", "Picnicking", "Nature walks"],
    nearbyAttractions: ["Nartiang Monoliths (28 km)", "Shnongpdeng (32 km)", "Thadlaskein Lake"],
    coordinates: { lat: 25.2711, lng: 92.2931 },
    monthlyVisitors: 7800,
    featured: true
  },
  {
    id: "17",
    name: "Dawki",
    location: "Dawki",
    state: "Meghalaya",
    region: "Northeast",
    category: ["Nature"],
    description: "Dawki is a border town famous for the Umngot River, renowned as one of the cleanest rivers in Asia. The water is so clear that boats appear suspended in air. The town sits at the India-Bangladesh border, connected by the historic Dawki Bridge built in 1932. It's the gateway to adventure activities in crystal-clear waters and serves as an important trade point with Bangladesh.",
    shortDescription: "Asia's cleanest river - Crystal-clear water paradise",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&h=800&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 15234,
    price: calculateDynamicPrice(2000, 5000, ["Winter", "Spring"]),
    duration: "1-2 days",
    bestSeason: ["Winter", "Spring"],
    weather: { temperature: 22, condition: "Pleasant", humidity: 68, bestTimeToVisit: "November to May" },
    highlights: ["Crystal-clear Umngot River", "Dawki suspension bridge", "Floating boat illusion", "India-Bangladesh border view"],
    activities: ["Boating", "Kayaking", "Snorkeling", "Cliff jumping", "Photography", "Border viewing"],
    nearbyAttractions: ["Shnongpdeng (3 km)", "Krang Suri Waterfall (30 km)", "Living Root Bridge"],
    coordinates: { lat: 25.1579, lng: 92.0189 },
    monthlyVisitors: 18500,
    featured: true
  },
  // SPITI VALLEY - Off-beat Trans-Himalayan destinations
  {
    id: "18",
    name: "Gue - The Mummy Village",
    location: "Gue",
    state: "Himachal Pradesh",
    region: "North",
    category: ["Heritage"],
    description: "Gue village is famous for housing a 500-year-old naturally preserved mummy of a Buddhist monk in meditative position. Discovered in 1975, the mummy belongs to Sangha Tenzin, a lama who self-mummified through Sokushinbutsu practice. The village sits at 10,000 feet in the remote Spiti Valley, near the Indo-Tibet border. It's one of the remotest villages in India with harsh winters and extreme isolation.",
    shortDescription: "500-year-old mummy - Remote Trans-Himalayan village",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=800&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 1876,
    price: calculateDynamicPrice(3000, 7000, ["Summer"]),
    duration: "1-2 days",
    bestSeason: ["Summer"],
    weather: { temperature: 8, condition: "Cold", humidity: 20, bestTimeToVisit: "June to September" },
    highlights: ["500-year-old natural mummy", "Buddhist monastery", "Gue Monastery", "Indo-Tibet border proximity"],
    activities: ["Monastery visits", "Cultural exploration", "Photography", "High-altitude experience"],
    nearbyAttractions: ["Tabo Monastery (45 km)", "Nako Lake (25 km)", "Sumdo village"],
    coordinates: { lat: 31.9178, lng: 78.4819 },
    monthlyVisitors: 1800,
    featured: true
  },
  {
    id: "19",
    name: "Kibber - Highest Inhabited Village",
    location: "Kibber",
    state: "Himachal Pradesh",
    region: "North",
    category: ["Nature"],
    description: "Kibber village at 14,200 feet (4,270m) is one of the highest inhabited villages in the world with motorable road access. Located in the Spiti Valley, it's home to about 80 families who brave extreme weather conditions. The village is the gateway to Kibber Wildlife Sanctuary, home to the endangered snow leopard, Tibetan wolf, and blue sheep. Traditional mud-brick houses showcase Spitian architecture.",
    shortDescription: "World's highest motorable village - Snow leopard territory",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1200&h=800&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 2145,
    price: calculateDynamicPrice(4000, 8000, ["Summer"]),
    duration: "2-3 days",
    bestSeason: ["Summer"],
    weather: { temperature: 5, condition: "Very Cold", humidity: 15, bestTimeToVisit: "June to September" },
    highlights: ["Highest motorable village (14,200 feet)", "Snow leopard habitat", "Kibber Wildlife Sanctuary", "Traditional Spitian houses"],
    activities: ["Wildlife spotting", "High-altitude trekking", "Photography", "Cultural immersion", "Astronomy"],
    nearbyAttractions: ["Chicham Bridge - highest bridge (28 km)", "Key Monastery (18 km)", "Langza village"],
    coordinates: { lat: 32.2833, lng: 78.0167 },
    monthlyVisitors: 3200,
    featured: true
  },
  {
    id: "20",
    name: "Kolkata - City of Joy",
    location: "Kolkata",
    state: "West Bengal",
    region: "East",
    category: ["Heritage", "Spiritual"],
    description: "Kolkata, the capital of West Bengal, is known as the 'City of Joy' and was the capital of British India until 1911. This cultural and intellectual hub is famous for its colonial architecture, literary heritage, and vibrant arts scene. Home to the iconic Howrah Bridge, Victoria Memorial, and numerous temples, Kolkata offers a unique blend of old-world charm and modern dynamism. The city is the birthplace of the Indian Renaissance and has produced numerous Nobel laureates, including Rabindranath Tagore.",
    shortDescription: "Cultural capital with colonial heritage and literary traditions",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1609619385002-f40bc8f6b8b0?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=1200&h=800&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 8950,
    price: calculateDynamicPrice(3000, 6000, ["Winter", "Autumn"]),
    duration: "3-4 days",
    bestSeason: ["Winter", "Autumn"],
    weather: { temperature: 27, condition: "Pleasant", humidity: 65, bestTimeToVisit: "October to March" },
    highlights: ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Temple", "Indian Museum", "College Street"],
    activities: ["Heritage walks", "Tram rides", "Bengali cuisine tasting", "Book shopping", "River Hooghly cruise"],
    nearbyAttractions: ["Sundarbans (100 km)", "Digha Beach (185 km)", "Bishnupur (150 km)"],
    coordinates: { lat: 22.5726, lng: 88.3639 },
    monthlyVisitors: 125000,
    featured: true
  },
  {
    id: "21",
    name: "Darjeeling - Queen of Hills",
    location: "Darjeeling",
    state: "West Bengal",
    region: "East",
    category: ["Hill Station", "Nature"],
    description: "Darjeeling is a picturesque hill station in West Bengal, famous for its tea gardens, the Darjeeling Himalayan Railway (Toy Train), and stunning views of Kanchenjunga. At an altitude of 6,700 feet, it offers a perfect blend of natural beauty, colonial charm, and Buddhist culture. The town is dotted with monasteries, tea estates, and Victorian-era architecture. Watching sunrise from Tiger Hill is a must-do experience.",
    shortDescription: "Himalayan hill station famous for tea and toy train",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 12500,
    price: calculateDynamicPrice(4500, 8000, ["Summer", "Spring"]),
    duration: "3-4 days",
    bestSeason: ["Summer", "Spring", "Autumn"],
    weather: { temperature: 15, condition: "Cool", humidity: 75, bestTimeToVisit: "March to May, October to November" },
    highlights: ["Toy Train (UNESCO Heritage)", "Tiger Hill sunrise", "Tea gardens", "Batasia Loop", "Peace Pagoda"],
    activities: ["Tea estate tours", "Toy train ride", "Mountain biking", "Monastery visits", "Cable car ride"],
    nearbyAttractions: ["Kalimpong (50 km)", "Gangtok (98 km)", "Mirik Lake (49 km)"],
    coordinates: { lat: 27.0360, lng: 88.2627 },
    monthlyVisitors: 45000,
    featured: true
  },
  {
    id: "22",
    name: "Amritsar - Golden City",
    location: "Amritsar",
    state: "Punjab",
    region: "North",
    category: ["Spiritual", "Heritage"],
    description: "Amritsar is home to the iconic Golden Temple (Harmandir Sahib), the holiest shrine in Sikhism. This spiritual city offers a profound experience with its magnificent architecture, langar (community kitchen), and the daily ceremony at Wagah Border. The city played a significant role in India's freedom struggle, witnessed at the Jallianwala Bagh memorial. Amritsar is also a culinary paradise, famous for Punjabi cuisine.",
    shortDescription: "Spiritual capital of Sikhism with the Golden Temple",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=800&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 15800,
    price: calculateDynamicPrice(2500, 5000, ["Winter", "Spring"]),
    duration: "2-3 days",
    bestSeason: ["Winter", "Spring"],
    weather: { temperature: 22, condition: "Pleasant", humidity: 55, bestTimeToVisit: "November to March" },
    highlights: ["Golden Temple", "Wagah Border Ceremony", "Jallianwala Bagh", "Partition Museum", "Gobindgarh Fort"],
    activities: ["Golden Temple visit", "Langar experience", "Wagah Border ceremony", "Food walks", "Heritage tours"],
    nearbyAttractions: ["Attari Border (28 km)", "Tarn Taran (22 km)", "Harike Wetland (60 km)"],
    coordinates: { lat: 31.6340, lng: 74.8723 },
    monthlyVisitors: 95000,
    featured: true
  }
];

// Mock Travel Buddies
export const mockTravelBuddies: TravelBuddy[] = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "/placeholder-user.jpg",
    location: "Mumbai, Maharashtra",
    interests: ["Beach", "Adventure"],
    upcomingTrip: "Goa in January",
    bio: "Beach lover and adventure seeker!"
  },
  {
    id: "2",
    name: "Rahul Verma",
    avatar: "/placeholder-user.jpg",
    location: "Delhi",
    interests: ["Heritage", "Spiritual"],
    upcomingTrip: "Leh-Ladakh in June",
    bio: "History buff planning an epic Ladakh trip."
  },
  {
    id: "3",
    name: "Ananya Reddy",
    avatar: "/placeholder-user.jpg",
    location: "Bangalore",
    interests: ["Nature", "Hill Station"],
    upcomingTrip: "Coorg this month",
    bio: "Nature photographer seeking peaceful getaways."
  }
];

// Monthly Visitor Data for Admin
export const monthlyVisitorData: MonthlyVisitorData[] = [
  { month: "Jan", visitors: 125000 },
  { month: "Feb", visitors: 135000 },
  { month: "Mar", visitors: 142000 },
  { month: "Apr", visitors: 98000 },
  { month: "May", visitors: 87000 },
  { month: "Jun", visitors: 76000 },
  { month: "Jul", visitors: 82000 },
  { month: "Aug", visitors: 95000 },
  { month: "Sep", visitors: 108000 },
  { month: "Oct", visitors: 165000 },
  { month: "Nov", visitors: 178000 },
  { month: "Dec", visitors: 195000 }
];

// Categories
export const categories: { name: Category; description: string; icon: string }[] = [
  { name: "Spiritual", description: "Sacred temples and pilgrimage sites", icon: "church" },
  { name: "Adventure", description: "Thrilling activities and extreme sports", icon: "mountain" },
  { name: "Heritage", description: "Ancient forts and monuments", icon: "landmark" },
  { name: "Nature", description: "Scenic landscapes and natural wonders", icon: "trees" },
  { name: "Beach", description: "Coastal paradises", icon: "waves" },
  { name: "Hill Station", description: "Mountain retreats", icon: "mountain-snow" }
];

// Helper functions
export const getPlacesByRegion = (region: Region) => mockPlaces.filter(p => p.region === region);
export const getPlacesByCategory = (category: Category) => mockPlaces.filter(p => p.category.includes(category));
export const getFeaturedPlaces = () => mockPlaces.filter(p => p.featured);
export const getPlaceById = (id: string) => mockPlaces.find(p => p.id === id);
export const getTrendingPlaces = () => [...mockPlaces].sort((a, b) => b.monthlyVisitors - a.monthlyVisitors).slice(0, 6);

