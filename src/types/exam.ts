import type { NewClass } from './class'
import type { Course } from './course'

export interface ExamType {
  Id: number
  ExamName: string
  CreatedAt: string
  UpdatedAt: string
}

export interface ExamTypeFormData {
  exam_name: string
}

export interface ExamSchedule {
  Id: number
  ClassId: number
  ExamTypeId: number
  CourseId: number
  Date: string
  StartTime: string
  EndTime: string
  CreatedAt: string
  UpdatedAt: string
  Course?: Course
  ExamType?: ExamType
  Newclass?: NewClass
}

export interface ExamScheduleFormData {
  class_id: string
  exam_type_id: string
  course_id: string
  date: string
  start_time: string
  end_time: string
}
