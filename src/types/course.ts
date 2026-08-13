import type { ClassSection, NewClass } from './class'
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

export interface AssignCourse {
  Id: number
  ClassId: number
  SectionId: number
  CourseId: number
  TeacherId: number | null
  Day: string | null
  StartTime: string | null
  EndTime: string | null
  CreatedAt: string
  UpdatedAt: string
  Course?: Course
  Teacher?: Teacher
  ClassSection?: ClassSection
  Newclass?: NewClass
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
