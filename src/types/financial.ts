import type { NewClass } from './class'
import type { AcademicYear } from './academicYear'
import type { Student } from './student'
import type { Teacher } from './teacher'

export interface TuitionFee {
  Id: number
  ClassId: number
  AcademicYearId: number
  ApplyDate: string
  Amount: number
  AdmissionFee: number
  // Only present on `manageTuitionFee`'s response — a dynamic attribute the
  // backend computes per-row (true when the month is in the past or fees
  // have already been collected for it), absent on other TuitionFee reads.
  Disabled?: boolean
  CreatedAt: string
  UpdatedAt: string
  Newclass?: NewClass
  AcademicYear?: AcademicYear
}

export interface StudentTuitionFee {
  Id: number
  Month: string
  AcademicYearId: number
  ClassId: number
  StudentId: number
  AdmissionFee: number | null
  ClassFeeAmount: number
  FeeDiscount: number | null
  DiscountReason: string | null
  ReceivingAmount: number | null
  ReceivingDate: string | null
  PaymentStatus: boolean
  CreatedAt: string
  UpdatedAt: string
}

// `financialController::viewAllClassesFee` — a class's students with fee
// totals computed server-side, not a bare StudentTuitionFee list.
export interface StudentWithFeeTotals extends Student {
  TotalFee: number
  TotalReceived: number
}

export interface ClassFeeSummary {
  Students: StudentWithFeeTotals[]
  TotalStudentsFee: number
  TotalFeeCollection: number
  TotalPandings: number
}

// `financialController::getOutstandingStudentwise` — students who still
// need a fee row generated for the given month.
export interface StudentFeeOutstanding {
  student_id: number
  student_name: string
  class_fee_amount: number
  class_id: number
  academic_year_id: number
  month: string
}

// `financialController::viewFeeCollectForm` — one row per month for a
// student, `month_id` only present once a TuitionFee row exists for it.
export interface FeeCollectionRow {
  month_id?: number
  month: string
  fee_amount: number
  receiving_amount: number
  status: 'Paid' | 'Unpaid' | 'Fee not set'
}

export interface TeacherSalary {
  Id: number
  Month: string
  AcademicYearId: number
  TeacherId: number
  CreatedDate: string
  SalaryAmount: number
  BonusAmount: number | null
  BonusReason: string | null
  PayingAmount: number | null
  PayingDate: string | null
  PaymentStatus: boolean
  CreatedAt: string
  UpdatedAt: string
  Teacher?: Teacher
}

// `TeachersSalaryController::getTeachersOutstandings` — teachers who still
// need a salary row generated for the given month.
export interface TeacherSalaryOutstanding {
  teacher_id: number
  teacher_name: string
  salary_amount: number
  academic_year_id: number
  month: string
}

// `TeachersSalaryController::viewTeacherSalary` — one row per month for a
// teacher, `month_id` only present once a TeachersSalary row exists for it.
export interface TeacherSalaryMonthRow {
  month_id?: number
  month: string
  salary_amount: number
  status: 'Paid' | 'Unpaid'
}

export interface OtherExpanse {
  Id: number
  AcademicYearId: number
  ExpanseName: string
  ExpanseAmount: number
  BillingDate: string
  CreatedAt: string
  UpdatedAt: string
}

export interface OtherExpanseFormData {
  expanse_name: string
  expanse_amount: string
  billing_date: string
}
