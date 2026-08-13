import type { ReactNode } from 'react'
import { classNames } from '../../utils/helpers'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info'

const variants: Record<Variant, string> = {
  default: 'border-slate-200 bg-slate-100 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-slate-300 bg-slate-100 text-slate-800',
}

interface BadgeProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span className={classNames('inline-flex items-center border px-2.5 py-1 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}

export default Badge
