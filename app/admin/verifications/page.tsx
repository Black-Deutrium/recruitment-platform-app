"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/hooks/use-auth"
import { Shield, Search, Eye, CheckCircle, XCircle, Clock, FileText, AlertCircle } from "lucide-react"
import type { Verification } from "@/lib/types"

export default function AdminVerifications() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const documentTypes = [
    { value: "id_card", label: "ID Card" },
    { value: "academic_transcript", label: "Academic Transcript" },
    { value: "degree_certificate", label: "Degree Certificate" },
    { value: "resume", label: "Resume/CV" },
    { value: "portfolio", label: "Portfolio" },
    { value: "recommendation_letter", label: "Recommendation Letter" },
  ]

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "admin") {
      router.push("/unauthorized")
    }
    if (user) {
      loadVerifications()
    }
  }, [loading, isAuthenticated, user, router])

  const loadVerifications = async () => {
    try {
      const response = await fetch("/api/admin/verifications", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setVerifications(data.verifications)
      }
    } catch (error) {
      console.error("Error loading verifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthToken = () => {
    const cookies = document.cookie.split(";")
    const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth-token="))
    return authCookie ? authCookie.split("=")[1] : ""
  }

  const handleVerificationAction = async (verificationId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/admin/verifications/${verificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          status: action === "approve" ? "approved" : "rejected",
          admin_notes: adminNotes,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess(`Document ${action}d successfully`)
        setAdminNotes("")
        setSelectedVerification(null)
        loadVerifications()
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.message || `Failed to ${action} document`)
      }
    } catch (error) {
      setError(`An error occurred while ${action}ing the document`)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "approved":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredVerifications = verifications.filter((verification) => {
    const matchesSearch =
      verification.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.student_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || verification.status === statusFilter

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
          <Shield className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Verifications</h1>
            <p className="text-gray-600">Review and verify student documents</p>
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
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifications.filter((v) => v.status === "pending").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifications.filter((v) => v.status === "approved").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifications.filter((v) => v.status === "rejected").length}</div>
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
                  placeholder="Search by document type or student ID..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Verifications List */}
        {isLoading ? (
          <div className="text-center py-8">Loading verifications...</div>
        ) : filteredVerifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No verifications found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No documents submitted for verification yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredVerifications.map((verification) => (
              <Card key={verification.verify_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {documentTypes.find((t) => t.value === verification.document_type)?.label ||
                          verification.document_type}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                          <span>Student ID: {verification.student_id}</span>
                          <span>Submitted {new Date(verification.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(verification.status)}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(verification.status)}
                        <span className="capitalize">{verification.status}</span>
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {verification.admin_notes && (
                        <p>
                          <span className="font-medium">Admin Notes:</span> {verification.admin_notes}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVerification(verification)
                              setAdminNotes(verification.admin_notes || "")
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Document Verification</DialogTitle>
                            <DialogDescription>Review and verify the submitted document</DialogDescription>
                          </DialogHeader>
                          {selectedVerification && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Document Type:</span>
                                  <p>
                                    {documentTypes.find((t) => t.value === selectedVerification.document_type)?.label ||
                                      selectedVerification.document_type}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium">Student ID:</span>
                                  <p>{selectedVerification.student_id}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Submitted:</span>
                                  <p>{new Date(selectedVerification.submitted_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span>
                                  <p className="capitalize">{selectedVerification.status}</p>
                                </div>
                              </div>

                              <div className="border rounded-lg p-4 bg-gray-50">
                                <p className="text-sm text-gray-600 mb-2">Document Preview:</p>
                                <div className="flex items-center justify-center h-32 bg-white border rounded">
                                  <FileText className="h-8 w-8 text-gray-400" />
                                  <span className="ml-2 text-gray-500">Document preview not available</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="adminNotes">Admin Notes</Label>
                                <Textarea
                                  id="adminNotes"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add notes about the verification decision..."
                                  rows={3}
                                />
                              </div>

                              {selectedVerification.status === "pending" && (
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleVerificationAction(selectedVerification.verify_id, "reject")}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => handleVerificationAction(selectedVerification.verify_id, "approve")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
