import type { AuthUser } from './auth'
import type { NewClass, ClassSection } from './class'
import type { AcademicYear } from './academicYear'

export interface Student {
  Id: number
  UserId: number | null
  AcademicYearId: number
  FirstName: string
  LastName: string
  Guardian: string
  Relation: string
  Occupation: string | null
  NationalId: string | null
  Dob: string
  Gender: string
  Religion: string
  Address: string | null
  Nationality: string
  ContactNumber: string
  ClassId: number
  ClassSectionId: number | null
  LastSchool: string | null
  Photo: string | null
  BirthOrNic: string | null
  LastSchoolCertificate: string | null
  DeletedAt: string | null
  CreatedAt: string
  UpdatedAt: string
  User?: AuthUser
  Class?: NewClass
  Section?: ClassSection
  AcademicYear?: AcademicYear
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
