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
