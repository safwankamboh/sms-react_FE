import type { NewClass } from './class'
import type { Teacher } from './teacher'

export interface Course {
  Id: number
  CourseName: string
  CourseCode: string | null
  DeletedAt: string | null
  CreatedAt: string
  UpdatedAt: string
}

export interface CourseFormData {
  course_name: string
  course_code?: string
}

// The model only has `class()`, `teacher()` and `course()` relations — no
// `classSection` relation exists, even though `class_section_id` is a real
// column (stored as a plain string, not a validated FK).
export interface AssignCourse {
  Id: number
  AcademicYearId: number
  ClassId: number
  ClassSectionId: string | null
  CourseId: number | null
  TeacherId: number | null
  IsBreak: boolean
  FromTime: string
  ToTime: string
  CreatedAt: string
  UpdatedAt: string
  Class?: NewClass
  Course?: Course
  Teacher?: Teacher
}

// Matches AssignCourseController::assignCourse/updateAssignCourse's actual
// validation (`course`, `teacher`, `from_time`, `to_time`) plus the
// unvalidated `class_section_id` it also reads off the request.
export interface AssignCourseFormData {
  course: string
  teacher: string
  from_time: string
  to_time: string
  class_section_id?: string
}
