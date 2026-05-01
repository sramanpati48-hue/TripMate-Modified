"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TripDayCard, type TripActivity } from "@/components/trip-day-card"
import { AddActivityDialog } from "@/components/add-activity-dialog"
import AIPromptInterface from "@/components/AIPromptInterface"
import TripMateHero from "@/components/trip-mate-hero"
import { PricingInfo } from "@/components/pricing-info"
import { LiveNotificationsPanel } from "@/components/live-notifications"
import { TripSummary } from "@/components/trip-summary"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface TripDay {
  day: number
  date: string
  activities: TripActivity[]
}

const initialTrip: TripDay[] = [
  {
    day: 1,
    date: "Monday, Jan 15",
    activities: [
      {
        id: "1",
        name: "Arrive at Indira Gandhi International Airport",
        time: "08:00",
        duration: "2 hours",
        location: "New Delhi Airport",
        category: "Transport",
        notes: "Flight to Delhi",
        transportMode: "uber-go",
        transportFare: 450,
        distanceToNext: 15,
      },
      {
        id: "2",
        name: "Check-in at Hotel near India Gate",
        time: "11:00",
        duration: "1 hour",
        location: "Connaught Place, New Delhi",
        category: "Accommodation",
        transportMode: "metro",
        transportFare: 40,
        distanceToNext: 3,
      },
      {
        id: "3",
        name: "Visit India Gate",
        time: "16:00",
        duration: "2 hours",
        location: "Rajpath, New Delhi",
        category: "Sightseeing",
        notes: "Beautiful monument, great for photos at sunset",
        transportMode: "auto-rickshaw",
        transportFare: 80,
        distanceToNext: 2,
      },
      {
        id: "4",
        name: "Dinner at Connaught Place",
        time: "19:30",
        duration: "1.5 hours",
        location: "Connaught Place",
        category: "Food",
        notes: "Try authentic North Indian cuisine",
      },
    ],
  },
  {
    day: 2,
    date: "Tuesday, Jan 16",
    activities: [
      {
        id: "5",
        name: "Red Fort Visit",
        time: "09:00",
        duration: "2.5 hours",
        location: "Netaji Subhash Marg, Chandni Chowk",
        category: "Sightseeing",
        notes: "UNESCO World Heritage Site, arrive early to beat crowds",
        transportMode: "uber-go",
        transportFare: 120,
        distanceToNext: 1.5,
      },
      {
        id: "6",
        name: "Explore Chandni Chowk Market",
        time: "12:00",
        duration: "2 hours",
        location: "Chandni Chowk",
        category: "Activity",
        notes: "Old Delhi's famous market, try street food",
        transportMode: "none",
        transportFare: 0,
        distanceToNext: 0.5,
      },
      {
        id: "7",
        name: "Visit Jama Masjid",
        time: "15:00",
        duration: "1.5 hours",
        location: "Chandni Chowk",
        category: "Sightseeing",
        notes: "India's largest mosque",
      },
      {
        id: "8",
        name: "Humayun's Tomb",
        time: "17:30",
        duration: "2 hours",
        location: "Nizamuddin East",
        category: "Sightseeing",
        notes: "Stunning Mughal architecture",
      },
    ],
  },
  {
    day: 3,
    date: "Wednesday, Jan 17",
    activities: [
      {
        id: "9",
        name: "Day Trip to Agra - Taj Mahal",
        time: "06:00",
        duration: "8 hours",
        location: "Agra, Uttar Pradesh",
        category: "Sightseeing",
        notes: "Start early to see Taj Mahal at sunrise. Book tickets online in advance.",
      },
      {
        id: "10",
        name: "Visit Agra Fort",
        time: "11:00",
        duration: "2 hours",
        location: "Agra Fort, Agra",
        category: "Sightseeing",
        notes: "Another UNESCO World Heritage Site",
      },
      {
        id: "11",
        name: "Return to Delhi",
        time: "16:00",
        duration: "3 hours",
        location: "Agra to Delhi",
        category: "Transport",
      },
    ],
  },
]

export default function TripPlannerPage() {
  const [trip, setTrip] = useState<TripDay[]>(initialTrip)
  const [addingToDay, setAddingToDay] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual")
  const router = useRouter()
  const draftAppliedRef = useRef(false)

  useEffect(() => {
    if (draftAppliedRef.current) return

    const params = new URLSearchParams(window.location.search)
    if (params.get("addFromPlace") !== "1") return

    const rawDraft = localStorage.getItem("tripmate:add-activity-draft")
    if (!rawDraft) {
      window.history.replaceState(null, "", "/trip-planner")
      return
    }

    try {
      const draft = JSON.parse(rawDraft) as Omit<TripActivity, "id">
      setTrip((prev) => {
        const lastDay = prev[prev.length - 1]
        const nextDayNumber = (lastDay?.day || 0) + 1
        const newDay: TripDay = {
          day: nextDayNumber,
          date: `Day ${nextDayNumber}`,
          activities: [{ ...draft, id: Date.now().toString() }],
        }

        return [...prev, newDay]
      })
      draftAppliedRef.current = true
      localStorage.removeItem("tripmate:add-activity-draft")
      alert("New itinerary day created and destination added")
    } catch (error) {
      console.error("Failed to apply trip draft:", error)
    } finally {
      window.history.replaceState(null, "", "/trip-planner")
    }
  }, [router])

  // Get previous location for transport calculation
  const getPreviousLocation = (dayNum: number) => {
    const day = trip.find(d => d.day === dayNum)
    if (!day || day.activities.length === 0) return undefined
    return day.activities[day.activities.length - 1].location
  }

  const handleAddActivity = (dayNum: number, activity: Omit<TripActivity, "id">) => {
    setTrip((prev) =>
      prev.map((day) => {
        if (day.day === dayNum) {
          return {
            ...day,
            activities: [...day.activities, { ...activity, id: Date.now().toString() }],
          }
        }
        return day
      }),
    )
  }

  const handleRemoveActivity = (dayNum: number, activityId: string) => {
    setTrip((prev) =>
      prev.map((day) => {
        if (day.day === dayNum) {
          return {
            ...day,
            activities: day.activities.filter((a) => a.id !== activityId),
          }
        }
        return day
      }),
    )
  }

  const handleReorderActivities = (dayNum: number, activities: TripActivity[]) => {
    setTrip((prev) =>
      prev.map((day) => {
        if (day.day === dayNum) {
          return { ...day, activities }
        }
        return day
      }),
    )
  }

  const addNewDay = () => {
    const lastDay = trip[trip.length - 1]
    const newDay: TripDay = {
      day: lastDay.day + 1,
      date: `Day ${lastDay.day + 1}`,
      activities: [],
    }
    setTrip([...trip, newDay])
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-transparent text-slate-900">
      <Navbar />
      <main className="relative flex-1 overflow-hidden bg-transparent">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center opacity-100 saturate-125 brightness-110"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
            muted
            playsInline
            autoPlay
            loop
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,246,235,0.10)_45%,rgba(255,250,243,0.18)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[50vh] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[44vh] bg-[linear-gradient(180deg,rgba(255,248,240,0.00)_0%,rgba(255,248,240,0.06)_100%)]" />
          <div className="absolute inset-x-0 top-[50vh] h-[50vh] origin-top scale-y-[-1] opacity-28 blur-[1px]">
            <video
              className="absolute inset-0 h-full w-full object-cover object-center"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
              muted
              playsInline
              autoPlay
              loop
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,240,0.12)_0%,rgba(255,248,240,0.82)_100%)]" />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-8">
          <div className="mb-8 flex items-start justify-end text-slate-900">
            <PricingInfo />
          </div>

          <TripMateHero activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "manual" ? (
            <div className="mt-6 space-y-6 rounded-[28px] border border-white/12 bg-white/3 p-5 shadow-2xl shadow-orange-100/10 backdrop-blur-sm md:p-8">
              <TripSummary days={trip} />

              <div className="grid gap-6 lg:grid-cols-2">
                {trip.map((day) => (
                  <TripDayCard
                    key={day.day}
                    day={day.day}
                    date={day.date}
                    activities={day.activities}
                    onAddActivity={() => setAddingToDay(day.day)}
                    onRemoveActivity={(activityId) => handleRemoveActivity(day.day, activityId)}
                    onReorderActivities={(activities) => handleReorderActivities(day.day, activities)}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <Button variant="outline" onClick={addNewDay} className="gap-2 border-white/15 bg-white/6 text-slate-900 hover:bg-white/12 hover:text-slate-900">
                  <Plus className="h-4 w-4" />
                  Add Another Day
                </Button>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-2xl rounded-[28px] border border-white/12 bg-white/3 p-4 shadow-2xl shadow-orange-100/10 backdrop-blur-sm md:p-8">
              <AIPromptInterface />
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AddActivityDialog
        open={addingToDay !== null}
        onOpenChange={() => setAddingToDay(null)}
        onAdd={(activity) => addingToDay !== null && handleAddActivity(addingToDay, activity)}
        previousLocation={addingToDay !== null ? getPreviousLocation(addingToDay) : undefined}
      />
      
      <LiveNotificationsPanel />
    </div>
  )
}
