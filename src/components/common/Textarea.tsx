import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { classNames } from '../../utils/helpers'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, className, required, ...props },
  ref,
) {
  const generatedId = useId()
  const textareaId = id || generatedId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        className={classNames(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100',
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-slate-900 focus:ring-slate-100',
          className,
        )}
        {...props}
      />
      {(error || hint) && (
        <p className={classNames('mt-1.5 text-xs', error ? 'text-rose-600' : 'text-slate-500')}>{error || hint}</p>
      )}
    </div>
  )
})

export default Textarea
