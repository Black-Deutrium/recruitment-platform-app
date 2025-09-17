import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

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
    const file = formData.get("resume") as File

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Please upload PDF, DOC, or DOCX files only." },
        { status: 400 },
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size too large. Maximum size is 5MB." },
        { status: 400 },
      )
    }

    // In a real application, you would upload to a file storage service like AWS S3
    // For now, we'll simulate the upload and store a mock URL
    const resumeUrl = `/uploads/resumes/${payload.userId}-${Date.now()}-${file.name}`

    // Update student profile with resume URL
    const profile = await Database.findStudentByUserId(payload.userId)
    if (profile) {
      await Database.updateStudent(profile.student_id, {
        resume_url: resumeUrl,
      })
    } else {
      await Database.createStudent({
        user_id: payload.userId,
        skills: [],
        education: [],
        verified: false,
        verification_documents: [],
        resume_url: resumeUrl,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully",
      resume_url: resumeUrl,
    })
  } catch (error) {
    console.error("Resume upload error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
