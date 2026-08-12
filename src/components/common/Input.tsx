import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { classNames } from '../../utils/helpers'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: LucideIcon
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon: Icon, id, className, required, ...props },
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
      <div className="relative">
        {Icon && (
          <Icon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? helpId : undefined}
          className={classNames(
            'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100',
            Icon && 'pl-10',
            error
              ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
              : 'border-slate-200 focus:border-slate-900 focus:ring-slate-100',
            className,
          )}
          {...props}
        />
      </div>
      {(error || hint) && (
        <p id={helpId} className={classNames('mt-1.5 text-xs', error ? 'text-rose-600' : 'text-slate-500')}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

export default Input
