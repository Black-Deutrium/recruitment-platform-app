"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import { Briefcase, Users, TrendingUp, Clock, PlusCircle, Eye } from "lucide-react"
import Link from "next/link"

export default function RecruiterDashboard() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    activeJobs: 5,
    totalApplications: 47,
    shortlistedCandidates: 12,
    interviewsScheduled: 8,
    hiredThisMonth: 3,
    responseRate: 68,
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "recruiter") {
      router.push("/unauthorized")
    }
  }, [loading, isAuthenticated, user, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "recruiter") {
    return null
  }

  return (
    <DashboardLayout userRole="recruiter" userName={user.name || "Recruiter"} userEmail={user.email}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name || "Recruiter"}!</h1>
          <p className="text-green-100">Manage your job postings and find the best candidates for your company.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Currently hiring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stats.shortlistedCandidates} shortlisted</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.interviewsScheduled}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hiredThisMonth}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your recruitment process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <PlusCircle className="h-5 w-5 text-blue-600" />
                  <span>Post a new job</span>
                </div>
                <Link href="/recruiter/jobs/new">
                  <Button size="sm">Create</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Review candidates</span>
                </div>
                <Link href="/recruiter/candidates">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  <span>Manage job postings</span>
                </div>
                <Link href="/recruiter/jobs">
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Job Posts</CardTitle>
              <CardDescription>Your latest job postings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Senior Software Engineer</p>
                  <p className="text-sm text-muted-foreground">15 applications</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Manager</p>
                  <p className="text-sm text-muted-foreground">8 applications</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">UX Designer</p>
                  <p className="text-sm text-muted-foreground">12 applications</p>
                </div>
                <Badge variant="secondary">Closed</Badge>
              </div>
              <Link href="/recruiter/jobs">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Candidate Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Pipeline</CardTitle>
            <CardDescription>Overview of candidates in your hiring process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">47</div>
                <div className="text-sm text-blue-600">Applied</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">12</div>
                <div className="text-sm text-yellow-600">Shortlisted</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">8</div>
                <div className="text-sm text-purple-600">Interview</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">3</div>
                <div className="text-sm text-green-600">Hired</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Top Candidates</CardTitle>
            <CardDescription>AI-ranked candidates based on job requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-medium">JS</span>
                </div>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">Software Engineer • 95% match</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-700">95%</Badge>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-medium">AD</span>
                </div>
                <div>
                  <p className="font-medium">Alice Davis</p>
                  <p className="text-sm text-muted-foreground">Product Manager • 92% match</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-700">92%</Badge>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
