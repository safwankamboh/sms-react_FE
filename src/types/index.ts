// ─── Shared Primitives ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  role_id: number
  username: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

// ─── Class / Section ──────────────────────────────────────────────────────────

export interface NewClass {
  id: number
  sort_order: number
  class_name: string
  deleted_at?: string | null
  created_at: string
  updated_at: string
  classSections?: ClassSection[]
}

export interface ClassSection {
  id: number
  sort_order: number
  class_id: number
  section_name: string
  deleted_at?: string | null
  created_at: string
  updated_at: string
  class?: NewClass
}

// ─── Academic Year ────────────────────────────────────────────────────────────

export interface AcademicYear {
  id: number
  name: string
  code: string
  from_date: string
  to_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Student ──────────────────────────────────────────────────────────────────

export interface Student {
  id: number
  user_id: number | null
  academic_year_id: number
  first_name: string
  last_name: string
  guardian: string
  relation: string
  occupation: string | null
  national_id: string | null
  dob: string
  gender: string
  religion: string
  address: string | null
  nationality: string
  contact_number: string
  class_id: number
  class_section_id: number | null
  last_school: string | null
  photo: string | null
  birth_or_nic: string | null
  last_school_certificate: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  user?: AuthUser
  class?: NewClass
  section?: ClassSection
  academicYear?: AcademicYear
}

// Matches the multipart payload accepted by POST /student/save (see StudentController::saveStudent)
export interface StudentCreateFormData {
  first_name: string
  last_name: string
  guardian: string
  relation: string
  occupation: string
  national_id: string
  dob: string
  gender: string
  religion: string
  address: string
  nationality: string
  contact_number: string
  class_id: string
  class_section_id: string
  pre_school: string
  user_name: string
  email: string
  password: string
  cpassword: string
  photograph: File | null
  nic: File | null
  last_school_certificate: File | null
}

// ─── Teacher ──────────────────────────────────────────────────────────────────

export interface Teacher {
  id: number
  user_id: number
  designation: string | null
  qualification: string | null
  dob: string | null
  gender: string | null
  address: string | null
  phone: string | null
  salary: number | null
  joining_date: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  user?: AuthUser
}

export interface TeacherFormData {
  name: string
  email: string
  password: string
  designation?: string
  qualification?: string
  dob?: string
  gender?: string
  address?: string
  phone?: string
  salary?: string
  joining_date?: string
}

// ─── Course ───────────────────────────────────────────────────────────────────

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

// ─── Assign Course ────────────────────────────────────────────────────────────

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

// ─── Tuition Fee ──────────────────────────────────────────────────────────────

export interface TuitionFee {
  id: number
  class_id: number
  amount: number
  academic_year_id: number
  created_at: string
  updated_at: string
  newclass?: NewClass
  academic_year?: AcademicYear
}

// ─── Student Tuition Fee ──────────────────────────────────────────────────────

export interface StudentTuitionFee {
  id: number
  student_id: number
  tuition_fee_id: number
  month: string
  paid_amount: number | null
  paid_date: string | null
  is_paid: number
  created_at: string
  updated_at: string
  student?: Student
  tuition_fee?: TuitionFee
}

// ─── Teacher Salary ───────────────────────────────────────────────────────────

export interface TeacherSalary {
  id: number
  teacher_id: number
  month: string
  amount: number
  paid_amount: number | null
  paid_date: string | null
  is_paid: number
  created_at: string
  updated_at: string
  teacher?: Teacher
}

// ─── Other Expense ────────────────────────────────────────────────────────────

export interface OtherExpanse {
  id: number
  title: string
  amount: number
  description: string | null
  date: string
  created_at: string
  updated_at: string
}

export interface OtherExpanseFormData {
  title: string
  amount: string
  description?: string
  date: string
}

// ─── Exam ─────────────────────────────────────────────────────────────────────

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

// ─── Attendance ───────────────────────────────────────────────────────────────

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

// ─── Time Slot ────────────────────────────────────────────────────────────────

export interface TimeSlot {
  value: string
  label: string
}
