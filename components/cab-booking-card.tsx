"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Car, Clock, IndianRupee, MapPin, Calendar, Users, 
  Zap, Shield, Star, Phone, CheckCircle2, ExternalLink 
} from "lucide-react"
import { 
  getRecommendedTransport, 
  getTransportModeName, 
  type TransportMode 
} from "@/lib/transport-service"

const popularCities = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Ahmedabad", "Jaipur", "Goa", "Manali", "Shimla"
]

export function CabBookingCard() {
  const [bookingType, setBookingType] = useState<"local" | "outstation">("local")
  const [pickup, setPickup] = useState("")
  const [drop, setDrop] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [distance, setDistance] = useState(10)
  const [selectedCab, setSelectedCab] = useState<TransportMode>("uber-go")
  const [showResults, setShowResults] = useState(false)
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropSuggestions, setShowDropSuggestions] = useState(false)

  const getFilteredCities = (query: string) => {
    if (!query) return popularCities
    return popularCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    )
  }

  const pickupSuggestions = getFilteredCities(pickup)
  const dropSuggestions = getFilteredCities(drop)

  const handleGetQuote = () => {
    if (!pickup || !drop || !date || !time) return
    setShowResults(true)
  }

  const cabOptions = bookingType === "local" 
    ? ["uber-go", "ola-mini", "auto-rickshaw", "app-bike", "uber-premier", "ola-sedan"]
    : ["uber-go", "ola-mini", "taxi", "rental-car", "uber-premier", "ola-sedan"]

  const routes = pickup && drop 
    ? getRecommendedTransport(pickup, drop, distance, time)
    : null

  const filteredOptions = routes?.options.filter(opt => 
    cabOptions.includes(opt.mode as string)
  ) || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Book a Cab
          </CardTitle>
          <CardDescription>
            Get instant quotes from Uber, Ola, and local cab services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Type */}
          <RadioGroup value={bookingType} onValueChange={(v) => setBookingType(v as any)}>
            <div className="grid grid-cols-2 gap-4">
              <label
                htmlFor="local"
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  bookingType === "local" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value="local" id="local" />
                <div>
                  <p className="font-medium">Local Trip</p>
                  <p className="text-xs text-muted-foreground">Within city</p>
                </div>
              </label>
              <label
                htmlFor="outstation"
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  bookingType === "outstation" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value="outstation" id="outstation" />
                <div>
                  <p className="font-medium">Outstation</p>
                  <p className="text-xs text-muted-foreground">Between cities</p>
                </div>
              </label>
            </div>
          </RadioGroup>

          {/* Location Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <Label htmlFor="pickup">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pickup"
                  value={pickup}
                  onChange={(e) => {
                    setPickup(e.target.value)
                    setShowPickupSuggestions(true)
                  }}
                  onFocus={() => setShowPickupSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                  placeholder="Enter pickup location"
                  className="pl-9"
                  required
                />
              </div>
              {showPickupSuggestions && pickup && pickupSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {pickupSuggestions.slice(0, 8).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setPickup(city)
                        setShowPickupSuggestions(false)
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

            <div className="space-y-2 relative">
              <Label htmlFor="drop">Drop Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="drop"
                  value={drop}
                  onChange={(e) => {
                    setDrop(e.target.value)
                    setShowDropSuggestions(true)
                  }}
                  onFocus={() => setShowDropSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDropSuggestions(false), 200)}
                  placeholder="Enter destination"
                  className="pl-9"
                  required
                />
              </div>
              {showDropSuggestions && drop && dropSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {dropSuggestions.slice(0, 8).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setDrop(city)
                        setShowDropSuggestions(false)
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

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Pickup Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Pickup Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Distance (for outstation) */}
          {bookingType === "outstation" && (
            <div className="space-y-2">
              <Label htmlFor="distance">Estimated Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                min="10"
                max="1000"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value) || 10)}
              />
            </div>
          )}

          <Button onClick={handleGetQuote} className="w-full" size="lg">
            Get Quotes
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && filteredOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Cabs</CardTitle>
            <CardDescription>
              {pickup} → {drop} • {distance} km
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredOptions.map((option) => (
              <div
                key={option.mode}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                  selectedCab === option.mode ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setSelectedCab(option.mode)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">{getTransportModeName(option.mode)}</h4>
                      {option.mode.includes('uber') && (
                        <Badge variant="secondary" className="text-xs">Uber</Badge>
                      )}
                      {option.mode.includes('ola') && (
                        <Badge variant="secondary" className="text-xs">Ola</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {option.description}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {option.estimatedTime}
                      </span>
                      <Badge 
                        variant={option.availability === 'high' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {option.availability === 'high' ? '✓ Available' : 'Limited'}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-1">
                      ₹{option.estimatedFare.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Estimated fare
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t space-y-2">
              {selectedCab.includes('uber') && (
                <Button className="w-full" size="lg" asChild>
                  <a
                    href="https://m.uber.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Book on Uber App
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {selectedCab.includes('ola') && (
                <Button className="w-full" size="lg" asChild>
                  <a
                    href="https://book.olacabs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Book on Ola App
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {!selectedCab.includes('uber') && !selectedCab.includes('ola') && (
                <>
                  <Button className="w-full" size="lg" asChild>
                    <a
                      href="https://m.uber.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Book on Uber
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button className="w-full" variant="outline" size="lg" asChild>
                    <a
                      href="https://book.olacabs.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Book on Ola
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {[
                { icon: Zap, label: "Instant Booking" },
                { icon: Shield, label: "Safe & Secure" },
                { icon: Star, label: "Top Rated Drivers" },
                { icon: CheckCircle2, label: "No Hidden Charges" },
              ].map((feature) => (
                <div key={feature.label} className="flex items-center gap-2 text-sm">
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{feature.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Why Book With Us */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">Why Book Cabs With Us?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">💰 Best Prices</h4>
              <p className="text-sm text-muted-foreground">
                Compare fares from multiple providers and get the best deal
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚡ Quick Booking</h4>
              <p className="text-sm text-muted-foreground">
                Book your cab in under 2 minutes with instant confirmation
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🛡️ Safe Travel</h4>
              <p className="text-sm text-muted-foreground">
                Verified drivers, GPS tracking, and 24/7 customer support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
