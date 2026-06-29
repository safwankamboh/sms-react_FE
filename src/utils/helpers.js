export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(value, options = {}) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(value))
}
