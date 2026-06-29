import EmptyState from './EmptyState'
import Loader from './Loader'

function Table({ columns, data, loading = false, emptyTitle = 'No records found', rowKey = 'id' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={column.headerClassName || 'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          {!loading && data.length > 0 && (
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.map((row, rowIndex) => (
                <tr key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey]} className="hover:bg-slate-50/70">
                  {columns.map((column) => (
                    <td key={column.key} className={column.className || 'whitespace-nowrap px-5 py-4 text-sm text-slate-600'}>
                      {column.render ? column.render(row, rowIndex) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
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
