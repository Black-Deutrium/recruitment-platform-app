"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/hooks/use-auth"
import { Briefcase, FileText, Shield, User, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    profileCompletion: 75,
    applicationsSubmitted: 3,
    documentsVerified: 2,
    totalDocuments: 3,
    activeApplications: 2,
    interviewsScheduled: 1,
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "student") {
      router.push("/unauthorized")
    }
  }, [loading, isAuthenticated, user, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  return (
    <DashboardLayout userRole="student" userName={user.name || "Student"} userEmail={user.email}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name || "Student"}!</h1>
          <p className="text-blue-100">Track your applications and manage your profile to get hired faster.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profileCompletion}%</div>
              <Progress value={stats.profileCompletion} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applicationsSubmitted}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stats.activeApplications} active</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.documentsVerified}/{stats.totalDocuments}
              </div>
              <p className="text-xs text-muted-foreground">Verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.interviewsScheduled}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Complete these tasks to improve your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Complete your profile</span>
                </div>
                <Link href="/student/profile">
                  <Button size="sm">Update</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span>Upload verification documents</span>
                </div>
                <Link href="/student/documents">
                  <Button size="sm" variant="outline">
                    Upload
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <span>Browse available jobs</span>
                </div>
                <Link href="/student/jobs">
                  <Button size="sm" variant="outline">
                    Browse
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Software Engineer</p>
                  <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                </div>
                <Badge variant="secondary">Under Review</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Frontend Developer</p>
                  <p className="text-sm text-muted-foreground">StartupXYZ</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Interview Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Analyst</p>
                  <p className="text-sm text-muted-foreground">DataCorp</p>
                </div>
                <Badge variant="outline">Applied</Badge>
              </div>
              <Link href="/student/applications">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Applications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Profile Status */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
            <CardDescription>Complete your profile to increase your chances of getting hired</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Basic information completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Skills and education added</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Resume uploaded (pending verification)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span>Portfolio/projects section</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
