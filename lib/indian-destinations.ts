// Comprehensive list of Indian tourist destinations
export interface IndianDestination {
  name: string
  state: string
  type: string[]
  region: string
  popularFor?: string
}

export const indianDestinations: IndianDestination[] = [
  // North India
  { name: "Agra", state: "Uttar Pradesh", type: ["Heritage", "Historical"], region: "North", popularFor: "Taj Mahal" },
  { name: "Amritsar", state: "Punjab", type: ["Spiritual", "Heritage"], region: "North", popularFor: "Golden Temple" },
  { name: "Chandigarh", state: "Chandigarh", type: ["Urban", "Modern"], region: "North", popularFor: "Rock Garden" },
  { name: "Delhi", state: "Delhi", type: ["Heritage", "Urban"], region: "North", popularFor: "Red Fort, India Gate" },
  { name: "Dharamshala", state: "Himachal Pradesh", type: ["Hill Station", "Spiritual"], region: "North", popularFor: "Dalai Lama Temple" },
  { name: "Haridwar", state: "Uttarakhand", type: ["Spiritual", "Religious"], region: "North", popularFor: "Ganga Aarti" },
  { name: "Jaipur", state: "Rajasthan", type: ["Heritage", "Royal"], region: "North", popularFor: "Hawa Mahal, Amber Fort" },
  { name: "Jaisalmer", state: "Rajasthan", type: ["Desert", "Heritage"], region: "North", popularFor: "Golden Fort, Sand Dunes" },
  { name: "Jodhpur", state: "Rajasthan", type: ["Heritage", "Royal"], region: "North", popularFor: "Mehrangarh Fort" },
  { name: "Kullu", state: "Himachal Pradesh", type: ["Hill Station", "Adventure"], region: "North", popularFor: "Valley, River Rafting" },
  { name: "Leh", state: "Ladakh", type: ["Adventure", "Mountains"], region: "North", popularFor: "Monasteries, Pangong Lake" },
  { name: "Manali", state: "Himachal Pradesh", type: ["Hill Station", "Adventure"], region: "North", popularFor: "Rohtang Pass, Solang Valley" },
  { name: "Mathura", state: "Uttar Pradesh", type: ["Spiritual", "Religious"], region: "North", popularFor: "Krishna Janmabhoomi" },
  { name: "McLeod Ganj", state: "Himachal Pradesh", type: ["Hill Station", "Spiritual"], region: "North", popularFor: "Tibetan Culture" },
  { name: "Mussoorie", state: "Uttarakhand", type: ["Hill Station", "Nature"], region: "North", popularFor: "Kempty Falls" },
  { name: "Nainital", state: "Uttarakhand", type: ["Hill Station", "Lake"], region: "North", popularFor: "Naini Lake" },
  { name: "Pushkar", state: "Rajasthan", type: ["Spiritual", "Cultural"], region: "North", popularFor: "Camel Fair, Brahma Temple" },
  { name: "Rishikesh", state: "Uttarakhand", type: ["Adventure", "Spiritual"], region: "North", popularFor: "Yoga, River Rafting" },
  { name: "Shimla", state: "Himachal Pradesh", type: ["Hill Station", "Colonial"], region: "North", popularFor: "The Mall, Jakhu Temple" },
  { name: "Udaipur", state: "Rajasthan", type: ["Heritage", "Royal"], region: "North", popularFor: "City Palace, Lake Pichola" },
  { name: "Varanasi", state: "Uttar Pradesh", type: ["Spiritual", "Heritage"], region: "North", popularFor: "Ganga Ghat, Kashi Vishwanath" },
  { name: "Vrindavan", state: "Uttar Pradesh", type: ["Spiritual", "Religious"], region: "North", popularFor: "Krishna Temples" },
  
  // South India
  { name: "Alleppey", state: "Kerala", type: ["Beach", "Backwaters"], region: "South", popularFor: "Houseboats" },
  { name: "Bangalore", state: "Karnataka", type: ["Urban", "Gardens"], region: "South", popularFor: "IT Hub, Lalbagh" },
  { name: "Chennai", state: "Tamil Nadu", type: ["Urban", "Beach"], region: "South", popularFor: "Marina Beach, Temples" },
  { name: "Coorg", state: "Karnataka", type: ["Hill Station", "Nature"], region: "South", popularFor: "Coffee Plantations" },
  { name: "Hampi", state: "Karnataka", type: ["Heritage", "Historical"], region: "South", popularFor: "Vijayanagara Ruins" },
  { name: "Hyderabad", state: "Telangana", type: ["Heritage", "Urban"], region: "South", popularFor: "Charminar, Biryani" },
  { name: "Kanyakumari", state: "Tamil Nadu", type: ["Beach", "Spiritual"], region: "South", popularFor: "Sunrise, Vivekananda Rock" },
  { name: "Kochi", state: "Kerala", type: ["Beach", "Heritage"], region: "South", popularFor: "Chinese Fishing Nets" },
  { name: "Kodaikanal", state: "Tamil Nadu", type: ["Hill Station", "Nature"], region: "South", popularFor: "Lakes, Waterfalls" },
  { name: "Kovalam", state: "Kerala", type: ["Beach", "Resort"], region: "South", popularFor: "Lighthouse Beach" },
  { name: "Madurai", state: "Tamil Nadu", type: ["Spiritual", "Heritage"], region: "South", popularFor: "Meenakshi Temple" },
  { name: "Mahabalipuram", state: "Tamil Nadu", type: ["Heritage", "Beach"], region: "South", popularFor: "Shore Temple" },
  { name: "Munnar", state: "Kerala", type: ["Hill Station", "Tea Gardens"], region: "South", popularFor: "Tea Plantations" },
  { name: "Mysore", state: "Karnataka", type: ["Heritage", "Royal"], region: "South", popularFor: "Mysore Palace" },
  { name: "Ooty", state: "Tamil Nadu", type: ["Hill Station", "Nature"], region: "South", popularFor: "Nilgiri Mountain Railway" },
  { name: "Pondicherry", state: "Puducherry", type: ["Beach", "French Colony"], region: "South", popularFor: "French Quarter, Auroville" },
  { name: "Rameshwaram", state: "Tamil Nadu", type: ["Spiritual", "Beach"], region: "South", popularFor: "Ramanathaswamy Temple" },
  { name: "Thekkady", state: "Kerala", type: ["Wildlife", "Nature"], region: "South", popularFor: "Periyar Wildlife Sanctuary" },
  { name: "Thiruvananthapuram", state: "Kerala", type: ["Beach", "Heritage"], region: "South", popularFor: "Padmanabhaswamy Temple" },
  { name: "Tirupati", state: "Andhra Pradesh", type: ["Spiritual", "Religious"], region: "South", popularFor: "Venkateswara Temple" },
  { name: "Varkala", state: "Kerala", type: ["Beach", "Cliffs"], region: "South", popularFor: "Cliff Beach, Papanasam" },
  { name: "Wayanad", state: "Kerala", type: ["Nature", "Wildlife"], region: "South", popularFor: "Forests, Waterfalls" },
  
  // East India
  { name: "Bhubaneswar", state: "Odisha", type: ["Heritage", "Spiritual"], region: "East", popularFor: "Temples" },
  { name: "Darjeeling", state: "West Bengal", type: ["Hill Station", "Tea Gardens"], region: "East", popularFor: "Tea, Toy Train" },
  { name: "Digha", state: "West Bengal", type: ["Beach", "Resort"], region: "East", popularFor: "Beach Town" },
  { name: "Gangtok", state: "Sikkim", type: ["Hill Station", "Mountains"], region: "East", popularFor: "Tsomgo Lake" },
  { name: "Guwahati", state: "Assam", type: ["Urban", "Spiritual"], region: "East", popularFor: "Kamakhya Temple" },
  { name: "Imphal", state: "Manipur", type: ["Nature", "Cultural"], region: "East", popularFor: "Loktak Lake" },
  { name: "Kalimpong", state: "West Bengal", type: ["Hill Station", "Nature"], region: "East", popularFor: "Buddhist Monasteries" },
  { name: "Kolkata", state: "West Bengal", type: ["Urban", "Heritage"], region: "East", popularFor: "Victoria Memorial, Howrah Bridge" },
  { name: "Konark", state: "Odisha", type: ["Heritage", "Beach"], region: "East", popularFor: "Sun Temple" },
  { name: "Patna", state: "Bihar", type: ["Heritage", "Historical"], region: "East", popularFor: "Golghar, Mahavir Mandir" },
  { name: "Pelling", state: "Sikkim", type: ["Hill Station", "Adventure"], region: "East", popularFor: "Kanchenjunga Views" },
  { name: "Puri", state: "Odisha", type: ["Beach", "Spiritual"], region: "East", popularFor: "Jagannath Temple" },
  { name: "Ranchi", state: "Jharkhand", type: ["Waterfalls", "Nature"], region: "East", popularFor: "Hundru Falls" },
  { name: "Shillong", state: "Meghalaya", type: ["Hill Station", "Nature"], region: "East", popularFor: "Scotland of East" },
  { name: "Siliguri", state: "West Bengal", type: ["Gateway", "Urban"], region: "East", popularFor: "Gateway to Himalayas" },
  { name: "Sundarbans", state: "West Bengal", type: ["Wildlife", "Mangroves"], region: "East", popularFor: "Royal Bengal Tigers" },
  
  // West India
  { name: "Ahmedabad", state: "Gujarat", type: ["Heritage", "Urban"], region: "West", popularFor: "Sabarmati Ashram" },
  { name: "Ajanta Caves", state: "Maharashtra", type: ["Heritage", "Historical"], region: "West", popularFor: "Buddhist Caves" },
  { name: "Alibag", state: "Maharashtra", type: ["Beach", "Resort"], region: "West", popularFor: "Beach Getaway" },
  { name: "Aurangabad", state: "Maharashtra", type: ["Heritage", "Historical"], region: "West", popularFor: "Gateway to Ajanta-Ellora" },
  { name: "Daman & Diu", state: "Daman & Diu", type: ["Beach", "Portuguese"], region: "West", popularFor: "Beaches, Fort" },
  { name: "Dwarka", state: "Gujarat", type: ["Spiritual", "Religious"], region: "West", popularFor: "Dwarkadhish Temple" },
  { name: "Ellora Caves", state: "Maharashtra", type: ["Heritage", "Historical"], region: "West", popularFor: "Rock-cut Temples" },
  { name: "Gandhinagar", state: "Gujarat", type: ["Urban", "Planned"], region: "West", popularFor: "Akshardham Temple" },
  { name: "Gir National Park", state: "Gujarat", type: ["Wildlife", "Safari"], region: "West", popularFor: "Asiatic Lions" },
  { name: "Goa", state: "Goa", type: ["Beach", "Nightlife"], region: "West", popularFor: "Beaches, Portuguese Culture" },
  { name: "Lonavala", state: "Maharashtra", type: ["Hill Station", "Nature"], region: "West", popularFor: "Waterfalls, Caves" },
  { name: "Mahabaleshwar", state: "Maharashtra", type: ["Hill Station", "Nature"], region: "West", popularFor: "Strawberries, Viewpoints" },
  { name: "Matheran", state: "Maharashtra", type: ["Hill Station", "Nature"], region: "West", popularFor: "Vehicle-free Town" },
  { name: "Mount Abu", state: "Rajasthan", type: ["Hill Station", "Heritage"], region: "West", popularFor: "Dilwara Temples" },
  { name: "Mumbai", state: "Maharashtra", type: ["Urban", "Coastal"], region: "West", popularFor: "Gateway of India, Bollywood" },
  { name: "Nashik", state: "Maharashtra", type: ["Spiritual", "Wine"], region: "West", popularFor: "Kumbh Mela, Vineyards" },
  { name: "Pune", state: "Maharashtra", type: ["Urban", "Heritage"], region: "West", popularFor: "Shaniwar Wada" },
  { name: "Rann of Kutch", state: "Gujarat", type: ["Desert", "Cultural"], region: "West", popularFor: "White Desert, Rann Utsav" },
  { name: "Shirdi", state: "Maharashtra", type: ["Spiritual", "Religious"], region: "West", popularFor: "Sai Baba Temple" },
  { name: "Somnath", state: "Gujarat", type: ["Spiritual", "Beach"], region: "West", popularFor: "Somnath Temple" },
  { name: "Tarkarli", state: "Maharashtra", type: ["Beach", "Diving"], region: "West", popularFor: "Scuba Diving" },
  { name: "Vadodara", state: "Gujarat", type: ["Heritage", "Urban"], region: "West", popularFor: "Laxmi Vilas Palace" },
  
  // Central India
  { name: "Bandhavgarh", state: "Madhya Pradesh", type: ["Wildlife", "Safari"], region: "Central", popularFor: "Tiger Reserve" },
  { name: "Bhopal", state: "Madhya Pradesh", type: ["Urban", "Heritage"], region: "Central", popularFor: "Lakes, Bhimbetka Caves" },
  { name: "Gwalior", state: "Madhya Pradesh", type: ["Heritage", "Fort"], region: "Central", popularFor: "Gwalior Fort" },
  { name: "Indore", state: "Madhya Pradesh", type: ["Urban", "Food"], region: "Central", popularFor: "Street Food" },
  { name: "Jabalpur", state: "Madhya Pradesh", type: ["Nature", "Waterfalls"], region: "Central", popularFor: "Marble Rocks, Dhuandhar Falls" },
  { name: "Kanha National Park", state: "Madhya Pradesh", type: ["Wildlife", "Safari"], region: "Central", popularFor: "Tiger Reserve" },
  { name: "Khajuraho", state: "Madhya Pradesh", type: ["Heritage", "UNESCO"], region: "Central", popularFor: "Erotic Temples" },
  { name: "Mandu", state: "Madhya Pradesh", type: ["Heritage", "Historical"], region: "Central", popularFor: "Afghan Architecture" },
  { name: "Omkareshwar", state: "Madhya Pradesh", type: ["Spiritual", "Island"], region: "Central", popularFor: "Jyotirlinga" },
  { name: "Orchha", state: "Madhya Pradesh", type: ["Heritage", "Historical"], region: "Central", popularFor: "Palaces, Temples" },
  { name: "Pachmarhi", state: "Madhya Pradesh", type: ["Hill Station", "Nature"], region: "Central", popularFor: "Waterfalls, Caves" },
  { name: "Panna", state: "Madhya Pradesh", type: ["Wildlife", "Safari"], region: "Central", popularFor: "Tiger Reserve, Diamonds" },
  { name: "Raipur", state: "Chhattisgarh", type: ["Urban", "Modern"], region: "Central", popularFor: "Steel City" },
  { name: "Sanchi", state: "Madhya Pradesh", type: ["Heritage", "Buddhist"], region: "Central", popularFor: "Buddhist Stupa" },
  { name: "Ujjain", state: "Madhya Pradesh", type: ["Spiritual", "Religious"], region: "Central", popularFor: "Mahakaleshwar Temple, Kumbh Mela" },
  
  // Northeast India
  { name: "Aizawl", state: "Mizoram", type: ["Hill Station", "Cultural"], region: "Northeast", popularFor: "Tribal Culture" },
  { name: "Cherrapunji", state: "Meghalaya", type: ["Nature", "Waterfalls"], region: "Northeast", popularFor: "Wettest Place, Living Root Bridges" },
  { name: "Dawki", state: "Meghalaya", type: ["Nature", "River"], region: "Northeast", popularFor: "Crystal Clear Umngot River" },
  { name: "Dimapur", state: "Nagaland", type: ["Urban", "Gateway"], region: "Northeast", popularFor: "Gateway to Nagaland" },
  { name: "Itanagar", state: "Arunachal Pradesh", type: ["Hill Station", "Cultural"], region: "Northeast", popularFor: "Ita Fort" },
  { name: "Kaziranga", state: "Assam", type: ["Wildlife", "UNESCO"], region: "Northeast", popularFor: "One-horned Rhinos" },
  { name: "Kohima", state: "Nagaland", type: ["Hill Station", "War Memorial"], region: "Northeast", popularFor: "Hornbill Festival" },
  { name: "Mawlynnong", state: "Meghalaya", type: ["Village", "Nature"], region: "Northeast", popularFor: "Cleanest Village in Asia" },
  { name: "Tawang", state: "Arunachal Pradesh", type: ["Mountains", "Spiritual"], region: "Northeast", popularFor: "Tawang Monastery" },
  { name: "Ziro Valley", state: "Arunachal Pradesh", type: ["Valley", "Cultural"], region: "Northeast", popularFor: "Apatani Tribe, Music Festival" },
  
  // Union Territories & Islands
  { name: "Andaman & Nicobar Islands", state: "Andaman & Nicobar", type: ["Beach", "Islands"], region: "South", popularFor: "Radhanagar Beach, Cellular Jail" },
  { name: "Havelock Island", state: "Andaman & Nicobar", type: ["Beach", "Diving"], region: "South", popularFor: "Scuba Diving, Pristine Beaches" },
  { name: "Lakshadweep", state: "Lakshadweep", type: ["Beach", "Islands"], region: "South", popularFor: "Coral Reefs" },
  { name: "Neil Island", state: "Andaman & Nicobar", type: ["Beach", "Islands"], region: "South", popularFor: "Natural Bridge" },
  { name: "Port Blair", state: "Andaman & Nicobar", type: ["Urban", "Historical"], region: "South", popularFor: "Cellular Jail, Water Sports" },
]

// Helper function to search destinations
export function searchDestinations(query: string, limit = 10): IndianDestination[] {
  if (!query || query.trim().length === 0) return []
  
  const searchTerm = query.toLowerCase().trim()
  
  return indianDestinations
    .filter(dest => 
      dest.name.toLowerCase().includes(searchTerm) ||
      dest.state.toLowerCase().includes(searchTerm) ||
      dest.type.some(t => t.toLowerCase().includes(searchTerm)) ||
      dest.popularFor?.toLowerCase().includes(searchTerm)
    )
    .slice(0, limit)
}

// Helper function to get all destination names
export function getAllDestinationNames(): string[] {
  return indianDestinations.map(d => d.name).sort()
}

// Helper function to get destinations by state
export function getDestinationsByState(state: string): IndianDestination[] {
  return indianDestinations.filter(d => 
    d.state.toLowerCase() === state.toLowerCase()
  )
}

// Helper function to get destinations by type
export function getDestinationsByType(type: string): IndianDestination[] {
  return indianDestinations.filter(d =>
    d.type.some(t => t.toLowerCase() === type.toLowerCase())
  )
}
