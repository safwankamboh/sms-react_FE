import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { UploadCloud } from 'lucide-react'
import { classNames } from '../../utils/helpers'

interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  label?: string
  error?: string
  hint?: string
  fileName?: string | null
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { label, error, hint, fileName, id, className, required, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const helpId = `${inputId}-help`

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      <label
        htmlFor={inputId}
        className={classNames(
          'flex w-full cursor-pointer items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition',
          error ? 'border-rose-300' : 'border-slate-200 hover:border-slate-300',
          className,
        )}
      >
        <UploadCloud size={16} className="shrink-0 text-slate-400" />
        <span className={classNames('truncate', fileName ? 'text-slate-900' : 'text-slate-400')}>
          {fileName || 'Choose a file…'}
        </span>
        <input
          ref={ref}
          id={inputId}
          type="file"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? helpId : undefined}
          className="sr-only"
          {...props}
        />
      </label>
      {(error || hint) && (
        <p id={helpId} className={classNames('mt-1.5 text-xs', error ? 'text-rose-600' : 'text-slate-500')}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

export default FileInput
