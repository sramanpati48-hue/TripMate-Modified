"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateFare, estimateDistance, formatFare, type TransportFare } from "@/lib/transport-service"
import { geocodeDestination, searchNearbyPlaces } from "@/lib/google-maps-service"
import { buildProviderUrl } from "@/lib/ride-links"
import { Clock, MapPin, Navigation } from "lucide-react"

export default function CabBookingStandalone() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropLocation, setDropLocation] = useState("")
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [booking, setBooking] = useState<{ id: string; mode: string; eta: number; fare: number } | null>(null)

  const [pickupCoords, setPickupCoords] = useState<{lat:number;lng:number}|null>(null)
  const [suggestions, setSuggestions] = useState<Array<any>>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [liveTime, setLiveTime] = useState<string | null>(null)
  const refreshRef = useRef<number | null>(null)

  const cabModes = ["uber-go", "ola-mini", "taxi", "uber-premier"] as const

  const displayPickup = useCurrentLocation ? "📍 Current Location" : pickupLocation
  const distance = useMemo(() => estimateDistance(pickupLocation || "", dropLocation || ""), [pickupLocation, dropLocation])

  const options: TransportFare[] = useMemo(() => {
    return cabModes.map((mode) => calculateFare(mode as any, distance, liveTime || undefined))
  }, [distance])

  // Update live time for surge calc and refresh fares periodically
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const id = window.setInterval(updateTime, 10000)
    refreshRef.current = id
    return () => { if (refreshRef.current) window.clearInterval(refreshRef.current) }
  }, [])

  const handleCurrentLocation = () => {
    setUseCurrentLocation(!useCurrentLocation)
    if (!useCurrentLocation) {
      setPickupLocation("Current Location")
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude
            setPickupCoords({ lat, lng })

            // optionally reverse-geocode to a friendly name
            const dest = await geocodeDestination(`${lat},${lng}`)
            if (dest) setPickupLocation(dest.name)
          },
          (err) => {
            console.warn('Geolocation error', err)
          },
          { enableHighAccuracy: true, timeout: 8000 }
        )
      }
    } else {
      setPickupLocation("")
      setPickupCoords(null)
    }
  }

  const handleBook = (option: TransportFare) => {
    const id = `BK-${Math.random().toString(36).slice(2, 9).toUpperCase()}`
    const eta = Math.floor(2 + Math.random() * 8)
    setBooking({ id, mode: option.mode, eta, fare: option.estimatedFare })
  }

  const isValid = (useCurrentLocation || pickupLocation) && dropLocation

  // provider deep link builder is `buildProviderUrl` (imported)

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold tracking-wider text-slate-600 uppercase">Quick Rides</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Book Your Cab
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
            Get affordable rides from any location. Compare fares and book instantly.
          </p>
        </div>

        {/* Location Selection */}
        <Card className="mb-6 border border-white/10 bg-white/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Pickup Location */}
              <div>
                <Label className="text-sm text-slate-600 mb-2 block">Pickup Location</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={pickupLocation}
                        onChange={(e) => {
                          setPickupLocation(e.target.value)
                          setUseCurrentLocation(false)
                        }}
                        placeholder="Enter pickup location"
                        disabled={useCurrentLocation}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant={useCurrentLocation ? "default" : "outline"}
                      size="sm"
                      onClick={handleCurrentLocation}
                      className="gap-1"
                    >
                      <Navigation className="h-4 w-4" />
                      Current
                    </Button>
                  </div>
                </div>
              </div>

              {/* Drop Location */}
              <div>
                <Label className="text-sm text-slate-600 mb-2 block">Drop Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    placeholder="Enter drop location"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cab Options */}
        {isValid && (
          <div className="space-y-6">
            <div className="text-sm text-slate-600 flex items-center gap-2 p-4 rounded-lg bg-slate-50">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{displayPickup} → {dropLocation} • {distance} km</span>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Available Cabs</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {options.map((opt) => (
                  <Card key={opt.mode} className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-slate-900">{opt.mode.replace(/-/g, ' ').toUpperCase()}</p>
                          <p className="text-sm text-slate-600 mt-1">{opt.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{formatFare(opt.estimatedFare)}</div>
                          <div className="text-xs text-slate-600">{opt.estimatedTime}</div>
                        </div>
                      </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock className="h-4 w-4" />
                                ETA: 2–10 min
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  rel="noreferrer"
                                  target="_blank"
                                  href={buildProviderUrl(opt.mode, pickupCoords, null, pickupLocation, dropLocation)}
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Open provider
                                </a>
                                <Button size="sm" onClick={() => handleBook(opt)}>Book</Button>
                              </div>
                            </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Booking Confirmation */}
        {booking && (
          <Card className="mt-6 border-white/10 bg-white/6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-2">✓</div>
                <p className="text-sm text-slate-600 mb-1">Booking confirmed!</p>
                <p className="font-bold text-xl mb-4">{booking.mode}</p>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <p>Reference: <span className="font-mono font-semibold text-slate-900">{booking.id}</span></p>
                  <p>ETA: {booking.eta} minutes • Fare: {formatFare(booking.fare)}</p>
                </div>
                <Button onClick={() => setBooking(null)} variant="outline" className="w-full">
                  Book Another Ride
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
