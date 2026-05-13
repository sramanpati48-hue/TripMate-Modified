"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AgencyCard from '@/components/agency-card'

export default function AgencyPortalPage() {
  const [agency, setAgency] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchAgency = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        router.push('/login')
        return
      }
      const res = await fetch('/api/admin/agencies', { headers: { Authorization: `Bearer ${token}` } })
      // This endpoint is admin-only; for portal we'll fetch by current user instead
      const me = await fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      if (!me.ok) { router.push('/login'); return }
      const meJson = await me.json()
      // Try to fetch agency by userId
      const r2 = await fetch(`/api/admin/agencies`, { headers: { Authorization: `Bearer ${token}` } })
      if (!r2.ok) return
      const list = await r2.json()
      const found = (list.data || []).find((a: any) => a.userId === meJson.data.id)
      if (found) setAgency(found)
    }
    fetchAgency()
  }, [router])

  if (!agency) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Agency Portal</h1>
        <p className="mt-4">You don't have an agency yet.</p>
        <Link href="/agency-portal/register" className="mt-4 inline-block rounded bg-primary px-4 py-2 text-white">Register your agency</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Agency Portal</h1>
      <div className="mt-6">
        <AgencyCard agency={{ id: agency.id, agencyName: agency.agencyName, city: agency.city, state: agency.state, logoUrl: agency.logoUrl, verificationStatus: agency.verificationStatus, planCount: agency.plans?.length }} />
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/agency-portal/plans/new" className="rounded bg-primary px-3 py-2 text-white">Add New Plan</Link>
        <Link href="/agency-portal/documents" className="rounded bg-white/5 px-3 py-2 text-white">Documents</Link>
      </div>
    </div>
  )
}
