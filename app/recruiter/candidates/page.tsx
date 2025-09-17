"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/hooks/use-auth"
import { Users, Search, Star, Eye, MessageSquare, Calendar } from "lucide-react"

interface Candidate {
  id: string
  name: string
  email: string
  jobTitle: string
  aiScore: number
  status: "applied" | "shortlisted" | "rejected" | "hired"
  appliedDate: Date
  skills: string[]
  experience: string
}

export default function RecruiterCandidates() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "recruiter") {
      router.push("/unauthorized")
    }
    if (user) {
      loadCandidates()
    }
  }, [loading, isAuthenticated, user, router])

  const loadCandidates = async () => {
    try {
      // Mock data for now - in real app, fetch from API
      const mockCandidates: Candidate[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@email.com",
          jobTitle: "Senior Software Engineer",
          aiScore: 95,
          status: "shortlisted",
          appliedDate: new Date("2024-01-15"),
          skills: ["React", "Node.js", "TypeScript", "AWS"],
          experience: "5+ years",
        },
        {
          id: "2",
          name: "Alice Davis",
          email: "alice.davis@email.com",
          jobTitle: "Product Manager",
          aiScore: 92,
          status: "applied",
          appliedDate: new Date("2024-01-14"),
          skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
          experience: "7+ years",
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.johnson@email.com",
          jobTitle: "Frontend Developer",
          aiScore: 88,
          status: "applied",
          appliedDate: new Date("2024-01-13"),
          skills: ["React", "Vue.js", "CSS", "JavaScript"],
          experience: "3+ years",
        },
        {
          id: "4",
          name: "Sarah Wilson",
          email: "sarah.wilson@email.com",
          jobTitle: "UX Designer",
          aiScore: 85,
          status: "rejected",
          appliedDate: new Date("2024-01-12"),
          skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
          experience: "4+ years",
        },
      ]
      setCandidates(mockCandidates)
    } catch (error) {
      console.error("Error loading candidates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCandidateStatus = async (candidateId: string, newStatus: Candidate["status"]) => {
    setCandidates(
      candidates.map((candidate) => (candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate)),
    )
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600">Review and manage job applicants</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates by name, email, job title, or skills..."
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
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        {isLoading ? (
          <div className="text-center py-8">Loading candidates...</div>
        ) : filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No candidates have applied to your jobs yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{candidate.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                            <span>{candidate.email}</span>
                            <span>Applied for: {candidate.jobTitle}</span>
                            <span>Applied {candidate.appliedDate.toLocaleDateString()}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(candidate.aiScore)}`}>
                          {candidate.aiScore}%
                        </div>
                        <div className="text-xs text-gray-500">AI Match</div>
                      </div>
                      <Badge className={getStatusColor(candidate.status)}>
                        <span className="capitalize">{candidate.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skills & Experience</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{candidate.experience} experience</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">AI Score: {candidate.aiScore}% match</span>
                      </div>
                      <div className="flex space-x-2">
                        {candidate.status === "applied" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCandidateStatus(candidate.id, "rejected")}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                            <Button size="sm" onClick={() => updateCandidateStatus(candidate.id, "shortlisted")}>
                              Shortlist
                            </Button>
                          </>
                        )}
                        {candidate.status === "shortlisted" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCandidateStatus(candidate.id, "rejected")}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                            <Button size="sm" onClick={() => updateCandidateStatus(candidate.id, "hired")}>
                              Hire
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
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
