import { type NextRequest, NextResponse } from "next/server"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Invalid token or insufficient permissions" },
        { status: 403 },
      )
    }

    // Mock data for now - in real app, fetch from database
    const mockVerifications = [
      {
        verify_id: "verify-1",
        student_id: "student-1",
        document_type: "id_card",
        doc_url: "/uploads/documents/id-card.pdf",
        status: "pending" as const,
        submitted_at: new Date("2024-01-15"),
      },
      {
        verify_id: "verify-2",
        student_id: "student-1",
        document_type: "academic_transcript",
        doc_url: "/uploads/documents/transcript.pdf",
        status: "approved" as const,
        admin_notes: "Document verified successfully",
        submitted_at: new Date("2024-01-10"),
      },
      {
        verify_id: "verify-3",
        student_id: "student-2",
        document_type: "resume",
        doc_url: "/uploads/documents/resume.pdf",
        status: "rejected" as const,
        admin_notes: "Document quality is poor, please resubmit",
        submitted_at: new Date("2024-01-12"),
      },
    ]

    return NextResponse.json({
      success: true,
      verifications: mockVerifications,
    })
  } catch (error) {
    console.error("Verifications fetch error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
