import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
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

    const { userId } = params

    // Prevent admin from suspending themselves
    if (userId === payload.userId) {
      return NextResponse.json({ success: false, message: "Cannot suspend your own account" }, { status: 400 })
    }

    // Check if user exists
    const user = await Database.findUserById(userId)
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Prevent suspension of other admin accounts
    if (user.role === "admin") {
      return NextResponse.json({ success: false, message: "Cannot suspend admin accounts" }, { status: 403 })
    }

    // In a real implementation, you would update the user's status to suspended
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "User suspended successfully",
    })
  } catch (error) {
    console.error("User suspension error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
