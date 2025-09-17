"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import { FileText, Clock, CheckCircle, XCircle, Calendar } from "lucide-react"
import type { Application } from "@/lib/types"

export default function StudentApplications() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "student") {
      router.push("/unauthorized")
    }
    if (user) {
      loadApplications()
    }
  }, [loading, isAuthenticated, user, router])

  const loadApplications = async () => {
    try {
      // Mock data for now - in real app, fetch from API
      const mockApplications: Application[] = [
        {
          app_id: "app-1",
          job_id: "job-1",
          student_id: "student-1",
          status: "applied",
          applied_at: new Date("2024-01-15"),
        },
        {
          app_id: "app-2",
          job_id: "job-2",
          student_id: "student-1",
          status: "shortlisted",
          ai_score: 92,
          applied_at: new Date("2024-01-10"),
        },
        {
          app_id: "app-3",
          job_id: "job-3",
          student_id: "student-1",
          status: "rejected",
          ai_score: 65,
          applied_at: new Date("2024-01-05"),
        },
      ]
      setApplications(mockApplications)
    } catch (error) {
      console.error("Error loading applications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="h-4 w-4" />
      case "shortlisted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "hired":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700"
      case "shortlisted":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      case "hired":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  return (
    <DashboardLayout userRole="student" userName={user.name || "Student"} userEmail={user.email}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600">Track the status of your job applications</p>
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="text-center py-8">Loading applications...</div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Start applying to jobs to see your applications here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.app_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">Software Engineer Position</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied {application.applied_at.toLocaleDateString()}
                        </span>
                        {application.ai_score && (
                          <span className="flex items-center">
                            <span className="text-sm">Match Score: {application.ai_score}%</span>
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status}</span>
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Company</h4>
                      <p className="text-gray-600">TechCorp Inc.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Application Status</h4>
                      <p className="text-gray-600">
                        {application.status === "applied" && "Your application has been submitted and is under review."}
                        {application.status === "shortlisted" &&
                          "Congratulations! You've been shortlisted for the next round."}
                        {application.status === "rejected" &&
                          "Unfortunately, your application was not selected this time."}
                        {application.status === "hired" && "Congratulations! You've been selected for this position."}
                      </p>
                    </div>

                    {application.ai_score && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">AI Match Score</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${application.ai_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{application.ai_score}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
