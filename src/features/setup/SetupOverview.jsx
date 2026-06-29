import {
  ArrowRight,
  Check,
  Code2,
  Layers3,
  PlugZap,
  ShieldCheck,
} from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import PageHeader from '../../components/common/PageHeader'
import { API_BASE_URL } from '../../utils/constants'

const foundations = [
  {
    title: 'Scalable structure',
    description: 'Features, API services, layout, context, and shared UI are separated.',
    icon: Layers3,
  },
  {
    title: 'Centralized API client',
    description: 'Base URL, bearer token, timeouts, and normalized errors live in one place.',
    icon: PlugZap,
  },
  {
    title: 'Global state ready',
    description: 'Redux Toolkit is configured for upcoming domain-specific slices.',
    icon: Code2,
  },
  {
    title: 'Responsive shell',
    description: 'The sidebar and top navigation adapt cleanly across screen sizes.',
    icon: ShieldCheck,
  },
]

function SetupOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="School workspace"
        title="Frontend foundation"
        description="The shared application shell is ready. Business modules will be connected one at a time after their API contracts are confirmed."
        actions={<Badge variant="success">Setup ready</Badge>}
      />

      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 text-white shadow-xl shadow-slate-200">
        <div className="relative p-6 sm:p-8">
          <div className="absolute -right-16 -top-24 size-64 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <Badge className="mb-5 border-white/15 bg-white/10 text-brand-100">
              Module 1
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              A clean base for every school workflow.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
              Reusable UI, centralized state, and a consistent API layer are now in place so each upcoming module stays focused and maintainable.
            </p>
            <Button className="mt-6" icon={ArrowRight} iconPosition="right" disabled>
              Authentication comes next
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {foundations.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.title} className="p-5">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={21} />
              </div>
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </Card>
          )
        })}
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Laravel API base</p>
            <code className="mt-1 block break-all text-sm text-brand-700">
              {API_BASE_URL}
            </code>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <span className="flex size-6 items-center justify-center rounded-full bg-emerald-50">
              <Check size={14} />
            </span>
            Environment configured
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SetupOverview
