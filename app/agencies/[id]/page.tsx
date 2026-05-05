"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AgencyCard } from "@/components/agency-card"
import { AgencyBookingForm } from "@/components/agency-booking-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Star, MapPin, ShieldCheck, Phone, Mail, Globe, Calendar,
  Users, IndianRupee, MessageSquare, ArrowRight, Clock, CheckCircle2,
  Building2
} from "lucide-react"
import { getAgencyById, mockAgencies } from "@/lib/agency-data"

export default function AgencyDetailPage() {
  const params = useParams()
  const agency = getAgencyById(params.id as string)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedDest, setSelectedDest] = useState("")

  if (!agency) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-40" />
            <h2 className="text-xl font-semibold mb-2">Agency Not Found</h2>
            <Link href="/agencies"><Button variant="outline">Back to Directory</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const similarAgencies = mockAgencies
    .filter(a => a.id !== agency.id && a.specializations.some(s => agency.specializations.includes(s)))
    .slice(0, 3)

  const openBooking = (dest?: string) => {
    setSelectedDest(dest || agency.destinations[0])
    setBookingOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Cover */}
        <div className="relative h-56 md:h-72 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${agency.coverImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Profile header */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 mb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-5">
              <div className="h-24 w-24 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-4 border-background flex items-center justify-center text-3xl font-bold text-orange-600 shrink-0">
                {agency.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold">{agency.name}</h1>
                  {agency.verified && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                  {agency.featured && (
                    <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">★ Featured</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">{agency.tagline}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {agency.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Since {agency.founded}</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {agency.rating} ({agency.reviewCount.toLocaleString()} reviews)
                  </span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {agency.totalBookings.toLocaleString()} bookings</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <MessageSquare className="h-4 w-4" /> Chat
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => openBooking()}>
                  <IndianRupee className="h-4 w-4" /> Book Now
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 pb-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-3">About</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{agency.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {agency.specializations.map(s => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Destinations */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-3">Destinations Served</h2>
                  <div className="flex flex-wrap gap-2">
                    {agency.destinations.map(d => (
                      <Badge
                        key={d}
                        className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-colors"
                        onClick={() => openBooking(d)}
                      >
                        <MapPin className="h-3 w-3 mr-1" /> {d}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Trips */}
              {agency.trips.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Featured Trips</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {agency.trips.map(trip => (
                        <div key={trip.id} className="rounded-xl overflow-hidden border border-border/50 group agency-card-hover cursor-pointer" onClick={() => openBooking(trip.destination)}>
                          <div className="relative h-36 overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${trip.image})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="text-white font-semibold text-sm">{trip.title}</h3>
                              <div className="flex items-center gap-3 text-white/70 text-xs mt-1">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {trip.duration}</span>
                                <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> ₹{trip.price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {trip.highlights.map((h, i) => (
                                <span key={i} className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
                  <div className="space-y-4">
                    {agency.reviews.map(review => (
                      <div key={review.id} className="flex gap-3 p-4 rounded-xl bg-muted/30 border border-border/30">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {review.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{review.userName}</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{review.tripDestination} · {new Date(review.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking CTA */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Ready to Book?</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Price Range</span>
                      <span className="font-medium text-foreground">₹{agency.priceRange.min.toLocaleString()} – ₹{agency.priceRange.max.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Service Fee</span>
                      <span className="font-medium text-foreground">{agency.commissionRate}%</span>
                    </div>
                  </div>
                  <Button className="w-full gap-2" onClick={() => openBooking()}>
                    Book Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold">Contact</h3>
                  <div className="space-y-2 text-sm">
                    <a href={`tel:${agency.contactPhone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" /> {agency.contactPhone}
                    </a>
                    <a href={`mailto:${agency.contactEmail}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" /> {agency.contactEmail}
                    </a>
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Trust */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold">Trust & Safety</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Identity Verified",
                      "Licensed Tour Operator",
                      `${agency.totalBookings.toLocaleString()}+ completed bookings`,
                      `${agency.rating} star rating`,
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Agencies */}
          {similarAgencies.length > 0 && (
            <div className="pb-12">
              <h2 className="text-xl font-bold mb-6">Similar Agencies</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarAgencies.map(a => (
                  <AgencyCard key={a.id} agency={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AgencyBookingForm
        agency={agency}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        preselectedDestination={selectedDest}
      />
    </div>
  )
}
