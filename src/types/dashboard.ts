import type { AcademicYear } from './academicYear'

export interface DashboardSummary {
  AcademicYear: AcademicYear | null
  TotalStudents: number
  TotalMaleStudents: number
  TotalFemaleStudents: number
  TotalTeachers: number
  TotalClasses: number
  TotalCourses: number
}
