import type { ElementType, ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../utils/helpers'

type CardProps<T extends ElementType = 'section'> = { as?: T } & ComponentPropsWithoutRef<T>

function Card<T extends ElementType = 'section'>({ as, className, children, ...props }: CardProps<T>) {
  const Component = (as ?? 'section') as ElementType
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
