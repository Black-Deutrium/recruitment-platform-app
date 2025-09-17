"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import { Search, MapPin, Clock, Briefcase, Building } from "lucide-react"
import type { Job } from "@/lib/types"

export default function StudentJobs() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "student") {
      router.push("/unauthorized")
    }
    if (user) {
      loadJobs()
    }
  }, [loading, isAuthenticated, user, router])

  const loadJobs = async () => {
    try {
      const response = await fetch("/api/jobs")
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

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some((req) => req.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
              <p className="text-gray-600">Discover and apply to job opportunities</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs by title, description, or requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                {searchTerm ? "Try adjusting your search terms" : "No job postings are currently available"}
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
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          Company Name
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Remote/On-site
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      className={job.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                    >
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 5).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.requirements.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {job.applicants.length} applicant{job.applicants.length !== 1 ? "s" : ""}
                    </div>
                    <Button>Apply Now</Button>
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
