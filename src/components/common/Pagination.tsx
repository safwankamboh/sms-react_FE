import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  total?: number
  from?: number
  to?: number
}

function Pagination({ currentPage, lastPage, onPageChange, total, from, to }: PaginationProps) {
  if (lastPage <= 1) return null

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {total != null && (
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{from}</span> to{' '}
          <span className="font-medium text-slate-700">{to}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span>
        </p>
      )}
      <div className="flex gap-2 sm:ml-auto">
        <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" icon={ChevronRight} iconPosition="right" disabled={currentPage >= lastPage} onClick={() => onPageChange(currentPage + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default Pagination
