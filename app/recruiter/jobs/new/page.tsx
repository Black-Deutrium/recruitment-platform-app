"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/hooks/use-auth"
import { Plus, X, Save, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewJobPosting() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [] as string[],
    location: "",
    jobType: "",
    salary: "",
  })
  const [newRequirement, setNewRequirement] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "recruiter") {
      router.push("/unauthorized")
    }
  }, [loading, isAuthenticated, user, router])

  const getAuthToken = () => {
    const cookies = document.cookie.split(";")
    const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth-token="))
    return authCookie ? authCookie.split("=")[1] : ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (formData.requirements.length === 0) {
      setError("Please add at least one requirement")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/recruiter/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Job posted successfully!")
        setTimeout(() => {
          router.push("/recruiter/jobs")
        }, 2000)
      } else {
        setError(data.message || "Failed to post job")
      }
    } catch (error) {
      setError("An error occurred while posting the job")
    } finally {
      setIsLoading(false)
    }
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()],
      })
      setNewRequirement("")
    }
  }

  const removeRequirement = (requirementToRemove: string) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((req) => req !== requirementToRemove),
    })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "recruiter") {
    return null
  }

  return (
    <DashboardLayout userRole="recruiter" userName={user.name || "Recruiter"} userEmail={user.email}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Link href="/recruiter/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post New Job</h1>
          <p className="text-gray-600">Create a new job posting to attract qualified candidates</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Provide the basic information about the position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Input
                    id="jobType"
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    placeholder="e.g., Full-time, Part-time, Contract"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g., $80,000 - $120,000 per year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Add the skills and qualifications required for this position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement (e.g., 3+ years React experience)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Requirements ({formData.requirements.length})</Label>
                {formData.requirements.length === 0 ? (
                  <p className="text-sm text-gray-500">No requirements added yet</p>
                ) : (
                  <div className="space-y-2">
                    {formData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{requirement}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(requirement)}
                          className="text-red-600 hover:bg-red-100 rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/recruiter/jobs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="min-w-32">
              {isLoading ? (
                "Posting..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Post Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
