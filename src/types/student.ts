import type { AuthUser } from './auth'
import type { NewClass, ClassSection } from './class'
import type { AcademicYear } from './academicYear'

export interface Student {
  id: number
  user_id: number | null
  academic_year_id: number
  first_name: string
  last_name: string
  guardian: string
  relation: string
  occupation: string | null
  national_id: string | null
  dob: string
  gender: string
  religion: string
  address: string | null
  nationality: string
  contact_number: string
  class_id: number
  class_section_id: number | null
  last_school: string | null
  photo: string | null
  birth_or_nic: string | null
  last_school_certificate: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  user?: AuthUser
  class?: NewClass
  section?: ClassSection
  academicYear?: AcademicYear
}

// Matches the multipart payload accepted by POST /student/save (see StudentController::saveStudent)
export interface StudentCreateFormData {
  first_name: string
  last_name: string
  guardian: string
  relation: string
  occupation: string
  national_id: string
  dob: string
  gender: string
  religion: string
  address: string
  nationality: string
  contact_number: string
  class_id: string
  class_section_id: string
  pre_school: string
  user_name: string
  email: string
  password: string
  cpassword: string
  photograph: File | null
  nic: File | null
  last_school_certificate: File | null
}
