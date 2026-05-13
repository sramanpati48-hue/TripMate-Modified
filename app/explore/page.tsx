"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { PlaceCard } from "@/components/place-card"
import { PlaceCardSkeleton } from "@/components/place-card-skeleton"
import { Filters } from "@/components/filters"
import { EmptyState } from "@/components/empty-state"
import { PlaceDetailsDialog } from "@/components/place-details-dialog"
import { PricingInfo } from "@/components/pricing-info"
import { LiveNotificationsPanel } from "@/components/live-notifications"
import { mockPlaces, type Place, type Region, type Category } from "@/lib/mock-data"
import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Landmark,
  MapPin,
  MessageSquareQuote,
  PartyPopper,
  Play,
  SearchX,
  Share2,
  Sparkles,
  Star,
  Sun,
  Users,
  Utensils,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react"

type GoaSlide = {
  id: number
  place: string
  location: string
  vibe: string
  rating: string
  bestTime: string
  popularNow: string
  liveNow: string
  visitedToday: string
  tagline: string
  image: string
}

type GoaCategory = {
  id: string
  label: string
  icon: LucideIcon
  thumb: string
}

type GoaHighlight = {
  id: number
  title: string
  tagline: string
  category: string
  crowd: string
  budget: string
  bestTime: string
  image: string
  whyVisit: string
}

type GoaStory = {
  id: number
  title: string
  readTime: string
  image: string
  author: string
  excerpt: string
}

type GoaReel = {
  id: number
  creator: string
  caption: string
  image: string
}

type GoaLocalShot = {
  id: number
  author: string
  image: string
}

type GoaReview = {
  id: number
  tag: string
  text: string
}

const goaSlides: GoaSlide[] = [
  {
    id: 1,
    place: "Candid walks on Goa's daytime shore",
    location: "Baga Beach, Goa",
    vibe: "Beach • Daytime • Documentary",
    rating: "4.8 ★ (2.1k reviews)",
    bestTime: "Best time: Oct – Feb",
    popularNow: "Popular now",
    liveNow: "124 travellers exploring now",
    visitedToday: "Rahul + 3 others visited today",
    tagline: "People walking barefoot by the waves in natural sunlight, with candid motion, beach shacks, and a lively crowd in the background.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: 2,
    place: "Evening tide, music, and barefoot conversations",
    location: "Candolim Beach, Goa",
    vibe: "Shoreline • Golden Hour • Social",
    rating: "4.8 ★ (2.1k reviews)",
    bestTime: "Best time: Oct – Feb",
    popularNow: "Popular now",
    liveNow: "124 travellers exploring now",
    visitedToday: "Rahul + 3 others visited today",
    tagline: "Friends leaning into the breeze, waves brushing the sand, and the shoreline humming with easy, unhurried energy.",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: 3,
    place: "Night falls, Goa wakes up",
    location: "Anjuna, Goa",
    vibe: "Nightlife • Neon • Beach Club",
    rating: "4.8 ★ (2.1k reviews)",
    bestTime: "Best time: Oct – Feb",
    popularNow: "Popular now",
    liveNow: "124 travellers exploring now",
    visitedToday: "Rahul + 3 others visited today",
    tagline: "Bass rolling through the open air, people moving in loose circles, and lights reflecting off saltwater air.",
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: 4,
    place: "A quieter side of Goa",
    location: "South Goa, India",
    vibe: "Hidden Cove • Sunset • Calm",
    rating: "4.8 ★ (2.1k reviews)",
    bestTime: "Best time: Oct – Feb",
    popularNow: "Popular now",
    liveNow: "124 travellers exploring now",
    visitedToday: "Rahul + 3 others visited today",
    tagline: "A slower coastline, softer light, and the sound of waves carrying across a quiet stretch of sand.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=80",
  },
]

const goaCategories: GoaCategory[] = [
  {
    id: "Beaches",
    label: "Beaches",
    icon: Waves,
    thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "Party",
    label: "Party",
    icon: PartyPopper,
    thumb: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "Food",
    label: "Food",
    icon: Utensils,
    thumb: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "Culture",
    label: "Culture",
    icon: Landmark,
    thumb: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "Hidden Gems",
    label: "Hidden Gems",
    icon: Sparkles,
    thumb: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80",
  },
]

const goaHighlights: GoaHighlight[] = [
  {
    id: 1,
    title: "Candolim Candid Shore",
    tagline: "Locals and travelers sharing one relaxed beach rhythm.",
    category: "Beaches",
    crowd: "Medium",
    budget: "Budget-friendly",
    bestTime: "Late afternoon",
    image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "A balanced Goa beach frame with real crowd energy, palm shade, and easy swim-friendly water.",
  },
  {
    id: 2,
    title: "Baga Neon Party Front",
    tagline: "Dense crowd dancing under DJ lights and sea-air haze.",
    category: "Party",
    crowd: "High",
    budget: "Premium",
    bestTime: "Night",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "If Goa nightlife is your focus, this captures authentic dance-floor intensity and DJ-led momentum.",
  },
  {
    id: 3,
    title: "Rustic Shack Food Table",
    tagline: "Fish curry rice, prawn balchao, and bebinca in a raw local setting.",
    category: "Food",
    crowd: "Medium",
    budget: "Mid-range",
    bestTime: "Lunch",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "A strong food stop for authentic flavors, rustic plating, and documentary-style dining moments.",
  },
  {
    id: 4,
    title: "Fontainhas Local Walk",
    tagline: "Candid street culture with old-Goa texture and everyday movement.",
    category: "Culture",
    crowd: "Medium",
    budget: "Budget-friendly",
    bestTime: "Morning",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "Best for travelers who want culture through candid local life instead of staged tourist moments.",
  },
  {
    id: 5,
    title: "Cliffside Hidden Cove",
    tagline: "Quiet sunset beach with fewer people and serene water textures.",
    category: "Hidden Gems",
    crowd: "Low",
    budget: "Budget-friendly",
    bestTime: "Sunset",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "Ideal for low-noise, authentic Goa shots with cliffs, soft light, and minimal crowd pressure.",
  },
  {
    id: 6,
    title: "Golden Hour Life Strip",
    tagline: "Families, kids in waves, shacks, and palms in one cinematic frame.",
    category: "Beaches",
    crowd: "Medium",
    budget: "Mid-range",
    bestTime: "Sunset",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "A complete Goa lifestyle scene where candid family moments and beach textures come together naturally.",
  },
  {
    id: 7,
    title: "Morjim Palm Edge",
    tagline: "Wide sands, calm surf, and long shoreline walks.",
    category: "Beaches",
    crowd: "Low",
    budget: "Mid-range",
    bestTime: "Sunrise",
    image: "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "Great for peaceful frames, fewer crowds, and authentic shoreline textures.",
  },
  {
    id: 8,
    title: "Colva Blue Hour",
    tagline: "Soft sky tones and reflective wet sand after sunset.",
    category: "Beaches",
    crowd: "Medium",
    budget: "Budget-friendly",
    bestTime: "Blue hour",
    image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "Ideal for evening beach strolls and moody coastal photography.",
  },
  {
    id: 9,
    title: "Anjuna DJ Courtyard",
    tagline: "Open-air dance zone with beach-adjacent sound and lights.",
    category: "Party",
    crowd: "High",
    budget: "Premium",
    bestTime: "Late night",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "Strong DJ-led scene for high-energy groups and nightlife seekers.",
  },
  {
    id: 10,
    title: "Candolim Beach Stage",
    tagline: "Live beats, light haze, and dance-friendly oceanfront setup.",
    category: "Party",
    crowd: "High",
    budget: "Mid-range",
    bestTime: "Night",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "Combines beach ambience with realistic party movement and visuals.",
  },
  {
    id: 11,
    title: "Panjim Seafood Table",
    tagline: "Local fish curry rice and spice-forward coastal plating.",
    category: "Food",
    crowd: "Medium",
    budget: "Budget-friendly",
    bestTime: "Lunch",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "A practical local meal stop with authentic flavors and rustic service.",
  },
  {
    id: 12,
    title: "Balchao Shack Kitchen",
    tagline: "Prawn balchao, clay bowls, and raw shack textures.",
    category: "Food",
    crowd: "Low",
    budget: "Mid-range",
    bestTime: "Evening",
    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "A documentary food vibe with bold spice detail and local setting.",
  },
  {
    id: 13,
    title: "Old Goa Church Front",
    tagline: "Historic facades with everyday movement and local rhythm.",
    category: "Culture",
    crowd: "Medium",
    budget: "Budget-friendly",
    bestTime: "Morning",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "Mixes architecture and lived culture for a grounded Goa experience.",
  },
  {
    id: 14,
    title: "Latin Quarter Corners",
    tagline: "Colorful homes, balcony shadows, and candid lane portraits.",
    category: "Culture",
    crowd: "Low",
    budget: "Budget-friendly",
    bestTime: "Afternoon",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "Perfect for slow city walks and documentary street composition.",
  },
  {
    id: 15,
    title: "Butterfly Cove Trail",
    tagline: "Rocky approach, crystal water, and hidden shoreline calm.",
    category: "Hidden Gems",
    crowd: "Low",
    budget: "Budget-friendly",
    bestTime: "Sunset",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1200&q=80",
    whyVisit: "A quieter coastal route for travelers seeking less-touristed views.",
  },
  {
    id: 16,
    title: "Backwater Ferry Point",
    tagline: "Local boats, mangrove light, and low-noise waterside life.",
    category: "Hidden Gems",
    crowd: "Low",
    budget: "Budget-friendly",
    bestTime: "Late afternoon",
    image: "/backwater-boat.png",
    whyVisit: "Offers intimate, authentic Goa moments beyond mainstream beach strips.",
  },
]

const goaStories: GoaStory[] = [
  {
    id: 1,
    title: "I reached the shore just before the sky turned gold",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
    author: "Wanderer",
    excerpt: "The golden hour at Candolim Beach isn't just about the sunset—it's about the candid moments with locals, the sea spray, and palm silhouettes. Here's what makes this moment authentic.",
  },
  {
    id: 2,
    title: "From beach calm to neon dance floor in one evening",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=600&q=80",
    author: "Night Tide",
    excerpt: "Goa's duality is unmatched. Morning serenity at Baga Beach transforms into pulsing DJ sets by midnight. Discover how to navigate this shift and capture both sides of the story.",
  },
  {
    id: 3,
    title: "Local secrets: Where Goa eats when tourists aren't watching",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80",
    author: "Coastal Table",
    excerpt: "Fish curry rice in clay bowls, prawn balchao in shack kitchens, and bebinca served on banana leaves. These are the flavors that make Goa legendary. Join us off the beaten path.",
  },
]

const goaReels: GoaReel[] = [
  {
    id: 1,
    creator: "@goa.diaries",
    caption: "Crowd energy and DJ transitions by the beach.",
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    creator: "@coastlocal",
    caption: "Sunset lifestyle shots with real candid moments.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=700&q=80",
  },
]

const goaLocalShots: GoaLocalShot[] = [
  {
    id: 1,
    author: "@vagator.frames",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    author: "@candolimlocal",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    author: "@shackstories",
    image: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=500&q=80",
  },
]

const goaReviews: GoaReview[] = [
  {
    id: 1,
    tag: "Best for sunset",
    text: "Lighting was natural and beautiful, and the beach had a great local vibe without feeling staged.",
  },
  {
    id: 2,
    tag: "Crowded",
    text: "Night party had intense energy and realistic crowd movement, exactly what we wanted for music night.",
  },
  {
    id: 3,
    tag: "Budget-friendly",
    text: "Food and beach day were easy on budget and still felt premium in overall experience.",
  },
]

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<Region | "All">("All")
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All")
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeGoaCategory, setActiveGoaCategory] = useState("Beaches")
  const [selectedGoaHighlight, setSelectedGoaHighlight] = useState<GoaHighlight | null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  // Read URL parameters on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const regionParam = searchParams.get("region")
    
    if (categoryParam) {
      // Capitalize each word to match category values (e.g., "hill station" -> "Hill Station")
      const capitalizedCategory = categoryParam
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      setSelectedCategory(capitalizedCategory as Category)
    }
    
    if (regionParam) {
      const capitalizedRegion = regionParam
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      setSelectedRegion(capitalizedRegion as Region)
    }
  }, [searchParams])

  useEffect(() => {
    router.prefetch("/goa-experiences")
  }, [router])

  useEffect(() => {
    // Fetch real-time data from Gemini API with category/region filters
    const fetchPlaces = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('realtime', 'true')
        if (selectedCategory !== 'All') params.set('category', selectedCategory)
        if (selectedRegion !== 'All') params.set('region', selectedRegion)
        if (searchQuery && searchQuery.trim().length > 0) {
          params.set('search', searchQuery.trim())
        }
        
        const response = await fetch(`/api/destinations?${params.toString()}`)
        const data = await response.json()
        setPlaces(data)
      } catch (error) {
        console.error('Error fetching destinations:', error)
        // Fallback to mock data
        setPlaces(mockPlaces)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchPlaces()
    }, searchQuery ? 500 : 0)
    
    return () => clearTimeout(timer)
  }, [selectedCategory, selectedRegion, searchQuery])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % goaSlides.length)
    }, 4200)

    return () => clearInterval(timer)
  }, [])

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = !searchQuery || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRegion = selectedRegion === "All" || place.region === selectedRegion
    const matchesCategory = selectedCategory === "All" || place.category.includes(selectedCategory)

    return matchesSearch && matchesRegion && matchesCategory
  })

  const filteredGoaHighlights = goaHighlights.filter((item) => item.category === activeGoaCategory)

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % goaSlides.length)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + goaSlides.length) % goaSlides.length)
  }

  const handleTouchStart = (value: number) => {
    setTouchStartX(value)
  }

  const handleTouchEnd = (value: number) => {
    if (touchStartX === null) return
    const distance = touchStartX - value
    if (Math.abs(distance) > 45) {
      if (distance > 0) nextSlide()
      else prevSlide()
    }
    setTouchStartX(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background py-12 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">
              Explore <span className="text-primary">India</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
              Discover incredible destinations across India - from spiritual havens to adventure hotspots
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 max-w-2xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={setSearchQuery}
                  showSuggestions={false}
                  placeholder="Search destinations, states, or categories..."
                />
              </div>
              <Filters
                selectedRegion={selectedRegion}
                selectedCategory={selectedCategory}
                onRegionChange={setSelectedRegion}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <section className="goa-section-border relative mb-10 overflow-hidden rounded-3xl border border-indigo-200/40 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-4 shadow-[0_24px_80px_-30px_rgba(99,102,241,0.2)] backdrop-blur-sm dark:border-indigo-900/30 dark:from-slate-900/80 dark:via-indigo-950/30 dark:to-purple-950/20 sm:p-6">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-pink-400/8 to-indigo-400/8 blur-3xl" />
            <div className="relative mb-6 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-indigo-600 shadow-sm backdrop-blur dark:border-indigo-800/40 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                  </span>
                  Goa Highlights
                </div>
                <h2 className="goa-shimmer-text mt-1 text-2xl font-bold sm:text-3xl" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                  Sunlit moments on Goa's shores
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base" style={{ fontFamily: "Inter, var(--font-sans)" }}>
                  A quiet walk through the coast, the sound of waves behind you, music drifting from the shacks, and people moving slowly into the evening.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.22)]" />
                  Live storytelling
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25">
                  <Sparkles className="h-3.5 w-3.5" />
                  Trending
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-[28px] border border-border/70 bg-muted/20 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.45)]">
              <div className="relative h-[420px] sm:h-[500px]">
                {goaSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${index === activeSlide ? "pointer-events-auto opacity-100 translate-x-0 scale-100" : "pointer-events-none opacity-0 translate-x-6 scale-[1.03]"}`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/38 to-black/12" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />
                    <div className="relative flex h-full flex-col justify-between p-5 text-white sm:p-7 lg:p-8">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 motion-safe:[animation:fadeUp_.65s_ease-out]">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] motion-safe:[animation:floaty_6s_ease-in-out_infinite]">
                            <MapPin className="h-3.5 w-3.5 text-white/80" />
                            {slide.location}
                          </div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.14)] motion-safe:[animation:floaty_6s_ease-in-out_infinite] motion-safe:[animation-delay:1.1s]">
                            {slide.vibe}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={prevSlide}
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/12 text-white/95 backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.16)]"
                            aria-label="Previous highlight"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={nextSlide}
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/12 text-white/95 backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.16)]"
                            aria-label="Next highlight"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="max-w-2xl space-y-4 motion-safe:[animation:fadeUp_.7s_ease-out]">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/85">
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.16)] motion-safe:[animation:floaty_6s_ease-in-out_infinite]">
                              <Star className="h-3.5 w-3.5 fill-current text-amber-300" />
                              {slide.rating}
                            </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.16)] motion-safe:[animation:floaty_6s_ease-in-out_infinite] motion-safe:[animation-delay:0.7s]">
                            <Clock3 className="h-3.5 w-3.5 text-white/80" />
                            {slide.bestTime}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.16)] motion-safe:[animation:floaty_6s_ease-in-out_infinite] motion-safe:[animation-delay:1.4s]">
                            <Sparkles className="h-3.5 w-3.5 text-white/80" />
                            {slide.popularNow}
                          </span>
                        </div>

                        <h3 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-[3.35rem] lg:leading-[1.02]" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                          {slide.place}
                        </h3>

                        <p className="max-w-xl text-sm leading-6 text-white/88 sm:text-base lg:text-[1.02rem]" style={{ fontFamily: "Inter, var(--font-sans)" }}>
                          {slide.tagline}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-white/85">
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
                            <Users className="h-3.5 w-3.5 text-white/80" />
                            {slide.liveNow}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
                            <Sparkles className="h-3.5 w-3.5 text-white/80" />
                            {slide.visitedToday}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {[
                            "Beach",
                            "Sunset",
                            "Local Life",
                          ].map((chip, chipIndex) => (
                            <span
                              key={chip}
                              className="inline-flex items-center rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.14)] motion-safe:[animation:floaty_6s_ease-in-out_infinite]"
                              style={{ animationDelay: `${chipIndex * 0.6}s` }}
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => router.push("/goa-experiences")}
                              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/18 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:bg-white/26 hover:shadow-[0_0_28px_rgba(255,255,255,0.18)]"
                            >
                              Explore Experiences
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const gridNode = document.getElementById("goa-highlights-grid")
                                gridNode?.scrollIntoView({ behavior: "smooth", block: "start" })
                              }}
                              className="group inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/95 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:bg-white/20 hover:shadow-[0_0_22px_rgba(255,255,255,0.14)]"
                            >
                              View All
                              <ArrowRight className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>
                          </div>
                      </div>

                      <div className="space-y-3 pt-4 motion-safe:[animation:fadeUp_.8s_ease-out]">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/70">
                          <span>Featured moments</span>
                          <span>{String(activeSlide + 1).padStart(2, "0")} / {String(goaSlides.length).padStart(2, "0")}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {goaSlides.map((progressSlide, index) => (
                            <button
                              key={progressSlide.id}
                              type="button"
                              onClick={() => setActiveSlide(index)}
                              className="group relative h-1.5 overflow-hidden rounded-full bg-white/18"
                              aria-label={`Go to slide ${index + 1}`}
                            >
                              <span
                                className={`absolute inset-y-0 left-0 rounded-full bg-white transition-all duration-700 ${index === activeSlide ? "w-full shadow-[0_0_18px_rgba(255,255,255,0.45)]" : "w-0 group-hover:w-1/2"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-4 flex items-center justify-center text-primary/80">
              <ArrowDown className="h-4 w-4" />
              <span className="mx-2 text-xs font-medium uppercase tracking-wider">Explore by category</span>
              <ArrowDown className="h-4 w-4" />
            </div>

            <div className="mb-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {goaCategories.map((category) => {
                const Icon = category.icon
                const isActive = activeGoaCategory === category.id
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveGoaCategory(category.id)}
                    className={`group relative min-w-[148px] overflow-hidden rounded-2xl border p-0 text-left transition-all duration-300 ${
                      isActive
                        ? "goa-category-active border-indigo-400/60 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/30"
                        : "border-border/60 bg-card shadow-sm hover:border-indigo-300/50 hover:shadow-md"
                    }`}
                  >
                    <div className="relative h-20 overflow-hidden">
                      <div
                        className="card-image absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${category.thumb})` }}
                      />
                      <div className={`absolute inset-0 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-indigo-600/55 to-purple-700/45"
                          : "bg-gradient-to-br from-black/30 to-black/10 group-hover:from-indigo-600/35 group-hover:to-purple-700/25"
                      }`} />
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                      isActive ? "text-indigo-700 dark:text-indigo-300" : "text-foreground"
                    }`}>
                      <Icon className={`h-4 w-4 transition-colors duration-200 ${
                        isActive ? "text-indigo-500" : "text-muted-foreground group-hover:text-indigo-400"
                      }`} />
                      {category.label}
                      {isActive && (
                        <span className="ml-auto rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          ON
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div id="goa-highlights-grid" className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                  <span className="text-indigo-600 dark:text-indigo-400">{activeGoaCategory}</span>{" "}Highlights
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{filteredGoaHighlights.length} curated spots · Updated live</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition-all hover:bg-indigo-100 dark:border-indigo-800/40 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
              >
                View all
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredGoaHighlights.map((highlight, idx) => {
                const crowdColor =
                  highlight.crowd === "High"
                    ? "bg-rose-500/90"
                    : highlight.crowd === "Medium"
                    ? "bg-amber-500/90"
                    : "bg-emerald-500/90"
                const budgetColor =
                  highlight.budget === "Premium"
                    ? "from-violet-600/90 to-purple-700/90"
                    : highlight.budget === "Mid-range"
                    ? "from-sky-600/90 to-blue-700/90"
                    : "from-emerald-600/90 to-teal-700/90"
                return (
                  <article
                    key={highlight.id}
                    className="goa-highlight-card group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card shadow-md"
                    style={{ animationDelay: `${idx * 0.07}s` }}
                    onClick={() => setSelectedGoaHighlight(highlight)}
                  >
                    {/* Image area — tall, cinematic */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={highlight.image}
                        alt={highlight.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {/* Multi-layer gradient overlay */}
                      <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent" />

                      {/* Top-left: crowd badge */}
                      <div className="absolute left-3 top-3">
                        <span className={`goa-badge inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ${crowdColor}`}>
                          <Users className="h-3 w-3" />
                          {highlight.crowd}
                        </span>
                      </div>

                      {/* Top-right: best time */}
                      <div className="absolute right-3 top-3">
                        <span className="goa-badge inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                          <Sun className="h-3 w-3 text-amber-300" />
                          {highlight.bestTime}
                        </span>
                      </div>

                      {/* Bottom overlay: title & tagline */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4
                          className="text-[1.05rem] font-bold leading-tight text-white drop-shadow-sm"
                          style={{ fontFamily: "Poppins, var(--font-sans)" }}
                        >
                          {highlight.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-xs text-white/80" style={{ fontFamily: "Inter, var(--font-sans)" }}>
                          {highlight.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="space-y-3 p-4">
                      {/* Budget pill — gradient */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-semibold text-white shadow-sm ${budgetColor}`}>
                          <Star className="h-3 w-3 fill-current text-white/80" />
                          {highlight.budget}
                        </span>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-200/60 bg-indigo-50 text-indigo-500 transition-all hover:bg-indigo-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/30 dark:border-indigo-800/40 dark:bg-indigo-950/60"
                          onClick={(e) => { e.stopPropagation(); }}
                          aria-label="Save highlight"
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Tags row */}
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 font-medium text-muted-foreground">
                          👥 Crowd: {highlight.crowd}
                        </span>
                        <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 font-medium text-muted-foreground">
                          🕐 {highlight.bestTime}
                        </span>
                      </div>

                      {/* CTA row */}
                      <div className="flex items-center justify-between border-t border-border/40 pt-2">
                        <span className="text-[11px] font-medium text-indigo-500 dark:text-indigo-400">
                          Tap to explore →
                        </span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPlaces.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? "result" : "results"}
                </p>
                <PricingInfo />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} onSelect={setSelectedPlace} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No places found"
              description={`We couldn't find any places matching "${searchQuery}". Try adjusting your search or filters.`}
              actionLabel="Clear Search"
              onAction={() => setSearchQuery("")}
            />
          )}
        </div>
      </main>
      <Footer />

      <PlaceDetailsDialog place={selectedPlace} open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)} />
      {selectedGoaHighlight ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 p-3 sm:p-6">
          <div className="max-h-[96vh] w-full max-w-5xl overflow-auto rounded-3xl bg-background shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
              <h3 className="text-lg font-semibold" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                {selectedGoaHighlight.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedGoaHighlight(null)}
                className="grid h-8 w-8 place-items-center rounded-full border text-muted-foreground transition hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative mb-5 h-60 overflow-hidden rounded-2xl sm:h-72">
                <img
                  src={selectedGoaHighlight.image}
                  alt={selectedGoaHighlight.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs uppercase tracking-wider">Goa Highlight Detail</p>
                  <h4 className="text-2xl font-semibold" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                    {selectedGoaHighlight.title}
                  </h4>
                </div>
              </div>

              <div className="mb-5 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-muted px-3 py-1.5">Crowd: {selectedGoaHighlight.crowd}</span>
                <span className="rounded-full bg-muted px-3 py-1.5">Budget: {selectedGoaHighlight.budget}</span>
                <span className="rounded-full bg-muted px-3 py-1.5">Best time: {selectedGoaHighlight.bestTime}</span>
              </div>

              <div className="mb-6 rounded-2xl border bg-card p-4">
                <h5 className="mb-2 font-semibold" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                  Why visit
                </h5>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "Inter, var(--font-sans)" }}>
                  {selectedGoaHighlight.whyVisit}
                </p>
              </div>

              <div className="mb-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted">
                  <Bookmark className="h-4 w-4" /> Save
                </button>
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted">
                  <ArrowRight className="h-4 w-4" /> Add to Trip
                </button>
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted">
                  <Share2 className="h-4 w-4" /> Share
                </button>
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-95">
                  <MapPin className="h-4 w-4" /> View on Map
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border bg-card p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h5 className="inline-flex items-center gap-2 text-base font-semibold" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                        <BookOpen className="h-4 w-4 text-primary" />
                        Trending in Goa
                      </h5>
                      <p className="mt-1 text-xs text-muted-foreground" style={{ fontFamily: "Inter, var(--font-sans)" }}>
                        Curated stories, guides, and moments from the coast.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      <MessageSquareQuote className="h-3.5 w-3.5" />
                      Trending Now
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {goaStories.map((story, index) => (
                      <article
                        key={story.id}
                        className={`group overflow-hidden rounded-xl border transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${index === 0 ? "bg-gradient-to-br from-primary/10 via-background to-accent/10" : "bg-background hover:bg-muted/30"}`}
                      >
                        <div className="flex gap-3 p-3">
                          <div
                            className={`relative overflow-hidden rounded-lg bg-cover bg-center ${index === 0 ? "h-24 w-24 sm:h-28 sm:w-28" : "h-20 w-20"}`}
                            style={{ backgroundImage: `url(${story.image})` }}
                          >
                            <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />
                            {index === 0 ? (
                              <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
                                Featured
                              </span>
                            ) : null}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="rounded-full bg-muted px-2 py-0.5">{story.author}</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-3 w-3" />
                                {story.readTime}
                              </span>
                            </div>
                            <p className={`font-semibold leading-snug ${index === 0 ? "text-[15px]" : "text-sm"}`} style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                              {story.title}
                            </p>
                            <p className={`mt-1 text-xs text-muted-foreground ${index === 0 ? "line-clamp-3" : "line-clamp-2"}`} style={{ fontFamily: "Inter, var(--font-sans)" }}>
                              {story.excerpt}
                            </p>
                            <button
                              type="button"
                              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary transition group-hover:translate-x-0.5"
                            >
                              View story
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border bg-card p-4">
                  <h5 className="mb-3 inline-flex items-center gap-2 text-base font-semibold" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                    <Play className="h-4 w-4 text-primary" />
                    Reels
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    {goaReels.map((reel) => (
                      <article key={reel.id} className="relative overflow-hidden rounded-xl border">
                        <div className="aspect-[9/16] bg-cover bg-center" style={{ backgroundImage: `url(${reel.image})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                        <button type="button" className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white backdrop-blur">
                          <Play className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 text-xs text-white">
                          <p className="font-semibold">{reel.creator}</p>
                          <p className="text-white/80">{reel.caption}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border bg-card p-4">
                  <h5 className="mb-3 inline-flex items-center gap-2 text-base font-semibold" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                    <Sparkles className="h-4 w-4 text-primary" />
                    Moments from Goa
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {goaLocalShots.map((shot) => (
                      <div key={shot.id} className="relative aspect-[4/5] overflow-hidden rounded-lg">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${shot.image})` }} />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-2 py-1.5 text-[10px] text-white">
                          {shot.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border bg-card p-4">
                  <h5 className="mb-3 inline-flex items-center gap-2 text-base font-semibold" style={{ fontFamily: "Poppins, var(--font-sans)" }}>
                    <Star className="h-4 w-4 text-primary" />
                    Top Picks
                  </h5>
                  <div className="space-y-3">
                    {goaReviews.map((review) => (
                      <article key={review.id} className="rounded-xl border p-3">
                        <div className="mb-2 flex items-center gap-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="mb-2 text-sm text-muted-foreground">{review.text}</p>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs">{review.tag}</span>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-primary/80">
                <Sun className="h-3.5 w-3.5" />
                Inspiration to Filter to Explore to Decision
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <LiveNotificationsPanel />
    </div>
  )
}

