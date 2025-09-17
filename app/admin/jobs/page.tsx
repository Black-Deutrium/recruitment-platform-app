"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/use-auth"
import { Briefcase, Search, MoreVertical, Eye, Flag, Trash2, Users } from "lucide-react"
import type { Job } from "@/lib/types"

export default function AdminJobs() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "admin") {
      router.push("/unauthorized")
    }
    if (user) {
      loadJobs()
    }
  }, [loading, isAuthenticated, user, router])

  const loadJobs = async () => {
    try {
      const response = await fetch("/api/admin/jobs", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error("Error loading jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthToken = () => {
    const cookies = document.cookie.split(";")
    const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth-token="))
    return authCookie ? authCookie.split("=")[1] : ""
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      if (response.ok) {
        setJobs(jobs.filter((job) => job.job_id !== jobId))
      }
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
          <Briefcase className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600">Monitor and manage all job postings on the platform</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.filter((j) => j.status === "active").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.filter((j) => j.status === "closed").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.reduce((total, job) => total + job.applicants.length, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {isLoading ? (
          <div className="text-center py-8">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No job postings yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.job_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="mt-2">
                        Posted {new Date(job.created_at).toLocaleDateString()} • Recruiter ID: {job.recruiter_id}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          job.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }
                      >
                        {job.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            Flag for Review
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteJob(job.job_id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 4).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.requirements.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicants.length} applicant{job.applicants.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
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
