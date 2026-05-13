import Link from 'next/link'
import { Building2, MapPin, Star } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import VerificationStatusBadge from '@/components/verification-status-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { findMockAgencyById, type MockAgency, type MockPlan, type MockReview } from '@/lib/mock-agencies'
import PlanCard from '@/components/plan-card'
import { proxiedImageUrl } from '@/lib/image-url'
import FallbackImage from '@/components/fallback-image'

type PageParams = Promise<{ agencyId: string }>

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

function ReviewCard({ review }: { review: MockReview }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-teal-400/20 to-orange-400/20 text-sm font-semibold text-white">
          {review.initials}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-semibold text-white">{review.name}</h4>
              <p className="text-xs text-white/45">{review.date}</p>
            </div>
            <StarRating rating={review.rating} />
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}

export default async function AgencyProfile({ params }: { params: PageParams }) {
  const { agencyId } = await params
  const agency: MockAgency | null = findMockAgencyById(agencyId)

  if (!agency) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_rgba(5,8,22,0.94),_rgba(5,8,22,1))]" />
        <Navbar />
        <main className="relative z-10 container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Building2 className="h-8 w-8 text-teal-300" />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Agency not found</h1>
            <p className="mt-3 text-white/65">The requested agency does not exist in the current mock data set.</p>
            <Link
              href="/agencies"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
            >
              Back to Agencies
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_rgba(5,8,22,0.94),_rgba(5,8,22,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]" />

      <Navbar />

      <main className="relative z-10">
        <section className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-12">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {agency.logoUrl ? (
                      <FallbackImage
                        src={proxiedImageUrl(agency.logoUrl)}
                        fallbackSrc="/placeholder.svg"
                        alt={agency.agencyName}
                        className="h-full w-full object-cover"
                        width={80}
                        height={80}
                        loading="lazy"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-white/55" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{agency.agencyName}</h1>
                      <VerificationStatusBadge status={agency.verificationStatus} />
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-white/65">
                      <MapPin className="h-4 w-4" />
                      <span>{agency.city}, {agency.state}</span>
                    </div>
                  </div>
                </div>

                <p className="max-w-3xl text-base leading-7 text-white/70 sm:text-lg">{agency.description}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">Plans</p>
                    <p className="mt-2 text-2xl font-bold">{agency.planCount}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">Average rating</p>
                    <div className="mt-2">
                      <StarRating rating={agency.avgRating} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">Categories</p>
                    <p className="mt-2 text-lg font-semibold">{agency.categories.length}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {agency.categories.map((category) => (
                    <span key={category} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/70">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <Tabs defaultValue="plans" className="gap-6">
            <TabsList className="sticky top-16 z-20 h-auto w-full justify-start gap-2 rounded-2xl border border-white/10 bg-[#08111f]/90 p-2 backdrop-blur-xl">
              <TabsTrigger value="plans" className="flex-1 rounded-xl px-4 py-3 text-sm data-[state=active]:bg-teal-400/15 data-[state=active]:text-teal-100">
                Our Plans
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 rounded-xl px-4 py-3 text-sm data-[state=active]:bg-teal-400/15 data-[state=active]:text-teal-100">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="mt-6 outline-none">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {agency.plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={{
                      ...plan,
                      agencyId: agency.id,
                      agency: {
                        agencyName: agency.agencyName,
                        logoUrl: agency.logoUrl,
                      },
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 outline-none">
              <div className="grid gap-6 lg:grid-cols-3">
                {agency.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  )
}
