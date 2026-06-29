import { forwardRef, useId } from 'react'
import { classNames } from '../../utils/helpers'

const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, className, required, rows = 4, ...props },
  ref,
) {
  const generatedId = useId()
  const textareaId = id || generatedId
  const helpId = `${textareaId}-help`

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
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? helpId : undefined}
        className={classNames(
          'w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100',
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100',
          className,
        )}
        {...props}
      />
      {(error || hint) && (
        <p id={helpId} className={classNames('mt-1.5 text-xs', error ? 'text-rose-600' : 'text-slate-500')}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

export default Textarea
