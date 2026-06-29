import { classNames } from '../../utils/helpers'

function Card({ as: Component = 'section', className, children, ...props }) {
  return (
    <Component
      className={classNames('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
