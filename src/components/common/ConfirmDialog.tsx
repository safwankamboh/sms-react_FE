import { TriangleAlert } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  variant?: 'danger' | 'primary'
}

function ConfirmDialog({
  open, onClose, onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button
            variant={variant === 'danger' ? 'primary' : variant}
            className={variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : ''}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <TriangleAlert size={21} />
        </div>
        <p className="pt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
