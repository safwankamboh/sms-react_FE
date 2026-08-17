import { Check, Calendar } from 'lucide-react'
import { useGetAllAcademicYearsQuery } from '../../store/api/academicYearApi'
import { Loader, EmptyState, Badge } from '../common'
import { classNames, formatDate } from '../../utils/helpers'
import type { AcademicYear } from '../../types'

interface AcademicYearPickerProps {
  selectedId?: number | null
  onSelect: (year: AcademicYear) => void
}

function AcademicYearPicker({ selectedId, onSelect }: AcademicYearPickerProps) {
  const { data: years = [], isFetching, isError } = useGetAllAcademicYearsQuery()

  if (isFetching) return <Loader label="Loading academic years..." />

  if (isError) {
    return <EmptyState title="Couldn't load academic years" description="Please try again in a moment." />
  }

  if (years.length === 0) {
    return <EmptyState title="No academic years found" description="Ask an administrator to create one first." />
  }

  return (
    <div className="space-y-2">
      {years.map((year) => {
        const isSelected = year.Id === selectedId
        return (
          <button
            key={year.Id}
            type="button"
            onClick={() => onSelect(year)}
            className={classNames(
              'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition',
              isSelected
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            <div className="flex items-center gap-3">
              <Calendar size={18} className={isSelected ? 'text-white' : 'text-slate-400'} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{year.Name}</span>
                  {year.IsActive && <Badge variant={isSelected ? 'default' : 'success'}>School default</Badge>}
                </div>
                <p className={classNames('text-xs', isSelected ? 'text-slate-300' : 'text-slate-500')}>
                  {formatDate(year.FromDate)} &ndash; {formatDate(year.ToDate)}
                </p>
              </div>
            </div>
            {isSelected && <Check size={18} />}
          </button>
        )
      })}
    </div>
  )
}

export default AcademicYearPicker
