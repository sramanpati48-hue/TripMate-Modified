"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { ArrowRight, CalendarDays, Tag } from 'lucide-react'
import { proxiedImageUrl } from '@/lib/image-url'

interface Plan {
  id: string
  title: string
  destinations?: string[]
  duration?: number
  pricePerPerson?: number
  category?: string
  images?: string[]
  agencyId?: string
  agency?: { agencyName?: string; logoUrl?: string | null }
}

export default function PlanCard({ plan }: { plan: Plan }) {
  const [imageErrored, setImageErrored] = useState(false)
  const heroImage = plan.images?.[0]

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/25 hover:shadow-[0_18px_45px_rgba(0,0,0,0.32)]">
      <div className="relative h-40 overflow-hidden border-b border-white/10">
        <img
          src={imageErrored || !heroImage ? proxiedImageUrl('https://source.unsplash.com/800x500/?india,travel') : proxiedImageUrl(heroImage)}
          alt={plan.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          width={800}
          height={500}
          loading="lazy"
          onError={() => setImageErrored(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-teal-200">
              <Tag className="h-3.5 w-3.5" />
              {plan.category}
            </div>
            <h4 className="mt-2 text-lg font-semibold text-white">{plan.title}</h4>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white">
            ₹{plan.pricePerPerson?.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/60">
          <CalendarDays className="h-4 w-4" />
          {plan.duration} days
        </div>

        <div className="flex flex-wrap gap-2">
          {plan.destinations?.slice(0, 3).map((destination) => (
            <span key={destination} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
              {destination}
            </span>
          ))}
        </div>

        <Link
          href={plan.agencyId ? `/agencies/${plan.agencyId}/plans/${plan.id}` : '#'}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-100"
        >
          View Plan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
