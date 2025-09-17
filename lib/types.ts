// Database schema types based on requirements
export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: "student" | "recruiter" | "admin"
  created_at: Date
  updated_at: Date
}

export interface Student {
  student_id: string
  user_id: string
  skills: string[]
  education: string[]
  resume_url?: string
  verified: boolean
  verification_documents: VerificationDocument[]
  phone?: string
  bio?: string
}

export interface Job {
  job_id: string
  recruiter_id: string
  title: string
  description: string
  requirements: string[]
  applicants: string[]
  status: "active" | "closed"
  created_at: Date
}

export interface Application {
  app_id: string
  job_id: string
  student_id: string
  status: "applied" | "shortlisted" | "rejected" | "hired"
  ai_score?: number
  applied_at: Date
}

export interface Verification {
  verify_id: string
  student_id: string
  document_type: string
  doc_url: string
  status: "pending" | "approved" | "rejected"
  admin_notes?: string
  submitted_at: Date
}

export interface VerificationDocument {
  type: string
  url: string
  status: "pending" | "approved" | "rejected"
  uploaded_at: Date
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: "student" | "recruiter"
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: Omit<User, "password_hash">
  message?: string
}
