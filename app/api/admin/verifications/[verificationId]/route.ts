import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { verificationId: string } }) {
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

    const { verificationId } = params
    const body = await request.json()
    const { status, admin_notes } = body

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 })
    }

    // In a real application, you would update the verification in the database
    const updatedVerification = await Database.updateVerification(verificationId, {
      status,
      admin_notes,
    })

    if (!updatedVerification) {
      return NextResponse.json({ success: false, message: "Verification not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Verification ${status} successfully`,
      verification: updatedVerification,
    })
  } catch (error) {
    console.error("Verification update error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
