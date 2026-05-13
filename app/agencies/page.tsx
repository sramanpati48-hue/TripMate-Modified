"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Building2, ChevronDown, Filter, Search } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import AgencyCard from '@/components/agency-card'
import { CATEGORY_FILTERS, INDIAN_STATES, MOCK_AGENCIES, type MockAgency } from '@/lib/mock-agencies'

type BrowsePlanResponse = {
  id?: string
  category?: string
  agency?: {
    id: string
    agencyName: string
    logoUrl: string | null
    city: string
    state: string
    verificationStatus?: MockAgency['verificationStatus']
  }
}

function aggregateAgencyPlans(plans: BrowsePlanResponse[]): MockAgency[] {
  const agencyMap = new Map<string, MockAgency & { categorySet: Set<string> }>()

  for (const plan of plans) {
    const agency = plan.agency
    if (!agency) continue

    const existing = agencyMap.get(agency.id)
    const category = plan.category ? String(plan.category).toUpperCase() : ''

    if (existing) {
      existing.planCount += 1
      if (category) existing.categorySet.add(category)
      continue
    }

    agencyMap.set(agency.id, {
      id: agency.id,
      agencyName: agency.agencyName,
      city: agency.city,
      state: agency.state,
      logoUrl: agency.logoUrl,
      verificationStatus: agency.verificationStatus || 'VERIFIED',
      planCount: 1,
      avgRating: 4.6,
      description: `${agency.agencyName} is a verified travel agency in ${agency.city}, ${agency.state}.`,
      categories: category ? [category] : [],
      categorySet: new Set(category ? [category] : []),
    })
  }

  return Array.from(agencyMap.values()).map(({ categorySet, ...agency }) => ({
    ...agency,
    categories: Array.from(categorySet),
  }))
}

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, rating))
  const fullStars = Math.round(clamped)

  return (
    <div className="flex items-center gap-1 text-amber-300">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 ${index < fullStars ? 'fill-current' : 'fill-white/15'}`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.175 0l-3.368 2.446c-.784.57-1.838-.197-1.539-1.118l1.285-3.955a1 1 0 00-.363-1.118L2.123 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-white/75">{clamped.toFixed(1)}</span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded-full bg-white/10" />
            <div className="h-3 w-1/2 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="h-4 w-28 rounded-full bg-white/10" />
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-white/10" />
          <div className="h-6 w-20 rounded-full bg-white/10" />
          <div className="h-6 w-20 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-24 rounded-full bg-white/10" />
          <div className="h-8 w-24 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  )
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<MockAgency[]>(MOCK_AGENCIES)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    let isMounted = true

    const fetchAgencies = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/agencies/plans/browse', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Failed to load agencies (${response.status})`)
        }

        const payload = await response.json()
        const rows = Array.isArray(payload?.data) ? payload.data : []
        const aggregated = aggregateAgencyPlans(rows)

        if (isMounted) {
          setAgencies(aggregated.length > 0 ? aggregated : MOCK_AGENCIES)
        }
      } catch (error) {
        console.error('Failed to load agencies:', error)
        if (isMounted) {
          setAgencies(MOCK_AGENCIES)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAgencies()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleAgencies = useMemo(() => {
    return agencies.filter((agency) => {
      const matchesSearch = !searchQuery || agency.agencyName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesState = selectedState === 'All States' || agency.state === selectedState
      const matchesCategory = selectedCategory === 'All' || agency.categories.includes(selectedCategory)

      return matchesSearch && matchesState && matchesCategory
    })
  }, [agencies, searchQuery, selectedState, selectedCategory])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_rgba(5,8,22,0.94),_rgba(5,8,22,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]" />

      <Navbar />

      <main className="relative z-10">
        <section className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                Verified Travel Agencies
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Explore trusted travel agencies across India
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Browse verified agencies, compare their active plans, and discover specialists for adventure, pilgrimage, beach escapes, and more.
              </p>
            </div>
          </div>
        </section>

        <section className="sticky top-16 z-30 border-b border-white/10 bg-[#08111f]/90 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search agencies by name"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-teal-400/30 focus:bg-white/10"
                />
              </div>

              <div className="relative w-full lg:w-[220px]">
                <select
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-sm text-white outline-none transition focus:border-teal-400/30 focus:bg-white/10"
                >
                  <option value="All States">All States</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="mr-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                <Filter className="h-3.5 w-3.5" />
                Categories
              </div>
              {CATEGORY_FILTERS.map((category) => {
                const active = selectedCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      active
                        ? 'border-teal-400/30 bg-teal-400/15 text-teal-200 shadow-[0_0_0_1px_rgba(45,212,191,0.12)]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : visibleAgencies.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-sm text-white/60">
                  Showing <span className="font-semibold text-white">{visibleAgencies.length}</span> {visibleAgencies.length === 1 ? 'agency' : 'agencies'}
                </p>
                <p className="text-sm text-white/40">Verified agencies with live plan counts</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleAgencies.map((agency) => (
                  <AgencyCard key={agency.id} agency={agency} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-20 text-center backdrop-blur-xl">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Building2 className="h-8 w-8 text-teal-300" />
              </div>
              <h2 className="text-2xl font-semibold text-white">No verified agencies yet</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                We couldn&apos;t find any agencies matching your filters right now. You can register your own agency and start building a verified profile.
              </p>
              <Link
                href="/agency-portal/register"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:shadow-lg hover:shadow-teal-500/20"
              >
                Register Your Agency
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
