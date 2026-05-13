"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewPlanPage() {
  const [form, setForm] = useState<any>({ destinations: [], inclusions: [], exclusions: [], itinerary: [], images: [], startDates: [] })
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`/api/agencies/${form.agencyId}/plans`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success('Plan created and pending approval')
      router.push('/agency-portal')
    } catch (err: any) {
      toast.error(err.message || 'Failed')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Create New Plan</h1>
      <div className="mt-4 space-y-3">
        <input placeholder="Agency ID" className="w-full p-2" onChange={(e) => setForm({ ...form, agencyId: e.target.value })} />
        <input placeholder="Title" className="w-full p-2" onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Description" className="w-full p-2" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Category" className="w-full p-2" onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <div className="flex gap-2">
          <input placeholder="Price per person" type="number" className="p-2" onChange={(e) => setForm({ ...form, pricePerPerson: Number(e.target.value) })} />
          <input placeholder="Duration (days)" type="number" className="p-2" onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
        </div>
        <div>
          <button onClick={handleSubmit} className="rounded bg-primary px-3 py-2 text-white">Create Plan</button>
        </div>
      </div>
    </div>
  )
}
