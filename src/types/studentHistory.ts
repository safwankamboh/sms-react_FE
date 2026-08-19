import type { AuthUser } from './auth'
import type { NewClass, ClassSection } from './class'
import type { AcademicYear } from './academicYear'
import type { RolloverDecision } from './rollover'
import type { StudentStatus } from './student'

// Shapes matched against the live, verified GET /student/{id}/history
// response (Phase 4b §11) — a pure read composition over already-immutable
// enrollment/promotion/status-history data, not a new table.

export interface StudentHistoryEnrollment {
  Id: number
  ClassId: number
  ClassSectionId: number | null
  RollNumber: string | null
  AdmissionDate: string | null
  Status: string
  PromotionStatus: RolloverDecision | 'new_admission' | null
  AcademicYearId: number
  Class?: NewClass
  ClassSection?: ClassSection
  AcademicYear?: AcademicYear
}

export interface StudentHistoryPromotion {
  Id: number
  FromEnrollmentId: number
  ToEnrollmentId: number
  FromAcademicYearId: number
  ToAcademicYearId: number
  FromClassId: number
  ToClassId: number
  Decision: RolloverDecision
  ProcessedBy?: AuthUser
  ProcessedAt: string
  Remarks: string | null
}

export interface StudentHistoryTimelineEntry {
  Enrollment: StudentHistoryEnrollment
  Promotion: StudentHistoryPromotion | null
}

export interface StudentStatusHistoryEntry {
  Id: number
  StudentId: number
  Status: StudentStatus
  EffectiveDate: string
  Reason: string | null
  ChangedBy: number | null
  CreatedAt: string
}

export interface StudentHistory {
  Student: {
    Id: number
    GrNumber: string
    FirstName: string
    LastName: string
    Status: StudentStatus
  }
  Timeline: StudentHistoryTimelineEntry[]
  StatusHistory: StudentStatusHistoryEntry[]
}
