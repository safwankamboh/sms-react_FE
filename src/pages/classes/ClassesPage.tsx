import { useState } from 'react'
import { Plus, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetClassesQuery, useSaveClassMutation } from '../../store/api/classesApi'
import { Table, Button, Modal, Input, PageHeader } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { NewClass } from '../../types'
import { formatDate } from '../../utils/helpers'

function ClassesPage() {
  const { data: classes = [], isFetching: loading } = useGetClassesQuery()
  const [saveClass, { isLoading: saving }] = useSaveClassMutation()

  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    try {
      await saveClass({ class_name: name }).unwrap()
      setAddOpen(false); setName('')
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed.')
    }
  }

  const columns: Column<NewClass>[] = [
    { key: 'class_name', header: 'Class Name', render: (c) => <span className="font-medium text-slate-900">{c.class_name}</span> },
    { key: 'created_at', header: 'Created', render: (c) => formatDate(c.created_at) },
    { key: 'actions', header: 'Actions', render: (c) => (
      <div className="flex gap-2">
        <Button as={Link} to={`/administrator/classes/${c.id}/sections`} size="sm" variant="secondary" icon={ChevronRight} iconPosition="right">Sections</Button>
        <Button as={Link} to={`/administrator/classes/${c.id}/tuition-fee`} size="sm" variant="ghost">Tuition Fee</Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administration" title="Classes" description="Manage school classes and their sections."
        actions={<Button icon={Plus} onClick={() => setAddOpen(true)}>Add Class</Button>}
      />
      <Table columns={columns} data={classes} loading={loading} emptyTitle="No classes found" />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Class"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button form="add-class-form" type="submit" loading={saving}>Save Class</Button></div>}
      >
        <form id="add-class-form" onSubmit={handleSubmit} className="space-y-4">
          <Input label="Class Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Class 9" />
          {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>
    </div>
  )
}

export default ClassesPage
