"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIItineraryCard, type AIActivity } from "@/components/ai-itinerary-card"
import { Sparkles, Loader2, Save, RefreshCw } from "lucide-react"
import { calculateActivityCost, calculateActivityCostRange } from "@/lib/pricing"
import { calculateFare } from "@/lib/transport-service"

const mockAIItinerary: AIActivity[] = [
  {
    id: "1",
    time: "06:00",
    name: "Sunrise at Taj Mahal",
    description: "Experience the ethereal beauty of the Taj Mahal at sunrise when the white marble glows with golden hues.",
    duration: "2.5 hours",
    location: "Taj Mahal, Agra",
    category: "Sightseeing",
    tips: "Book tickets online in advance. Enter through the East gate for quicker access. Photography is best during golden hour.",
    cost: `${calculateActivityCost(250, 'entry')} (Indians), ${calculateActivityCost(1100, 'entry')} (Foreigners)`,
    transportMode: "uber-go",
    transportFare: calculateFare("uber-go", 3, "06:00").estimatedFare,
    distanceToNext: 3,
  },
  {
    id: "2",
    time: "09:00",
    name: "Breakfast at Pinch of Spice",
    description: "Enjoy authentic North Indian breakfast with local flavors and specialties.",
    duration: "1 hour",
    location: "MG Road, Agra",
    category: "Food",
    tips: "Try their parathas and lassi. Popular spot, so arrive early or make a reservation.",
    cost: calculateActivityCostRange(200, 400, 'food'),
    transportMode: "auto-rickshaw",
    transportFare: calculateFare("auto-rickshaw", 2.5, "10:00").estimatedFare,
    distanceToNext: 2.5,
  },
  {
    id: "3",
    time: "10:30",
    name: "Explore Agra Fort",
    description: "Visit this UNESCO World Heritage Site showcasing magnificent Mughal architecture and rich history.",
    duration: "2 hours",
    location: "Agra Fort, Rakabganj",
    category: "Sightseeing",
    tips: "Hire a guide to learn fascinating stories. Don't miss the Jahangir Palace and Diwan-i-Am.",
    cost: calculateActivityCost(550, 'entry'),
    transportMode: "uber-go",
    transportFare: calculateFare("uber-go", 4, "12:30").estimatedFare,
    distanceToNext: 4,
  },
  {
    id: "4",
    time: "13:00",
    name: "Lunch at Peshawri",
    description: "Savor the finest North-West Frontier cuisine in an authentic setting.",
    duration: "1.5 hours",
    location: "ITC Mughal, Agra",
    category: "Food",
    tips: "Their dal bukhara and kebabs are legendary. Book in advance for lunch.",
    cost: calculateActivityCostRange(1500, 2500, 'food'),
    transportMode: "ola-mini",
    transportFare: calculateFare("ola-mini", 5, "14:30").estimatedFare,
    distanceToNext: 5,
  },
  {
    id: "5",
    time: "15:30",
    name: "Visit Mehtab Bagh",
    description: "Cross the Yamuna River to visit this Mughal garden offering stunning back views of the Taj Mahal.",
    duration: "1.5 hours",
    location: "Nagla Devjit, Agra",
    category: "Activity",
    tips: "Perfect spot for photography with Taj Mahal reflection views. Less crowded than the main monument.",
    cost: calculateActivityCost(200, 'entry'),
    transportMode: "auto-rickshaw",
    transportFare: calculateFare("auto-rickshaw", 3.5, "17:00").estimatedFare,
    distanceToNext: 3.5,
  },
  {
    id: "6",
    time: "18:00",
    name: "Shopping at Sadar Bazaar",
    description: "Experience local culture and shop for marble handicrafts, leather goods, and traditional jewelry.",
    duration: "2 hours",
    location: "Sadar Bazaar, Agra",
    category: "Activity",
    tips: "Bargain is expected! Look for marble inlay work and leather items. Be careful with your belongings.",
    cost: calculateActivityCostRange(500, 5000, 'activity'),
  },
  {
    id: "7",
    time: "07:00",
    name: "Itmad-ud-Daulah (Baby Taj) Visit",
    description: "Explore the exquisite marble tomb often called Baby Taj.",
    duration: "1.5 hours",
    location: "East Bank Yamuna River",
    category: "Heritage",
    tips: "Less crowded, intricate inlay work. Best morning light for photos.",
    cost: calculateActivityCost(310, 'entry'),
  },
  {
    id: "8",
    time: "16:00",
    name: "Akbar's Tomb at Sikandra",
    description: "Visit the magnificent tomb of Emperor Akbar with unique architecture.",
    duration: "2 hours",
    location: "Sikandra, 10km from Agra",
    category: "Heritage",
    tips: "Blend of Hindu and Islamic architecture. Wildlife spotting - deer and peacocks.",
    cost: calculateActivityCost(300, 'entry'),
  },
  {
    id: "9",
    time: "19:30",
    name: "Mohabbat The Taj Show",
    description: "Watch cultural dance-drama depicting Taj Mahal's love story.",
    duration: "1.5 hours",
    location: "Kalakriti Cultural Center",
    category: "Cultural",
    tips: "Book in advance. Audio available in multiple languages. AC auditorium.",
    cost: calculateActivityCostRange(600, 1000, 'activity'),
  },
  {
    id: "10",
    time: "11:00",
    name: "Taj Museum Visit",
    description: "Explore artifacts and history related to Taj Mahal construction.",
    duration: "1 hour",
    location: "Inside Taj Mahal complex",
    category: "Heritage",
    tips: "Included in Taj Mahal ticket. Original drawings and miniature paintings.",
    cost: "Included",
  },
]

// Function to generate destination-specific itineraries
const generateItineraryForDestination = (dest: string, budget: string = 'moderate', days: number = 1): AIActivity[] => {
  const lowerDest = dest.toLowerCase()
  
  // Budget multipliers for cost adjustments
  const budgetMultiplier = budget === 'budget' ? 0.6 : budget === 'luxury' ? 1.8 : 1.0
  
  // Helper function to adjust costs based on budget
  const adjustCostForBudget = (cost: string): string => {
    if (cost === 'Free' || cost.includes('Included') || cost.includes('donations')) return cost
    
    // Extract numbers from cost string
    const numbers = cost.match(/\d+/g)
    if (!numbers) return cost
    
    const adjustedNumbers = numbers.map(n => Math.round(parseInt(n) * budgetMultiplier))
    let adjustedCost = cost
    numbers.forEach((num, i) => {
      adjustedCost = adjustedCost.replace(num, adjustedNumbers[i].toString())
    })
    return adjustedCost
  }
  
  // Helper function to select activities based on duration
  const selectActivitiesByDuration = (allActivities: AIActivity[]): AIActivity[] => {
    if (allActivities.length === 0) return allActivities
    
    // Calculate activities based on duration with clearer differentiation
    let selectedCount: number
    
    if (days === 1) {
      // 1 day: 3-4 key activities
      selectedCount = Math.min(4, allActivities.length)
    } else if (days === 2) {
      // 2 days: 5-7 activities
      selectedCount = Math.min(7, allActivities.length)
    } else if (days === 3) {
      // 3 days: 8-10 activities
      selectedCount = Math.min(10, allActivities.length)
    } else if (days === 4) {
      // 4 days: 11-14 activities
      selectedCount = Math.min(14, allActivities.length)
    } else if (days === 5) {
      // 5 days: 15-18 activities
      selectedCount = Math.min(18, allActivities.length)
    } else {
      // 6+ days: all activities
      selectedCount = allActivities.length
    }
    
    return allActivities.slice(0, selectedCount)
  }
  
  // Helper function to apply budget variations to activity names and descriptions
  const applyBudgetVariations = (activity: AIActivity): AIActivity => {
    let modifiedActivity = { ...activity }
    
    if (budget === 'budget') {
      // Budget-friendly alternatives
      if (activity.category === 'Food') {
        modifiedActivity.description = activity.description.replace('finest', 'authentic').replace('luxury', 'local')
      }
      if (activity.category === 'Accommodation') {
        modifiedActivity.description = activity.description.replace('luxury', 'comfortable').replace('premium', 'budget-friendly')
      }
    } else if (budget === 'luxury') {
      // Luxury upgrades
      if (activity.category === 'Food') {
        modifiedActivity.description = activity.description.includes('luxury') ? activity.description : activity.description.replace('authentic', 'premium').replace('local', 'upscale')
      }
      if (activity.category === 'Transport') {
        modifiedActivity.description = activity.description.replace('cab', 'private chauffeur').replace('auto-rickshaw', 'private car')
        modifiedActivity.tips = (activity.tips || '') + ' Private luxury vehicle recommended.'
      }
    }
    
    // Adjust cost
    if (activity.cost) {
      modifiedActivity.cost = adjustCostForBudget(activity.cost)
    }
    
    return modifiedActivity
  }
  
  // Jaipur itinerary
  if (lowerDest.includes('jaipur') || lowerDest.includes('pink city')) {
    const jaipurActivities: AIActivity[] = [
      {
        id: "1",
        time: "08:00",
        name: "Sunrise at Amber Fort",
        description: "Visit the magnificent Amber Fort early morning to avoid crowds and enjoy cooler weather.",
        duration: "3 hours",
        location: "Amber Fort, Jaipur",
        category: "Sightseeing",
        tips: "Take an elephant ride up to the fort or walk for better photos. Hire a guide to learn the history.",
        cost: `${calculateActivityCost(500, 'entry')} (entry + guide)`,
      },
      {
        id: "2",
        time: "12:00",
        name: "Lunch at Laxmi Misthan Bhandar",
        description: "Try authentic Rajasthani thali and famous sweets at this iconic restaurant.",
        duration: "1.5 hours",
        location: "Johari Bazaar, Jaipur",
        category: "Food",
        tips: "Try their ghewar and dal baati churma. Cash only!",
        cost: calculateActivityCostRange(300, 500, 'food'),
      },
      {
        id: "3",
        time: "14:00",
        name: "City Palace & Jantar Mantar",
        description: "Explore the royal residence and astronomical observatory.",
        duration: "2.5 hours",
        location: "City Palace Road",
        category: "Sightseeing",
        tips: "Combo ticket available for both sites. Photography allowed in most areas.",
        cost: calculateActivityCost(700, 'entry'),
      },
      {
        id: "4",
        time: "17:00",
        name: "Hawa Mahal & Johari Bazaar",
        description: "See the Palace of Winds and shop for jewelry, textiles, and handicrafts.",
        duration: "2 hours",
        location: "Hawa Mahal Road",
        category: "Activity",
        tips: "Visit Hawa Mahal from outside (great photos), then shop at nearby bazaars. Bargain well!",
        cost: `${calculateActivityCost(200, 'entry')} + shopping`,
      },
      {
        id: "5",
        time: "08:00",
        name: "Nahargarh Fort Sunrise Visit",
        description: "Watch sunrise from hilltop fort with panoramic city views.",
        duration: "2 hours",
        location: "Nahargarh Fort",
        category: "Sightseeing",
        tips: "Best for photography. Cafe available for breakfast. Tiger Fort is nearby.",
        cost: calculateActivityCost(200, 'entry'),
      },
      {
        id: "6",
        time: "10:30",
        name: "Jaigarh Fort & Cannon Factory",
        description: "Explore the fort housing world's largest wheeled cannon.",
        duration: "2 hours",
        location: "Jaigarh Fort",
        category: "Heritage",
        tips: "Less crowded than Amber Fort. Great views. Water reserves and puppet show.",
        cost: calculateActivityCost(350, 'entry'),
      },
      {
        id: "7",
        time: "13:30",
        name: "Traditional Rajasthani Thali at Chokhi Dhani",
        description: "Authentic village experience with cultural performances and food.",
        duration: "3 hours",
        location: "Chokhi Dhani Resort",
        category: "Cultural",
        tips: "Evening visit recommended. Camel rides, puppet shows, folk dances included.",
        cost: calculateActivityCostRange(800, 1200, 'food'),
      },
      {
        id: "8",
        time: "15:00",
        name: "Albert Hall Museum Visit",
        description: "Explore Rajasthan's oldest museum with Egyptian mummy and miniature paintings.",
        duration: "1.5 hours",
        location: "Ram Niwas Garden",
        category: "Heritage",
        tips: "Beautiful architecture. Light show in evening. Photography allowed.",
        cost: calculateActivityCost(300, 'entry'),
      },
      {
        id: "9",
        time: "18:00",
        name: "Jal Mahal Evening Photo Walk",
        description: "Photograph the stunning Water Palace during golden hour.",
        duration: "1 hour",
        location: "Man Sagar Lake",
        category: "Activity",
        tips: "Entry not allowed inside, but perfect for photos from outside. Sunset views spectacular.",
        cost: "Free",
      },
      {
        id: "10",
        time: "11:00",
        name: "Anokhi Museum of Hand Printing",
        description: "Learn about traditional block printing techniques and textile heritage.",
        duration: "1.5 hours",
        location: "Kheri Gate",
        category: "Cultural",
        tips: "Hands-on workshops available. Beautiful collection. Shop for authentic prints.",
        cost: calculateActivityCost(150, 'entry'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(jaipurActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Goa itinerary
  if (lowerDest.includes('goa')) {
    const goaActivities: AIActivity[] = [
      {
        id: "1",
        time: "07:00",
        name: "Sunrise at Palolem Beach",
        description: "Watch the stunning sunrise at one of Goa's most beautiful beaches.",
        duration: "2 hours",
        location: "Palolem Beach, South Goa",
        category: "Activity",
        tips: "Arrive early for peaceful beach time. Yoga sessions available on the beach.",
        cost: "Free",
      },
      {
        id: "2",
        time: "10:00",
        name: "Water Sports at Baga Beach",
        description: "Try parasailing, jet skiing, and banana boat rides.",
        duration: "2.5 hours",
        location: "Baga Beach, North Goa",
        category: "Activity",
        tips: "Bargain for combo packages. Wear sunscreen and life jacket provided.",
        cost: calculateActivityCostRange(1500, 3000, 'activity'),
      },
      {
        id: "3",
        time: "13:00",
        name: "Seafood Lunch at Beach Shack",
        description: "Enjoy fresh catch of the day at a beachfront shack.",
        duration: "1.5 hours",
        location: "Calangute Beach",
        category: "Food",
        tips: "Try prawn curry rice and fish recheado. Ask about the catch of the day.",
        cost: calculateActivityCostRange(800, 1200, 'food'),
      },
      {
        id: "4",
        time: "16:00",
        name: "Old Goa Churches Tour",
        description: "Visit Basilica of Bom Jesus and Se Cathedral - UNESCO World Heritage Sites.",
        duration: "2 hours",
        location: "Old Goa",
        category: "Sightseeing",
        tips: "Dress modestly. Free entry but donations welcome.",
        cost: "Free",
      },
      {
        id: "5",
        time: "19:00",
        name: "Sunset Cruise on Mandovi River",
        description: "Enjoy live music, dance, and dinner on a river cruise.",
        duration: "2 hours",
        location: "Mandovi River",
        category: "Activity",
        tips: "Book in advance. Evening cruise includes entertainment and buffet dinner.",
        cost: calculateActivityCostRange(600, 1000, 'activity'),
      },
      {
        id: "6",
        time: "08:00",
        name: "Spice Plantation Tour",
        description: "Explore organic spice farms and learn about traditional cultivation.",
        duration: "3 hours",
        location: "Ponda",
        category: "Activity",
        tips: "Includes traditional Goan lunch. Elephant rides available. Buy fresh spices.",
        cost: calculateActivityCostRange(500, 800, 'activity'),
      },
      {
        id: "7",
        time: "16:00",
        name: "Dudhsagar Waterfalls Trek",
        description: "Visit India's 5th tallest waterfall via jeep safari and trek.",
        duration: "6 hours",
        location: "Mollem National Park",
        category: "Adventure",
        tips: "Best during monsoon. Full day activity. Carry swimwear and change of clothes.",
        cost: calculateActivityCostRange(1500, 2500, 'activity'),
      },
      {
        id: "8",
        time: "20:00",
        name: "Night Market Shopping at Arpora",
        description: "Experience vibrant Saturday night market with shopping and food.",
        duration: "2.5 hours",
        location: "Arpora",
        category: "Activity",
        tips: "Only on Saturdays. Bargain for clothes, jewelry, handicrafts. Live music.",
        cost: calculateActivityCostRange(300, 1000, 'activity'),
      },
      {
        id: "9",
        time: "10:00",
        name: "Fort Aguada Heritage Walk",
        description: "Explore 17th century Portuguese fort with stunning sea views.",
        duration: "2 hours",
        location: "Candolim",
        category: "Heritage",
        tips: "Well-preserved fort. Lighthouse visit separate. Good for photography.",
        cost: "Free",
      },
      {
        id: "10",
        time: "14:00",
        name: "Scuba Diving at Grande Island",
        description: "Underwater adventure with PADI certified instructors.",
        duration: "4 hours",
        location: "Grande Island",
        category: "Adventure",
        tips: "No prior experience needed. Includes boat ride. October-May season.",
        cost: calculateActivityCostRange(2500, 4000, 'activity'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(goaActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Varanasi itinerary
  if (lowerDest.includes('varanasi') || lowerDest.includes('banaras') || lowerDest.includes('kashi')) {
    const varanasiActivities: AIActivity[] = [
      {
        id: "1",
        time: "05:30",
        name: "Sunrise Boat Ride on Ganges",
        description: "Experience the spiritual awakening of Varanasi from the holy river.",
        duration: "2 hours",
        location: "Dashashwamedh Ghat",
        category: "Activity",
        tips: "Book boat the night before. Witness morning prayers and rituals from the river.",
        cost: calculateActivityCostRange(200, 500, 'transport'),
      },
      {
        id: "2",
        time: "08:00",
        name: "Visit Kashi Vishwanath Temple",
        description: "One of the 12 Jyotirlingas and most sacred Shiva temple.",
        duration: "2 hours",
        location: "Vishwanath Gali",
        category: "Spiritual",
        tips: "No phones/cameras allowed. Long queues expected. Dress modestly.",
        cost: "Free",
      },
      {
        id: "3",
        time: "11:00",
        name: "Breakfast at Kashi Chat Bhandar",
        description: "Try authentic Banarasi breakfast - kachori sabzi and lassi.",
        duration: "1 hour",
        location: "Godowlia",
        category: "Food",
        tips: "Try their famous tamatar chaat and malaiyo (seasonal).",
        cost: calculateActivityCostRange(100, 200, 'food'),
      },
      {
        id: "4",
        time: "14:00",
        name: "Sarnath Buddhist Site",
        description: "Visit the place where Buddha gave his first sermon.",
        duration: "2.5 hours",
        location: "Sarnath, 10km from Varanasi",
        category: "Sightseeing",
        tips: "Hire auto-rickshaw for round trip. See Dhamek Stupa and museum.",
        cost: calculateActivityCost(300, 'transport'),
      },
      {
        id: "5",
        time: "18:30",
        name: "Ganga Aarti at Dashashwamedh Ghat",
        description: "Witness the mesmerizing evening prayer ceremony with fire and chants.",
        duration: "1.5 hours",
        location: "Dashashwamedh Ghat",
        category: "Spiritual",
        tips: "Arrive 30 mins early for good viewing spot. Can watch from boat or ghat.",
        cost: "Free",
      },
      {
        id: "6",
        time: "07:00",
        name: "Morning Walk Through Ancient Ghats",
        description: "Explore Manikarnika, Assi, and other historic ghats on foot.",
        duration: "2 hours",
        location: "Various Ghats",
        category: "Cultural",
        tips: "Witness cremation ceremonies respectfully. Photography with permission only.",
        cost: "Free",
      },
      {
        id: "7",
        time: "13:00",
        name: "Lunch at Blue Lassi",
        description: "Try the famous lassi at this iconic 100-year-old shop.",
        duration: "1 hour",
        location: "Near Manikarnika Ghat",
        category: "Food",
        tips: "Try their special fruit lassi. Cash only. Small seating area.",
        cost: calculateActivityCostRange(50, 150, 'food'),
      },
      {
        id: "8",
        time: "15:00",
        name: "Silk Weaving Tour in Banarasi Saree Workshop",
        description: "See traditional Banarasi saree weaving process.",
        duration: "2 hours",
        location: "Weaver's colony",
        category: "Cultural",
        tips: "Fascinating craftsmanship. Can purchase authentic sarees. Bargain expected.",
        cost: calculateActivityCost(200, 'activity'),
      },
      {
        id: "9",
        time: "16:30",
        name: "Ramnagar Fort & Museum",
        description: "Visit the ancestral home of Kashi's Maharaja with vintage collection.",
        duration: "1.5 hours",
        location: "Ramnagar, across Ganges",
        category: "Heritage",
        tips: "Take ferry across river. Vintage cars and royal artifacts. Photography allowed.",
        cost: calculateActivityCost(200, 'entry'),
      },
      {
        id: "10",
        time: "06:00",
        name: "Yoga Session by the Ganges",
        description: "Practice traditional yoga with river views and spiritual ambiance.",
        duration: "1.5 hours",
        location: "Assi Ghat",
        category: "Activity",
        tips: "Many free/donation-based sessions available. Bring yoga mat or rent.",
        cost: calculateActivityCostRange(200, 500, 'activity'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(varanasiActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Kerala itinerary
  if (lowerDest.includes('kerala') || lowerDest.includes('alleppey') || lowerDest.includes('kumarakom') || lowerDest.includes('backwater')) {
    const keralaActivities: AIActivity[] = [
      {
        id: "1",
        time: "12:00",
        name: "Houseboat Check-in & Lunch",
        description: "Board your private kettuvallam houseboat with traditional Kerala lunch.",
        duration: "2 hours",
        location: "Alleppey Backwaters",
        category: "Accommodation",
        tips: "Book AC houseboat in advance. Includes all meals. Choose 1-night package.",
        cost: calculateActivityCostRange(8000, 15000, 'accommodation'),
      },
      {
        id: "2",
        time: "14:30",
        name: "Backwater Cruise",
        description: "Glide through serene canals, paddy fields, and village life.",
        duration: "3 hours",
        location: "Vembanad Lake",
        category: "Activity",
        tips: "Best views from top deck. Watch sunset from the boat. Wifi usually not available.",
        cost: "Included",
      },
      {
        id: "3",
        time: "18:00",
        name: "Kerala Dinner on Houseboat",
        description: "Traditional Kerala cuisine with fish curry, appam, and coconut-based dishes.",
        duration: "1.5 hours",
        location: "Houseboat",
        category: "Food",
        tips: "Food is cooked fresh on boat. Request special dishes in advance.",
        cost: "Included",
      },
      {
        id: "4",
        time: "10:00",
        name: "Village Tour & Toddy Tapping",
        description: "Experience local village life and see toddy (palm wine) extraction.",
        duration: "2 hours",
        location: "Local Village",
        category: "Activity",
        tips: "Interact with locals. Try fresh toddy (non-alcoholic version available).",
        cost: calculateActivityCost(500, 'activity'),
      },
      {
        id: "5",
        time: "07:00",
        name: "Kathakali Dance Performance",
        description: "Watch traditional Kerala dance-drama with elaborate costumes.",
        duration: "2 hours",
        location: "Cultural Center, Kochi",
        category: "Cultural",
        tips: "Arrive early to see makeup application. English commentary available.",
        cost: calculateActivityCostRange(300, 500, 'activity'),
      },
      {
        id: "6",
        time: "09:00",
        name: "Munnar Tea Plantation Visit",
        description: "Tour lush tea estates and learn about tea processing.",
        duration: "3 hours",
        location: "Munnar, 130km from Kochi",
        category: "Activity",
        tips: "Best from October to March. Tasting included. Buy fresh tea.",
        cost: calculateActivityCostRange(400, 800, 'activity'),
      },
      {
        id: "7",
        time: "15:00",
        name: "Ayurvedic Spa Treatment",
        description: "Experience authentic Kerala Ayurvedic massage and therapies.",
        duration: "2 hours",
        location: "Ayurvedic Resort",
        category: "Wellness",
        tips: "Book in advance. Mention any health conditions. Shower facilities available.",
        cost: calculateActivityCostRange(1500, 3000, 'activity'),
      },
      {
        id: "8",
        time: "17:00",
        name: "Chinese Fishing Nets & Fort Kochi Walk",
        description: "Explore historic Fort Kochi with iconic fishing nets.",
        duration: "2 hours",
        location: "Fort Kochi",
        category: "Sightseeing",
        tips: "Sunset views spectacular. Visit St. Francis Church and Dutch Palace nearby.",
        cost: "Free",
      },
      {
        id: "9",
        time: "11:00",
        name: "Traditional Kerala Sadya Lunch",
        description: "Feast on authentic banana leaf meal with 20+ dishes.",
        duration: "1.5 hours",
        location: "Traditional Restaurant",
        category: "Food",
        tips: "Vegetarian feast. Eat with hands. Unlimited servings. Best on Onam festival.",
        cost: calculateActivityCostRange(200, 400, 'food'),
      },
      {
        id: "10",
        time: "08:00",
        name: "Periyar Wildlife Sanctuary Boat Safari",
        description: "Spot elephants, bison, and birds on scenic lake safari.",
        duration: "2.5 hours",
        location: "Thekkady",
        category: "Wildlife",
        tips: "Early morning best for wildlife. Carry binoculars. Book tickets online.",
        cost: calculateActivityCostRange(300, 600, 'activity'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(keralaActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Manali itinerary
  if (lowerDest.includes('manali') || lowerDest.includes('himachal')) {
    const manaliActivities: AIActivity[] = [
      {
        id: "1",
        time: "07:00",
        name: "Solang Valley Adventure",
        description: "Experience paragliding, zorbing, and cable car rides with mountain views.",
        duration: "4 hours",
        location: "Solang Valley, 14km from Manali",
        category: "Adventure",
        tips: "Book activities on-site. Weather dependent. Wear layers and comfortable shoes.",
        cost: calculateActivityCostRange(1500, 3000, 'activity'),
      },
      {
        id: "2",
        time: "12:00",
        name: "Lunch at Johnson's Cafe",
        description: "Popular cafe in Old Manali serving Italian and Israeli cuisine.",
        duration: "1.5 hours",
        location: "Old Manali",
        category: "Food",
        tips: "Try their trout fish and apple pie. Great ambiance with mountain views.",
        cost: calculateActivityCostRange(600, 1000, 'food'),
      },
      {
        id: "3",
        time: "14:00",
        name: "Hadimba Temple & Old Manali Walk",
        description: "Visit ancient wooden temple and explore hippie culture of Old Manali.",
        duration: "2 hours",
        location: "Hadimba Temple Road",
        category: "Sightseeing",
        tips: "Temple is in dense forest. Walk around Old Manali's cafes and shops.",
        cost: calculateActivityCost(50, 'entry'),
      },
      {
        id: "4",
        time: "17:00",
        name: "Mall Road Shopping & Cafe Hopping",
        description: "Shop for woolens, handicrafts and enjoy mountain cafe culture.",
        duration: "2.5 hours",
        location: "Mall Road, Manali",
        category: "Activity",
        tips: "Bargain at shops. Try hot chocolate at cafes. Best time for photos.",
        cost: calculateActivityCostRange(500, 2000, 'activity'),
      },
      {
        id: "5",
        time: "06:00",
        name: "Rohtang Pass Snow Adventure",
        description: "Experience snow activities at 13,050 ft mountain pass.",
        duration: "5 hours",
        location: "Rohtang Pass, 51km from Manali",
        category: "Adventure",
        tips: "Permit required (book online). May-October only. Carry warm clothes.",
        cost: calculateActivityCostRange(2000, 3500, 'transport'),
      },
      {
        id: "6",
        time: "08:30",
        name: "Vashisht Hot Springs & Temple",
        description: "Relax in natural hot water springs with mountain views.",
        duration: "2 hours",
        location: "Vashisht Village, 3km from Manali",
        category: "Wellness",
        tips: "Free public baths available. Separate sections for men and women.",
        cost: "Free",
      },
      {
        id: "7",
        time: "15:00",
        name: "River Rafting in Beas River",
        description: "Thrilling white water rafting experience.",
        duration: "2 hours",
        location: "Pirdi to Jhiri stretch",
        category: "Adventure",
        tips: "Best May-June. Life jackets provided. Certified instructors.",
        cost: calculateActivityCostRange(800, 1500, 'activity'),
      },
      {
        id: "8",
        time: "16:30",
        name: "Visit Naggar Castle",
        description: "Explore medieval castle with art gallery and cafe.",
        duration: "1.5 hours",
        location: "Naggar, 21km from Manali",
        category: "Heritage",
        tips: "Nicholas Roerich Art Gallery nearby. Heritage hotel inside castle.",
        cost: calculateActivityCost(100, 'entry'),
      },
      {
        id: "9",
        time: "13:00",
        name: "Trout Fishing at Manali Nature Park",
        description: "Try your hand at fishing in pristine mountain streams.",
        duration: "2 hours",
        location: "Manali Nature Park",
        category: "Activity",
        tips: "Equipment available for rent. License required. Cook your catch.",
        cost: calculateActivityCostRange(500, 1000, 'activity'),
      },
      {
        id: "10",
        time: "10:00",
        name: "Trek to Jogini Waterfall",
        description: "Easy trek through pine forests to hidden waterfall.",
        duration: "3 hours",
        location: "Vashisht Village",
        category: "Adventure",
        tips: "3km trail. Moderate difficulty. Carry water. Best April-June.",
        cost: "Free",
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(manaliActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Leh-Ladakh itinerary
  if (lowerDest.includes('leh') || lowerDest.includes('ladakh')) {
    const ladakhActivities: AIActivity[] = [
      {
        id: "1",
        time: "09:00",
        name: "Pangong Lake Day Trip",
        description: "Visit the stunning blue lake made famous by Bollywood (160km from Leh).",
        duration: "10 hours",
        location: "Pangong Tso Lake",
        category: "Sightseeing",
        tips: "Start very early. Carry permits, snacks, and warm clothes. Road conditions vary.",
        cost: `${calculateActivityCostRange(5000, 8000, 'transport')} (cab)`,
      },
      {
        id: "2",
        time: "12:00",
        name: "Lunch at Pangong Lake",
        description: "Simple meal at lakeside camps with breathtaking views.",
        duration: "1 hour",
        location: "Pangong Lake",
        category: "Food",
        tips: "Limited options - mostly Maggi and thukpa. Carry snacks from Leh.",
        cost: calculateActivityCostRange(200, 400, 'food'),
      },
      {
        id: "3",
        time: "14:00",
        name: "Photography at Pangong",
        description: "Capture the changing colors of the lake and surrounding mountains.",
        duration: "2 hours",
        location: "Pangong Lake",
        category: "Activity",
        tips: "Lake changes colors throughout the day. Respect military zones.",
        cost: "Free",
      },
      {
        id: "4",
        time: "08:00",
        name: "Nubra Valley via Khardung La",
        description: "Cross world's highest motorable road to sand dunes valley.",
        duration: "12 hours",
        location: "Nubra Valley, 160km from Leh",
        category: "Adventure",
        tips: "Full day trip. Permits required. Visit Diskit Monastery and Hunder sand dunes.",
        cost: calculateActivityCostRange(6000, 10000, 'transport'),
      },
      {
        id: "5",
        time: "07:00",
        name: "Sunrise at Thiksey Monastery",
        description: "Attend morning prayers at impressive hilltop monastery.",
        duration: "2 hours",
        location: "Thiksey, 19km from Leh",
        category: "Spiritual",
        tips: "Prayer ceremony at 6:30 AM. Mini Potala Palace. Museum worth visiting.",
        cost: calculateActivityCost(50, 'entry'),
      },
      {
        id: "6",
        time: "10:00",
        name: "Leh Palace & Shanti Stupa",
        description: "Visit 17th century palace and white-domed peace pagoda.",
        duration: "3 hours",
        location: "Leh Town",
        category: "Sightseeing",
        tips: "Panoramic Leh views. Sunrise/sunset best at Shanti Stupa.",
        cost: calculateActivityCost(100, 'entry'),
      },
      {
        id: "7",
        time: "13:30",
        name: "Lunch at Tibetan Kitchen",
        description: "Enjoy momos, thukpa and traditional Ladakhi cuisine.",
        duration: "1 hour",
        location: "Leh Market",
        category: "Food",
        tips: "Popular spot. Try butter tea and tingmo. Vegetarian options available.",
        cost: calculateActivityCostRange(300, 600, 'food'),
      },
      {
        id: "8",
        time: "16:00",
        name: "Magnetic Hill & Gurudwara Pathar Sahib",
        description: "Experience gravity-defying optical illusion and sacred shrine.",
        duration: "2 hours",
        location: "Leh-Kargil Road",
        category: "Activity",
        tips: "Test the magnetic hill with vehicle. Gurudwara serves free langar.",
        cost: "Free",
      },
      {
        id: "9",
        time: "09:30",
        name: "River Rafting on Zanskar River",
        description: "Thrilling rapids with stunning gorge views.",
        duration: "3 hours",
        location: "Chiling to Nimmu",
        category: "Adventure",
        tips: "June-August season. Equipment provided. Grade II-III rapids.",
        cost: calculateActivityCostRange(1500, 2500, 'activity'),
      },
      {
        id: "10",
        time: "18:00",
        name: "Leh Market Shopping & Cafe Hopping",
        description: "Shop for Pashmina, handicrafts and enjoy local cafes.",
        duration: "2 hours",
        location: "Leh Main Bazaar",
        category: "Activity",
        tips: "Bargain expected. Check authenticity of Pashmina. Try apricot products.",
        cost: calculateActivityCostRange(500, 5000, 'activity'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(ladakhActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Rishikesh itinerary
  if (lowerDest.includes('rishikesh') || lowerDest.includes('yoga capital')) {
    const rishikeshActivities: AIActivity[] = [
      {
        id: "1",
        time: "06:00",
        name: "Morning Yoga Session",
        description: "Start your day with yoga at a riverside ashram overlooking the Ganges.",
        duration: "2 hours",
        location: "Parmarth Niketan Ashram",
        category: "Activity",
        tips: "Wear comfortable clothes. Free sessions available at many ashrams.",
        cost: calculateActivityCostRange(200, 500, 'activity'),
      },
      {
        id: "2",
        time: "09:00",
        name: "River Rafting on Ganges",
        description: "Experience thrilling white water rafting from Shivpuri to Rishikesh.",
        duration: "3 hours",
        location: "Shivpuri to Ram Jhula",
        category: "Adventure",
        tips: "Book with certified operators. 16-26 km stretch available. Wear quick-dry clothes.",
        cost: calculateActivityCostRange(800, 1500, 'activity'),
      },
      {
        id: "3",
        time: "13:00",
        name: "Lunch at Little Buddha Cafe",
        description: "Enjoy healthy organic food with Ganges views.",
        duration: "1.5 hours",
        location: "Tapovan, Laxman Jhula",
        category: "Food",
        tips: "Try their Buddha bowls and fresh juices. Rooftop has great river views.",
        cost: calculateActivityCostRange(300, 500, 'food'),
      },
      {
        id: "4",
        time: "16:00",
        name: "Visit Ram & Laxman Jhula",
        description: "Walk across iconic suspension bridges and explore markets.",
        duration: "2 hours",
        location: "Ram Jhula & Laxman Jhula",
        category: "Sightseeing",
        tips: "Great for photography. Shop for yoga accessories and spiritual books.",
        cost: "Free",
      },
      {
        id: "5",
        time: "18:30",
        name: "Ganga Aarti at Triveni Ghat",
        description: "Witness the beautiful evening prayer ceremony by the holy river.",
        duration: "1 hour",
        location: "Triveni Ghat",
        category: "Spiritual",
        tips: "Arrive early for good spot. Participate by offering diyas.",
        cost: "Free",
      },
      {
        id: "6",
        time: "07:00",
        name: "Beatles Ashram Visit",
        description: "Explore abandoned ashram where Beatles stayed and meditated.",
        duration: "2 hours",
        location: "Rajaji National Park",
        category: "Heritage",
        tips: "Photography paradise with graffiti art. Carry water. Entry fee required.",
        cost: calculateActivityCost(150, 'entry'),
      },
      {
        id: "7",
        time: "11:00",
        name: "Bungee Jumping at Jumpin Heights",
        description: "India's highest bungee jump from 83 meters.",
        duration: "2 hours",
        location: "Mohan Chatti, 22km from Rishikesh",
        category: "Adventure",
        tips: "Book in advance. Weight restrictions apply. Giant swing also available.",
        cost: calculateActivityCostRange(3500, 4000, 'activity'),
      },
      {
        id: "8",
        time: "14:30",
        name: "Neer Garh Waterfall Trek",
        description: "Hike to picturesque waterfall with natural pools.",
        duration: "2.5 hours",
        location: "2km from Laxman Jhula",
        category: "Adventure",
        tips: "Easy trek. Carry swimwear. Best during monsoon. Entry fee minimal.",
        cost: calculateActivityCost(50, 'entry'),
      },
      {
        id: "9",
        time: "17:00",
        name: "Sunset Meditation at Kunjapuri Temple",
        description: "Hilltop temple offering panoramic Himalayan views.",
        duration: "2 hours",
        location: "18km from Rishikesh",
        category: "Spiritual",
        tips: "Sunrise visit also popular. Hire cab. Dress modestly.",
        cost: calculateActivityCostRange(800, 1200, 'transport'),
      },
      {
        id: "10",
        time: "10:00",
        name: "Ayurvedic Cooking Class",
        description: "Learn to cook healthy Indian vegetarian dishes.",
        duration: "3 hours",
        location: "Yoga Ashram",
        category: "Cultural",
        tips: "Hands-on experience. Recipe booklet provided. Includes lunch.",
        cost: calculateActivityCostRange(1000, 1500, 'activity'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(rishikeshActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Ziro Valley itinerary
  if (lowerDest.includes('ziro') || lowerDest.includes('arunachal')) {
    const ziroActivities: AIActivity[] = [
      {
        id: "1",
        time: "08:00",
        name: "Explore Apatani Tribal Villages",
        description: "Visit unique villages known for rice-fish farming and UNESCO heritage.",
        duration: "3 hours",
        location: "Hong Village",
        category: "Cultural",
        tips: "Hire local guide. Respect tribal customs. Try interacting with elderly women with face tattoos.",
        cost: calculateActivityCost(500, 'activity'),
      },
      {
        id: "2",
        time: "12:00",
        name: "Traditional Apatani Lunch",
        description: "Experience authentic tribal cuisine with rice, smoked meat, and local vegetables.",
        duration: "1.5 hours",
        location: "Local homestay",
        category: "Food",
        tips: "Try rice beer (apong) if you enjoy it. Meals usually included in homestay.",
        cost: calculateActivityCostRange(200, 400, 'food'),
      },
      {
        id: "3",
        time: "15:00",
        name: "Talley Valley Wildlife Sanctuary Trek",
        description: "Trek through pristine forests rich in biodiversity and orchids.",
        duration: "3 hours",
        location: "Talley Valley",
        category: "Nature",
        tips: "Obtain permits in advance. Best during spring for orchids. Carry water and snacks.",
        cost: calculateActivityCost(200, 'entry'),
      },
      {
        id: "4",
        time: "19:00",
        name: "Bonfire Evening at Homestay",
        description: "Enjoy local stories, music, and hospitality under starlit skies.",
        duration: "2 hours",
        location: "Homestay",
        category: "Cultural",
        tips: "Perfect for photography. Dress warmly. Ask about local legends.",
        cost: "Included",
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(ziroActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Mechuka itinerary
  if (lowerDest.includes('mechuka') || lowerDest.includes('menchukha')) {
    const mechukaActivities: AIActivity[] = [
      {
        id: "1",
        time: "07:00",
        name: "Sunrise at Samten Yongcha Monastery",
        description: "Visit the 400-year-old monastery for morning prayers and panoramic views.",
        duration: "2 hours",
        location: "Samten Yongcha Monastery",
        category: "Spiritual",
        tips: "Dress modestly. Join morning prayers if possible. Photography allowed with permission.",
        cost: "Free (donations welcome)",
      },
      {
        id: "2",
        time: "10:00",
        name: "Explore Mechuka Town",
        description: "Walk through picturesque town with Indo-Tibetan culture and Siyom River.",
        duration: "2 hours",
        location: "Mechuka Town",
        category: "Sightseeing",
        tips: "Visit the hanging bridge. Interact with locals. Limited ATM facilities - carry cash.",
        cost: "Free",
      },
      {
        id: "3",
        time: "13:00",
        name: "Lunch at Army Guest House",
        description: "Enjoy simple North Indian and Chinese meals with hospitality.",
        duration: "1 hour",
        location: "Army Guest House or homestay",
        category: "Food",
        tips: "Limited dining options. Pre-booking recommended. Try momos and thukpa.",
        cost: calculateActivityCostRange(200, 400, 'food'),
      },
      {
        id: "4",
        time: "15:00",
        name: "Trek to Mayodiya Valley",
        description: "Experience untouched alpine meadows with stunning mountain backdrops.",
        duration: "3 hours",
        location: "Mayodiya Valley",
        category: "Adventure",
        tips: "Hire local guide. Weather changes quickly. Carry warm layers.",
        cost: calculateActivityCostRange(800, 1200, 'activity'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(mechukaActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Dong Valley itinerary
  if (lowerDest.includes('dong') || lowerDest.includes('first sunrise')) {
    const dongActivities: AIActivity[] = [
      {
        id: "1",
        time: "04:30",
        name: "India's First Sunrise",
        description: "Witness the first sunrise in India from the easternmost inhabited village.",
        duration: "2 hours",
        location: "Dong Village viewpoint",
        category: "Nature",
        tips: "Wake up very early. Carry flashlight and warm clothes. Clear weather essential.",
        cost: "Free",
      },
      {
        id: "2",
        time: "08:00",
        name: "Breakfast with Mishmi Tribe",
        description: "Share morning meal with local Mishmi community and learn their customs.",
        duration: "1.5 hours",
        location: "Dong Village homestay",
        category: "Cultural",
        tips: "Homestay experience recommended. Try local bread and butter tea.",
        cost: "Included in homestay",
      },
      {
        id: "3",
        time: "10:00",
        name: "Village Walk & Tribal Life",
        description: "Explore traditional Mishmi houses and learn about their unique lifestyle.",
        duration: "2 hours",
        location: "Dong Village",
        category: "Cultural",
        tips: "Respect privacy. Photography with permission. Learn about their hunting traditions.",
        cost: "Free",
      },
      {
        id: "4",
        time: "14:00",
        name: "Trek to Walong War Memorial",
        description: "Visit memorial commemorating 1962 Indo-China war heroes.",
        duration: "2 hours",
        location: "Walong",
        category: "Heritage",
        tips: "Emotional and historical significance. Pay respects. Limited facilities.",
        cost: "Free",
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(dongActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Nongriat & Living Root Bridges itinerary
  if (lowerDest.includes('nongriat') || lowerDest.includes('living root') || lowerDest.includes('double decker')) {
    const nongriatActivities: AIActivity[] = [
      {
        id: "1",
        time: "07:00",
        name: "Trek to Nongriat Village",
        description: "Descend 3500+ steps through lush forests to reach the root bridge village.",
        duration: "3 hours",
        location: "Tyrna to Nongriat",
        category: "Adventure",
        tips: "Start early to avoid heat. Wear good trekking shoes. Carry water and snacks.",
        cost: "Free",
      },
      {
        id: "2",
        time: "11:00",
        name: "Visit Double Decker Living Root Bridge",
        description: "Marvel at the UNESCO heritage nominee - 180-year-old natural bridge.",
        duration: "2 hours",
        location: "Nongriat Village",
        category: "Nature",
        tips: "Perfect for photography. Walk carefully - bridge is slippery when wet.",
        cost: "Free",
      },
      {
        id: "3",
        time: "13:30",
        name: "Lunch at Village Homestay",
        description: "Enjoy traditional Khasi food with rice, pork, and local vegetables.",
        duration: "1 hour",
        location: "Nongriat homestay",
        category: "Food",
        tips: "Simple but fresh meals. Try jadoh (rice with meat). Included in homestay usually.",
        cost: calculateActivityCostRange(150, 300, 'food'),
      },
      {
        id: "4",
        time: "15:00",
        name: "Rainbow Falls & Natural Pool",
        description: "Trek further to hidden waterfall and swim in crystal-clear natural pools.",
        duration: "2 hours",
        location: "Below Nongriat",
        category: "Nature",
        tips: "Additional 300 steps down. Bring swimwear. Very refreshing after trek.",
        cost: "Free",
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(nongriatActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Shnongpdeng itinerary
  if (lowerDest.includes('shnongpdeng') || lowerDest.includes('umngot')) {
    const shnongpdengActivities: AIActivity[] = [
      {
        id: "1",
        time: "08:00",
        name: "Glass Boat Ride on Umngot River",
        description: "Experience India's clearest river where boats appear to float in air.",
        duration: "1.5 hours",
        location: "Shnongpdeng, Umngot River",
        category: "Activity",
        tips: "Best views in morning light. Pre-book during peak season. Stunning for photography.",
        cost: calculateActivityCostRange(400, 600, 'activity'),
      },
      {
        id: "2",
        time: "10:00",
        name: "Cliff Jumping & River Activities",
        description: "Try cliff jumping, kayaking, and swimming in crystal-clear waters.",
        duration: "2 hours",
        location: "Shnongpdeng riverside",
        category: "Adventure",
        tips: "Wear life jacket. Multiple jump heights available. Best during non-monsoon.",
        cost: calculateActivityCostRange(500, 1000, 'activity'),
      },
      {
        id: "3",
        time: "13:00",
        name: "Riverside Camping Lunch",
        description: "Enjoy BBQ and local cuisine at riverside camps.",
        duration: "1.5 hours",
        location: "Camping site",
        category: "Food",
        tips: "Usually included in camping packages. Fresh fish available. Bring snacks.",
        cost: calculateActivityCostRange(300, 500, 'food'),
      },
      {
        id: "4",
        time: "16:00",
        name: "Visit Dawki Border & Shopping",
        description: "Explore Indo-Bangladesh border and shop at Dawki market.",
        duration: "2 hours",
        location: "Dawki, 5 km from Shnongpdeng",
        category: "Sightseeing",
        tips: "Carry ID proof for border area. Good for buying handicrafts and dry fish.",
        cost: "Free",
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(shnongpdengActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Mawsynram itinerary
  if (lowerDest.includes('mawsynram') || lowerDest.includes('wettest place')) {
    const mawsynramActivities: AIActivity[] = [
      {
        id: "1",
        time: "08:00",
        name: "Mawjymbuin Cave Exploration",
        description: "Visit ancient cave with natural Shivalinga stalagmite formation.",
        duration: "1.5 hours",
        location: "Mawjymbuin Cave",
        category: "Nature",
        tips: "Can be slippery. Carry flashlight. Sacred site - maintain respect.",
        cost: calculateActivityCost(50, 'entry'),
      },
      {
        id: "2",
        time: "10:00",
        name: "Witness Living Root Bridges",
        description: "Short trek to nearby root bridge in monsoon forests.",
        duration: "2 hours",
        location: "Mawsynram area",
        category: "Nature",
        tips: "Hire local guide. Leeches common during monsoon. Wear long socks.",
        cost: calculateActivityCost(300, 'activity'),
      },
      {
        id: "3",
        time: "13:00",
        name: "Traditional Khasi Lunch",
        description: "Experience authentic Khasi cuisine with rice, meat, and unique preparations.",
        duration: "1 hour",
        location: "Local restaurant",
        category: "Food",
        tips: "Try tungrymbai (fermented soybean) and jadoh. Limited options available.",
        cost: calculateActivityCostRange(150, 300, 'food'),
      },
      {
        id: "4",
        time: "15:00",
        name: "Monsoon Photography & Village Walk",
        description: "Capture the essence of world's wettest place and interact with locals.",
        duration: "2 hours",
        location: "Mawsynram Village",
        category: "Cultural",
        tips: "Bring rain gear - it rains almost daily. See knup (traditional rain shields).",
        cost: "Free",
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(mawsynramActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Nartiang itinerary
  if (lowerDest.includes('nartiang') || lowerDest.includes('monolith')) {
    const nartiangActivities: AIActivity[] = [
      {
        id: "1",
        time: "08:00",
        name: "Nartiang Monoliths Exploration",
        description: "Visit ancient megalithic site with India's tallest menhir (standing stone).",
        duration: "2 hours",
        location: "Nartiang Durga Temple complex",
        category: "Heritage",
        tips: "Fascinating historical site. Hire local guide for stories. Best in morning light.",
        cost: "Free (guide ₹200-300)",
      },
      {
        id: "2",
        time: "10:30",
        name: "Durga Temple Visit",
        description: "Ancient temple with unique beheading rituals (now discontinued).",
        duration: "1 hour",
        location: "Nartiang Durga Temple",
        category: "Spiritual",
        tips: "Rich history of Jaintia Kingdom. Photography allowed. Respectful attire.",
        cost: "Free (donations welcome)",
      },
      {
        id: "3",
        time: "12:00",
        name: "Lunch at Jowai Town",
        description: "Drive to nearby Jowai for better dining options.",
        duration: "1.5 hours",
        location: "Jowai (20 km)",
        category: "Food",
        tips: "Limited options in Nartiang. Jowai has basic restaurants. Try local pork dishes.",
        cost: calculateActivityCostRange(150, 300, 'food'),
      },
      {
        id: "4",
        time: "15:00",
        name: "Thadlaskein Lake",
        description: "Visit serene lake with legends of ancient kingdom.",
        duration: "1.5 hours",
        location: "Thadlaskein Lake",
        category: "Nature",
        tips: "Peaceful spot for relaxation. Boating available. Good for photography.",
        cost: calculateActivityCost(100, 'activity'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(nartiangActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Krang Suri Waterfall itinerary
  if (lowerDest.includes('krang suri') || lowerDest.includes('krangsuri')) {
    const krangsuriActivities: AIActivity[] = [
      {
        id: "1",
        time: "09:00",
        name: "Krang Suri Waterfall Visit",
        description: "Experience stunning turquoise blue waterfall and natural pools.",
        duration: "3 hours",
        location: "Krang Suri Waterfall, Jaintia Hills",
        category: "Nature",
        tips: "Perfect for swimming. Bring swimwear and towel. Weekdays less crowded.",
        cost: calculateActivityCost(20, 'entry'),
      },
      {
        id: "2",
        time: "12:30",
        name: "Picnic Lunch at Waterfall",
        description: "Enjoy packed lunch by the pristine blue pools.",
        duration: "1 hour",
        location: "Krang Suri",
        category: "Food",
        tips: "Carry packed lunch from Jowai. Limited food stalls. Maintain cleanliness.",
        cost: calculateActivityCostRange(100, 200, 'food'),
      },
      {
        id: "3",
        time: "14:00",
        name: "Photography & Swimming",
        description: "Capture stunning blue waters and enjoy refreshing swim.",
        duration: "2 hours",
        location: "Krang Suri pools",
        category: "Activity",
        tips: "Best light for photos before 3 PM. Water is cold - exhilarating!",
        cost: "Free",
      },
      {
        id: "4",
        time: "16:30",
        name: "Visit Nearby Phe Phe Falls",
        description: "Another beautiful waterfall 10 minutes away.",
        duration: "1 hour",
        location: "Phe Phe Falls",
        category: "Nature",
        tips: "Smaller but equally beautiful. Usually empty. Perfect ending to day.",
        cost: "Free",
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(krangsuriActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Dawki itinerary
  if (lowerDest.includes('dawki') && !lowerDest.includes('shnongpdeng')) {
    const dawkiActivities: AIActivity[] = [
      {
        id: "1",
        time: "08:00",
        name: "Umngot River Boating",
        description: "Boat ride on Asia's cleanest river with crystal-clear waters.",
        duration: "2 hours",
        location: "Dawki Bridge area",
        category: "Activity",
        tips: "Book early during peak season. See floating boats effect. Stunning for photos.",
        cost: calculateActivityCostRange(500, 800, 'activity'),
      },
      {
        id: "2",
        time: "11:00",
        name: "Explore Dawki Indo-Bangladesh Border",
        description: "Visit the international border and famous bridge.",
        duration: "1 hour",
        location: "Dawki Border",
        category: "Sightseeing",
        tips: "Carry valid ID proof. Photography restricted in some areas. Security checkpoints.",
        cost: "Free",
      },
      {
        id: "3",
        time: "13:00",
        name: "Lunch at Dawki Market",
        description: "Simple meals at local eateries near the market.",
        duration: "1 hour",
        location: "Dawki Market",
        category: "Food",
        tips: "Basic food options. Try local rice and fish. Maintain hygiene.",
        cost: calculateActivityCostRange(150, 250, 'food'),
      },
      {
        id: "4",
        time: "15:00",
        name: "Shnongpdeng Riverside Adventure",
        description: "Combine with Shnongpdeng for water activities and cliff jumping.",
        duration: "2.5 hours",
        location: "Shnongpdeng (5 km)",
        category: "Adventure",
        tips: "Kayaking, cliff jumping, and camping available. Book in advance.",
        cost: calculateActivityCostRange(800, 1500, 'activity'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(dawkiActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Gue Village itinerary
  if (lowerDest.includes('gue') || lowerDest.includes('mummy')) {
    const gueActivities: AIActivity[] = [
      {
        id: "1",
        time: "09:00",
        name: "Visit 500-Year-Old Mummy",
        description: "See the naturally preserved mummy of Sangha Tenzin in sitting position.",
        duration: "1 hour",
        location: "Gue Monastery",
        category: "Heritage",
        tips: "Unique attraction. Respectful photography. Learn the mummification story.",
        cost: "Free (donations accepted)",
      },
      {
        id: "2",
        time: "11:00",
        name: "Explore Trans-Himalayan Landscape",
        description: "Walk through barren yet beautiful high-altitude desert terrain.",
        duration: "2 hours",
        location: "Gue Village surroundings",
        category: "Nature",
        tips: "Stunning moonscape. Good for photography. Carry water - no facilities.",
        cost: "Free",
      },
      {
        id: "3",
        time: "13:30",
        name: "Lunch at Tabo",
        description: "Drive to Tabo for lunch at basic guesthouses.",
        duration: "1.5 hours",
        location: "Tabo (30 km)",
        category: "Food",
        tips: "Limited options. Simple dal-rice and momos. Tabo has better facilities.",
        cost: calculateActivityCostRange(150, 300, 'food'),
      },
      {
        id: "4",
        time: "16:00",
        name: "Tabo Monastery Complex",
        description: "Visit 1000-year-old monastery with ancient murals (UNESCO site).",
        duration: "2 hours",
        location: "Tabo Monastery",
        category: "Spiritual",
        tips: "Ajanta of the Himalayas. Incredible frescoes. Photography inside restricted.",
        cost: calculateActivityCost(50, 'entry'),
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(gueActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Kibber Village itinerary
  if (lowerDest.includes('kibber') || lowerDest.includes('highest village')) {
    const kibberActivities: AIActivity[] = [
      {
        id: "1",
        time: "06:00",
        name: "Snow Leopard Spotting Trek",
        description: "Early morning trek with possibility of spotting elusive snow leopards.",
        duration: "4 hours",
        location: "Kibber Wildlife Sanctuary",
        category: "Wildlife",
        tips: "Hire local guide essential. Best in winter. Bring binoculars and warm clothes.",
        cost: calculateActivityCostRange(2000, 3000, 'activity'),
      },
      {
        id: "2",
        time: "11:00",
        name: "Explore Kibber Village",
        description: "Walk through world's highest motorable village at 4205m.",
        duration: "2 hours",
        location: "Kibber Village",
        category: "Cultural",
        tips: "Acclimatize properly. Interact with locals. See traditional houses.",
        cost: "Free",
      },
      {
        id: "3",
        time: "13:00",
        name: "Homestay Lunch",
        description: "Enjoy traditional Spitian meal with butter tea and tsampa.",
        duration: "1 hour",
        location: "Local homestay",
        category: "Food",
        tips: "Homestay experience recommended. Try thukpa and momos. Limited options.",
        cost: calculateActivityCostRange(200, 400, 'food'),
      },
      {
        id: "4",
        time: "15:00",
        name: "Visit Key Monastery",
        description: "Drive to iconic monastery perched on hilltop (12 km).",
        duration: "2 hours",
        location: "Key Monastery",
        category: "Spiritual",
        tips: "Most photographed monastery in Spiti. Attend evening prayers. Stunning views.",
        cost: "Free (donations)",
      },
    ]
    
    const selectedActivities = selectActivitiesByDuration(kibberActivities)
    return selectedActivities.map(applyBudgetVariations)
  }
  
  // Default Agra itinerary (original)
  const defaultActivities = selectActivitiesByDuration(mockAIItinerary)
  return defaultActivities.map(applyBudgetVariations)
}

// Helper function to convert 24-hour time to 12-hour AM/PM format
const convertTo12Hour = (time24: string): string => {
  // If already in 12-hour format (contains AM/PM), return as is
  if (time24.includes('AM') || time24.includes('PM') || time24.includes('am') || time24.includes('pm')) {
    return time24.toUpperCase()
  }
  
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Helper function to convert any time format to minutes since midnight for sorting
const timeToMinutes = (timeStr: string): number => {
  try {
    // Handle 12-hour format (e.g., "07:00 AM", "2:30 PM")
    if (timeStr.includes('AM') || timeStr.includes('PM') || timeStr.includes('am') || timeStr.includes('pm')) {
      const upperTime = timeStr.toUpperCase()
      const isPM = upperTime.includes('PM')
      const timeWithoutPeriod = upperTime.replace(/\s*(AM|PM)\s*/g, '').trim()
      const [hoursStr, minutesStr] = timeWithoutPeriod.split(':')
      let hours = parseInt(hoursStr)
      const minutes = parseInt(minutesStr || '0')
      
      // Convert to 24-hour format
      if (isPM && hours !== 12) {
        hours += 12
      } else if (!isPM && hours === 12) {
        hours = 0
      }
      
      return hours * 60 + minutes
    }
    
    // Handle 24-hour format (e.g., "07:00", "14:30")
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num))
    return hours * 60 + (minutes || 0)
  } catch (error) {
    console.error('Error parsing time:', timeStr, error)
    return 0 // Default to midnight if parsing fails
  }
}

// Helper function to group activities by day
const groupActivitiesByDay = (activities: AIActivity[], daysCount: number) => {
  // First, sort activities by time (morning to night) using the robust time parser
  const sortedActivities = [...activities].sort((a, b) => {
    const timeA = timeToMinutes(a.time)
    const timeB = timeToMinutes(b.time)
    return timeA - timeB
  })
  
  const activitiesPerDay = Math.ceil(sortedActivities.length / daysCount)
  const days: { day: number; activities: AIActivity[] }[] = []
  
  for (let i = 0; i < daysCount; i++) {
    const startIdx = i * activitiesPerDay
    const endIdx = Math.min(startIdx + activitiesPerDay, sortedActivities.length)
    const dayActivities = sortedActivities.slice(startIdx, endIdx)
    
    if (dayActivities.length > 0) {
      // Convert times to AM/PM format and ensure chronological order
      const activitiesWithFormattedTime = dayActivities
        .sort((a, b) => {
          const timeA = timeToMinutes(a.time)
          const timeB = timeToMinutes(b.time)
          return timeA - timeB
        })
        .map(activity => ({
          ...activity,
          time: convertTo12Hour(activity.time)
        }))
      
      days.push({
        day: i + 1,
        activities: activitiesWithFormattedTime
      })
    }
  }
  
  return days
}

// Helper function to get recommended duration for each destination
const getRecommendedDuration = (destination: string): number => {
  const dest = destination.toLowerCase()
  
  // Major tourist destinations (3-5 days)
  if (dest.includes('taj mahal') || dest.includes('agra')) return 2
  if (dest.includes('jaipur')) return 3
  if (dest.includes('goa')) return 4
  if (dest.includes('varanasi') || dest.includes('banaras') || dest.includes('kashi')) return 3
  if (dest.includes('kerala') || dest.includes('alleppey') || dest.includes('backwater')) return 4
  if (dest.includes('manali')) return 4
  if (dest.includes('leh') || dest.includes('ladakh')) return 5
  if (dest.includes('rishikesh')) return 3
  
  // Offbeat destinations (2-3 days)
  if (dest.includes('ziro')) return 3
  if (dest.includes('mechuka')) return 3
  if (dest.includes('dong')) return 2
  if (dest.includes('nongriat') || dest.includes('living root') || dest.includes('double decker')) return 2
  if (dest.includes('shnongpdeng')) return 2
  if (dest.includes('mawsynram')) return 2
  if (dest.includes('nartiang')) return 1
  if (dest.includes('krang suri') || dest.includes('krangsuri')) return 1
  if (dest.includes('dawki')) return 2
  if (dest.includes('gue') || dest.includes('mummy')) return 2
  if (dest.includes('kibber')) return 3
  
  // Default
  return 2
}

export function AIItineraryGenerator() {
  const [destination, setDestination] = useState("")
  const [duration, setDuration] = useState("1")
  const [interests, setInterests] = useState("")
  const [budget, setBudget] = useState("moderate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<AIActivity[] | null>(null)
  const [recommendedDays, setRecommendedDays] = useState<number | null>(null)

  // Update recommended duration when destination changes
  const handleDestinationChange = (value: string) => {
    setDestination(value)
    if (value.trim()) {
      const recommended = getRecommendedDuration(value)
      setRecommendedDays(recommended)
      // Auto-update duration to recommended value
      setDuration(recommended.toString())
    } else {
      setRecommendedDays(null)
    }
  }

  const handleGenerate = async () => {
    if (!destination) return

    setIsGenerating(true)
    
    try {
      console.log('Generating itinerary for:', destination)
      
      // Call Gemini API for any Indian destination
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days: parseInt(duration),
          budget,
          interests
        })
      })
      
      console.log('API response status:', response.status)
      
      if (!response.ok) {
        let errorMessage = 'Failed to generate itinerary'
        try {
          const errorData = await response.json()
          console.error('API error:', errorData)
          errorMessage = errorData.details || errorData.error || errorMessage
          
          // Special handling for rate limit
          if (response.status === 429 || errorMessage.includes('Rate limit')) {
            errorMessage = '⚠️ API rate limit reached. Please wait 2-3 minutes and try again. Using fallback itinerary for now.'
          }
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = `API error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      console.log('Received itinerary data:', data)
      
      // Transform API response to match our format
      const daysData = data.itinerary || data.days || []
      
      if (Array.isArray(daysData) && daysData.length > 0) {
        const activities: AIActivity[] = []
        daysData.forEach((day: any, dayIndex: number) => {
          day.activities?.forEach((activity: any, actIndex: number) => {
            activities.push({
              id: `${dayIndex}-${actIndex}`,
              time: activity.time || '09:00',
              name: activity.name || activity.title || activity.activity,
              description: activity.description,
              duration: activity.duration || '2 hours',
              location: activity.location || destination,
              category: activity.category || 'Activity',
              tips: activity.tips || activity.notes || '',
              cost: activity.cost || activity.estimatedCost || 'Varies'
            })
          })
        })
        
        if (activities.length > 0) {
          setGeneratedItinerary(activities)
        } else {
          throw new Error('No activities generated')
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error: any) {
      console.error('Error generating itinerary:', error)
      alert(`Failed to generate itinerary: ${error.message}. Using fallback data.`)
      
      // Fallback to local mock data
      const itinerary = generateItineraryForDestination(destination, budget, parseInt(duration))
      setGeneratedItinerary(itinerary)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    // Simply call generate again for fresh results
    await handleGenerate()
  }

  const handleSave = () => {
    // In real app, would save to trip planner
    alert("Itinerary saved to your trip!")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Trip Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Get personalized itineraries for ANY place in India - powered by Google Gemini AI 🇮🇳
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                placeholder="Enter ANY place in India - city, monument, region, village..."
              />
              <p className="text-xs text-muted-foreground">
                Powered by AI - works for any Indian destination! 🇮🇳
              </p>
              {recommendedDays && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  AI Recommended: {recommendedDays} {recommendedDays === 1 ? 'day' : 'days'}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <SelectItem key={d} value={d.toString()}>
                      {d} {d === 1 ? "day" : "days"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests & Preferences</Label>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Heritage sites, spiritual tours, adventure sports, local cuisine, photography..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget Level</Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget-friendly</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGenerate} disabled={!destination || isGenerating} className="w-full gap-2">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI Itinerary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedItinerary && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your AI-Generated Itinerary</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const dayWiseItinerary = groupActivitiesByDay(generatedItinerary, parseInt(duration))
              
              return (
                <div className="space-y-8">
                  {dayWiseItinerary.map((dayData) => (
                    <div key={dayData.day} className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                          {dayData.day}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Day {dayData.day}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dayData.activities.length} {dayData.activities.length === 1 ? 'activity' : 'activities'} planned
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-0">
                        {dayData.activities.map((activity, index) => (
                          <AIItineraryCard
                            key={activity.id}
                            activity={activity}
                            isFirst={index === 0}
                            isLast={index === dayData.activities.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
