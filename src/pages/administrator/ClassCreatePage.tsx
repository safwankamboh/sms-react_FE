import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSaveClassMutation } from '../../store/api/classesApi'
import { FormWrapper, Input, Button, PageHeader } from '../../components/common'

function ClassCreatePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saveClass, { isLoading: saving }] = useSaveClassMutation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await saveClass({ new_class: name }).unwrap()
      navigate('/administrator/classes')
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to create class.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Create New Class" description="Add a new class to the school."
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/administrator/classes')}>Back</Button>}
      />

      <FormWrapper title="Class Details" onSubmit={handleSubmit}
        actions={
          <>
            <Button type="button" variant="secondary" onClick={() => navigate('/administrator/classes')}>Cancel</Button>
            <Button type="submit" loading={saving}>Add Class</Button>
          </>
        }
      >
        <Input label="New Class" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Class 9" />
        {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
      </FormWrapper>
    </div>
  )
}

export default ClassCreatePage
