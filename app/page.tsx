import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">CampusRecruit</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Campus Recruitment Made Simple</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your campus hiring process with AI-powered candidate verification, automated resume screening,
            and comprehensive recruitment management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>For Students</CardTitle>
              <CardDescription>Create your profile, upload documents, and apply to jobs with ease</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Profile management</li>
                <li>• Document verification</li>
                <li>• Job applications</li>
                <li>• Application tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Briefcase className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>For Recruiters</CardTitle>
              <CardDescription>Post jobs, review candidates, and manage your hiring pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Job posting management</li>
                <li>• AI-powered candidate ranking</li>
                <li>• Application review</li>
                <li>• Interview scheduling</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>For Administrators</CardTitle>
              <CardDescription>Oversee the platform, verify documents, and manage users</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• User management</li>
                <li>• Document verification</li>
                <li>• Platform analytics</li>
                <li>• System monitoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Platform Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">AI-Powered Screening</h4>
              <p className="text-sm text-gray-600">Automated resume analysis and candidate ranking</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Document Verification</h4>
              <p className="text-sm text-gray-600">Secure verification of candidate credentials</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Role-Based Access</h4>
              <p className="text-sm text-gray-600">Separate dashboards for each user type</p>
            </div>
            <div className="text-center">
              <Briefcase className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Complete Workflow</h4>
              <p className="text-sm text-gray-600">End-to-end recruitment management</p>
            </div>
          </div>
        </div>

        {/* Test Accounts Info */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">Test the Platform</h3>
          <p className="text-gray-600 mb-4">Use these test accounts to explore different user roles:</p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-blue-600">Student Account</h4>
              <p>Email: student@test.com</p>
              <p>Password: Student123</p>
            </div>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-green-600">Recruiter Account</h4>
              <p>Email: recruiter@test.com</p>
              <p>Password: Recruiter123</p>
            </div>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-purple-600">Admin Account</h4>
              <p>Email: admin@test.com</p>
              <p>Password: Admin123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
