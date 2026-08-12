import type { AuthUser } from './auth'

export interface Teacher {
  id: number
  user_id: number
  designation: string | null
  qualification: string | null
  dob: string | null
  gender: string | null
  address: string | null
  phone: string | null
  salary: number | null
  joining_date: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  user?: AuthUser
}

export interface TeacherFormData {
  name: string
  email: string
  password: string
  designation?: string
  qualification?: string
  dob?: string
  gender?: string
  address?: string
  phone?: string
  salary?: string
  joining_date?: string
}
