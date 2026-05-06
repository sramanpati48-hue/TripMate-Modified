"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Building2, TrendingUp, Users, IndianRupee, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { platformStats } from "@/lib/agency-data"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export function RevenueShowcase() {
  const steps = [
    { icon: Building2, title: "Register", desc: "Agencies join our verified network", color: "from-violet-500 to-purple-600" },
    { icon: Users, title: "Get Matched", desc: "Smart engine connects you with travelers", color: "from-orange-500 to-amber-600" },
    { icon: IndianRupee, title: "Earn & Grow", desc: "Commission + advertising revenue", color: "from-emerald-500 to-green-600" },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0f1a2e] to-[#0b1220]" />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(249,115,22,0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,92,246,0.15), transparent 50%)" }}
      />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-5 py-2 text-sm font-medium text-orange-400 mb-4">
            <Sparkles className="h-4 w-4" />
            For Travel Agencies
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Grow Your Business with <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">TRIPMATE</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Join India&apos;s fastest-growing travel marketplace. Get matched with thousands of travelers and boost your bookings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: platformStats.totalAgencies, suffix: "+", label: "Partner Agencies" },
            { value: Math.floor(platformStats.totalBookings / 1000), suffix: "K+", label: "Total Bookings" },
            { value: 250, suffix: "L+", label: "Revenue Generated" },
            { value: parseFloat(platformStats.avgRating), suffix: "★", label: "Avg Agency Rating" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-white/50 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
              <div className="absolute -top-3 -left-1 h-7 w-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {i + 1}
              </div>
              <div className={`inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br ${step.color} items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits + CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">Why Partner with TRIPMATE?</h3>
            <ul className="space-y-2">
              {["Verified agency badge builds trust", "Smart matching brings ideal customers", "Transparent commission structure", "Featured listings & banner ads"].map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/agencies">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl hover:opacity-90 gap-2 whitespace-nowrap">
              Register Your Agency <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
