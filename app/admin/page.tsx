"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import { Users, Shield, Briefcase, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 1247,
    newUsersThisWeek: 23,
    pendingVerifications: 15,
    totalJobs: 89,
    activeJobs: 67,
    totalApplications: 456,
    systemHealth: 98,
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "admin") {
      router.push("/unauthorized")
    }
  }, [loading, isAuthenticated, user, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <DashboardLayout userRole="admin" userName={user.name || "Admin"} userEmail={user.email}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-purple-100">Monitor platform activity and manage system operations.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.newUsersThisWeek} this week</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeJobs}/{stats.totalJobs}
              </div>
              <p className="text-xs text-muted-foreground">Total jobs posted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth}%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span>Review pending verifications</span>
                </div>
                <Link href="/admin/verifications">
                  <Button size="sm">Review</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Manage users</span>
                </div>
                <Link href="/admin/users">
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <span>Monitor job postings</span>
                </div>
                <Link href="/admin/jobs">
                  <Button size="sm" variant="outline">
                    Monitor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">15 documents pending verification</p>
                  <p className="text-xs text-muted-foreground">Some users waiting for approval</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-muted-foreground">Daily backup successful</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">User activity increased 12%</p>
                  <p className="text-xs text-muted-foreground">Compared to last week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>Latest users who joined the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-700">JS</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Smith</p>
                    <p className="text-xs text-muted-foreground">Student • 2 hours ago</p>
                  </div>
                </div>
                <Badge variant="outline">Student</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-700">AD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alice Davis</p>
                    <p className="text-xs text-muted-foreground">Recruiter • 5 hours ago</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Recruiter</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-700">MJ</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mike Johnson</p>
                    <p className="text-xs text-muted-foreground">Student • 1 day ago</p>
                  </div>
                </div>
                <Badge variant="outline">Student</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Queue</CardTitle>
              <CardDescription>Documents awaiting verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Academic Transcript</p>
                  <p className="text-xs text-muted-foreground">Sarah Wilson • 2 hours ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">ID Card</p>
                  <p className="text-xs text-muted-foreground">Robert Chen • 4 hours ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Resume</p>
                  <p className="text-xs text-muted-foreground">Emma Thompson • 6 hours ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                </div>
              </div>
              <Link href="/admin/verifications">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Verifications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
