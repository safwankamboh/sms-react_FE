import type { NewClass } from './class'
import type { AcademicYear } from './academicYear'
import type { Student } from './student'
import type { Teacher } from './teacher'

export interface TuitionFee {
  id: number
  class_id: number
  amount: number
  academic_year_id: number
  created_at: string
  updated_at: string
  newclass?: NewClass
  academic_year?: AcademicYear
}

export interface StudentTuitionFee {
  id: number
  student_id: number
  tuition_fee_id: number
  month: string
  paid_amount: number | null
  paid_date: string | null
  is_paid: number
  created_at: string
  updated_at: string
  student?: Student
  tuition_fee?: TuitionFee
}

export interface TeacherSalary {
  id: number
  teacher_id: number
  month: string
  amount: number
  paid_amount: number | null
  paid_date: string | null
  is_paid: number
  created_at: string
  updated_at: string
  teacher?: Teacher
}

export interface OtherExpanse {
  id: number
  title: string
  amount: number
  description: string | null
  date: string
  created_at: string
  updated_at: string
}

export interface OtherExpanseFormData {
  title: string
  amount: string
  description?: string
  date: string
}
