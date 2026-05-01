"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  ArrowRightLeft,
  AlertCircle,
  Bus,
  Clock,
  Coffee,
  IndianRupee,
  MapPin,
  Plane,
  Search,
  Sparkles,
  Star,
  Train,
  Wifi,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  calculateFare,
  estimateDistance,
  formatFare,
  getCheapestOption,
  getFastestOption,
  getRecommendedTransport,
  getTransportModeName,
  type TransportFare,
  type TransportMode,
  type TransportRoute,
} from "@/lib/transport-service"
import { getCurrentPricingFactors } from "@/lib/pricing"

const cabModes: TransportMode[] = ["uber-go", "ola-mini", "auto-rickshaw", "taxi", "uber-premier"]

const iconByMode: Record<TransportMode, typeof Plane> = {
  flight: Plane,
  train: Train,
  bus: Bus,
  metro: Train,
  "auto-rickshaw": Bus,
  taxi: Bus,
  "ola-mini": Bus,
  "ola-sedan": Bus,
  "uber-go": Bus,
  "uber-premier": Bus,
  "local-bus": Bus,
  "app-bike": Zap,
  "rental-car": Bus,
  none: Bus,
}

const amenityIcons: Record<string, typeof Wifi> = {
  Wifi,
  WiFi: Wifi,
  Meal: Coffee,
  Snacks: Coffee,
  Entertainment: Sparkles,
  AC: Sparkles,
  Blanket: Sparkles,
  Charging: Zap,
}

const availabilityClasses: Record<TransportFare["availability"], string> = {
  high: "bg-emerald-500/15 text-emerald-900 border-emerald-500/20",
  medium: "bg-amber-500/15 text-amber-900 border-amber-500/20",
  low: "bg-rose-500/15 text-rose-900 border-rose-500/20",
}

const amenitiesByMode: Record<TransportMode, string[]> = {
  flight: ["WiFi", "Meal", "Entertainment"],
  train: ["WiFi", "Meal", "Charging"],
  bus: ["AC", "Snacks"],
  metro: ["Fast boarding", "High frequency"],
  "auto-rickshaw": ["Quick hop", "Flexible pickup"],
  taxi: ["Doorstep pickup", "AC"],
  "ola-mini": ["AC", "Budget-friendly"],
  "ola-sedan": ["AC", "More luggage space"],
  "uber-go": ["AC", "Wide availability"],
  "uber-premier": ["AC", "Premium interior"],
  "local-bus": ["Budget-friendly", "City coverage"],
  "app-bike": ["Beat traffic", "Fast pickup"],
  "rental-car": ["Driver included", "Full day use"],
  none: ["Walking pace"],
}

const ratingByMode: Record<TransportMode, number> = {
  flight: 4.8,
  train: 4.7,
  bus: 4.1,
  metro: 4.9,
  "auto-rickshaw": 4.0,
  taxi: 4.3,
  "ola-mini": 4.4,
  "ola-sedan": 4.6,
  "uber-go": 4.5,
  "uber-premier": 4.7,
  "local-bus": 4.0,
  "app-bike": 4.3,
  "rental-car": 4.6,
  none: 5.0,
}

const seatTextByMode: Record<TransportMode, string> = {
  flight: "18-40",
  train: "50+",
  bus: "12-40",
  metro: "100+",
  "auto-rickshaw": "3",
  taxi: "4",
  "ola-mini": "4",
  "ola-sedan": "4",
  "uber-go": "4",
  "uber-premier": "4",
  "local-bus": "20-40",
  "app-bike": "1",
  "rental-car": "4-7",
  none: "1",
}

const modeLabelClasses: Record<TransportMode, string> = {
  flight: "text-blue-700",
  train: "text-emerald-700",
  bus: "text-orange-700",
  metro: "text-emerald-700",
  "auto-rickshaw": "text-amber-700",
  taxi: "text-slate-700",
  "ola-mini": "text-indigo-700",
  "ola-sedan": "text-indigo-700",
  "uber-go": "text-indigo-700",
  "uber-premier": "text-violet-700",
  "local-bus": "text-orange-700",
  "app-bike": "text-cyan-700",
  "rental-car": "text-slate-700",
  none: "text-slate-700",
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  if (hours === 0) return `${remainder} min`
  return `${hours}h ${remainder}m`
}

function OptionCard({ option, highlight }: { option: TransportFare; highlight?: string }) {
  const Icon = iconByMode[option.mode]
  const amenities = amenitiesByMode[option.mode] ?? []
  const rating = ratingByMode[option.mode] ?? 4.2
  const seats = seatTextByMode[option.mode] ?? "n/a"

  return (
    <Card className="border border-white/20 bg-white/12 backdrop-blur-md shadow-xl shadow-orange-100/15">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/20 p-3 text-slate-950 shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className={`font-semibold ${modeLabelClasses[option.mode]}`}>{getTransportModeName(option.mode)}</p>
                {highlight ? <Badge className="border border-white/15 bg-white/10 text-slate-900">{highlight}</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-slate-600">{option.description}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-slate-950">{formatFare(option.estimatedFare)}</div>
            {option.originalPrice && option.originalPrice > option.price ? (
              <div className="text-xs text-slate-600 line-through">{formatFare(option.originalPrice)}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2 text-slate-500"><Clock className="h-4 w-4" /> Time</div>
            <div className="mt-1 font-semibold text-slate-950">{option.estimatedTime}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2 text-slate-500"><Star className="h-4 w-4" /> Rating</div>
            <div className="mt-1 font-semibold text-slate-950">{rating.toFixed(1)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2 text-slate-500"><AlertCircle className="h-4 w-4" /> Seats</div>
            <div className="mt-1 font-semibold text-slate-950">{seats} seats</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2 text-slate-500"><Sparkles className="h-4 w-4" /> Availability</div>
            <Badge className={`mt-1 border ${availabilityClasses[option.availability]}`}>{option.availability}</Badge>
          </div>
        </div>

        {amenities.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {amenities.map((amenity) => {
              const Amenity = amenityIcons[amenity] ?? Sparkles
              return (
                <Badge key={amenity} className="border border-white/12 bg-white/8 text-slate-700">
                  <Amenity className="mr-1 h-3.5 w-3.5" />
                  {amenity}
                </Badge>
              )
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

const TransportHero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"search" | "compare" | "cabs">("search")
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way")
  const [from, setFrom] = useState("Kolkata")
  const [to, setTo] = useState("Goa")
  const [submittedRoute, setSubmittedRoute] = useState<TransportRoute | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState("12:00")

  useEffect(() => {
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }, [])

  const pricing = getCurrentPricingFactors()
  const liveTime = currentTime
  const previewDistance = useMemo(() => estimateDistance(from.trim(), to.trim()), [from, to])
  const previewRoute = from.trim() && to.trim() ? getRecommendedTransport(from.trim(), to.trim(), previewDistance, liveTime) : null
  const route = submittedRoute ?? previewRoute
  const options = route?.options ?? []
  const cheapest = options.length > 0 ? getCheapestOption(options) : null
  const fastest = options.length > 0 ? getFastestOption(options) : null
  const topRated = options.length > 0 ? [...options].sort((a, b) => (ratingByMode[b.mode] ?? 0) - (ratingByMode[a.mode] ?? 0))[0] : null
  const featuredOptions = useMemo(() => {
    const picks: Array<{ label: string; option: TransportFare }> = []
    const seen = new Set<TransportMode>()

    for (const candidate of [
      cheapest && { label: "Cheapest live fare", option: cheapest },
      fastest && { label: "Fastest live option", option: fastest },
      topRated && { label: "Best-rated operator", option: topRated },
      ...options.map((option) => ({ label: "More live options", option })),
    ]) {
      if (!candidate || seen.has(candidate.option.mode)) continue
      seen.add(candidate.option.mode)
      picks.push(candidate)
      if (picks.length === 3) break
    }

    return picks
  }, [cheapest, fastest, options, topRated])

  const cabOptions = useMemo(() => {
    if (!from.trim() || !to.trim()) return []
    const distance = estimateDistance(from.trim(), to.trim())
    return cabModes
      .map((mode) => calculateFare(mode, distance, liveTime))
      .sort((a, b) => a.estimatedFare - b.estimatedFare)
  }, [from, to, liveTime])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!previewRoute) return
    setSubmittedRoute(previewRoute)
    setLastUpdated(new Date())
    setActiveTab("search")
  }

  return (
    <div className="relative min-h-[78vh] w-full overflow-hidden bg-transparent text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center opacity-100 saturate-125 brightness-110"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,246,235,0.10)_45%,rgba(255,250,243,0.18)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[50vh] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[44vh] bg-[linear-gradient(180deg,rgba(255,248,240,0.00)_0%,rgba(255,248,240,0.06)_100%)]" />
        <div className="absolute inset-x-0 top-[50vh] h-[50vh] origin-top scale-y-[-1] opacity-28 blur-[1px]">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
            muted
            playsInline
            autoPlay
            loop
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,240,0.12)_0%,rgba(255,248,240,0.82)_100%)]" />
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center px-6 pt-24 pb-12">
        <div className="mb-10 -mt-12 max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-700">All-In-One Transport</p>
          <h1 className="text-6xl font-normal leading-none tracking-tighter text-slate-500 md:text-7xl lg:text-8xl">Premium.</h1>
          <h1 className="-mt-3 text-6xl font-normal leading-none tracking-tighter text-slate-900 drop-shadow-sm md:text-7xl lg:text-8xl">Accessible.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-700 drop-shadow-sm md:text-xl">
            Compare fares for flights, trains, and buses. Book cabs for local travel. All in one place.
          </p>
        </div>

        <div className="mb-14 flex gap-4">
          <button className="rounded-full border border-white/15 bg-white/6 px-6 py-2.5 font-semibold text-slate-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/12">
            <Search className="mr-2 inline-block h-4 w-4" />
            Discover Routes
          </button>
          <button className="rounded-full bg-slate-900/90 px-6 py-2.5 font-semibold text-white shadow-lg shadow-slate-900/20 transition-colors hover:bg-slate-900">
            Book Now
          </button>
        </div>

        <div className="w-full max-w-[850px] rounded-[28px] border border-white/12 bg-white/3 p-4 shadow-2xl shadow-orange-100/10 backdrop-blur-sm md:p-8">
          <div className="mb-6 flex rounded-2xl border border-white/12 bg-white/6 p-1.5">
            {[
              { key: "search", label: "Search Transport" },
              { key: "compare", label: "Compare Fares" },
              { key: "cabs", label: "Book Cabs" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${activeTab === tab.key ? "bg-white/12 text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="px-2 pb-2 md:px-6 md:pb-6">
            <h3 className="mb-1 text-xl font-semibold text-slate-900">Where do you want to go?</h3>
            <p className="mb-6 text-sm text-slate-600">Search and compare prices for flights, trains, and buses across India</p>

            <div className="mb-6 flex gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${tripType === "one-way" ? "border-orange-500" : "border-slate-400"}`}>
                  {tripType === "one-way" ? <div className="h-2 w-2 rounded-full bg-orange-500" /> : null}
                </div>
                <span className="text-sm text-slate-700">One Way</span>
                <input type="radio" className="hidden" checked={tripType === "one-way"} onChange={() => setTripType("one-way")} />
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${tripType === "round-trip" ? "border-orange-500" : "border-slate-400"}`}>
                  {tripType === "round-trip" ? <div className="h-2 w-2 rounded-full bg-orange-500" /> : null}
                </div>
                <span className="text-sm text-slate-700">Round Trip</span>
                <input type="radio" className="hidden" checked={tripType === "round-trip"} onChange={() => setTripType("round-trip")} />
              </label>
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="w-full flex-1">
                <label className="mb-1.5 ml-1 block text-xs font-medium text-slate-500">From</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={from}
                    onChange={(event) => setFrom(event.target.value)}
                    placeholder="Enter origin city"
                    className="w-full rounded-xl border border-white/12 bg-white/5 py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 backdrop-blur-sm transition-colors focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/6 backdrop-blur-sm md:flex md:-mx-6 md:mt-6">
                <ArrowRightLeft className="h-4 w-4 text-slate-900" />
              </div>

              <div className="w-full flex-1">
                <label className="mb-1.5 ml-1 block text-xs font-medium text-slate-500">To</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                    placeholder="Enter destination city"
                    className="w-full rounded-xl border border-white/12 bg-white/5 py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 backdrop-blur-sm transition-colors focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                <Badge className="border border-white/12 bg-white/8 text-slate-700">{pricing.season} season</Badge>
                <Badge className="border border-white/12 bg-white/8 text-slate-700">Demand x{pricing.demandMultiplier.toFixed(1)}</Badge>
                <Badge className="border border-white/12 bg-white/8 text-slate-700">{pricing.isHoliday ? "Holiday rates" : pricing.isWeekend ? "Weekend rates" : "Live weekday rates"}</Badge>
              </div>

              <button className="rounded-xl bg-orange-500 px-8 py-3 font-bold text-black transition-colors hover:bg-orange-600">
                Search
              </button>
            </div>
          </form>

          <div className="px-2 pb-2 md:px-6 md:pb-6">
            {route ? (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-white/20 bg-white/12 px-4 py-3 shadow-sm backdrop-blur-md">
                    <p className="text-xs uppercase tracking-wide text-slate-600">Route</p>
                    <p className="mt-1 font-semibold text-slate-950">{route.from} → {route.to}</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/12 px-4 py-3 shadow-sm backdrop-blur-md">
                    <p className="text-xs uppercase tracking-wide text-slate-600">Distance</p>
                    <p className="mt-1 font-semibold text-slate-950">{route.distance} km</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/12 px-4 py-3 shadow-sm backdrop-blur-md">
                    <p className="text-xs uppercase tracking-wide text-slate-600">Travel time</p>
                    <p className="mt-1 font-semibold text-slate-950">{formatMinutes(route.estimatedDuration)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/12 px-4 py-3 shadow-sm backdrop-blur-md">
                    <p className="text-xs uppercase tracking-wide text-slate-600">Updated</p>
                    <p className="mt-1 font-semibold text-slate-950">{lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : liveTime}</p>
                  </div>
                </div>

                {activeTab === "search" ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {featuredOptions.map((item) => (
                      <OptionCard key={`${item.label}-${item.option.mode}`} option={item.option} highlight={item.label} />
                    ))}
                  </div>
                ) : null}

                {activeTab === "compare" ? (
                  <div className="grid gap-4">
                    {options.map((option) => (
                      <OptionCard key={`${option.mode}-${option.estimatedFare}-${option.estimatedTime}`} option={option} />
                    ))}
                  </div>
                ) : null}

                {activeTab === "cabs" ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {cabOptions.map((option) => (
                      <Card key={option.mode} className="border border-white/12 bg-white/5 backdrop-blur-sm shadow-lg shadow-orange-100/10">
                        <CardContent className="p-4 md:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={`font-semibold ${modeLabelClasses[option.mode]}`}>{getTransportModeName(option.mode)}</p>
                              <p className="mt-1 text-sm text-slate-600">{option.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-slate-900">{formatFare(option.estimatedFare)}</div>
                              <div className="text-xs text-slate-500">{option.estimatedTime}</div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className={`border ${availabilityClasses[option.availability]}`}>{option.availability} availability</Badge>
                            {((amenitiesByMode[option.mode] ?? []) as string[]).slice(0, 3).map((amenity) => (
                              <Badge key={amenity} className="border border-white/12 bg-white/8 text-slate-700">{amenity}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm text-slate-700 shadow-sm backdrop-blur-md">
                  <div className="flex items-center gap-2 font-medium text-slate-950">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    Live pricing
                  </div>
                  <p className="mt-1">{pricing.tooltip}. Estimates update from the current time, day-of-week demand, and holiday pricing.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-600">
                Enter origin and destination to see live fares, fastest routes, and cab pricing.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransportHero
