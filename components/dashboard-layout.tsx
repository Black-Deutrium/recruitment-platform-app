"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Briefcase,
  Menu,
  User,
  Settings,
  LogOut,
  Home,
  FileText,
  Users,
  Shield,
  PlusCircle,
  Search,
  BarChart3,
} from "lucide-react"
import { logout } from "@/lib/hooks/use-auth"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "student" | "recruiter" | "admin"
  userName: string
  userEmail: string
}

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Profile", href: "/student/profile", icon: User },
    { name: "Jobs", href: "/student/jobs", icon: Search },
    { name: "Applications", href: "/student/applications", icon: FileText },
    { name: "Documents", href: "/student/documents", icon: Shield },
  ],
  recruiter: [
    { name: "Dashboard", href: "/recruiter", icon: Home },
    { name: "Jobs", href: "/recruiter/jobs", icon: Briefcase },
    { name: "Post Job", href: "/recruiter/jobs/new", icon: PlusCircle },
    { name: "Candidates", href: "/recruiter/candidates", icon: Users },
    { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Verifications", href: "/admin/verifications", icon: Shield },
    { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ],
}

export function DashboardLayout({ children, userRole, userName, userEmail }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const navItems = navigationItems[userRole]

  const handleLogout = () => {
    logout()
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b">
        <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-xl font-bold text-gray-900">CampusRecruit</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Role Badge */}
      <div className="px-4 py-4 border-t">
        <div className="flex items-center justify-center">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium capitalize",
              userRole === "student" && "bg-blue-100 text-blue-700",
              userRole === "recruiter" && "bg-green-100 text-green-700",
              userRole === "admin" && "bg-purple-100 text-purple-700",
            )}
          >
            {userRole}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="bg-white h-full">
            <Sidebar mobile />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <div className="bg-white h-full">
                    <Sidebar mobile />
                  </div>
                </SheetContent>
              </Sheet>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">{userRole} Dashboard</h2>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
