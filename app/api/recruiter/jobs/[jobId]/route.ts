import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { jobId: string } }) {
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

    const { jobId } = params
    const body = await request.json()

    // Find job and verify ownership
    const job = await Database.findJobById(jobId)
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 })
    }

    if (job.recruiter_id !== payload.userId) {
      return NextResponse.json({ success: false, message: "Unauthorized to modify this job" }, { status: 403 })
    }

    // Update job
    const updatedJob = await Database.updateJob(jobId, body)

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    })
  } catch (error) {
    console.error("Job update error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { jobId: string } }) {
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

    const { jobId } = params

    // Find job and verify ownership
    const job = await Database.findJobById(jobId)
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 })
    }

    if (job.recruiter_id !== payload.userId) {
      return NextResponse.json({ success: false, message: "Unauthorized to delete this job" }, { status: 403 })
    }

    // Delete job
    const deleted = await Database.deleteJob(jobId)
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Failed to delete job" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    })
  } catch (error) {
    console.error("Job deletion error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
