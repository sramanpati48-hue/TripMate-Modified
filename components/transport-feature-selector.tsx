"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Car, Search } from "lucide-react"
import TransportFaresSearch from "./transport-fares-search"
import CabBookingStandalone from "./cab-booking-standalone"

type Feature = "selector" | "cabs" | "fares"

export default function TransportFeatureSelector() {
  const [selectedFeature, setSelectedFeature] = useState<Feature>("selector")

  if (selectedFeature === "cabs") {
    return (
      <div className="min-h-screen w-full">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedFeature("selector")}
            className="mb-6"
          >
            ← Back to Features
          </Button>
          <CabBookingStandalone />
        </div>
      </div>
    )
  }

  if (selectedFeature === "fares") {
    return (
      <div className="min-h-screen w-full">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedFeature("selector")}
            className="mb-6"
          >
            ← Back to Features
          </Button>
          <TransportFaresSearch />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="mb-2 text-sm font-semibold tracking-wider text-slate-600 uppercase">Transport Solutions</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            How can we help you travel?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Choose your travel need and find the best options tailored for you.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Book Cabs Card */}
          <Card className="border-2 border-slate-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedFeature("cabs")}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                    <Car className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Book a Cab</CardTitle>
                    <CardDescription>Quick local rides in your city</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> Choose pickup & drop location
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> Compare cab fares instantly
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> Multiple cab options available
                </li>
              </ul>
              <Button className="w-full gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white group-hover:shadow-lg transition-shadow">
                Book Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Check & Book Fare Card */}
          <Card className="border-2 border-slate-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedFeature("fares")}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Check & Book Fares</CardTitle>
                    <CardDescription>Compare long-distance travel options</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Search flights, trains & buses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Compare prices across all modes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Book directly with operators
                </li>
              </ul>
              <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white group-hover:shadow-lg transition-shadow">
                Search Fares
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-sm text-slate-600">
          <p>All your travel needs in one place. TripMate makes it easy to compare and book.</p>
        </div>
      </div>
    </div>
  )
}
