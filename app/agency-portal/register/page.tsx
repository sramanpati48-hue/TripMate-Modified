"use client"
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AgencyRegister() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<any>({})
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/agencies/register', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      toast.success('Agency registered — verification pending')
      router.push('/agency-portal')
    } catch (err: any) {
      toast.error(err.message || 'Failed')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Register Travel Agency</h1>
      <div className="mt-4">
        {step === 1 && (
          <div>
            <label>Agency Name</label>
            <input className="w-full p-2 mt-1" onChange={(e) => setForm({ ...form, agencyName: e.target.value })} />
            <label className="mt-3">Registration No</label>
            <input className="w-full p-2 mt-1" onChange={(e) => setForm({ ...form, registrationNo: e.target.value })} />
            <label className="mt-3">Phone</label>
            <input className="w-full p-2 mt-1" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <label className="mt-3">Address</label>
            <input className="w-full p-2 mt-1" onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="mt-4">
              <button onClick={() => setStep(2)} className="rounded bg-primary px-3 py-2 text-white">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label>PAN Number</label>
            <input className="w-full p-2 mt-1" onChange={(e) => setForm({ ...form, panNumber: e.target.value })} />
            <label className="mt-3">License Number</label>
            <input className="w-full p-2 mt-1" onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
            <label className="mt-3">GST Number (optional)</label>
            <input className="w-full p-2 mt-1" onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
            <div className="mt-4">
              <button onClick={() => setStep(1)} className="mr-2">Back</button>
              <button onClick={() => setStep(3)} className="rounded bg-primary px-3 py-2 text-white">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-semibold">Review & Submit</h3>
            <pre className="bg-white/5 p-3 rounded mt-2">{JSON.stringify(form, null, 2)}</pre>
            <div className="mt-4">
              <button onClick={() => setStep(2)} className="mr-2">Back</button>
              <button onClick={handleSubmit} className="rounded bg-primary px-3 py-2 text-white">Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
