import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-red-700">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            This page is restricted to specific user roles. Please make sure you're logged in with the correct account
            type.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">Go Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
