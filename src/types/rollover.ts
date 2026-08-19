// Academic-year rollover (Phase 4a) — shapes matched against the live,
// verified `/adminstrator/academic-years/rollover*` API responses, not
// guessed.

export type RolloverDecision = 'promoted' | 'retained' | 'transferred'

export interface RolloverCandidate {
  StudentId: number
  GrNumber: string
  Name: string
  RollNumber: string | null
  FromEnrollmentId: number
  CurrentClassId: number
  CurrentClassSectionId: number | null
  CurrentClassSectionName: string | null
  SuggestedClassId: number | null
  SuggestedClassName: string | null
}

export interface RolloverDecisionInput {
  student_id: number
  decision: RolloverDecision
  to_class_id: number
  to_class_section_id: number
  to_branch_id?: number
  remarks?: string
}

export interface RolloverOutcome {
  StudentId: number
  EnrollmentId: number
}

export interface RolloverRejection {
  StudentId: number
  Reason: string
}

export interface RolloverResult {
  Processed: RolloverOutcome[]
  AlreadyProcessed: RolloverOutcome[]
  Rejected: RolloverRejection[]
}
