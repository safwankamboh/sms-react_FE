import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetAcademicYearsQuery, useSetDefaultAcademicYearMutation } from '../../store/api/academicYearApi'
import { Table, Button, PageHeader, Badge, Pagination } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { AcademicYear } from '../../types'
import { formatDate } from '../../utils/helpers'

function AcademicYearsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data: yearsPage, isFetching: loading } = useGetAcademicYearsQuery(page)
  const [setDefaultAcademicYear] = useSetDefaultAcademicYearMutation()

  const list = yearsPage?.data ?? []

  const columns: Column<AcademicYear>[] = [
    { key: 'name', header: 'Name', render: (y) => <span className="font-medium text-slate-900">{y.Name}</span> },
    { key: 'from_date', header: 'From', render: (y) => formatDate(y.FromDate) },
    { key: 'to_date', header: 'To', render: (y) => formatDate(y.ToDate) },
    { key: 'status', header: 'Status', render: (y) => (
      y.IsActive ? (
        <Badge variant="success">Default</Badge>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => setDefaultAcademicYear(y.Id)}>Set to default</Button>
      )
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Manage Academic Years" description="View academic years and choose the active one."
        actions={<Button icon={<Plus size={16} />} onClick={() => navigate('/administrator/academic-years/create')}>Add Academic Year</Button>}
      />
      <Table columns={columns} data={list} loading={loading} emptyTitle="No academic years found" />
      <Pagination currentPage={yearsPage?.meta.currentPage ?? 1} lastPage={yearsPage?.meta.lastPage ?? 1} onPageChange={setPage} total={yearsPage?.meta.total ?? 0} from={yearsPage?.meta.from ?? 0} to={yearsPage?.meta.to ?? 0} />
    </div>
  )
}

export default AcademicYearsPage
