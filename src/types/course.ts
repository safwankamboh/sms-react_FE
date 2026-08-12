import type { ClassSection, NewClass } from './class'
import type { Teacher } from './teacher'

export interface Course {
  id: number
  course_name: string
  course_code: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface CourseFormData {
  course_name: string
  course_code?: string
}

export interface AssignCourse {
  id: number
  class_id: number
  section_id: number
  course_id: number
  teacher_id: number | null
  day: string | null
  start_time: string | null
  end_time: string | null
  created_at: string
  updated_at: string
  course?: Course
  teacher?: Teacher
  class_section?: ClassSection
  newclass?: NewClass
}

export interface AssignCourseFormData {
  class_id: string
  section_id: string
  course_id: string
  teacher_id?: string
  day?: string
  start_time?: string
  end_time?: string
}
