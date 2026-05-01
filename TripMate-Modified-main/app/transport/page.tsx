"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TransportSearchForm } from "@/components/transport-search-form"
import { TransportResults } from "@/components/transport-results"
import { CabBookingCard } from "@/components/cab-booking-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Train, Bus, Car, MapPin, IndianRupee } from "lucide-react"

export interface TransportSearchParams {
  from: string
  to: string
  date: string
  returnDate?: string
  passengers: number
  tripType: 'one-way' | 'round-trip'
}

export default function TransportPage() {
  const [searchParams, setSearchParams] = useState<TransportSearchParams | null>(null)
  const [activeTab, setActiveTab] = useState<string>("search")

  const handleSearch = (params: TransportSearchParams) => {
    setSearchParams(params)
    setActiveTab("results")
  }

  const stats = [
    {
      icon: Plane,
      label: "Flight Routes",
      value: "500+",
      color: "text-blue-600",
    },
    {
      icon: Train,
      label: "Train Routes",
      value: "1000+",
      color: "text-green-600",
    },
    {
      icon: Bus,
      label: "Bus Operators",
      value: "200+",
      color: "text-orange-600",
    },
    {
      icon: Car,
      label: "Cab Partners",
      value: "50K+",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-secondary/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-3">Transport & Bookings</h1>
              <p className="text-lg text-primary-foreground/90 mb-6">
                Compare fares for flights, trains, and buses. Book cabs for local travel. All in one place.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="bg-background/10 backdrop-blur-sm border-primary-foreground/20">
                    <CardContent className="p-4 text-center">
                      <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-primary-foreground/80">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
              <TabsTrigger value="search" className="gap-2">
                <MapPin className="h-4 w-4" />
                Search Transport
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!searchParams} className="gap-2">
                <IndianRupee className="h-4 w-4" />
                Compare Fares
              </TabsTrigger>
              <TabsTrigger value="cabs" className="gap-2">
                <Car className="h-4 w-4" />
                Book Cabs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Where do you want to go?</CardTitle>
                    <CardDescription>
                      Search and compare prices for flights, trains, and buses across India
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransportSearchForm onSearch={handleSearch} />
                  </CardContent>
                </Card>

                {/* Popular Routes */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Routes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { from: "Delhi", to: "Mumbai", price: "₹2,500" },
                        { from: "Bangalore", to: "Goa", price: "₹1,800" },
                        { from: "Mumbai", to: "Jaipur", price: "₹3,200" },
                        { from: "Delhi", to: "Manali", price: "₹800" },
                        { from: "Chennai", to: "Bangalore", price: "₹1,200" },
                        { from: "Kolkata", to: "Darjeeling", price: "₹1,500" },
                      ].map((route) => (
                        <button
                          key={`${route.from}-${route.to}`}
                          onClick={() => {
                            handleSearch({
                              from: route.from,
                              to: route.to,
                              date: new Date().toISOString().split('T')[0],
                              passengers: 1,
                              tripType: 'one-way',
                            })
                          }}
                          className="flex items-center justify-between p-3 rounded-lg border hover:border-primary hover:bg-secondary/50 transition-all text-left"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {route.from} → {route.to}
                            </span>
                          </div>
                          <span className="text-sm text-primary font-semibold">
                            from {route.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {searchParams && (
                <TransportResults searchParams={searchParams} />
              )}
            </TabsContent>

            <TabsContent value="cabs">
              <div className="max-w-4xl mx-auto">
                <CabBookingCard />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
