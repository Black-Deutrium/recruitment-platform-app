"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { BarChart3, Users, Briefcase, TrendingUp, Calendar, Activity } from "lucide-react"

export default function AdminAnalytics() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    totalUsers: 1247,
    newUsersThisMonth: 89,
    totalJobs: 156,
    activeJobs: 89,
    totalApplications: 2341,
    applicationsThisMonth: 234,
    verificationsPending: 15,
    systemUptime: 99.8,
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
        {/* Header */}
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Platform insights and performance metrics</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analytics.newUsersThisMonth}</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeJobs}</div>
              <p className="text-xs text-muted-foreground">of {analytics.totalJobs} total jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalApplications.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analytics.applicationsThisMonth}</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.systemUptime}%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Chart placeholder - User growth over time</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>Application volume by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Chart placeholder - Application trends</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown by user type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Students</span>
                  <span className="text-sm text-gray-600">892 (71.6%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "71.6%" }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Recruiters</span>
                  <span className="text-sm text-gray-600">342 (27.4%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "27.4%" }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Admins</span>
                  <span className="text-sm text-gray-600">13 (1.0%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "1%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>Recent activity summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">23 new users registered today</p>
                    <p className="text-xs text-gray-500">12% increase from yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">8 new jobs posted today</p>
                    <p className="text-xs text-gray-500">5% increase from yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">156 applications submitted today</p>
                    <p className="text-xs text-gray-500">18% increase from yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">15 documents pending verification</p>
                    <p className="text-xs text-gray-500">Requires admin attention</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
