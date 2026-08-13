// The pagination meta as sent by the backend envelope's `Meta` key.
export interface RawPaginationMeta {
  CurrentPage: number
  PerPage: number
  Total: number
  LastPage: number
}

// Frontend-facing pagination shape (camelCase, matches the `Pagination`
// component's props) — `from`/`to` are derived client-side since the
// backend only sends the four fields above.
export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
  from: number
  to: number
}

export interface TimeSlot {
  value: string
  label: string
}

// The generic envelope every backend API response is wrapped in. Endpoints
// don't need this directly (the base query already unwraps `Data`/`Meta`
// for them), but it documents the wire shape and is handy for anything that
// needs to reason about the raw response (e.g. reading `Errors` directly).
export interface ApiResponse<T = unknown> {
  Success: boolean
  Message: string
  Data: T
  Meta: RawPaginationMeta | null
  Errors: Record<string, string[]> | null
}
