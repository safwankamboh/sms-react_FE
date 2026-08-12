import { useState } from 'react'
import { Plus, Eye, Trash2, RotateCcw, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  useGetStudentsQuery, useGetTrashStudentsQuery,
  useSoftDeleteStudentMutation, useRestoreStudentMutation,
} from '../../store/api/studentsApi'
import { Table, Button, PageHeader, Badge, Pagination, ConfirmDialog } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { Student } from '../../types'
import { formatDate } from '../../utils/helpers'

function StudentsPage() {
  const navigate = useNavigate()
  const [deleteId, setDeleteId] = useState<{ classId: number; studentId: number } | null>(null)
  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [page, setPage] = useState(1)

  const { data: studentsPage, isFetching: loadingStudents } = useGetStudentsQuery(page)
  const { data: trash = [], isFetching: loadingTrash } = useGetTrashStudentsQuery(undefined, { skip: tab !== 'trash' })

  const [softDeleteStudent, { isLoading: deleting }] = useSoftDeleteStudentMutation()
  const [restoreStudent] = useRestoreStudentMutation()

  const list = studentsPage?.data ?? []

  const handleDelete = async () => {
    if (!deleteId) return
    await softDeleteStudent(deleteId)
    setDeleteId(null)
  }

  const columns: Column<Student>[] = [
    { key: 'name', header: 'Name', render: (s) => (
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          <User size={14} />
        </div>
        <div>
          <p className="font-medium text-slate-900">{s.first_name} {s.last_name}</p>
          <p className="text-xs text-slate-400">{s.contact_number}</p>
        </div>
      </div>
    )},
    { key: 'guardian', header: 'Guardian', render: (s) => s.guardian },
    { key: 'class', header: 'Class', render: (s) => s.class?.class_name ?? '—' },
    { key: 'section', header: 'Section', render: (s) => s.section?.section_name ?? '—' },
    { key: 'gender', header: 'Gender', render: (s) => <Badge>{s.gender}</Badge> },
    { key: 'created_at', header: 'Enrolled On', render: (s) => formatDate(s.created_at) },
    { key: 'actions', header: 'Actions', render: (s) => (
      <div className="flex items-center gap-1">
        <Button size="sm" variant="secondary" icon={<Eye size={14} />} onClick={() => navigate(`/students/${s.class_id}/${s.id}/profile`)}>{null}</Button>
        <Button size="sm" variant="secondary" icon={<Trash2 size={14} />} className="text-rose-500 hover:bg-rose-50" onClick={() => setDeleteId({ classId: s.class_id, studentId: s.id })}>{null}</Button>
      </div>
    )},
  ]

  const trashColumns: Column<Student>[] = [
    { key: 'name', header: 'Name', render: (s) => `${s.first_name} ${s.last_name}` },
    { key: 'class', header: 'Class', render: (s) => s.class?.class_name ?? '—' },
    { key: 'deleted', header: 'Deleted At', render: (s) => formatDate(s.deleted_at) },
    { key: 'actions', header: 'Actions', render: (s) => (
      <Button size="sm" variant="secondary" icon={<RotateCcw size={14} />} onClick={() => restoreStudent({ classId: s.class_id, studentId: s.id })}>Restore</Button>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic"
        title="Students"
        description="Manage student registrations, profiles and records."
        actions={
          <div className="flex gap-2">
            <Button variant={tab === 'active' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('active')}>Active</Button>
            <Button variant={tab === 'trash' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('trash')}>Trash</Button>
            <Button icon={<Plus size={16} />} onClick={() => navigate('/students/create')}>Add Student</Button>
          </div>
        }
      />

      {tab === 'active' ? (
        <>
          <Table columns={columns} data={list} loading={loadingStudents} emptyTitle="No students found" />
          <Pagination
            currentPage={studentsPage?.current_page ?? 1}
            lastPage={studentsPage?.last_page ?? 1}
            onPageChange={setPage}
            total={studentsPage?.total ?? 0}
            from={studentsPage?.from ?? 0}
            to={studentsPage?.to ?? 0}
          />
        </>
      ) : (
        <Table columns={trashColumns} data={trash} loading={loadingTrash} emptyTitle="Trash is empty" />
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Move to Trash" description="This student will be moved to trash. You can restore them later." confirmLabel="Move to Trash" />
    </div>
  )
}

export default StudentsPage
