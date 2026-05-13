"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function MyPlansPage() {
  const [agency, setAgency] = useState<any>(null)

  useEffect(() => {
    const f = async () => {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/agencies/me', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      if (!res.ok) return
      const data = await res.json()
      setAgency(data.data)
    }
    f()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">My Plans</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agency?.plans?.map((p: any) => (
          <div key={p.id} className="rounded border p-3 bg-[#071019]/80">
            <h3 className="font-semibold">{p.title}</h3>
            <div className="text-sm text-white/60">{p.duration} days • ₹{p.pricePerPerson}</div>
            <div className="mt-2 flex gap-2">
              <Link href={`/agency-portal/plans/${p.id}/edit`} className="px-2 py-1 rounded bg-white/5">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
