import type { Student } from './student'

export interface StudentAttendance {
  id: number
  student_id: number
  class_id: number
  date: string
  status: 'present' | 'absent' | 'late'
  created_at: string
  updated_at: string
  student?: Student
}

export interface AttendanceRecord {
  student_id: number
  status: 'present' | 'absent' | 'late'
}
