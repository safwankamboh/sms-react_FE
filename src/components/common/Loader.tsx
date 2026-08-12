import { LoaderCircle } from 'lucide-react'
import { classNames } from '../../utils/helpers'

interface LoaderProps {
  label?: string
  fullPage?: boolean
  className?: string
}

function Loader({ label = 'Loading...', fullPage = false, className }: LoaderProps) {
  return (
    <div
      className={classNames(
        'flex items-center justify-center gap-3 text-sm font-medium text-slate-500',
        fullPage && 'min-h-[50vh]',
        className,
      )}
      role="status"
    >
      <LoaderCircle className="animate-spin text-slate-900" size={22} />
      <span>{label}</span>
    </div>
  )
}

export default Loader
