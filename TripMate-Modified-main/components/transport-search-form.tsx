"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, ArrowLeftRight, MapPin } from "lucide-react"
import type { TransportSearchParams } from "@/app/transport/page"

interface TransportSearchFormProps {
  onSearch: (params: TransportSearchParams) => void
}

const popularCities = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Ahmedabad", "Jaipur", "Goa", "Manali", "Shimla",
  "Udaipur", "Varanasi", "Amritsar", "Agra", "Darjeeling", "Ooty"
]

export function TransportSearchForm({ onSearch }: TransportSearchFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way")
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)

  const getFilteredCities = (query: string) => {
    if (!query) return popularCities
    return popularCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    )
  }

  const fromSuggestions = getFilteredCities(from)
  const toSuggestions = getFilteredCities(to)

  const handleSwap = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!from || !to || !date) return

    onSearch({
      from,
      to,
      date,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      passengers: parseInt(passengers),
      tripType,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip Type */}
      <RadioGroup value={tripType} onValueChange={(value) => setTripType(value as any)}>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="one-way" id="one-way" />
            <Label htmlFor="one-way">One Way</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="round-trip" id="round-trip" />
            <Label htmlFor="round-trip">Round Trip</Label>
          </div>
        </div>
      </RadioGroup>

      {/* From & To */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        <div className="space-y-2 relative">
          <Label htmlFor="from">From</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="from"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value)
                setShowFromSuggestions(true)
              }}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              placeholder="Enter origin city"
              className="pl-9"
              required
            />
          </div>
          {showFromSuggestions && from && fromSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
              {fromSuggestions.slice(0, 8).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setFrom(city)
                    setShowFromSuggestions(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{city}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleSwap}
          className="mb-0"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>

        <div className="space-y-2 relative">
          <Label htmlFor="to">To</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="to"
              value={to}
              onChange={(e) => {
                setTo(e.target.value)
                setShowToSuggestions(true)
              }}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              placeholder="Enter destination city"
              className="pl-9"
              required
            />
          </div>
          {showToSuggestions && to && toSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
              {toSuggestions.slice(0, 8).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setTo(city)
                    setShowToSuggestions(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{city}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Departure Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {tripType === "round-trip" && (
          <div className="space-y-2">
            <Label htmlFor="returnDate">Return Date</Label>
            <Input
              id="returnDate"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={date || new Date().toISOString().split('T')[0]}
              required={tripType === "round-trip"}
            />
          </div>
        )}
      </div>

      {/* Passengers */}
      <div className="space-y-2">
        <Label htmlFor="passengers">Passengers</Label>
        <Select value={passengers} onValueChange={setPassengers}>
          <SelectTrigger id="passengers" className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? "Passenger" : "Passengers"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" className="w-full gap-2">
        <Search className="h-5 w-5" />
        Search Transport Options
      </Button>
    </form>
  )
}
