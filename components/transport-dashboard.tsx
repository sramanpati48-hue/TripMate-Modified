"use client"

import React, { useState } from "react"
import { TransportSearchForm } from "./transport-search-form"
import { TransportResults } from "./transport-results"
import CabBooking from "./cab-booking"
import { Card, CardContent } from "@/components/ui/card"

export default function TransportDashboard() {
  const today = new Date().toISOString().split("T")[0]

  const [searchParams, setSearchParams] = useState<any>({
    from: "Kolkata",
    to: "Goa",
    date: today,
    passengers: 1,
    tripType: "one-way",
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      {/* Cab booking is a separate section above the dashboard results */}
      <div className="mb-6">
        {searchParams ? (
          <CabBooking from={searchParams.from} to={searchParams.to} passengers={searchParams.passengers} />
        ) : (
          <Card className="mb-4">
            <CardContent>
              <p className="text-sm text-slate-600">Cab Booking</p>
              <p className="text-slate-900 font-semibold">Enter route to enable cab booking</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <div className="rounded-lg border border-muted p-6">
            <TransportSearchForm onSearch={(next) => setSearchParams(next)} />
          </div>
        </div>

        <div className="md:col-span-2">
          {searchParams ? (
            <TransportResults searchParams={searchParams} />
          ) : (
            <div className="rounded-lg border border-muted p-8 text-center text-muted-foreground">
              Enter a route to search for transport options.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
