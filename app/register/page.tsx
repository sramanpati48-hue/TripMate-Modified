"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Mail, Lock, User, Eye, EyeOff, Loader2, Check } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.met)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      return
    }
    if (!isPasswordValid) {
      setError("Please meet all password requirements")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // Prepare the payload
      const payload = {
        email: email.trim(),
        password,
        name: name.trim(),
      }

      console.log('Sending signup request:', { ...payload, password: '[HIDDEN]' })

      // Call the backend signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      // Try to parse JSON safely (some errors may return non-JSON bodies)
      let data: any = null
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        try {
          data = await response.json()
        } catch (parseErr) {
          console.error('Failed to parse signup response JSON:', parseErr)
        }
      } else {
        // fallback: attempt to read text body
        try {
          const text = await response.text()
          console.log('Signup response (text):', text)
          data = { message: text }
        } catch (txtErr) {
          console.error('Failed to read signup response text:', txtErr)
        }
      }

      console.log('Signup response status:', response.status, data)

      if (!response.ok) {
        // Show specific validation errors if available
        if (data && data.errors && typeof data.errors === 'object') {
          const errorMessages = Object.values(data.errors).join('. ')
          setError(errorMessages)
        } else {
          setError((data && data.message) || `Signup failed (status ${response.status})`)
        }
        setIsLoading(false)
        return
      }

      // Store the JWT token in localStorage
      if (data?.data?.token) {
        try {
          localStorage.setItem('authToken', data.data.token)
          localStorage.setItem('user', JSON.stringify(data.data.user))
        } catch (storageErr) {
          console.error('Failed to save auth token/user to localStorage:', storageErr)
        }
      }

      // Redirect to profile page
      setIsLoading(false)
      window.location.href = '/profile'
    } catch (err) {
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 bg-secondary/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">TRIPMATE</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Start planning your next adventure today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-1 mt-2">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.label}
                        className={`flex items-center gap-2 text-xs ${req.met ? "text-primary" : "text-muted-foreground"}`}
                      >
                        <Check className={`h-3 w-3 ${req.met ? "opacity-100" : "opacity-30"}`} />
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
