"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TripDayCard, type TripActivity } from "@/components/trip-day-card"
import { AddActivityDialog } from "@/components/add-activity-dialog"
import { AIItineraryGenerator } from "@/components/ai-itinerary-generator"
import { PricingInfo } from "@/components/pricing-info"
import { LiveNotificationsPanel } from "@/components/live-notifications"
import { TripSummary } from "@/components/trip-summary"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CalendarDays, Sparkles } from "lucide-react"

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Trip Planner - <span className="text-primary">Explore India</span>
                </h1>
                <p className="text-muted-foreground">Plan your perfect Indian adventure day by day or let AI create your itinerary</p>
              </div>
              <PricingInfo />
            </div>
          </div>

          <Tabs defaultValue="manual" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="manual" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Manual Planning
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Generator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6">
              {/* Trip Summary */}
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
                <Button variant="outline" onClick={addNewDay} className="gap-2 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add Another Day
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai">
              <div className="max-w-2xl mx-auto">
                <AIItineraryGenerator />
              </div>
            </TabsContent>
          </Tabs>
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
