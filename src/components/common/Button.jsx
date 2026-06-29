import { LoaderCircle } from 'lucide-react'
import { classNames } from '../../utils/helpers'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
}

const sizes = {
  sm: 'min-h-9 px-3 py-1.5 text-xs',
  md: 'min-h-10 px-4 py-2 text-sm',
  lg: 'min-h-12 px-5 py-2.5 text-sm',
}

function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={Component === 'button' ? disabled || loading : undefined}
      {...props}
    >
      {loading && <LoaderCircle size={17} className="animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={17} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={17} />}
    </Component>
  )
}

export default Button
