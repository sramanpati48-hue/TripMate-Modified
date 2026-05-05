"use client"

import { CheckCircle2, Download, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { TravelAgency } from "@/lib/agency-data"

interface BookingConfirmationProps {
  agency: TravelAgency
  destination: string
  dates: string
  travelers: number
  totalCost: number
  commission: number
  onClose: () => void
}

export function BookingConfirmation({
  agency,
  destination,
  dates,
  travelers,
  totalCost,
  commission,
  onClose,
}: BookingConfirmationProps) {
  return (
    <div className="text-center space-y-5 py-4">
      {/* Animated checkmark */}
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 animate-ping opacity-40" />
        <div className="relative flex h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 items-center justify-center shadow-xl mx-auto">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-foreground">Booking Request Sent!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {agency.name} will confirm your booking within 24 hours
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-muted/50 p-4 text-left space-y-2 border border-border/50">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Agency</span>
          <span className="font-medium">{agency.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Destination</span>
          <span className="font-medium">{destination}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Dates</span>
          <span className="font-medium">{dates}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Travelers</span>
          <span className="font-medium">{travelers}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Trip Cost</span>
          <span className="font-medium">₹{totalCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Service Fee</span>
          <span>₹{commission.toLocaleString()}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{(totalCost + commission).toLocaleString()}</span>
        </div>
      </div>

      {/* Info strip */}
      <div className="rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-3 text-xs text-orange-700 dark:text-orange-300">
        ✨ This booking helps support TRIPMATE and keeps our platform free for travelers!
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => {}}>
          <Download className="h-3.5 w-3.5" /> Download Booking Receipt
        </Button>
        <Link href={`/agencies/${agency.id}`} className="w-full">
          <Button variant="ghost" size="sm" className="w-full gap-2">
            <Star className="h-3.5 w-3.5" /> Rate {agency.name}
          </Button>
        </Link>
        <Button size="sm" className="w-full gap-2" onClick={onClose}>
          Done <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
