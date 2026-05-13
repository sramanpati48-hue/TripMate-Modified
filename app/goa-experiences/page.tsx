"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowRight,
  Bookmark,
  Camera,
  CalendarDays,
  Clock3,
  Compass,
  Flower2,
  Leaf,
  MapPin,
  Music2,
  PartyPopper,
  Sparkles,
  Star,
  Store,
  SunMedium,
  Tent,
  Utensils,
  Waves,
  Users,
  Plus,
  X,
} from "lucide-react"

type Experience = {
  id: number
  title: string
  category: string
  image: string
  rating: string
  location: string
  cost: string
  badge: string
  description: string
  duration: string
  host: string
  includes: string[]
}

type CommunityPost = {
  id: number
  user: string
  avatar: string
  timestamp: string
  title: string
  description: string
  interested: string
  category: string
}

type LiveEvent = {
  title: string
  time: string
  location: string
  people: string
  accent: string
}

type Recommendation = {
  title: string
  reason: string
  score: string
}

const categories = [
  { label: "All", icon: Sparkles },
  { label: "Beach Parties", icon: Waves },
  { label: "Sunset Cruises", icon: SunMedium },
  { label: "Water Sports", icon: Tent },
  { label: "Night Clubs", icon: PartyPopper },
  { label: "Local Food Tours", icon: Utensils },
  { label: "Music Festivals", icon: Music2 },
  { label: "Café Hangouts", icon: Camera },
  { label: "Flea Markets", icon: Store },
  { label: "Photography Walks", icon: Compass },
  { label: "Yoga Retreats", icon: Leaf },
]

const experiences: Experience[] = [
  {
    id: 1,
    title: "Beach Parties",
    category: "Beach Parties",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9",
    location: "Baga Beach",
    cost: "From ₹1,499",
    badge: "Trending tonight",
    description: "Sunset-to-midnight shoreline parties with DJ sets, fire shows, and a social crowd.",
    duration: "3-5 hrs",
    host: "Hosted by Goa Nights Collective",
    includes: ["DJ entry", "Welcome drink", "Beach-side seating"],
  },
  {
    id: 2,
    title: "Sunset Cruises",
    category: "Sunset Cruises",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8",
    location: "Mandovi River",
    cost: "From ₹2,299",
    badge: "Golden hour",
    description: "Luxury catamaran cruises with skyline views, live music, and sunset cocktails.",
    duration: "2 hrs",
    host: "Hosted by Sea Horizon",
    includes: ["Cruise ticket", "Music deck", "Drinks menu"],
  },
  {
    id: 3,
    title: "Water Sports",
    category: "Water Sports",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    rating: "4.7",
    location: "Calangute",
    cost: "From ₹899",
    badge: "Adrenaline pick",
    description: "Jet ski, parasailing, banana rides, and guided wave adventures for groups.",
    duration: "1.5-3 hrs",
    host: "Hosted by Aqua Rush",
    includes: ["Safety gear", "Instructor", "Photo stops"],
  },
  {
    id: 4,
    title: "Night Clubs",
    category: "Night Clubs",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9",
    location: "Anjuna",
    cost: "From ₹1,199",
    badge: "Live after dark",
    description: "Guest DJs, premium sound, and a neon-lit dancefloor with easy group access.",
    duration: "Late night",
    host: "Hosted by Housewave Goa",
    includes: ["Club entry", "Priority queue", "Live set"],
  },
  {
    id: 5,
    title: "Local Food Tours",
    category: "Local Food Tours",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9",
    location: "Panaji Old Town",
    cost: "From ₹1,099",
    badge: "Taste the coast",
    description: "Curated bites, hidden taverns, and local storytelling from long-time Goans.",
    duration: "3 hrs",
    host: "Hosted by Taste Trails",
    includes: ["6 tastings", "Local guide", "Cultural stops"],
  },
  {
    id: 6,
    title: "Music Festivals",
    category: "Music Festivals",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    rating: "5.0",
    location: "Vagator",
    cost: "From ₹3,999",
    badge: "Weekend anthem",
    description: "Festival passes for the biggest live stages, art installations, and after-parties.",
    duration: "Full day",
    host: "Hosted by Wavefront Events",
    includes: ["Festival pass", "Artist lineup", "After party"],
  },
  {
    id: 7,
    title: "Café Hangouts",
    category: "Café Hangouts",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8",
    location: "Assagao",
    cost: "From ₹499",
    badge: "Slow mornings",
    description: "Sunlit cafés, remote-work corners, and dessert stops with a creative crowd.",
    duration: "2-4 hrs",
    host: "Hosted by Wander Bean",
    includes: ["Cafe trail", "Coffee tasting", "Wi-Fi friendly"],
  },
  {
    id: 8,
    title: "Flea Markets",
    category: "Flea Markets",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    rating: "4.7",
    location: "Arpora Saturday Market",
    cost: "From ₹299",
    badge: "Hidden finds",
    description: "Vintage fashion, handmade crafts, and night market snacks in one lively trail.",
    duration: "Evening",
    host: "Hosted by Market Stories",
    includes: ["Guide map", "Bargain tips", "Snack trail"],
  },
  {
    id: 9,
    title: "Photography Walks",
    category: "Photography Walks",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9",
    location: "Fontainhas",
    cost: "From ₹799",
    badge: "Frame-worthy",
    description: "Color-rich lanes, heritage facades, and golden-hour shots with local guidance.",
    duration: "2 hrs",
    host: "Hosted by Frame Goa",
    includes: ["Photo tips", "Route map", "Edit recommendations"],
  },
  {
    id: 10,
    title: "Yoga Retreats",
    category: "Yoga Retreats",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    rating: "5.0",
    location: "Ashwem",
    cost: "From ₹1,899",
    badge: "Reset mode",
    description: "Ocean breeze meditation, sunrise flow, and mindful meals in a serene retreat.",
    duration: "Half day",
    host: "Hosted by Still Sea Studio",
    includes: ["Yoga mat", "Tea session", "Breathwork"],
  },
]

const liveEvents: LiveEvent[] = [
  {
    title: "Sunset EDM rooftop set",
    time: "6:30 PM",
    location: "Baga",
    people: "42 going",
    accent: "from-cyan-400/40 via-blue-500/30 to-sky-600/40",
  },
  {
    title: "Moonlight cruise with acoustic duo",
    time: "7:15 PM",
    location: "Mandovi",
    people: "28 going",
    accent: "from-amber-400/40 via-orange-500/30 to-rose-500/40",
  },
  {
    title: "Late-night street food crawl",
    time: "8:45 PM",
    location: "Panaji",
    people: "61 going",
    accent: "from-emerald-400/40 via-teal-500/30 to-cyan-500/40",
  },
  {
    title: "Beach volleyball + DJ warm-up",
    time: "Today",
    location: "Candolim",
    people: "19 going",
    accent: "from-fuchsia-400/40 via-violet-500/30 to-indigo-500/40",
  },
]

const communityPosts: CommunityPost[] = [
  {
    id: 1,
    user: "Aarav",
    avatar: "https://i.pravatar.cc/160?img=12",
    timestamp: "10 min ago",
    title: "Sunset beach EDM party tonight at Baga",
    description: "DJ lineup is confirmed and we’re meeting near the northern shacks by 6 PM. DM if you want the exact pin.",
    interested: "128",
    category: "Party announcement",
  },
  {
    id: 2,
    user: "Meera",
    avatar: "https://i.pravatar.cc/160?img=32",
    timestamp: "32 min ago",
    title: "Looking for people for scuba diving tomorrow",
    description: "Need 3 more travellers for an early dive session in South Goa. Beginners welcome, gear included.",
    interested: "74",
    category: "Travel group request",
  },
  {
    id: 3,
    user: "Rohan",
    avatar: "https://i.pravatar.cc/160?img=48",
    timestamp: "1 hour ago",
    title: "Live music meetup near Anjuna",
    description: "A laid-back hangout for anyone into indie sets, beach bars, and good conversation after sunset.",
    interested: "91",
    category: "Nightlife plan",
  },
]

const recommendations: Recommendation[] = [
  {
    title: "Best for first-timers",
    reason: "Pair a sunset cruise with a late dinner in Panaji for an easy premium evening.",
    score: "92% match",
  },
  {
    title: "Social energy pick",
    reason: "Beach parties and live music events are clustered tonight within a short ride.",
    score: "Live now",
  },
  {
    title: "Low-key reset",
    reason: "Start with a yoga retreat and end at a café hangout in Assagao for a slower day.",
    score: "Calm route",
  },
]

const hostCategories = categories.filter((category) => category.label !== "All")

export default function GoaExperiencesPage() {
  const [isReady, setIsReady] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)
  const [publishedMessage, setPublishedMessage] = useState<string | null>(null)
  const [bookmarkedExperiences, setBookmarkedExperiences] = useState<number[]>([])
  const [joinedPosts, setJoinedPosts] = useState<number[]>([])
  const [hostForm, setHostForm] = useState({
    eventName: "",
    location: "",
    dateTime: "",
    description: "",
    category: "Beach Parties",
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!publishedMessage) {
      return
    }

    const timer = setTimeout(() => setPublishedMessage(null), 3200)
    return () => clearTimeout(timer)
  }, [publishedMessage])

  const filteredExperiences = experiences.filter((experience) => {
    return selectedCategory === "All" || experience.category === selectedCategory
  })

  const filteredPosts = communityPosts

  const handlePublishEvent = () => {
    setPublishedMessage(
      hostForm.eventName
        ? `${hostForm.eventName} is ready to publish in Goa Community.`
        : "Your Goa event draft is ready to publish.",
    )
    setHostForm({
      eventName: "",
      location: "",
      dateTime: "",
      description: "",
      category: "Beach Parties",
    })
    setIsHostModalOpen(false)
  }

  const toggleExperienceBookmark = (experienceId: number) => {
    setBookmarkedExperiences((current) =>
      current.includes(experienceId)
        ? current.filter((value) => value !== experienceId)
        : [...current, experienceId],
    )
  }

  const toggleJoinPost = (postId: number) => {
    setJoinedPosts((current) =>
      current.includes(postId) ? current.filter((value) => value !== postId) : [...current, postId],
    )
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_50%,#020617_100%)] text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_28px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <Skeleton className="h-6 w-40 bg-white/10" />
                <Skeleton className="h-16 w-full max-w-3xl bg-white/10" />
                <Skeleton className="h-6 w-full max-w-2xl bg-white/10" />
                <Skeleton className="h-12 w-full rounded-2xl bg-white/10" />
                <Skeleton className="h-12 w-full rounded-2xl bg-white/10" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-28 rounded-full bg-white/10" />
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-36 rounded-[1.5rem] bg-white/10" />
                ))}
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-[1.75rem] bg-white/10" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_right,_rgba(244,114,182,0.12),_transparent_26%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#020617_100%)] text-white motion-safe:[animation:pageEnter_.7s_ease-out]">
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-6 md:px-6">
        {publishedMessage ? (
          <div className="fixed right-4 top-24 z-50 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100 shadow-[0_18px_60px_rgba(16,185,129,0.28)] backdrop-blur-2xl md:right-6">
            {publishedMessage}
          </div>
        ) : null}

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_100px_rgba(2,6,23,0.5)] backdrop-blur-2xl md:rounded-[2.5rem]">
          <div
            className="absolute inset-0 bg-cover bg-center md:bg-fixed"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/72 to-slate-950/88" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.14),_transparent_24%)]" />

          <div className="relative grid gap-8 p-6 md:p-10 xl:grid-cols-[1.08fr_0.92fr] xl:p-14">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full border border-cyan-300/25 bg-cyan-300/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-cyan-100">
                  Trending
                </Badge>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-xl">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live Events Happening Now
                </span>
              </div>

              <div className="space-y-4 motion-safe:[animation:fadeUp_.8s_ease-out]">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  Discover Goa Beyond the Beaches
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                  Explore local parties, sunset cruises, hidden cafés, nightlife, music events, and authentic community experiences.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {categories.map((category) => {
                  const Icon = category.icon
                  const isActive = selectedCategory === category.label

                  return (
                    <button
                      key={category.label}
                      type="button"
                      onClick={() => setSelectedCategory(category.label)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${isActive ? "border-white/20 bg-white text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.18)]" : "border-white/12 bg-white/8 text-white/86 backdrop-blur-xl hover:scale-[1.02] hover:bg-white/15"}`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-white/82">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/12 px-3 py-1.5 backdrop-blur-xl">
                  <Sparkles className="h-4 w-4 text-amber-200" />
                  120 live experiences tonight
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 backdrop-blur-xl">
                  <Users className="h-4 w-4 text-cyan-200" />
                  People exploring now: 1.2k
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <Card className="border-white/12 bg-white/8 text-white shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur-2xl">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Live pulse
                    </span>
                    <CalendarDays className="h-5 w-5 text-white/55" />
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">Tonight in Goa</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      The best events are clustered near Baga, Anjuna, and Panaji with easy ride-share access.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
                      <p className="text-lg font-semibold text-cyan-100">42</p>
                      <p className="text-white/60">Going now</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
                      <p className="text-lg font-semibold text-amber-100">14</p>
                      <p className="text-white/60">New posts</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
                      <p className="text-lg font-semibold text-rose-100">7</p>
                      <p className="text-white/60">Hot spots</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/12 bg-white/8 text-white shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur-2xl">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium text-white/78">
                      Nearby live updates
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/12 px-3 py-1 text-xs text-cyan-100">
                      <span className="h-2 w-2 rounded-full bg-cyan-300" />
                      refreshing
                    </span>
                  </div>
                  <div className="space-y-3">
                    {liveEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.title}
                        className={`rounded-[1.35rem] border border-white/12 bg-gradient-to-r ${event.accent} p-3 shadow-[0_16px_40px_rgba(2,6,23,0.25)]`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{event.title}</p>
                            <p className="mt-1 text-xs text-white/70">{event.time} · {event.location}</p>
                          </div>
                          <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white/82">
                            {event.people}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Badge className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                Live events happening now
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Curated moments to jump into tonight</h2>
            </div>
            <p className="hidden max-w-sm text-sm leading-6 text-white/65 md:block">
              Scroll through premium Goa experiences with the look and feel of a modern discovery app.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {filteredExperiences.map((experience) => {
              const isBookmarked = bookmarkedExperiences.includes(experience.id)

              return (
                <Card
                  key={experience.id}
                  className="min-w-[290px] snap-start overflow-hidden border-white/12 bg-white/8 text-white shadow-[0_18px_50px_rgba(2,6,23,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(2,6,23,0.42)] md:min-w-[340px]"
                >
                  <div className="relative h-56 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-110"
                      style={{ backgroundImage: `url(${experience.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                      <Badge className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] text-white backdrop-blur-xl">
                        {experience.badge}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => toggleExperienceBookmark(experience.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl transition hover:scale-105 hover:bg-white/20"
                        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark experience"}
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-white text-white" : "text-white/80"}`} />
                      </button>
                    </div>
                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl font-semibold text-white">{experience.title}</p>
                        <p className="mt-1 text-sm text-white/78">{experience.category}</p>
                      </div>
                      <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-right backdrop-blur-xl">
                        <div className="flex items-center justify-end gap-1 text-amber-300">
                          <Star className="h-4 w-4 fill-amber-300" />
                          <span className="text-sm font-semibold text-white">{experience.rating}</span>
                        </div>
                        <p className="text-[11px] text-white/65">Highly rated</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <MapPin className="h-4 w-4" />
                      {experience.location}
                    </div>
                    <p className="text-sm leading-6 text-white/72">{experience.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-white/70">
                      <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">{experience.cost}</span>
                      <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">{experience.duration}</span>
                      <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">{experience.host}</span>
                    </div>
                    <Button
                      onClick={() => setSelectedExperience(experience)}
                      className="h-11 w-full rounded-2xl bg-white text-slate-950 hover:bg-cyan-100"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mt-12 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div>
              <Badge className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                Community Updates
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Posts, meetups, and event plans from travelers in Goa</h2>
            </div>

            <Card className="border-white/12 bg-white/8 text-white shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur-2xl">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/75">Party announcements</span>
                  <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/75">Meetup invitations</span>
                  <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/75">Travel group requests</span>
                </div>
                <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/12 bg-slate-950/30 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-semibold text-white">
                    +
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">Share your own Goa update</p>
                    <p className="text-sm text-white/65">Post nightlife plans, event changes, or travel requests in seconds.</p>
                  </div>
                  <Button
                    onClick={() => setIsHostModalOpen(true)}
                    className="rounded-full bg-white text-slate-950 hover:bg-cyan-100"
                  >
                    Host an Event
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const joined = joinedPosts.includes(post.id)

                return (
                  <Card
                    key={post.id}
                    className="border-white/12 bg-white/8 text-white shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur-2xl"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <img
                          src={post.avatar}
                          alt={post.user}
                          className="h-12 w-12 rounded-full border border-white/15 object-cover"
                        />
                        <div className="min-w-0 flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-white/68">
                            <span className="font-semibold text-white">{post.user}</span>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                            <Badge className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[11px] text-white/75">
                              {post.category}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-white/72">{post.description}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-sm text-white/75">
                              <Users className="h-4 w-4" />
                              {post.interested} interested
                            </div>
                            <Button
                              onClick={() => toggleJoinPost(post.id)}
                              variant={joined ? "secondary" : "default"}
                              className={`rounded-full ${joined ? "bg-white text-slate-950 hover:bg-white/90" : "bg-cyan-500 text-white hover:bg-cyan-400"}`}
                            >
                              {joined ? "Joined" : "Join"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <Badge className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                AI travel recommendations
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Smarter plans for the rest of your day</h2>
            </div>

            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <Card
                  key={recommendation.title}
                  className="border-white/12 bg-white/8 text-white shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur-2xl"
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">{recommendation.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">{recommendation.reason}</p>
                      </div>
                      <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/75">
                        {recommendation.score}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="overflow-hidden border-white/12 bg-white/8 text-white shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur-2xl">
              <div className="bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.85))] p-6">
                <div className="flex items-center gap-2 text-sm text-cyan-100">
                  <Sparkles className="h-4 w-4" />
                  People exploring now
                </div>
                <p className="mt-4 text-3xl font-semibold">1,200+</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/72">
                  Travel pairs, solo explorers, and local hosts are active right now across the Goa discovery network.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs text-white/78">Near you</span>
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs text-white/78">Live now</span>
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs text-white/78">Booking fast</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur-2xl md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                Full experience mix
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Explore, connect, and host in one immersive place</h2>
            </div>
            <Button
              onClick={() => setIsHostModalOpen(true)}
              className="w-fit rounded-full bg-white text-slate-950 hover:bg-cyan-100"
            >
              <Plus className="mr-2 h-4 w-4" />
              Host an Event
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      <Button
        onClick={() => setIsHostModalOpen(true)}
        className="fixed bottom-5 right-5 z-40 h-14 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-5 text-white shadow-[0_18px_45px_rgba(251,86,129,0.4)] transition hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(251,86,129,0.48)]"
      >
        <Plus className="mr-2 h-5 w-5" />
        Host an Event
      </Button>

      <Dialog open={Boolean(selectedExperience)} onOpenChange={(open) => !open && setSelectedExperience(null)}>
        <DialogContent className="max-w-4xl border-white/12 bg-slate-950/96 p-0 text-white backdrop-blur-2xl">
          {selectedExperience ? (
            <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
              <div
                className="min-h-[280px] bg-cover bg-center lg:min-h-full"
                style={{ backgroundImage: `url(${selectedExperience.image})` }}
              >
                <div className="h-full w-full bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-6">
                  <Badge className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white backdrop-blur-xl">
                    {selectedExperience.badge}
                  </Badge>
                </div>
              </div>

              <div className="space-y-5 p-6 md:p-7">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-3xl text-white">{selectedExperience.title}</DialogTitle>
                  <DialogDescription className="text-white/70">
                    {selectedExperience.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap items-center gap-2 text-sm text-white/75">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-1.5">
                    <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                    {selectedExperience.rating}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-1.5">
                    <MapPin className="h-4 w-4" />
                    {selectedExperience.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-1.5">
                    <Clock3 className="h-4 w-4" />
                    {selectedExperience.duration}
                  </span>
                </div>

                <div className="rounded-[1.35rem] border border-white/12 bg-white/8 p-4">
                  <p className="text-sm font-medium text-white">What’s included</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedExperience.includes.map((item) => (
                      <span key={item} className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/72">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-white/12 bg-gradient-to-r from-cyan-500/15 via-white/8 to-fuchsia-500/15 p-4 text-sm text-white/75">
                  <p className="font-medium text-white">Hosted by {selectedExperience.host}</p>
                  <p className="mt-2 leading-6">
                    Easy access, curated crowd, and a premium discovery feel designed for travelers who want Goa to feel social and unforgettable.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full bg-white text-slate-950 hover:bg-cyan-100">
                    Book now from {selectedExperience.cost}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => toggleExperienceBookmark(selectedExperience.id)}
                    className="rounded-full bg-white/10 text-white hover:bg-white/15"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {bookmarkedExperiences.includes(selectedExperience.id) ? "Saved" : "Save experience"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isHostModalOpen} onOpenChange={setIsHostModalOpen}>
        <DialogContent className="max-w-2xl border-white/12 bg-slate-950/96 text-white backdrop-blur-2xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-3xl text-white">+ Host an Event</DialogTitle>
            <DialogDescription className="text-white/70">
              Create a Goa meetup, party announcement, or travel event in a glassmorphism editor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-white/78">
                <span>Event Name</span>
                <Input
                  value={hostForm.eventName}
                  onChange={(event) => setHostForm((current) => ({ ...current, eventName: event.target.value }))}
                  placeholder="Sunset beach jam"
                  className="border-white/12 bg-white/8 text-white placeholder:text-white/45"
                />
              </label>
              <label className="space-y-2 text-sm text-white/78">
                <span>Location</span>
                <Input
                  value={hostForm.location}
                  onChange={(event) => setHostForm((current) => ({ ...current, location: event.target.value }))}
                  placeholder="Baga Beach"
                  className="border-white/12 bg-white/8 text-white placeholder:text-white/45"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-white/78">
                <span>Date &amp; Time</span>
                <Input
                  type="datetime-local"
                  value={hostForm.dateTime}
                  onChange={(event) => setHostForm((current) => ({ ...current, dateTime: event.target.value }))}
                  className="border-white/12 bg-white/8 text-white"
                />
              </label>
              <label className="space-y-2 text-sm text-white/78">
                <span>Category</span>
                <select
                  value={hostForm.category}
                  onChange={(event) => setHostForm((current) => ({ ...current, category: event.target.value }))}
                  className="h-10 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-sm text-white outline-none"
                >
                  {hostCategories.map((category) => (
                    <option key={category.label} value={category.label} className="bg-slate-950 text-white">
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm text-white/78">
              <span>Description</span>
              <textarea
                value={hostForm.description}
                onChange={(event) => setHostForm((current) => ({ ...current, description: event.target.value }))}
                rows={4}
                placeholder="Tell people what makes this Goa experience worth joining."
                className="min-h-[120px] w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none"
              />
            </label>

            <label className="space-y-2 text-sm text-white/78">
              <span>Upload Cover Image</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full rounded-2xl border border-dashed border-white/12 bg-white/8 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
              />
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsHostModalOpen(false)}
              className="rounded-full bg-white/10 text-white hover:bg-white/15"
            >
              Cancel
            </Button>
            <Button onClick={handlePublishEvent} className="rounded-full bg-white text-slate-950 hover:bg-cyan-100">
              Publish Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
