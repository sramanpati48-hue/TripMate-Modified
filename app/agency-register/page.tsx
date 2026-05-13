"use client"

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronLeft, ChevronRight, CreditCard, FileUp, Image as ImageIcon, ShieldCheck, Upload, UserPlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

const STEPS = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Business Details' },
  { id: 3, label: 'Documents' },
  { id: 4, label: 'Payment' },
]

const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

const AGENCY_TYPES = [
  { value: 'TOUR_OPERATOR', label: 'Tour Operator' },
  { value: 'TRAVEL_AGENT', label: 'Travel Agent' },
  { value: 'ADVENTURE_SPECIALIST', label: 'Adventure Specialist' },
  { value: 'PILGRIMAGE_SPECIALIST', label: 'Pilgrimage Specialist' },
]

type FileState = {
  fileName: string
  dataUrl: string
}

type DocumentKey = 'brochure' | 'ownerIdProof' | 'ownerSelfie' | 'license' | 'paymentScreenshot'

const ACCEPTS: Record<DocumentKey, string> = {
  brochure: '.pdf,.jpg,.jpeg,.png',
  ownerIdProof: '.jpg,.jpeg,.png',
  ownerSelfie: '.jpg,.jpeg,.png',
  license: '.jpg,.jpeg,.png,.pdf',
  paymentScreenshot: '.jpg,.jpeg,.png',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

function StepCircle({ step, active, completed }: { step: number; active: boolean; completed: boolean }) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
        completed
          ? 'border-teal-400/40 bg-teal-400 text-slate-950'
          : active
            ? 'border-teal-400/40 bg-teal-400/15 text-teal-100'
            : 'border-white/10 bg-white/5 text-white/55'
      }`}
    >
      {completed ? <CheckCircle2 className="h-5 w-5" /> : step}
    </div>
  )
}

function UploadSlot({
  label,
  accept,
  value,
  onChange,
  onRemove,
  helper,
}: {
  label: string
  accept: string
  value?: FileState | null
  onChange: (file: File) => Promise<void>
  onRemove: () => void
  helper?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">{label}</h4>
          {helper ? <p className="mt-1 text-xs leading-5 text-white/55">{helper}</p> : null}
        </div>
        <Upload className="h-5 w-5 text-teal-300" />
      </div>

      <label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 px-4 py-5 text-center transition hover:border-teal-400/30 hover:bg-teal-400/5">
        {value ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {value.fileName}
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onRemove()
              }}
              className="inline-flex items-center justify-center gap-1 text-xs font-medium text-white/55 transition hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <FileUp className="h-5 w-5 text-teal-300" />
            </div>
            <p className="text-sm text-white/70">Click to upload or drag and drop</p>
            <p className="text-xs text-white/45">Accepted: {accept}</p>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={async (event) => {
            const file = event.target.files?.[0]
            if (!file) return
            await onChange(file)
            event.target.value = ''
          }}
        />
      </label>
    </div>
  )
}

export default function AgencyRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{ agencyId: string; email: string } | null>(null)

  const [account, setAccount] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })

  const [business, setBusiness] = useState({
    agencyName: '',
    registrationNo: '',
    panNumber: '',
    licenseNumber: '',
    gstNumber: '',
    website: '',
    address: '',
    city: '',
    state: '',
    description: '',
    agencyType: '',
  })

  const [files, setFiles] = useState<Record<DocumentKey, FileState | null>>({
    brochure: null,
    ownerIdProof: null,
    ownerSelfie: null,
    license: null,
    paymentScreenshot: null,
  })

  const [transactionId, setTransactionId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'tripmate-verify@upi'
  const verificationFee = 999
  const stepProgress = ((step - 1) / (STEPS.length - 1)) * 100

  const accountValid = useMemo(() => {
    return (
      account.fullName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email) &&
      account.password.length >= 8 &&
      account.password === account.confirmPassword &&
      /^[+\d\s\-()]{7,}$/.test(account.phone)
    )
  }, [account])

  const businessValid = useMemo(() => {
    return (
      business.agencyName.trim().length >= 2 &&
      business.registrationNo.trim().length >= 3 &&
      business.panNumber.trim().length >= 5 &&
      business.licenseNumber.trim().length >= 3 &&
      business.address.trim().length >= 5 &&
      business.city.trim().length >= 2 &&
      business.state.trim().length >= 2 &&
      business.description.trim().length >= 50 &&
      business.description.trim().length <= 300 &&
      Boolean(business.agencyType)
    )
  }, [business])

  const documentsValid = useMemo(() => {
    return Boolean(files.brochure && files.ownerIdProof && files.ownerSelfie && files.license)
  }, [files])

  const paymentValid = useMemo(() => {
    return transactionId.trim().length >= 8 && Boolean(files.paymentScreenshot)
  }, [transactionId, files.paymentScreenshot])

  const setFieldError = (field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleFileSelect = async (key: DocumentKey, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File is too large. Maximum size is 5MB.')
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setFiles((prev) => ({ ...prev, [key]: { fileName: file.name, dataUrl } }))
      clearFieldError(key)
    } catch (error) {
      console.error(error)
      toast.error('Failed to read file')
    }
  }

  const validateStep = (currentStep: number) => {
    const nextErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (account.fullName.trim().length < 2) nextErrors.fullName = 'Enter your full name'
      if (!account.email.trim()) nextErrors.email = 'Enter a valid email'
      if (account.password.length < 8) nextErrors.password = 'Password must be at least 8 characters'
      if (account.password !== account.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match'
      if (!/^[+\d\s\-()]{7,}$/.test(account.phone)) nextErrors.phone = 'Enter a valid phone number'
    }

    if (currentStep === 2) {
      if (business.agencyName.trim().length < 2) nextErrors.agencyName = 'Agency name is required'
      if (!business.registrationNo.trim()) nextErrors.registrationNo = 'Registration number is required'
      if (!business.panNumber.trim()) nextErrors.panNumber = 'PAN number is required'
      if (!business.licenseNumber.trim()) nextErrors.licenseNumber = 'License number is required'
      if (business.description.trim().length < 50 || business.description.trim().length > 300) nextErrors.description = 'Description must be 50-300 characters'
      if (!business.address.trim()) nextErrors.address = 'Address is required'
      if (!business.city.trim()) nextErrors.city = 'City is required'
      if (!business.state.trim()) nextErrors.state = 'State is required'
      if (!business.agencyType) nextErrors.agencyType = 'Select an agency type'
    }

    if (currentStep === 3) {
      if (!files.brochure) nextErrors.brochure = 'Upload your brochure'
      if (!files.ownerIdProof) nextErrors.ownerIdProof = 'Upload owner ID proof'
      if (!files.ownerSelfie) nextErrors.ownerSelfie = 'Upload owner selfie'
      if (!files.license) nextErrors.license = 'Upload tourism license'
    }

    if (currentStep === 4) {
      if (transactionId.trim().length < 8) nextErrors.transactionId = 'Enter a valid transaction ID'
      if (!files.paymentScreenshot) nextErrors.paymentScreenshot = 'Upload payment screenshot'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const createAgencyOwnerAccount = async () => {
    if (!validateStep(1)) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/agency-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: account.fullName,
          email: account.email,
          password: account.password,
          confirmPassword: account.confirmPassword,
          phone: account.phone,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Agency account creation failed')
      }

      localStorage.setItem('authToken', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      toast.success('Agency owner account created')
      setStep(2)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitApplication = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('Please create your account first')

      const response = await fetch('/api/agencies/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...business,
          verificationFee,
          feePaid: true,
          feeTransactionId: transactionId.trim(),
          feeScreenshotUrl: files.paymentScreenshot?.dataUrl,
          brochureUrl: files.brochure?.dataUrl,
          ownerIdProofUrl: files.ownerIdProof?.dataUrl,
          ownerSelfieUrl: files.ownerSelfie?.dataUrl,
          licenseDocUrl: files.license?.dataUrl,
          submittedAt: new Date().toISOString(),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Application submission failed')
      }

      setSubmissionResult({ agencyId: data.data.id, email: account.email })
      toast.success('Application submitted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateAccount = (field: keyof typeof account, value: string) => {
    setAccount((prev) => ({ ...prev, [field]: value }))
    clearFieldError(field)
  }

  const updateBusiness = (field: keyof typeof business, value: string) => {
    setBusiness((prev) => ({ ...prev, [field]: value }))
    clearFieldError(field)
  }

  if (submissionResult) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_rgba(5,8,22,0.94),_rgba(5,8,22,1))]" />
        <Navbar />
        <main className="relative z-10 container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-10 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/20 text-emerald-200">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Application Submitted!</h1>
            <p className="mt-3 text-white/70">
              We&apos;ll review your documents and contact you at {submissionResult.email} within 3-5 business days.
            </p>
            <p className="mt-4 text-sm text-white/55">Application ID: {submissionResult.agencyId}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/agency-portal" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950">
                Go to Agency Portal
              </Link>
              <Link href="/agencies" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
                Browse Agencies
              </Link>
            </div>
          </div>
        </main>
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
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                Travel Agency Registration
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Register your travel agency with TripMate</h1>
              <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Create an agency-owner account, submit business documents, pay the verification fee, and get reviewed by our admin team.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/45">Step {step} of 4</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">{STEPS[step - 1].label}</h2>
                </div>
                <div className="hidden text-sm text-white/50 sm:block">
                  Verification fee: ₹{verificationFee}
                </div>
              </div>
              <Progress value={stepProgress} className="mt-5 h-2 bg-white/10" />
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {STEPS.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-3 py-3">
                    <StepCircle step={item.id} active={step === item.id} completed={step > item.id} />
                    <span className={`text-sm font-medium ${step === item.id ? 'text-white' : 'text-white/55'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {step === 1 && (
              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-teal-200">
                    <UserPlus className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Account Creation</h3>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.fullName}>
                      <Input value={account.fullName} onChange={(e) => updateAccount('fullName', e.target.value)} placeholder="Your full name" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <Input value={account.email} onChange={(e) => updateAccount('email', e.target.value)} placeholder="you@agency.com" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="Password" error={errors.password}>
                      <Input type="password" value={account.password} onChange={(e) => updateAccount('password', e.target.value)} placeholder="Create a password" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="Confirm password" error={errors.confirmPassword}>
                      <Input type="password" value={account.confirmPassword} onChange={(e) => updateAccount('confirmPassword', e.target.value)} placeholder="Re-enter password" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="Phone" error={errors.phone} className="sm:col-span-2">
                      <Input value={account.phone} onChange={(e) => updateAccount('phone', e.target.value)} placeholder="+91 98765 43210" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                  </div>
                </div>

                <InfoPanel title="Why a separate flow?" icon={<ShieldCheck className="h-5 w-5 text-teal-300" />}>
                  <ul className="space-y-3 text-sm leading-6 text-white/70">
                    <li>• Travel agencies create an agency-owner account, not a standard traveler profile.</li>
                    <li>• The account is automatically linked to an agency verification submission.</li>
                    <li>• Once reviewed, the owner can access the Agency Portal and publish plans.</li>
                  </ul>
                </InfoPanel>
              </section>
            )}

            {step === 2 && (
              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-teal-200">
                    <FileUp className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Agency Business Details</h3>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Agency name" error={errors.agencyName} className="sm:col-span-2">
                      <Input value={business.agencyName} onChange={(e) => updateBusiness('agencyName', e.target.value)} placeholder="Company name" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="Registration number" error={errors.registrationNo}>
                      <Input value={business.registrationNo} onChange={(e) => updateBusiness('registrationNo', e.target.value)} placeholder="CIN / MSME number" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="PAN number" error={errors.panNumber}>
                      <Input value={business.panNumber} onChange={(e) => updateBusiness('panNumber', e.target.value)} placeholder="ABCDE1234F" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="License number" error={errors.licenseNumber}>
                      <Input value={business.licenseNumber} onChange={(e) => updateBusiness('licenseNumber', e.target.value)} placeholder="Tourism dept license" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="GST number (optional)">
                      <Input value={business.gstNumber} onChange={(e) => updateBusiness('gstNumber', e.target.value)} placeholder="GST number" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="Website (optional)">
                      <Input value={business.website} onChange={(e) => updateBusiness('website', e.target.value)} placeholder="https://youragency.com" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="Address" error={errors.address} className="sm:col-span-2">
                      <Input value={business.address} onChange={(e) => updateBusiness('address', e.target.value)} placeholder="Street, area, landmark" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="City" error={errors.city}>
                      <Input value={business.city} onChange={(e) => updateBusiness('city', e.target.value)} placeholder="City" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <Field label="State" error={errors.state}>
                      <Select value={business.state} onValueChange={(value) => updateBusiness('state', value)}>
                        <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Agency type" error={errors.agencyType}>
                      <Select value={business.agencyType} onValueChange={(value) => updateBusiness('agencyType', value)}>
                        <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGENCY_TYPES.map((item) => (
                            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Description" error={errors.description} className="sm:col-span-2">
                      <Textarea
                        value={business.description}
                        onChange={(e) => updateBusiness('description', e.target.value)}
                        placeholder="Tell travelers about your specialties, services, and destinations."
                        className="min-h-36 border-white/10 bg-white/5 text-white placeholder:text-white/40"
                      />
                      <p className="mt-1 text-xs text-white/45">50-300 characters</p>
                    </Field>
                  </div>
                </div>

                <InfoPanel title="Business profile tips" icon={<ImageIcon className="h-5 w-5 text-teal-300" />}>
                  <ul className="space-y-3 text-sm leading-6 text-white/70">
                    <li>• Use your legal registration details exactly as they appear on documents.</li>
                    <li>• A clear description helps the admin verify your agency faster.</li>
                    <li>• Select the most accurate agency type to improve review routing.</li>
                  </ul>
                </InfoPanel>
              </section>
            )}

            {step === 3 && (
              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-teal-200">
                    <Upload className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Document Upload</h3>
                  </div>
                  <div className="mt-6 grid gap-4">
                    <UploadSlot
                      label="Upload your agency brochure (PDF or image, max 5MB)"
                      accept={ACCEPTS.brochure}
                      value={files.brochure}
                      onChange={(file) => handleFileSelect('brochure', file)}
                      onRemove={() => setFiles((prev) => ({ ...prev, brochure: null }))}
                      helper="BrochureUrl will be stored in your agency record."
                    />
                    {errors.brochure ? <p className="-mt-2 text-sm text-red-300">{errors.brochure}</p> : null}

                    <UploadSlot
                      label="Aadhaar Card / Passport / Voter ID (front side)"
                      accept={ACCEPTS.ownerIdProof}
                      value={files.ownerIdProof}
                      onChange={(file) => handleFileSelect('ownerIdProof', file)}
                      onRemove={() => setFiles((prev) => ({ ...prev, ownerIdProof: null }))}
                    />
                    {errors.ownerIdProof ? <p className="-mt-2 text-sm text-red-300">{errors.ownerIdProof}</p> : null}

                    <UploadSlot
                      label="Selfie holding your identity document"
                      accept={ACCEPTS.ownerSelfie}
                      value={files.ownerSelfie}
                      onChange={(file) => handleFileSelect('ownerSelfie', file)}
                      onRemove={() => setFiles((prev) => ({ ...prev, ownerSelfie: null }))}
                    />
                    {errors.ownerSelfie ? <p className="-mt-2 text-sm text-red-300">{errors.ownerSelfie}</p> : null}

                    <UploadSlot
                      label="State Tourism Department License / IATA Certificate"
                      accept={ACCEPTS.license}
                      value={files.license}
                      onChange={(file) => handleFileSelect('license', file)}
                      onRemove={() => setFiles((prev) => ({ ...prev, license: null }))}
                    />
                    {errors.license ? <p className="-mt-2 text-sm text-red-300">{errors.license}</p> : null}
                  </div>
                </div>

                <InfoPanel title="Document review" icon={<CheckCircle2 className="h-5 w-5 text-teal-300" />}>
                  <p className="text-sm leading-6 text-white/70">
                    Every uploaded file stays with your application and is reviewed by the admin team before verification.
                  </p>
                </InfoPanel>
              </section>
            )}

            {step === 4 && (
              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-teal-200">
                    <CreditCard className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Verification Fee Payment</h3>
                  </div>

                  <div className="mt-6 rounded-3xl border border-teal-400/20 bg-teal-400/10 p-5">
                    <p className="text-lg font-semibold text-white">Verification Fee: ₹999</p>
                    <p className="mt-2 text-sm text-white/70">One-time, non-refundable. Your agency will be reviewed within 3-5 business days after payment.</p>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">UPI ID</p>
                      <p className="mt-2 text-lg font-semibold text-white">{upiId}</p>
                      <p className="mt-1 text-sm text-white/55">Amount: ₹{verificationFee}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-center">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">QR Code</p>
                      <div className="mt-3 flex items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-6">
                        <svg viewBox="0 0 128 128" className="h-28 w-28 text-white/75" aria-hidden="true">
                          <rect x="0" y="0" width="128" height="128" rx="12" fill="currentColor" opacity="0.12" />
                          <rect x="16" y="16" width="24" height="24" fill="currentColor" />
                          <rect x="88" y="16" width="24" height="24" fill="currentColor" />
                          <rect x="16" y="88" width="24" height="24" fill="currentColor" />
                          <rect x="52" y="52" width="8" height="8" fill="currentColor" />
                          <rect x="68" y="52" width="8" height="8" fill="currentColor" />
                          <rect x="52" y="68" width="8" height="8" fill="currentColor" />
                          <rect x="84" y="52" width="8" height="8" fill="currentColor" />
                          <rect x="68" y="84" width="8" height="8" fill="currentColor" />
                          <rect x="84" y="84" width="8" height="8" fill="currentColor" />
                        </svg>
                      </div>
                      <p className="mt-2 text-sm text-white/55">Scan to Pay</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Transaction ID" error={errors.transactionId} className="sm:col-span-2">
                      <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="UPI reference / transaction ID" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    </Field>
                    <div className="sm:col-span-2">
                      <UploadSlot
                        label="Payment screenshot (required)"
                        accept={ACCEPTS.paymentScreenshot}
                        value={files.paymentScreenshot}
                        onChange={(file) => handleFileSelect('paymentScreenshot', file)}
                        onRemove={() => setFiles((prev) => ({ ...prev, paymentScreenshot: null }))}
                      />
                      {errors.paymentScreenshot ? <p className="mt-2 text-sm text-red-300">{errors.paymentScreenshot}</p> : null}
                    </div>
                  </div>
                </div>

                <InfoPanel title="Final checklist" icon={<ShieldCheck className="h-5 w-5 text-teal-300" />}>
                  <ul className="space-y-3 text-sm leading-6 text-white/70">
                    <li>• Make sure the transaction ID is readable and at least 8 characters long.</li>
                    <li>• Payment screenshot is required before submitting your application.</li>
                    <li>• Once submitted, your application will be reviewed by TripMate admins.</li>
                  </ul>
                </InfoPanel>
              </section>
            )}

            <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-white/60">
                {step === 1 ? 'Create your agency-owner account to begin.' : step === 2 ? 'Complete your business details carefully.' : step === 3 ? 'Upload all documents before payment.' : 'Pay the verification fee and submit.'}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  disabled={step === 1 || isSubmitting}
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={async () => {
                      const valid = validateStep(step)
                      if (!valid) return
                      if (step === 1) await createAgencyOwnerAccount()
                      else setStep((prev) => prev + 1)
                    }}
                    disabled={isSubmitting || (step === 1 ? !accountValid : step === 2 ? !businessValid : !documentsValid)}
                    className="bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:from-teal-300 hover:to-cyan-400"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={submitApplication}
                    disabled={isSubmitting || !paymentValid}
                    className="bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:from-teal-300 hover:to-cyan-400"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="container mx-auto px-4 py-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white">How it works</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              {[
                'Create an agency-owner account',
                'Fill in your business details',
                'Upload documents and license',
                'Pay the fee and submit for review',
              ].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/70">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-teal-200">Step {index + 1}</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <Label className="text-sm text-white/80">{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  )
}

function InfoPanel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-white">
        {icon}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </aside>
  )
}
