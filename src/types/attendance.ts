import type { Student } from './student'

export interface StudentAttendance {
  Id: number
  StudentId: number
  ClassId: number
  Date: string
  Status: 'present' | 'absent' | 'late'
  CreatedAt: string
  UpdatedAt: string
  Student?: Student
}

export interface AttendanceRecord {
  student_id: number
  status: 'present' | 'absent' | 'late'
}
