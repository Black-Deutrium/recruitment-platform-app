import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
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

    // Prevent admin from deleting themselves
    if (userId === payload.userId) {
      return NextResponse.json({ success: false, message: "Cannot delete your own account" }, { status: 400 })
    }

    // Check if user exists
    const user = await Database.findUserById(userId)
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Prevent deletion of other admin accounts
    if (user.role === "admin") {
      return NextResponse.json({ success: false, message: "Cannot delete admin accounts" }, { status: 403 })
    }

    // Delete user
    const deleted = await Database.deleteUser(userId)
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
