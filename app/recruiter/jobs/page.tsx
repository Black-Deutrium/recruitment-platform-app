"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/use-auth"
import { Briefcase, Plus, Search, MoreVertical, Edit, Trash2, Eye, Users } from "lucide-react"
import Link from "next/link"
import type { Job } from "@/lib/types"

export default function RecruiterJobs() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "recruiter") {
      router.push("/unauthorized")
    }
    if (user) {
      loadJobs()
    }
  }, [loading, isAuthenticated, user, router])

  const loadJobs = async () => {
    try {
      const response = await fetch("/api/recruiter/jobs", {
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
      const response = await fetch(`/api/recruiter/jobs/${jobId}`, {
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

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "closed" : "active"

    try {
      const response = await fetch(`/api/recruiter/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setJobs(jobs.map((job) => (job.job_id === jobId ? { ...job, status: newStatus as "active" | "closed" } : job)))
      }
    } catch (error) {
      console.error("Error updating job status:", error)
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "recruiter") {
    return null
  }

  return (
    <DashboardLayout userRole="recruiter" userName={user.name || "Recruiter"} userEmail={user.email}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
              <p className="text-gray-600">Manage your job postings and track applications</p>
            </div>
          </div>
          <Link href="/recruiter/jobs/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search your job postings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No jobs found" : "No job postings yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Create your first job posting to start hiring"}
              </p>
              {!searchTerm && (
                <Link href="/recruiter/jobs/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </Link>
              )}
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
                        Posted {new Date(job.created_at).toLocaleDateString()}
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
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleJobStatus(job.job_id, job.status)}>
                            {job.status === "active" ? "Close Job" : "Reopen Job"}
                          </DropdownMenuItem>
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
                      <Link href={`/recruiter/jobs/${job.job_id}/candidates`}>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          View Candidates
                        </Button>
                      </Link>
                      <Link href={`/recruiter/jobs/${job.job_id}`}>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
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
