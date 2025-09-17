"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Store token in cookie
        document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days

        // Redirect based on role
        switch (data.user.role) {
          case "student":
            router.push("/student")
            break
          case "recruiter":
            router.push("/recruiter")
            break
          case "admin":
            router.push("/admin")
            break
          default:
            router.push("/")
        }
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">CampusRecruit</h1>
          </div>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Accounts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Test Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="font-medium text-blue-700">Student</p>
                <p>student@test.com</p>
                <p>Student123</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="font-medium text-green-700">Recruiter</p>
                <p>recruiter@test.com</p>
                <p>Recruiter123</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <p className="font-medium text-purple-700">Admin</p>
                <p>admin@test.com</p>
                <p>Admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
