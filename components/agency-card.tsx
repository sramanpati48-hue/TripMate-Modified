"use client"
import Link from 'next/link'
import { Building2, ShieldCheck, Star } from 'lucide-react'
import React, { useState } from 'react'
import VerificationStatusBadge from '@/components/verification-status-badge'
import { proxiedImageUrl } from '@/lib/image-url'

interface Props {
  agency: {
    id: string
    agencyName: string
    city?: string
    state?: string
    logoUrl?: string | null
    verificationStatus?: string
    planCount?: number
    avgRating?: number
    categories?: string[]
  }
}

export default function AgencyCard({ agency }: Props) {
  const verified = agency.verificationStatus === 'VERIFIED'
  const rating = Number.isFinite(agency.avgRating ?? NaN) ? Number(agency.avgRating) : 0
  const filledStars = Math.max(0, Math.min(5, Math.round(rating)))
  const [logoErrored, setLogoErrored] = useState(false)
  return (
    <Link href={`/agencies/${agency.id}`} className="block">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex h-full flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
              {agency.logoUrl && !logoErrored ? (
                <img
                  src={proxiedImageUrl(agency.logoUrl)}
                  alt={agency.agencyName}
                  className="h-12 w-12 rounded-full object-cover"
                  width={48}
                  height={48}
                  loading="lazy"
                  onError={() => setLogoErrored(true)}
                />
              ) : (
                <Building2 className="h-7 w-7 text-white/55" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold text-white">{agency.agencyName}</h3>
                {verified ? <VerificationStatusBadge status="VERIFIED" /> : <VerificationStatusBadge status={agency.verificationStatus || 'PENDING'} />}
              </div>
              <p className="mt-1 text-sm text-white/60">
                {agency.city}{agency.city && agency.state ? ', ' : ''}{agency.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-amber-300">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < filledStars ? 'fill-current' : 'text-white/15'}`}
              />
            ))}
            <span className="ml-1 text-sm text-white/75">{rating.toFixed(1)}</span>
          </div>

          {agency.categories?.length ? (
            <div className="flex flex-wrap gap-2">
              {agency.categories.slice(0, 3).map((category) => (
                <span key={category} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white/70">
                  {category}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <div className="text-sm text-white/70">
              <span className="font-semibold text-white">{agency.planCount ?? 0}</span> active plans
            </div>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition group-hover:border-teal-400/30 group-hover:bg-teal-400/10 group-hover:text-teal-200">
              View Plans
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
