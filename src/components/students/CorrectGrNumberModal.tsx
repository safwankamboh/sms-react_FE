import { useState } from 'react'
import { Modal, Button, Input, Textarea } from '../common'
import { useCorrectGrNumberMutation } from '../../store/api/studentsApi'

interface CorrectGrNumberModalProps {
  open: boolean
  onClose: () => void
  studentId: number
  currentGrNumber: string
}

// Exceptional, audited operation — never reachable from the ordinary
// profile-edit form (Phase 4b plan §10). A reason is required; the backend
// writes an audit_logs entry with the old/new value on every call.
function CorrectGrNumberModal({ open, onClose, studentId, currentGrNumber }: CorrectGrNumberModalProps) {
  const [grNumber, setGrNumber] = useState(currentGrNumber)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [correctGrNumber, { isLoading }] = useCorrectGrNumberMutation()

  const handleClose = () => {
    setGrNumber(currentGrNumber)
    setReason('')
    setError('')
    onClose()
  }

  const handleSubmit = async () => {
    setError('')
    if (!grNumber.trim() || !reason.trim()) {
      setError('GR Number and reason are both required.')
      return
    }
    try {
      await correctGrNumber({ studentId, gr_number: grNumber.trim(), reason: reason.trim() }).unwrap()
      handleClose()
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to correct GR Number.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Correct GR Number"
      description="GR Number is normally permanent — use this only for a genuine data-entry correction."
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} loading={isLoading} disabled={grNumber.trim() === currentGrNumber}>Save</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        <Input label="GR Number" value={grNumber} onChange={(e) => setGrNumber(e.target.value)} required />
        <Textarea
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why is this correction needed?"
          rows={3}
          required
        />
      </div>
    </Modal>
  )
}

export default CorrectGrNumberModal
