import { useState } from 'react'
import { Modal, Button, Select, Textarea } from '../common'
import { useChangeStudentStatusMutation } from '../../store/api/studentsApi'
import type { StudentStatus } from '../../types'

const STATUS_OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'transferred', label: 'Transferred' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'graduated', label: 'Graduated' },
]

interface ChangeStudentStatusModalProps {
  open: boolean
  onClose: () => void
  studentId: number
  currentStatus: StudentStatus
}

function ChangeStudentStatusModal({ open, onClose, studentId, currentStatus }: ChangeStudentStatusModalProps) {
  const [status, setStatus] = useState<StudentStatus>(currentStatus)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [changeStatus, { isLoading }] = useChangeStudentStatusMutation()

  const handleClose = () => {
    setStatus(currentStatus)
    setReason('')
    setError('')
    onClose()
  }

  const handleSubmit = async () => {
    setError('')
    try {
      await changeStatus({ studentId, status, reason: reason || undefined }).unwrap()
      handleClose()
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to update status.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change Student Status"
      description="Records a permanent lifecycle transition — never deletes the student record."
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} loading={isLoading} disabled={status === currentStatus}>Save</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        <Select
          label="New Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(e) => setStatus(e.target.value as StudentStatus)}
          placeholder=""
        />
        <Textarea
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Optional note explaining this change"
          rows={3}
        />
      </div>
    </Modal>
  )
}

export default ChangeStudentStatusModal
