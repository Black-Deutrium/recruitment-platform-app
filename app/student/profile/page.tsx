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
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/hooks/use-auth"
import { User, Plus, X, Upload, Save, AlertCircle } from "lucide-react"
import type { Student } from "@/lib/types"

export default function StudentProfile() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    skills: [] as string[],
    education: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")
  const [newEducation, setNewEducation] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "student") {
      router.push("/unauthorized")
    }
    if (user) {
      loadProfile()
    }
  }, [loading, isAuthenticated, user, router])

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/student/profile", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setProfile(data.profile)
        setFormData({
          name: data.user?.name || "",
          email: data.user?.email || "",
          phone: data.profile?.phone || "",
          bio: data.profile?.bio || "",
          skills: data.profile?.skills || [],
          education: data.profile?.education || [],
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

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

    try {
      const response = await fetch("/api/student/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Profile updated successfully!")
        loadProfile()
      } else {
        setError(data.message || "Failed to update profile")
      }
    } catch (error) {
      setError("An error occurred while updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("resume", resumeFile)

    try {
      const response = await fetch("/api/student/resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Resume uploaded successfully!")
        setResumeFile(null)
        loadProfile()
      } else {
        setError(data.message || "Failed to upload resume")
      }
    } catch (error) {
      setError("An error occurred while uploading resume")
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const addEducation = () => {
    if (newEducation.trim() && !formData.education.includes(newEducation.trim())) {
      setFormData({
        ...formData,
        education: [...formData.education, newEducation.trim()],
      })
      setNewEducation("")
    }
  }

  const removeEducation = (educationToRemove: string) => {
    setFormData({
      ...formData,
      education: formData.education.filter((edu) => edu !== educationToRemove),
    })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  return (
    <DashboardLayout userRole="student" userName={user.name || "Student"} userEmail={user.email}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and qualifications</p>
          </div>
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
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={formData.email} disabled className="bg-gray-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself, your interests, and career goals..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add your technical and soft skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., JavaScript, React, Communication)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Add your educational background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  placeholder="Add education (e.g., Computer Science - Bachelor's, XYZ University)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEducation())}
                />
                <Button type="button" onClick={addEducation} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.education.map((edu, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{edu}</span>
                    <button
                      type="button"
                      onClick={() => removeEducation(edu)}
                      className="text-red-600 hover:bg-red-100 rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your latest resume (PDF format recommended)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.resume_url && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Resume uploaded successfully
                    {profile.verified ? " and verified" : " (pending verification)"}
                  </p>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={!resumeFile || isLoading}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX (Max size: 5MB)</p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="min-w-32">
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
