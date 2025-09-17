import { NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    const jobs = await Database.getAllActiveJobs()

    return NextResponse.json({
      success: true,
      jobs,
    })
  } catch (error) {
    console.error("Jobs fetch error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
