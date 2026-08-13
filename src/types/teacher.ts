import type { AuthUser } from './auth'

export interface Teacher {
  Id: number
  UserId: number
  FirstName: string | null
  LastName: string | null
  ContactNumber: string | null
  Gender: string | null
  Address: string | null
  Quailification: string | null
  SubjectSpecialization: string | null
  Experience: string | null
  SalaryAmount: number
  NationalId: string | null
  Photograph: string | null
  NicFront: string | null
  NicBack: string | null
  DeletedAt: string | null
  CreatedAt: string
  UpdatedAt: string
  User?: AuthUser
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
