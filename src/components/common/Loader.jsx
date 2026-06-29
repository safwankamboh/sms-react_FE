import { LoaderCircle } from 'lucide-react'
import { classNames } from '../../utils/helpers'

function Loader({ label = 'Loading...', fullPage = false, className }) {
  return (
    <div
      className={classNames(
        'flex items-center justify-center gap-3 text-sm font-medium text-slate-500',
        fullPage && 'min-h-[50vh]',
        className,
      )}
      role="status"
    >
      <LoaderCircle className="animate-spin text-brand-600" size={22} />
      <span>{label}</span>
    </div>
  )
}

export default Loader
