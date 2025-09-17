import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { hashPassword, generateToken } from "@/lib/auth"
import type { RegisterData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    const { name, email, password, role } = body

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    if (!["student", "recruiter"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role specified" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await Database.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create user
    const user = await Database.createUser({
      name,
      email,
      password_hash,
      role,
    })

    // Create student profile if role is student
    if (role === "student") {
      await Database.createStudent({
        user_id: user.id,
        skills: [],
        education: [],
        verified: false,
        verification_documents: [],
      })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Return success response with token and user info (without password)
    const { password_hash: _, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
