"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plane, Train, Bus, Clock, IndianRupee, Star, Wifi, Coffee, Zap, AlertCircle, ExternalLink } from "lucide-react"
import type { TransportSearchParams } from "@/app/transport/page"
import { getDemandMultiplier, getHolidayMultiplier } from "@/lib/pricing"

interface TransportOption {
  id: string
  type: "flight" | "train" | "bus"
  operator: string
  departure: string
  arrival: string
  duration: string
  price: number
  originalPrice?: number
  class: string
  seats: number
  amenities: string[]
  rating: number
  stops?: number
}

const getBookingLinks = (type: string, searchParams: TransportSearchParams) => {
  const { from, to, date } = searchParams
  
  switch (type) {
    case 'flight':
      return [
        { name: 'MakeMyTrip', url: `https://www.makemytrip.com/flight/search?from=${from}&to=${to}&date=${date}`, primary: true },
        { name: 'Cleartrip', url: `https://www.cleartrip.com/flights/results?from=${from}&to=${to}&depart_date=${date}` },
        { name: 'Goibibo', url: `https://www.goibibo.com/flights/?from=${from}&to=${to}&date=${date}` },
      ]
    case 'train':
      return [
        { name: 'IRCTC', url: 'https://www.irctc.co.in/nget/train-search', primary: true },
        { name: 'RailYatri', url: `https://www.railyatri.in/train-ticket/trains-from-${from}-to-${to}` },
        { name: 'ConfirmTkt', url: 'https://www.confirmtkt.com/trains' },
      ]
    case 'bus':
      return [
        { name: 'RedBus', url: `https://www.redbus.in/bus-tickets/${from.toLowerCase()}-to-${to.toLowerCase()}`, primary: true },
        { name: 'AbhiBus', url: `https://www.abhibus.com/${from.toLowerCase()}-to-${to.toLowerCase()}-bus` },
        { name: 'MakeMyTrip', url: `https://www.makemytrip.com/bus-tickets/${from.toLowerCase()}-to-${to.toLowerCase()}` },
      ]
    default:
      return []
  }
}

interface TransportResultsProps {
  searchParams: TransportSearchParams
}

export function TransportResults({ searchParams }: TransportResultsProps) {
  const [results, setResults] = useState<TransportOption[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"price" | "duration" | "rating">("price")

  useEffect(() => {
    // Simulate fetching results
    const fetchResults = () => {
      setLoading(true)
      
      // Calculate dynamic pricing
      const demandMultiplier = getDemandMultiplier()
      const holidayMultiplier = getHolidayMultiplier()
      const priceMultiplier = demandMultiplier * holidayMultiplier

      // Generate mock results
      const mockResults: TransportOption[] = [
        // Flights
        {
          id: "f1",
          type: "flight",
          operator: "IndiGo",
          departure: "06:00",
          arrival: "08:15",
          duration: "2h 15m",
          price: Math.round(3500 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 3500 : undefined,
          class: "Economy",
          seats: 12,
          amenities: ["Wifi", "Meal"],
          rating: 4.3,
          stops: 0,
        },
        {
          id: "f2",
          type: "flight",
          operator: "Air India",
          departure: "09:30",
          arrival: "12:00",
          duration: "2h 30m",
          price: Math.round(4200 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 4200 : undefined,
          class: "Economy",
          seats: 8,
          amenities: ["Wifi", "Meal", "Entertainment"],
          rating: 4.5,
          stops: 0,
        },
        {
          id: "f3",
          type: "flight",
          operator: "SpiceJet",
          departure: "14:45",
          arrival: "17:15",
          duration: "2h 30m",
          price: Math.round(2900 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 2900 : undefined,
          class: "Economy",
          seats: 20,
          amenities: ["Snacks"],
          rating: 4.0,
          stops: 0,
        },
        // Trains
        {
          id: "t1",
          type: "train",
          operator: "Rajdhani Express",
          departure: "16:00",
          arrival: "06:30",
          duration: "14h 30m",
          price: Math.round(1800 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 1800 : undefined,
          class: "AC 2-Tier",
          seats: 15,
          amenities: ["Meals", "Bedding", "Wifi"],
          rating: 4.4,
          stops: 2,
        },
        {
          id: "t2",
          type: "train",
          operator: "Shatabdi Express",
          departure: "06:00",
          arrival: "14:30",
          duration: "8h 30m",
          price: Math.round(1200 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 1200 : undefined,
          class: "AC Chair Car",
          seats: 25,
          amenities: ["Meals", "Wifi"],
          rating: 4.2,
          stops: 4,
        },
        {
          id: "t3",
          type: "train",
          operator: "Duronto Express",
          departure: "21:30",
          arrival: "10:00",
          duration: "12h 30m",
          price: Math.round(900 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 900 : undefined,
          class: "AC 3-Tier",
          seats: 30,
          amenities: ["Meals", "Bedding"],
          rating: 4.0,
          stops: 1,
        },
        // Buses
        {
          id: "b1",
          type: "bus",
          operator: "Volvo AC Sleeper",
          departure: "20:00",
          arrival: "08:00",
          duration: "12h",
          price: Math.round(1200 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 1200 : undefined,
          class: "AC Sleeper",
          seats: 10,
          amenities: ["AC", "Blanket", "Charging"],
          rating: 4.3,
          stops: 3,
        },
        {
          id: "b2",
          type: "bus",
          operator: "RedBus Premium",
          departure: "22:30",
          arrival: "10:30",
          duration: "12h",
          price: Math.round(1500 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 1500 : undefined,
          class: "Premium Sleeper",
          seats: 6,
          amenities: ["AC", "WiFi", "Entertainment", "Blanket"],
          rating: 4.6,
          stops: 2,
        },
        {
          id: "b3",
          type: "bus",
          operator: "Karnataka SRTC",
          departure: "19:00",
          arrival: "07:30",
          duration: "12h 30m",
          price: Math.round(800 * priceMultiplier),
          originalPrice: priceMultiplier > 1 ? 800 : undefined,
          class: "AC Seater",
          seats: 18,
          amenities: ["AC", "Charging"],
          rating: 3.9,
          stops: 5,
        },
      ]

      setTimeout(() => {
        setResults(mockResults)
        setLoading(false)
      }, 800)
    }

    fetchResults()
  }, [searchParams])

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "duration":
        return parseFloat(a.duration) - parseFloat(b.duration)
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const flights = sortedResults.filter(r => r.type === "flight")
  const trains = sortedResults.filter(r => r.type === "train")
  const buses = sortedResults.filter(r => r.type === "bus")

  const getIcon = (type: string) => {
    switch (type) {
      case "flight": return Plane
      case "train": return Train
      case "bus": return Bus
      default: return Bus
    }
  }

  const renderOptions = (options: TransportOption[]) => (
    <div className="space-y-4">
      {options.map((option) => {
        const Icon = getIcon(option.type)
        const hasDiscount = option.originalPrice && option.originalPrice > option.price
        const bookingLinks = getBookingLinks(option.type, searchParams)

        return (
          <Card key={option.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Time & Duration */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{option.operator}</h3>
                    <div className="flex items-center gap-1 ml-auto md:ml-0">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{option.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <p className="text-2xl font-bold">{option.departure}</p>
                      <p className="text-sm text-muted-foreground">{searchParams.from}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                      <p className="text-sm font-medium">{option.duration}</p>
                      {option.stops !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          {option.stops === 0 ? "Non-stop" : `${option.stops} stop${option.stops > 1 ? 's' : ''}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{option.arrival}</p>
                      <p className="text-sm text-muted-foreground">{searchParams.to}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{option.class}</Badge>
                    {option.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="gap-1">
                        {amenity === "Wifi" && <Wifi className="h-3 w-3" />}
                        {amenity === "Meal" && <Coffee className="h-3 w-3" />}
                        {amenity === "Entertainment" && <Zap className="h-3 w-3" />}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right: Price & Booking */}
                <div className="md:w-48 flex flex-col justify-between items-end border-l pl-6">
                  <div className="text-right">
                    {hasDiscount && (
                      <p className="text-sm text-muted-foreground line-through">
                        ₹{option.originalPrice?.toLocaleString('en-IN')}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-primary mb-1">
                      ₹{option.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">per person</p>
                    {option.seats < 10 && (
                      <Badge variant="destructive" className="text-xs gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Only {option.seats} left
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2 mt-4">
                    {bookingLinks[0] && (
                      <Button className="w-full" asChild>
                        <a
                          href={bookingLinks[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Book on {bookingLinks[0].name}
                        </a>
                      </Button>
                    )}
                    {bookingLinks.length > 1 && (
                      <div className="grid grid-cols-2 gap-2">
                        {bookingLinks.slice(1).map((link) => (
                          <Button key={link.name} variant="outline" size="sm" asChild>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.name}
                            </a>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {options.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No options available for this route</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Searching for best options...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Summary */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {searchParams.from} → {searchParams.to}
              </CardTitle>
              <p className="text-muted-foreground">
                {new Date(searchParams.date).toLocaleDateString('en-IN', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
                {searchParams.returnDate && ` - ${new Date(searchParams.returnDate).toLocaleDateString('en-IN', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}`}
                {" • "}{searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSortBy("price")}>
                Cheapest
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSortBy("duration")}>
                Fastest
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSortBy("rating")}>
                Best Rated
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({results.length})</TabsTrigger>
          <TabsTrigger value="flights" className="gap-2">
            <Plane className="h-4 w-4" />
            Flights ({flights.length})
          </TabsTrigger>
          <TabsTrigger value="trains" className="gap-2">
            <Train className="h-4 w-4" />
            Trains ({trains.length})
          </TabsTrigger>
          <TabsTrigger value="buses" className="gap-2">
            <Bus className="h-4 w-4" />
            Buses ({buses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderOptions(sortedResults)}
        </TabsContent>

        <TabsContent value="flights">
          {renderOptions(flights)}
        </TabsContent>

        <TabsContent value="trains">
          {renderOptions(trains)}
        </TabsContent>

        <TabsContent value="buses">
          {renderOptions(buses)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
