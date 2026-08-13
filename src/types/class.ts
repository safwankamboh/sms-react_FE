export interface NewClass {
  Id: number
  SortOrder: number
  ClassName: string
  DeletedAt?: string | null
  CreatedAt: string
  UpdatedAt: string
  ClassSections?: ClassSection[]
}

export interface ClassSection {
  Id: number
  SortOrder: number
  ClassId: number
  SectionName: string
  DeletedAt?: string | null
  CreatedAt: string
  UpdatedAt: string
  Class?: NewClass
}
