// Database connection and models (MongoDB simulation for now)
import type { User, Student, Job, Application, Verification } from "./types"

// In-memory database simulation (replace with actual MongoDB connection)
export class Database {
  private static users: User[] = []
  private static students: Student[] = []
  private static jobs: Job[] = []
  private static applications: Application[] = []
  private static verifications: Verification[] = []

  // Initialize with test accounts as required
  static async initialize() {
    const { hashPassword } = await import("./auth")

    // Create test accounts if they don't exist
    const testAccounts = [
      {
        id: "student-1",
        name: "Test Student",
        email: "student@test.com",
        password: "Student123",
        role: "student" as const,
      },
      {
        id: "recruiter-1",
        name: "Test Recruiter",
        email: "recruiter@test.com",
        password: "Recruiter123",
        role: "recruiter" as const,
      },
      {
        id: "admin-1",
        name: "Test Admin",
        email: "admin@test.com",
        password: "Admin123",
        role: "admin" as const,
      },
    ]

    for (const account of testAccounts) {
      const existingUser = this.users.find((u) => u.email === account.email)
      if (!existingUser) {
        const hashedPassword = await hashPassword(account.password)
        const user: User = {
          id: account.id,
          name: account.name,
          email: account.email,
          password_hash: hashedPassword,
          role: account.role,
          created_at: new Date(),
          updated_at: new Date(),
        }
        this.users.push(user)

        // Create student profile for test student
        if (account.role === "student") {
          const student: Student = {
            student_id: `student-profile-${account.id}`,
            user_id: account.id,
            skills: ["JavaScript", "React", "Node.js"],
            education: ["Computer Science - Bachelor's"],
            verified: false,
            verification_documents: [],
            additional_info: "This is additional information for the student profile.",
          }
          this.students.push(student)
        }
      }
    }
  }

  // User operations
  static async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const user: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.users.push(user)
    return user
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null
  }

  static async findUserById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null
  }

  static async getAllUsers(): Promise<Omit<User, "password_hash">[]> {
    return this.users.map(({ password_hash, ...user }) => user)
  }

  static async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id)
    if (index > -1) {
      this.users.splice(index, 1)
      return true
    }
    return false
  }

  // Student operations
  static async createStudent(studentData: Omit<Student, "student_id">): Promise<Student> {
    const student: Student = {
      ...studentData,
      student_id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    this.students.push(student)
    return student
  }

  static async findStudentByUserId(userId: string): Promise<Student | null> {
    return this.students.find((s) => s.user_id === userId) || null
  }

  static async updateStudent(studentId: string, updates: Partial<Student>): Promise<Student | null> {
    const index = this.students.findIndex((s) => s.student_id === studentId)
    if (index > -1) {
      this.students[index] = { ...this.students[index], ...updates }
      return this.students[index]
    }
    return null
  }

  static async getAllVerifiedStudents(): Promise<Student[]> {
    return this.students.filter((s) => s.verified)
  }

  // Job operations
  static async createJob(jobData: Omit<Job, "job_id" | "created_at">): Promise<Job> {
    const job: Job = {
      ...jobData,
      job_id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date(),
    }
    this.jobs.push(job)
    return job
  }

  static async findJobsByRecruiterId(recruiterId: string): Promise<Job[]> {
    return this.jobs.filter((j) => j.recruiter_id === recruiterId)
  }

  static async getAllActiveJobs(): Promise<Job[]> {
    return this.jobs.filter((j) => j.status === "active")
  }

  static async findJobById(jobId: string): Promise<Job | null> {
    return this.jobs.find((j) => j.job_id === jobId) || null
  }

  static async updateJob(jobId: string, updates: Partial<Job>): Promise<Job | null> {
    const index = this.jobs.findIndex((j) => j.job_id === jobId)
    if (index > -1) {
      this.jobs[index] = { ...this.jobs[index], ...updates }
      return this.jobs[index]
    }
    return null
  }

  static async deleteJob(jobId: string): Promise<boolean> {
    const index = this.jobs.findIndex((j) => j.job_id === jobId)
    if (index > -1) {
      this.jobs.splice(index, 1)
      return true
    }
    return false
  }

  // Application operations
  static async createApplication(appData: Omit<Application, "app_id" | "applied_at">): Promise<Application> {
    const application: Application = {
      ...appData,
      app_id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      applied_at: new Date(),
    }
    this.applications.push(application)
    return application
  }

  static async findApplicationsByStudentId(studentId: string): Promise<Application[]> {
    return this.applications.filter((a) => a.student_id === studentId)
  }

  static async findApplicationsByJobId(jobId: string): Promise<Application[]> {
    return this.applications.filter((a) => a.job_id === jobId)
  }

  // Verification operations
  static async createVerification(
    verificationData: Omit<Verification, "verify_id" | "submitted_at">,
  ): Promise<Verification> {
    const verification: Verification = {
      ...verificationData,
      verify_id: `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      submitted_at: new Date(),
    }
    this.verifications.push(verification)
    return verification
  }

  static async getPendingVerifications(): Promise<Verification[]> {
    return this.verifications.filter((v) => v.status === "pending")
  }

  static async updateVerification(verifyId: string, updates: Partial<Verification>): Promise<Verification | null> {
    const index = this.verifications.findIndex((v) => v.verify_id === verifyId)
    if (index > -1) {
      this.verifications[index] = { ...this.verifications[index], ...updates }
      return this.verifications[index]
    }
    return null
  }
}

// Initialize database on import
Database.initialize()
