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

interface CabBookingProps {
  from?: string
  to?: string
  passengers?: number
}

const cabModes = ["uber-go", "ola-mini", "taxi", "uber-premier"] as const

export default function CabBooking({ from = "", to = "", passengers = 1 }: CabBookingProps) {
  const [pickupLocation, setPickupLocation] = useState(from)
  const [dropLocation, setDropLocation] = useState(to)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [booking, setBooking] = useState<{ id: string; mode: string; eta: number; fare: number } | null>(null)
  const [pickupCoords, setPickupCoords] = useState<{lat:number;lng:number}|null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [liveTime, setLiveTime] = useState<string | null>(null)
  const refreshRef = useRef<number | null>(null)

  const displayPickup = useCurrentLocation ? "📍 Current Location" : pickupLocation
  const distance = useMemo(() => estimateDistance(pickupLocation || "", dropLocation || ""), [pickupLocation, dropLocation])

  const options: TransportFare[] = useMemo(() => {
    return cabModes.map((mode) => calculateFare(mode as any, distance, liveTime || undefined))
  }, [distance, liveTime])

  useEffect(() => {
    const updateTime = () => setLiveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    updateTime()
    const id = window.setInterval(updateTime, 10000)
    refreshRef.current = id
    return () => { if (refreshRef.current) window.clearInterval(refreshRef.current) }
  }, [])

  const handleCurrentLocation = () => {
    setUseCurrentLocation(!useCurrentLocation)
    if (!useCurrentLocation) {
      // In a real app, you'd get the user's actual location via geolocation API
      setPickupLocation("Current Location")
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setPickupCoords({ lat, lng })
          const dest = await geocodeDestination(`${lat},${lng}`)
          if (dest) setPickupLocation(dest.name)
        }, (err) => console.warn('Geolocation error', err), { enableHighAccuracy: true })
      }
    } else {
      setPickupLocation("")
      setPickupCoords(null)
    }
  }

  // suggestions for pickup name
  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!pickupLocation || pickupLocation.toLowerCase().includes('current') || pickupLocation.trim().length < 2) {
        setSuggestions([])
        return
      }
      setLoadingSuggestions(true)
      const geo = await geocodeDestination(pickupLocation)
      if (geo && mounted) {
        const nearby = await searchNearbyPlaces(geo.location, 'restaurant')
        if (mounted) setSuggestions(nearby.slice(0,6))
      }
      setLoadingSuggestions(false)
    })()
    return () => { mounted = false }
  }, [pickupLocation])

  const handleBook = (option: TransportFare) => {
    const id = `BK-${Math.random().toString(36).slice(2, 9).toUpperCase()}`
    const eta = Math.floor(2 + Math.random() * 8)
    setBooking({ id, mode: option.mode, eta, fare: option.estimatedFare })
  }

  const isValid = (useCurrentLocation || pickupLocation) && dropLocation

  return (
    <section className="mb-6">
      {/* Location Selection */}
      <Card className="mb-4 border border-white/10 bg-white/5">
        <CardContent className="p-4">
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
        <div className="space-y-3">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{displayPickup} → {dropLocation} • {distance} km</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {options.map((opt) => (
              <Card key={opt.mode} className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{opt.mode.replace(/-/g, ' ').toUpperCase()}</p>
                      <p className="text-sm text-slate-600 mt-1">{opt.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatFare(opt.estimatedFare)}</div>
                      <div className="text-xs text-slate-600">{opt.estimatedTime}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      ETA: 2–10 min
                    </div>
                    <div className="flex items-center gap-2">
                      <a rel="noreferrer" target="_blank" href={buildProviderUrl(opt.mode, pickupCoords, null, pickupLocation, dropLocation)} className="text-sm text-blue-600 hover:underline">Open provider</a>
                      <Button size="sm" onClick={() => handleBook(opt)}>Book</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Booking Confirmation */}
      {booking && (
        <Card className="mt-4 border-white/10 bg-white/6">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">✓ Booking confirmed</p>
            <p className="font-semibold mt-1">{booking.mode}</p>
            <p className="text-sm text-slate-600 mt-2">Reference: {booking.id}</p>
            <p className="text-sm text-slate-600">ETA: {booking.eta} minutes • Fare: {formatFare(booking.fare)}</p>
            <Button size="sm" variant="outline" onClick={() => setBooking(null)} className="mt-3 w-full">
              Book Another Ride
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
