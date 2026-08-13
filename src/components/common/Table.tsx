import EmptyState from './EmptyState'
import Loader from './Loader'

export interface Column<T> {
  key: string
  header: string
  headerClassName?: string
  className?: string
  render?: (row: T, index: number) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyTitle?: string
  rowKey?: keyof T | ((row: T) => string | number)
}

function Table<T>({ columns, data, loading = false, emptyTitle = 'No records found', rowKey = 'id' as keyof T }: TableProps<T>) {
  return (
    <div className="overflow-hidden border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={col.headerClassName || 'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          {!loading && data.length > 0 && (
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.map((row, idx) => {
                const key = typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] as string | number)
                return (
                  <tr key={key} className="hover:bg-slate-50/70">
                    {columns.map((col) => (
                      <td key={col.key} className={col.className || 'whitespace-nowrap px-5 py-4 text-sm text-slate-600'}>
                        {col.render ? col.render(row, idx) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
      </div>
      {loading && <Loader className="py-14" />}
      {!loading && data.length === 0 && <EmptyState title={emptyTitle} compact />}
    </div>
  )
}

export default Table
