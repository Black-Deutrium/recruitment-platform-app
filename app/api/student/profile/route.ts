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

    // Get user and student profile
    const user = await Database.findUserById(payload.userId)
    const profile = await Database.findStudentByUserId(payload.userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      profile,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { name, phone, bio, skills, education } = body

    // Update user name
    const user = await Database.findUserById(payload.userId)
    if (user && name) {
      user.name = name
      user.updated_at = new Date()
    }

    // Update or create student profile
    const profile = await Database.findStudentByUserId(payload.userId)
    if (profile) {
      await Database.updateStudent(profile.student_id, {
        skills: skills || [],
        education: education || [],
        phone,
        bio,
      })
    } else {
      await Database.createStudent({
        user_id: payload.userId,
        skills: skills || [],
        education: education || [],
        verified: false,
        verification_documents: [],
        phone,
        bio,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
