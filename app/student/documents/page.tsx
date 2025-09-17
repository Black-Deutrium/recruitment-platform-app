"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/hooks/use-auth"
import { Shield, Upload, FileText, CheckCircle, Clock, XCircle, AlertCircle, Eye } from "lucide-react"
import type { Verification } from "@/lib/types"

export default function StudentDocuments() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [documents, setDocuments] = useState<Verification[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [isUploading, setIsUploading] = useState(false)
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
    if (!loading && isAuthenticated && user?.role !== "student") {
      router.push("/unauthorized")
    }
    if (user) {
      loadDocuments()
    }
  }, [loading, isAuthenticated, user, router])

  const loadDocuments = async () => {
    try {
      const response = await fetch("/api/student/documents", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error("Error loading documents:", error)
    }
  }

  const getAuthToken = () => {
    const cookies = document.cookie.split(";")
    const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth-token="))
    return authCookie ? authCookie.split("=")[1] : ""
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !documentType) {
      setError("Please select a file and document type")
      return
    }

    setIsUploading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("document", selectedFile)
    formData.append("documentType", documentType)

    try {
      const response = await fetch("/api/student/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Document uploaded successfully! It will be reviewed by our admin team.")
        setSelectedFile(null)
        setDocumentType("")
        loadDocuments()
      } else {
        setError(data.message || "Failed to upload document")
      }
    } catch (error) {
      setError("An error occurred while uploading the document")
    } finally {
      setIsUploading(false)
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  return (
    <DashboardLayout userRole="student" userName={user.name || "Student"} userEmail={user.email}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
            <p className="text-gray-600">Upload and manage your verification documents</p>
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

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>
              Upload documents for verification to increase your profile credibility and access more job opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document">Choose File</Label>
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max size: 10MB)</p>
              <Button type="submit" disabled={isUploading || !selectedFile || !documentType}>
                {isUploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Track the status of your uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
                <p className="text-gray-600">Upload your first document to start the verification process</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.verify_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {documentTypes.find((t) => t.value === doc.document_type)?.label || doc.document_type}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Submitted {new Date(doc.submitted_at).toLocaleDateString()}
                        </p>
                        {doc.admin_notes && doc.status === "rejected" && (
                          <p className="text-sm text-red-600 mt-1">Admin notes: {doc.admin_notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(doc.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(doc.status)}
                          <span className="capitalize">{doc.status}</span>
                        </span>
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Guidelines</CardTitle>
            <CardDescription>Tips for successful document verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Clear and Readable</h4>
                  <p className="text-sm text-gray-600">Ensure all text and details are clearly visible</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Complete Document</h4>
                  <p className="text-sm text-gray-600">Upload the full document, not just excerpts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Valid and Current</h4>
                  <p className="text-sm text-gray-600">Ensure documents are current and not expired</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Correct Format</h4>
                  <p className="text-sm text-gray-600">Use supported file formats (PDF preferred)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
