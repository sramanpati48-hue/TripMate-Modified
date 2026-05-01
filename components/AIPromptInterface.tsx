"use client"

import { FormEvent, useState } from "react"
import { ArrowUp, Loader2, Mic, Paperclip, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AIItineraryCard } from "./ai-itinerary-card"

type GeneratedItinerary = {
  destination?: string
  days?: number
  budget?: string
  totalCost?: number | string
  overview?: string
  itinerary?: Array<{
    day?: number
    title?: string
    activities?: Array<{
      time?: string
      activity?: string
      name?: string
      description?: string
      duration?: string
      location?: string
      cost?: number | string
      tips?: string
    }>
    accommodation?: string
    meals?: string[]
    tips?: string[]
  }>
  essentialInfo?: {
    bestTimeToVisit?: string
    howToReach?: string
    accommodation?: string[]
    localTransport?: string
    thingsToPack?: string[]
  }
}

function formatCost(cost: number | string | undefined) {
  if (cost === undefined || cost === null || cost === "") return undefined

  if (typeof cost === "number") {
    return `₹${cost.toLocaleString("en-IN")}`
  }

  return cost.toString().startsWith("₹") ? cost.toString() : `₹${cost}`
}

const AIPromptInterface = () => {
  const [destination, setDestination] = useState("")
  const [days, setDays] = useState("3")
  const [budget, setBudget] = useState("Medium")
  const [promptText, setPromptText] = useState("")
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateItinerary = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedDestination = destination.trim()
    if (!trimmedDestination) {
      setError("Please enter a destination before generating an itinerary.")
      return
    }

    const parsedDays = Number.parseInt(days, 10)
    if (!Number.isFinite(parsedDays) || parsedDays < 1) {
      setError("Please enter a valid trip duration.")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: trimmedDestination,
          days: parsedDays,
          budget,
          interests: promptText.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate itinerary.")
      }

      setGeneratedItinerary(data)
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "Failed to generate itinerary.")
    } finally {
      setIsGenerating(false)
    }
  }

  const itineraryDays = generatedItinerary?.itinerary || []

  return (
    <div className="mx-auto mt-12 mb-10 flex w-full max-w-4xl flex-col items-center">
      <div className="mb-10 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-orange-500">
          <Sparkles className="mr-2 h-3 w-3" />
          AI Itinerary Builder
        </div>

        <h1 className="mb-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          Plan Your Next Adventure
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-slate-700">
          Describe your dream trip, preferred vibe, and must-do activities. Our AI will craft a personalized itinerary instantly.
        </p>
      </div>

      <form
        onSubmit={handleGenerateItinerary}
        className="relative w-full max-w-3xl rounded-2xl border border-white/15 bg-white/6 p-2 shadow-2xl shadow-orange-100/10 transition-all backdrop-blur-md focus-within:border-orange-400/50 focus-within:ring-1 focus-within:ring-orange-400/50"
      >
        <div className="flex items-center justify-between border-b border-white/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700">
              50/50 Credits
            </span>
            <span className="cursor-pointer rounded-md bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-700 transition hover:bg-orange-500/20">
              Upgrade
            </span>
          </div>
          <span className="flex items-center text-xs text-slate-600">
            <Sparkles className="mr-1.5 h-3 w-3" /> Powered by Tripmate AI
          </span>
        </div>

        <div className="grid gap-3 px-4 pt-4 sm:grid-cols-[1.3fr_0.7fr_0.8fr]">
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-600">Destination</span>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Goa, Kerala, Jaipur..."
              className="h-11 w-full rounded-xl border border-white/15 bg-white/45 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-orange-400/50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-600">Days</span>
            <input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/15 bg-white/45 px-4 text-sm text-slate-900 outline-none transition focus:border-orange-400/50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-600">Budget</span>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/15 bg-white/45 px-4 text-sm text-slate-900 outline-none transition focus:border-orange-400/50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
        </div>

        <div className="px-4 pt-4">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Add preferences like family-friendly activities, food focus, nightlife, beaches, or a relaxed pace..."
            className="min-h-[120px] w-full resize-none rounded-2xl border border-white/15 bg-white/45 p-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-orange-400/50"
          />
        </div>

        <div className="flex items-center justify-end px-4 pb-2 pt-2">
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600">{promptText.length}/3,000</span>
            <button
              type="submit"
              className={`rounded-full p-2 transition-all ${
                isGenerating || !destination.trim()
                  ? "cursor-not-allowed bg-white/50 text-slate-500"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
              disabled={isGenerating || !destination.trim()}
              aria-label="Generate itinerary"
            >
              {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && <p className="px-4 pb-3 text-sm text-red-600">{error}</p>}
      </form>

      {generatedItinerary && (
        <div className="mt-10 w-full max-w-4xl space-y-6">
          <Card className="border border-white/15 bg-white/6 text-slate-900 shadow-2xl shadow-orange-100/10 backdrop-blur-md">
            <CardHeader className="border-b border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Generated itinerary</p>
                  <CardTitle className="mt-2 text-2xl text-slate-950">{generatedItinerary.destination || destination}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50">{generatedItinerary.days || days} Days</Badge>
                  <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{generatedItinerary.budget || budget} Budget</Badge>
                  {generatedItinerary.totalCost !== undefined && (
                    <Badge className="border border-white/30 bg-white/60 text-slate-900 hover:bg-white/60">
                      {formatCost(generatedItinerary.totalCost)} total
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            {generatedItinerary.overview && (
              <CardContent className="pt-6 text-sm leading-6 text-slate-700">{generatedItinerary.overview}</CardContent>
            )}
          </Card>

          {itineraryDays.map((day) => {
            const renderedActivities = (day.activities || []).map((activity, index) => ({
              id: `${day.day ?? "day"}-${index}`,
              time: activity.time || "",
              name: activity.activity || activity.name || `Activity ${index + 1}`,
              description: activity.description || "",
              duration: activity.duration || "",
              location: activity.location || "",
              category: index === 0 ? "Sightseeing" : "Activity",
              cost: formatCost(activity.cost),
              tips: activity.tips,
            }))

            return (
              <Card key={`${day.day ?? "day"}-${day.title ?? "itinerary"}`} className="border border-white/30 bg-white/35 text-slate-900 shadow-2xl shadow-orange-100/20 backdrop-blur-xl">
                <CardHeader className="border-b border-white/20">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Day {day.day ?? ""}</p>
                      <CardTitle className="mt-2 text-xl text-slate-950">{day.title || `Day ${day.day}`}</CardTitle>
                    </div>
                    {day.accommodation && <Badge className="border border-white/30 bg-white/60 text-slate-900 hover:bg-white/60">{day.accommodation}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  {renderedActivities.map((activity, index) => (
                    <AIItineraryCard
                      key={activity.id}
                      activity={activity}
                      isFirst={index === 0}
                      isLast={index === renderedActivities.length - 1}
                    />
                  ))}

                  {day.meals && day.meals.length > 0 && (
                    <div className="grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 sm:grid-cols-3">
                      {day.meals.map((meal, index) => (
                        <div key={`${day.day}-meal-${index}`}>
                          <p className="text-xs uppercase tracking-wide text-slate-600">Meal {index + 1}</p>
                          <p className="mt-1 text-sm text-slate-900">{meal}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {day.tips && day.tips.length > 0 && (
                    <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/70 p-4">
                      <p className="mb-2 text-xs uppercase tracking-wide text-orange-700">Day tips</p>
                      <ul className="space-y-2 text-sm text-slate-800">
                        {day.tips.map((tip, index) => (
                          <li key={`${day.day}-tip-${index}`}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {generatedItinerary.essentialInfo && (
            <Card className="border border-white/15 bg-white/6 text-slate-900 shadow-2xl shadow-orange-100/10 backdrop-blur-md">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-xl text-slate-950">Travel essentials</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                {generatedItinerary.essentialInfo.bestTimeToVisit && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-600">Best time to visit</p>
                    <p className="mt-1 text-sm text-slate-900">{generatedItinerary.essentialInfo.bestTimeToVisit}</p>
                  </div>
                )}
                {generatedItinerary.essentialInfo.howToReach && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-600">How to reach</p>
                    <p className="mt-1 text-sm text-slate-900">{generatedItinerary.essentialInfo.howToReach}</p>
                  </div>
                )}
                {generatedItinerary.essentialInfo.localTransport && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-600">Local transport</p>
                    <p className="mt-1 text-sm text-slate-900">{generatedItinerary.essentialInfo.localTransport}</p>
                  </div>
                )}
                {generatedItinerary.essentialInfo.thingsToPack && generatedItinerary.essentialInfo.thingsToPack.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-600">Things to pack</p>
                    <p className="mt-1 text-sm text-slate-900">{generatedItinerary.essentialInfo.thingsToPack.join(", ")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="border-white/30 bg-white/60 text-slate-900 hover:bg-white/80 hover:text-slate-900"
              onClick={() => setGeneratedItinerary(null)}
            >
              Clear itinerary
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIPromptInterface