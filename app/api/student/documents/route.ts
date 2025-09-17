import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Invalid token or insufficient permissions" },
        { status: 403 },
      )
    }

    // Get student profile to find student_id
    const student = await Database.findStudentByUserId(payload.userId)
    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 })
    }

    // Mock data for now - in real app, fetch from database
    const mockDocuments = [
      {
        verify_id: "verify-1",
        student_id: student.student_id,
        document_type: "id_card",
        doc_url: "/uploads/documents/id-card.pdf",
        status: "approved" as const,
        admin_notes: "Document verified successfully",
        submitted_at: new Date("2024-01-10"),
      },
      {
        verify_id: "verify-2",
        student_id: student.student_id,
        document_type: "academic_transcript",
        doc_url: "/uploads/documents/transcript.pdf",
        status: "pending" as const,
        submitted_at: new Date("2024-01-15"),
      },
    ]

    return NextResponse.json({
      success: true,
      documents: mockDocuments,
    })
  } catch (error) {
    console.error("Documents fetch error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Invalid token or insufficient permissions" },
        { status: 403 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("document") as File
    const documentType = formData.get("documentType") as string

    if (!file || !documentType) {
      return NextResponse.json({ success: false, message: "File and document type are required" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Please upload PDF, JPG, PNG, DOC, or DOCX files only." },
        { status: 400 },
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size too large. Maximum size is 10MB." },
        { status: 400 },
      )
    }

    // Get student profile
    const student = await Database.findStudentByUserId(payload.userId)
    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 })
    }

    // In a real application, you would upload to a file storage service
    const docUrl = `/uploads/documents/${payload.userId}-${Date.now()}-${file.name}`

    // Create verification record
    const verification = await Database.createVerification({
      student_id: student.student_id,
      document_type: documentType,
      doc_url: docUrl,
      status: "pending",
    })

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      verification,
    })
  } catch (error) {
    console.error("Document upload error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
