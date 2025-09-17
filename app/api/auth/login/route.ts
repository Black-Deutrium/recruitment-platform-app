import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { comparePassword, generateToken } from "@/lib/auth"
import type { LoginCredentials } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await Database.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Return success response with token and user info (without password)
    const { password_hash, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
