import Card from './Card'

function FormWrapper({ title, description, children, actions, onSubmit, className }) {
  return (
    <Card className={className}>
      {(title || description) && (
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="p-5 sm:p-6">{children}</div>
        {actions && <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">{actions}</div>}
      </form>
    </Card>
  )
}

export default FormWrapper
