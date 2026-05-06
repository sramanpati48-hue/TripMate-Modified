"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, IndianRupee, MessageSquare, Phone, Mail, Send, Loader2, ShieldCheck } from "lucide-react"
import type { TravelAgency } from "@/lib/agency-data"
import { BookingConfirmation } from "@/components/booking-confirmation"

interface AgencyBookingFormProps {
  agency: TravelAgency
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedDestination?: string
}

export function AgencyBookingForm({ agency, open, onOpenChange, preselectedDestination }: AgencyBookingFormProps) {
  const [step, setStep] = useState<"form" | "confirmed">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    destination: preselectedDestination || agency.destinations[0] || "",
    startDate: "",
    endDate: "",
    travelers: "2",
    budget: "",
    requirements: "",
    contactPreference: "chat" as "chat" | "call" | "email",
    name: "",
    email: "",
    phone: "",
  })

  const estimatedCost = formData.budget ? parseInt(formData.budget) : agency.priceRange.min
  const commissionFee = Math.round(estimatedCost * agency.commissionRate / 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(res => setTimeout(res, 1500))
    setIsSubmitting(false)
    setStep("confirmed")
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => { setStep("form") }, 300)
  }

  if (step === "confirmed") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <BookingConfirmation
            agency={agency}
            destination={formData.destination}
            dates={`${formData.startDate} to ${formData.endDate}`}
            travelers={parseInt(formData.travelers)}
            totalCost={estimatedCost}
            commission={commissionFee}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            Book with {agency.name}
            {agency.verified && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
          </DialogTitle>
          <DialogDescription>
            Fill in your trip details and the agency will get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="booking-name" className="text-xs">Your Name</Label>
              <Input id="booking-name" placeholder="Full name" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-email" className="text-xs">Email</Label>
              <Input id="booking-email" type="email" placeholder="you@email.com" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <Label htmlFor="booking-dest" className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" /> Destination</Label>
            <select
              id="booking-dest"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.destination}
              onChange={e => setFormData(p => ({ ...p, destination: e.target.value }))}
            >
              {agency.destinations.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="booking-start" className="text-xs">Start Date</Label>
              <Input id="booking-start" type="date" required value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-end" className="text-xs">End Date</Label>
              <Input id="booking-end" type="date" required value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>

          {/* Travelers + Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="booking-travelers" className="text-xs flex items-center gap-1"><Users className="h-3 w-3" /> Travelers</Label>
              <Input id="booking-travelers" type="number" min="1" max="20" value={formData.travelers} onChange={e => setFormData(p => ({ ...p, travelers: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-budget" className="text-xs flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Budget (₹)</Label>
              <Input id="booking-budget" type="number" placeholder={`${agency.priceRange.min}`} value={formData.budget} onChange={e => setFormData(p => ({ ...p, budget: e.target.value }))} />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-1.5">
            <Label htmlFor="booking-req" className="text-xs">Special Requirements</Label>
            <textarea
              id="booking-req"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-none"
              placeholder="Dietary restrictions, accessibility needs, special occasions..."
              value={formData.requirements}
              onChange={e => setFormData(p => ({ ...p, requirements: e.target.value }))}
            />
          </div>

          {/* Contact Preference */}
          <div className="space-y-1.5">
            <Label className="text-xs">Preferred Contact Method</Label>
            <div className="flex gap-2">
              {([
                { value: "chat", icon: MessageSquare, label: "Chat" },
                { value: "call", icon: Phone, label: "Call" },
                { value: "email", icon: Mail, label: "Email" },
              ] as const).map(opt => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={formData.contactPreference === opt.value ? "default" : "outline"}
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => setFormData(p => ({ ...p, contactPreference: opt.value }))}
                >
                  <opt.icon className="h-3.5 w-3.5" /> {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="rounded-xl bg-muted/50 p-4 space-y-2 border border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fee Breakdown</h4>
            <div className="flex justify-between text-sm">
              <span>Estimated Trip Cost</span>
              <span className="font-medium">₹{estimatedCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Platform Service Fee ({agency.commissionRate}%)</span>
              <span>₹{commissionFee.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>₹{(estimatedCost + commissionFee).toLocaleString()}</span>
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="h-4 w-4" /> Submit Booking Request</>
            )}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            By submitting, you agree to TRIPMATE&apos;s terms. The agency will confirm within 24 hours.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
