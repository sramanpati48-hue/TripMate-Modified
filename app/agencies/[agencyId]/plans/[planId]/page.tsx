import Link from 'next/link'
import { ArrowLeft, CalendarDays, MapPin, Star } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import BookingWidget from '@/components/booking-widget'
import { findMockAgencyById, findMockPlanById } from '@/lib/mock-agencies'
import { proxiedImageUrl } from '@/lib/image-url'
import FallbackImage from '@/components/fallback-image'

type PageParams = Promise<{ agencyId: string; planId: string }>

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(Math.max(0, Math.min(5, rating)))
  return (
    <div className="flex items-center gap-1 text-amber-300">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < filled ? 'fill-current' : 'text-white/15'}`} />
      ))}
      <span className="ml-1 text-sm text-white/75">{rating.toFixed(1)}</span>
    </div>
  )
}

export default async function PlanDetail({ params }: { params: PageParams }) {
  const { agencyId, planId } = await params
  const agency = findMockAgencyById(agencyId)
  const plan = findMockPlanById(agencyId, planId)
  const bookingPlan = plan && agency
    ? {
        ...plan,
        startDates: ['2026-06-15', '2026-07-01', '2026-07-15'],
        maxGroupSize: 8,
        agencyId: agency.id,
        agency: {
          agencyName: agency.agencyName,
          logoUrl: agency.logoUrl,
        },
      }
    : null
  const gallery = plan?.images?.slice(0, 3) || []
  const fallbackImage = 'https://source.unsplash.com/800x500/?india,travel'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_rgba(5,8,22,0.94),_rgba(5,8,22,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]" />

      <Navbar />

      <main className="relative z-10 container mx-auto px-4 py-10">
        <Link href={`/agencies/${agencyId}`} className="mb-6 inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to agency
        </Link>

        {!agency || !plan ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <h1 className="text-3xl font-bold">Plan not found</h1>
            <p className="mt-3 text-white/65">The selected plan is not available in the current mock dataset.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <FallbackImage
                    src={proxiedImageUrl(gallery[0] || fallbackImage)}
                    fallbackSrc={fallbackImage}
                    alt={`${plan.title} hero image`}
                    className="h-80 w-full object-cover"
                    width={1200}
                    height={800}
                    loading="lazy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(gallery.slice(1, 3).length ? gallery.slice(1, 3) : [fallbackImage, fallbackImage]).map((imageUrl, index) => (
                    <div key={`${plan.id}-thumb-${index}`} className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      <FallbackImage
                        src={proxiedImageUrl(imageUrl || fallbackImage)}
                        fallbackSrc={fallbackImage}
                        alt={`${plan.title} thumbnail ${index + 1}`}
                        className="h-40 w-full object-cover"
                        width={800}
                        height={500}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-200">
                    {plan.category}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {plan.duration} days
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{plan.title}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-white/65">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {agency.agencyName}
                    </span>
                    <span>•</span>
                    <span>{agency.city}, {agency.state}</span>
                  </div>
                </div>

                <p className="max-w-3xl text-base leading-7 text-white/70">{plan.description}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h2 className="text-lg font-semibold text-white">Itinerary</h2>
                <div className="mt-4 space-y-4">
                  {plan.itinerary.map((day) => (
                    <div key={day.day} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-white">Day {day.day}: {day.title}</h3>
                      </div>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-white/70">
                        {day.activities.map((activity) => (
                          <li key={activity}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.18em] text-white/45">Price per person</p>
                <div className="mt-3 text-4xl font-bold">₹{plan.pricePerPerson.toLocaleString()}</div>
                <p className="mt-2 text-sm text-white/60">{plan.duration}-day curated itinerary by {agency.agencyName}</p>

                <div className="mt-5">
                  <BookingWidget plan={bookingPlan} />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="font-semibold text-white">Plan Highlights</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.destinations.map((destination) => (
                    <span key={destination} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                      {destination}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <StarRating rating={agency.avgRating} />
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
