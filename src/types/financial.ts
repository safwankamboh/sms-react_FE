import type { NewClass } from './class'
import type { AcademicYear } from './academicYear'
import type { Student } from './student'
import type { Teacher } from './teacher'

export interface TuitionFee {
  Id: number
  ClassId: number
  Amount: number
  AcademicYearId: number
  CreatedAt: string
  UpdatedAt: string
  Newclass?: NewClass
  AcademicYear?: AcademicYear
}

export interface StudentTuitionFee {
  Id: number
  StudentId: number
  TuitionFeeId: number
  Month: string
  PaidAmount: number | null
  PaidDate: string | null
  IsPaid: number
  CreatedAt: string
  UpdatedAt: string
  Student?: Student
  TuitionFee?: TuitionFee
}

export interface TeacherSalary {
  Id: number
  TeacherId: number
  Month: string
  Amount: number
  PaidAmount: number | null
  PaidDate: string | null
  IsPaid: number
  CreatedAt: string
  UpdatedAt: string
  Teacher?: Teacher
}

export interface OtherExpanse {
  Id: number
  Title: string
  Amount: number
  Description: string | null
  Date: string
  CreatedAt: string
  UpdatedAt: string
}

export interface OtherExpanseFormData {
  title: string
  amount: string
  description?: string
  date: string
}
