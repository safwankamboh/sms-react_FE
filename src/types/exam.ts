import type { NewClass } from './class'
import type { Course } from './course'

export interface ExamType {
  id: number
  exam_name: string
  created_at: string
  updated_at: string
}

export interface ExamTypeFormData {
  exam_name: string
}

export interface ExamSchedule {
  id: number
  class_id: number
  exam_type_id: number
  course_id: number
  date: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
  course?: Course
  exam_type?: ExamType
  newclass?: NewClass
}

export interface ExamScheduleFormData {
  class_id: string
  exam_type_id: string
  course_id: string
  date: string
  start_time: string
  end_time: string
}
