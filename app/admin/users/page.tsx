"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/use-auth"
import { Users, Search, MoreVertical, UserCheck, UserX, Shield, AlertCircle, Trash2 } from "lucide-react"
import type { User } from "@/lib/types"

export default function AdminUsers() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<Omit<User, "password_hash">[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
    if (!loading && isAuthenticated && user?.role !== "admin") {
      router.push("/unauthorized")
    }
    if (user) {
      loadUsers()
    }
  }, [loading, isAuthenticated, user, router])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      } else {
        setError(data.message || "Failed to load users")
      }
    } catch (error) {
      setError("An error occurred while loading users")
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthToken = () => {
    const cookies = document.cookie.split(";")
    const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth-token="))
    return authCookie ? authCookie.split("=")[1] : ""
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setUsers(users.filter((u) => u.id !== userId))
        setSuccess("User deleted successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.message || "Failed to delete user")
      }
    } catch (error) {
      setError("An error occurred while deleting user")
    }
  }

  const handleSuspendUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("User suspended successfully")
        setTimeout(() => setSuccess(""), 3000)
        loadUsers() // Reload to get updated status
      } else {
        setError(data.message || "Failed to suspend user")
      }
    } catch (error) {
      setError("An error occurred while suspending user")
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-700"
      case "recruiter":
        return "bg-green-100 text-green-700"
      case "admin":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || u.role === roleFilter

    return matchesSearch && matchesRole
  })

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <DashboardLayout userRole="admin" userName={user.name || "Admin"} userEmail={user.email}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage platform users and their permissions</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "student").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recruiters</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "recruiter").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="recruiter">Recruiters</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {isLoading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm || roleFilter !== "all" ? "Try adjusting your search or filter criteria" : "No users yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((u) => (
              <Card key={u.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {u.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{u.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                            <span>{u.email}</span>
                            <span>Joined {new Date(u.created_at).toLocaleDateString()}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(u.role)}>
                        <span className="capitalize">{u.role}</span>
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <UserCheck className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSuspendUser(u.id)}>
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 focus:text-red-600"
                            disabled={u.role === "admin"}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Account Status:</span>
                      <span className="ml-2 text-green-600">Active</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Last Login:</span>
                      <span className="ml-2 text-gray-600">2 hours ago</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Account Type:</span>
                      <span className="ml-2 text-gray-600 capitalize">{u.role}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
