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
// `Day01`..`Day31` keys (the backend's raw SQL aliases `day_01`..`day_31`
// come back PascalCased by ApiResponse::pascalize(), same as every other
// response key).
export interface AttendanceReportRow {
  StudentId: number
  StudentName: string
  TotalPresent: number | string
  TotalAbsent: number | string
  TotalLeave: number | string
  [day: `Day${number}`]: string | number | undefined
}

export interface AttendanceReport {
  Date: string
  Class: NewClass | null
  ClassStudentsCount: number
  TotalPresentCount: number
  TotalAbsentCount: number
  TotalLeaveCount: number
  Days: string[]
  Results: AttendanceReportRow[]
  MinDate: string | null
  MaxDate: string | null
}
