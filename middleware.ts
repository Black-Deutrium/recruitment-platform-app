import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify token
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Role-based route protection
  if (pathname.startsWith("/student") && payload.role !== "student") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (pathname.startsWith("/recruiter") && payload.role !== "recruiter") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
