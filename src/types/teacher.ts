import type { AuthUser } from './auth'

export interface Teacher {
  id: number
  user_id: number
  first_name: string | null
  last_name: string | null
  contact_number: string | null
  gender: string | null
  address: string | null
  quailification: string | null
  subject_specialization: string | null
  experience: string | null
  salary_amount: number
  national_id: string | null
  photograph: string | null
  nic_front: string | null
  nic_back: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  user?: AuthUser
}

export interface TeacherFormData {
  name: string
  email: string
  password: string
  quailification?: string
  subject_specialization?: string
  experience?: string
  gender?: string
  address?: string
  contact_number?: string
  salary_amount?: string
  national_id?: string
}
