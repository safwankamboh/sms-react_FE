import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, CalendarClock } from 'lucide-react'
import { useGetSectionsQuery, useCreateSectionMutation } from '../../store/api/classesApi'
import { Table, Button, Modal, Input, PageHeader } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { ClassSection } from '../../types'

function SectionsPage() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const { data: sections = [], isFetching: loading } = useGetSectionsQuery(Number(classId))
  const [createSection, { isLoading: saving }] = useCreateSectionMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    try {
      await createSection({ classId: Number(classId), new_section: name }).unwrap()
      setModalOpen(false); setName('')
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to save.')
    }
  }

  const columns: Column<ClassSection>[] = [
    { key: 'section_name', header: 'Section', render: (s) => <span className="font-medium text-slate-900">{s.SectionName}</span> },
    { key: 'actions', header: 'Actions', render: (s) => (
      <Button size="sm" variant="secondary" icon={<CalendarClock size={14} />} onClick={() => navigate(`/administrator/classes/${classId}/sections/${s.Id}/timetable`)}>Timetable</Button>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Class Sections" description="Manage sections for this class."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/administrator/classes')}>Back</Button>
            <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Add Section</Button>
          </div>
        }
      />

      <Table columns={columns} data={sections} loading={loading} emptyTitle="No sections found" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Section"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#add-section-form')?.requestSubmit()} loading={saving}>Save</Button></div>}
      >
        <form id="add-section-form" onSubmit={handleSubmit} className="space-y-4">
          <Input label="Section Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Section A" />
          {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>
    </div>
  )
}

export default SectionsPage
