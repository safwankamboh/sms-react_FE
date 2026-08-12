import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          This page does not exist yet or will be added in a later module.
        </p>
        <Button as={Link} to="/" className="mt-6">
          Back to overview
        </Button>
      </div>
    </main>
  )
}

export default NotFound
