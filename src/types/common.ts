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

export interface TimeSlot {
  value: string
  label: string
}
