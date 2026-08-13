import { Plus, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetClassesQuery } from '../../store/api/classesApi'
import { Table, Button, PageHeader } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { NewClass } from '../../types'
import { formatDate } from '../../utils/helpers'

function ClassesPage() {
  const navigate = useNavigate()
  const { data: classes = [], isFetching: loading } = useGetClassesQuery()

  const columns: Column<NewClass>[] = [
    { key: 'class_name', header: 'Class Name', render: (c) => <span className="font-medium text-slate-900">{c.ClassName}</span> },
    { key: 'created_at', header: 'Created', render: (c) => formatDate(c.CreatedAt) },
    { key: 'actions', header: 'Actions', render: (c) => (
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => navigate(`/administrator/classes/${c.Id}/sections`)}>
          Sections <ChevronRight size={14} className="ml-2" />
        </Button>
        <Button size="sm" variant="secondary" onClick={() => navigate(`/administrator/classes/${c.Id}/tuition-fee`)}>
          Manage Fee
        </Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Manage Classes" description="Manage school classes and their sections."
        actions={<Button icon={<Plus size={16} />} onClick={() => navigate('/administrator/classes/create')}>Add Class</Button>}
      />
      <Table columns={columns} data={classes} loading={loading} emptyTitle="No classes found" />
    </div>
  )
}

export default ClassesPage
