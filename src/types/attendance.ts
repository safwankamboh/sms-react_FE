import type { NewClass } from './class'

export interface StudentAttendance {
  Id: number
  AcademicYearId: number
  TeacherId: number
  StudentId: number
  ClassId: number
  IsPresent: boolean
  IsAbsent: boolean
  IsLeave: boolean
  AttendanceDate: string
  CreatedAt: string
  UpdatedAt: string
}

export interface AttendanceRecord {
  student_id: number
  status: 'present' | 'absent' | 'leave'
}

// `AttendanceController::viewAttendance` — one row per student, with a
// P/A/L/- value for each day of the selected month under dynamic
// `day_01`..`day_31` keys (matches the backend's raw SQL CASE columns).
export interface AttendanceReportRow {
  student_id: number
  student_name: string
  total_present: number
  total_absent: number
  total_leave: number
  [day: `day_${number}`]: string | number | undefined
}

export interface AttendanceReport {
  date: string
  class: NewClass | null
  classStudentsCount: number
  totalPresentCount: number
  totalAbsentCount: number
  totalLeaveCount: number
  days: string[]
  results: AttendanceReportRow[]
  min_date: string | null
  max_date: string | null
}
