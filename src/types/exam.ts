export interface ExamType {
  Id: number
  ExamType: string
  CreatedAt: string
  UpdatedAt: string
}

export interface ExamTypeFormData {
  exam_type: string
}

// No relations exist on the backend ExamSchedule model — pages resolve
// Class/Course/Teacher/ExamType names client-side from already-fetched
// lookup lists rather than via eager-loaded objects.
export interface ExamSchedule {
  Id: number
  AcademicYearId: number
  ExamTypeId: number
  ClassId: number
  CourseId: number
  ExamTeacherId: number
  ExamClassId: number
  ExamClassSectionId: number
  ExamDate: string
  CreatedAt: string
  UpdatedAt: string
}

// Matches ExamScheduleController::submitExamScheduleForm's validation
// (`exam_schedule.*.exam_teacher`, `exam_schedule.*.exam_date`) — an array
// of rows under one `exam_schedule` key.
export interface ExamScheduleRow {
  exam_type: string
  course: string
  class: string
  teacher: string
  section: string
  exam_date: string
}

export interface ExamScheduleFormData {
  exam_schedule: ExamScheduleRow[]
}
