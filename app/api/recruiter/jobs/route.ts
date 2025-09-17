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
    if (!payload || payload.role !== "recruiter") {
      return NextResponse.json(
        { success: false, message: "Invalid token or insufficient permissions" },
        { status: 403 },
      )
    }

    const jobs = await Database.findJobsByRecruiterId(payload.userId)

    return NextResponse.json({
      success: true,
      jobs,
    })
  } catch (error) {
    console.error("Jobs fetch error:", error)
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
    if (!payload || payload.role !== "recruiter") {
      return NextResponse.json(
        { success: false, message: "Invalid token or insufficient permissions" },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { title, description, requirements, location, jobType, salary } = body

    // Validate required fields
    if (!title || !description || !requirements || requirements.length === 0) {
      return NextResponse.json(
        { success: false, message: "Title, description, and at least one requirement are required" },
        { status: 400 },
      )
    }

    // Create job
    const job = await Database.createJob({
      recruiter_id: payload.userId,
      title,
      description,
      requirements,
      applicants: [],
      status: "active",
      location,
      jobType,
      salary,
    })

    return NextResponse.json({
      success: true,
      message: "Job posted successfully",
      job,
    })
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
