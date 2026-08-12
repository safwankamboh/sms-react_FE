import type { ReactNode, ElementType } from 'react'
import { Inbox, type LucideIcon } from 'lucide-react'
import { classNames } from '../../utils/helpers'

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: ReactNode
  compact?: boolean
}

function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={classNames('flex flex-col items-center px-6 text-center', compact ? 'py-10' : 'py-16')}>
      <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={23} />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-800">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default EmptyState
