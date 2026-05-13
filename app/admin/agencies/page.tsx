"use client"

import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, FileText, Image as ImageIcon, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import VerificationStatusBadge from '@/components/verification-status-badge'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type AgencyDoc = {
  id: string
  docType: string
  fileUrl: string
  fileName: string
  reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewNotes?: string | null
}

type Agency = {
  id: string
  agencyName: string
  city: string
  state: string
  verificationStatus: string
  verificationNotes?: string | null
  feeTransactionId?: string | null
  feeScreenshotUrl?: string | null
  feePaid?: boolean
  brochureUrl?: string | null
  ownerIdProofUrl?: string | null
  ownerSelfieUrl?: string | null
  licenseDocUrl?: string | null
  documentsSubmitted?: AgencyDoc[]
}

const FINAL_STATUSES = ['VERIFIED', 'REJECTED', 'SUSPENDED'] as const

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [finalStatus, setFinalStatus] = useState<string>('VERIFIED')
  const [finalNotes, setFinalNotes] = useState('')
  const [documentState, setDocumentState] = useState<Record<string, { reviewStatus: string; reviewNotes: string }>>({})

  const selectedAgency = useMemo(() => agencies.find((agency) => agency.id === selectedAgencyId) || agencies[0] || null, [agencies, selectedAgencyId])
  const selectedDocs = selectedAgency?.documentsSubmitted || []

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) return
        const response = await fetch('/api/admin/agencies', { headers: { Authorization: `Bearer ${token}` } })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to load agencies')
        const rows = data.data || []
        setAgencies(rows)
        setSelectedAgencyId(rows[0]?.id || '')
      } catch (error: any) {
        toast.error(error.message || 'Failed to load agencies')
      } finally {
        setLoading(false)
      }
    }

    fetchAgencies()
  }, [])

  useEffect(() => {
    if (!selectedAgency) return
    setFinalStatus(selectedAgency.verificationStatus || 'VERIFIED')
    setFinalNotes(selectedAgency.verificationNotes || '')
    const initialDocState: Record<string, { reviewStatus: string; reviewNotes: string }> = {}
    for (const doc of selectedAgency.documentsSubmitted || []) {
      initialDocState[doc.id] = {
        reviewStatus: doc.reviewStatus || 'PENDING',
        reviewNotes: doc.reviewNotes || '',
      }
    }
    setDocumentState(initialDocState)
  }, [selectedAgency])

  const refreshAgencies = async () => {
    const token = localStorage.getItem('authToken')
    const response = await fetch('/api/admin/agencies', { headers: { Authorization: `Bearer ${token}` } })
    const data = await response.json()
    if (response.ok) {
      setAgencies(data.data || [])
    }
  }

  const updateDocument = async (docId: string, reviewStatus: string, reviewNotes: string) => {
    if (!selectedAgency) return
    try {
      setSaving(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/admin/agencies/${selectedAgency.id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documentId: docId, reviewStatus, reviewNotes }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update document')
      await refreshAgencies()
      toast.success('Document updated')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update document')
    } finally {
      setSaving(false)
    }
  }

  const approveAllDocuments = async () => {
    if (!selectedAgency) return
    try {
      setSaving(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/admin/agencies/${selectedAgency.id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approveAllDocuments: true }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to approve documents')
      await refreshAgencies()
      toast.success('All documents approved')
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve documents')
    } finally {
      setSaving(false)
    }
  }

  const saveFinalVerification = async () => {
    if (!selectedAgency) return
    try {
      setSaving(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/admin/agencies/${selectedAgency.id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verificationStatus: finalStatus, verificationNotes: finalNotes }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update verification')
      await refreshAgencies()
      toast.success('Verification updated')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update verification')
    } finally {
      setSaving(false)
    }
  }

  const paymentStatus = selectedAgency?.feePaid ? 'Fee Paid ✓' : 'Fee Not Paid ✗'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_rgba(5,8,22,0.94),_rgba(5,8,22,1))]" />
      <Navbar />

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-teal-200">
          <ShieldCheck className="h-5 w-5" />
          <h1 className="text-3xl font-bold">Agencies Review</h1>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">Loading agencies...</div>
        ) : agencies.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <p className="text-white/70">No agencies found.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-black/20 text-xs uppercase tracking-[0.18em] text-white/45">
                    <tr>
                      <th className="px-4 py-3">Agency</th>
                      <th className="px-4 py-3">City</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Fee</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((agency) => (
                      <tr
                        key={agency.id}
                        className={`cursor-pointer border-t border-white/10 transition hover:bg-white/5 ${selectedAgencyId === agency.id ? 'bg-white/5' : ''}`}
                        onClick={() => setSelectedAgencyId(agency.id)}
                      >
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{agency.agencyName}</div>
                          <div className="text-sm text-white/55">{agency.verificationNotes || 'No notes yet'}</div>
                        </td>
                        <td className="px-4 py-4 text-white/70">{agency.city}</td>
                        <td className="px-4 py-4"><VerificationStatusBadge status={agency.verificationStatus} /></td>
                        <td className="px-4 py-4 text-sm text-white/70">{agency.feePaid ? 'Paid' : 'Unpaid'}</td>
                        <td className="px-4 py-4">
                          <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              {selectedAgency ? (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedAgency.agencyName}</h2>
                    <p className="mt-1 text-sm text-white/60">{selectedAgency.city}, {selectedAgency.state}</p>
                    <div className="mt-3"><VerificationStatusBadge status={selectedAgency.verificationStatus} /></div>
                  </div>

                  <section className="space-y-3 rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center gap-2 text-teal-200">
                      <CreditCardIcon />
                      <h3 className="font-semibold">Fee Verification</h3>
                    </div>
                    <p className="text-sm text-white/70">Transaction ID: <span className="font-medium text-white">{selectedAgency.feeTransactionId || '—'}</span></p>
                    <p className={`text-sm font-medium ${selectedAgency.feePaid ? 'text-emerald-300' : 'text-red-300'}`}>{paymentStatus}</p>
                    {selectedAgency.feeScreenshotUrl ? (
                      <a href={selectedAgency.feeScreenshotUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <img src={selectedAgency.feeScreenshotUrl} alt="Payment screenshot" className="h-40 w-full object-cover" />
                      </a>
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/55">No payment screenshot uploaded.</div>
                    )}
                  </section>

                  <section className="space-y-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-teal-200">
                        <FileText className="h-4 w-4" />
                        <h3 className="font-semibold">Document Review</h3>
                      </div>
                      <Button onClick={approveAllDocuments} disabled={saving} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                        Approve All Documents
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {selectedDocs.map((doc) => {
                        const current = documentState[doc.id] || { reviewStatus: doc.reviewStatus || 'PENDING', reviewNotes: doc.reviewNotes || '' }
                        const isPdf = doc.fileUrl.toLowerCase().includes('application/pdf') || doc.fileName.toLowerCase().endsWith('.pdf')
                        return (
                          <div key={doc.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start gap-3">
                              <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                                {isPdf ? (
                                  <div className="flex h-24 w-24 items-center justify-center px-3 text-center text-xs text-white/70">
                                    <FileText className="h-8 w-8 text-teal-300" />
                                  </div>
                                ) : (
                                  <img src={doc.fileUrl} alt={doc.fileName} className="h-24 w-24 object-cover" />
                                )}
                              </a>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <p className="font-semibold text-white">{doc.fileName}</p>
                                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">{doc.docType}</p>
                                  </div>
                                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-teal-200 hover:text-teal-100">
                                    Open <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.2fr]">
                                  <Select
                                    value={current.reviewStatus}
                                    onValueChange={(value) => setDocumentState((prev) => ({ ...prev, [doc.id]: { ...current, reviewStatus: value } }))}
                                  >
                                    <SelectTrigger className="w-full border-white/10 bg-black/20 text-white">
                                      <SelectValue placeholder="Review status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PENDING">PENDING</SelectItem>
                                      <SelectItem value="APPROVED">APPROVED</SelectItem>
                                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    value={current.reviewNotes}
                                    onChange={(event) => setDocumentState((prev) => ({ ...prev, [doc.id]: { ...current, reviewNotes: event.target.value } }))}
                                    placeholder="Notes for this document"
                                    className="border-white/10 bg-black/20 text-white placeholder:text-white/35"
                                  />
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3">
                                  <span className={`text-xs font-semibold ${current.reviewStatus === 'APPROVED' ? 'text-emerald-300' : current.reviewStatus === 'REJECTED' ? 'text-red-300' : 'text-amber-300'}`}>
                                    {current.reviewStatus}
                                  </span>
                                  <Button
                                    onClick={() => updateDocument(doc.id, current.reviewStatus, current.reviewNotes)}
                                    disabled={saving}
                                    className="bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:from-teal-300 hover:to-cyan-400"
                                  >
                                    Save Document
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>

                  <section className="space-y-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center gap-2 text-teal-200">
                      <Sparkles className="h-4 w-4" />
                      <h3 className="font-semibold">Final Verification Decision</h3>
                    </div>
                    <Select value={finalStatus} onValueChange={setFinalStatus}>
                      <SelectTrigger className="w-full border-white/10 bg-black/20 text-white">
                        <SelectValue placeholder="Select final decision" />
                      </SelectTrigger>
                      <SelectContent>
                        {FINAL_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      value={finalNotes}
                      onChange={(event) => setFinalNotes(event.target.value)}
                      placeholder="Add verification notes or rejection reason"
                      className="min-h-28 border-white/10 bg-black/20 text-white placeholder:text-white/35"
                    />
                    <Button onClick={saveFinalVerification} disabled={saving} className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:from-teal-300 hover:to-cyan-400">
                      Save Verification Decision
                    </Button>
                  </section>
                </>
              ) : (
                <div className="text-white/60">Select an agency to review.</div>
              )}
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function CreditCardIcon() {
  return <ShieldCheck className="h-4 w-4 text-teal-300" />
}
