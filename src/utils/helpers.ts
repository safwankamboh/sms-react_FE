import type { PaginationMeta, RawPaginationMeta } from '../types/common'

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function toPaginationMeta(meta?: RawPaginationMeta | null): PaginationMeta {
  const currentPage = meta?.CurrentPage ?? 1
  const perPage = meta?.PerPage ?? 0
  const total = meta?.Total ?? 0
  const lastPage = meta?.LastPage ?? 1
  return {
    currentPage,
    perPage,
    total,
    lastPage,
    from: total === 0 ? 0 : (currentPage - 1) * perPage + 1,
    to: Math.min(currentPage * perPage, total),
  }
}

export function formatDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions = {}): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(value))
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatMonthYear(monthStr: string): string {
  if (!monthStr) return '—'
  const [year, month] = monthStr.split('-')
  if (!year || !month) return monthStr
  return new Intl.DateTimeFormat('en-PK', { month: 'long', year: 'numeric' }).format(
    new Date(Number(year), Number(month) - 1),
  )
}

export function getInitials(name?: string | null): string {
  if (!name) return '—'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '—'
}
