import ComponentCard from '../components/ComponentCard'

const components = [
  {
    title: 'Yield & Tapping-Opportunity Forecasting',
    description: 'Short-horizon latex yield forecast with a tap, do-not-tap, or inspect recommendation.',
    status: 'Tap today',
    tone: 'normal' as const,
    to: '/yield',
    accentClass: 'border-emerald-600',
  },
  {
    title: 'Disease Detection & Severity',
    description: 'Classifies leaf disease, estimates severity, and flags cases for a plant pathologist.',
    status: '2 pending review',
    tone: 'watch' as const,
    to: '/disease',
    accentClass: 'border-amber-600',
  },
  {
    title: 'Tapping-Panel Health & TPD Early Warning',
    description: 'Tracks dry-cut progression over time to warn of Tapping Panel Dryness before it happens.',
    status: '1 high risk',
    tone: 'alert' as const,
    to: '/tpd',
    accentClass: 'border-red-600',
  },
  {
    title: 'Tapping Quality & Bark Monitoring',
    description: 'Audits completed tapping cuts and tracks bark consumption over time.',
    status: 'Normal',
    tone: 'normal' as const,
    to: '/tapping',
    accentClass: 'border-emerald-600',
  },
]

export default function Dashboard() {
  return (
    <div>
      <section className="bg-emerald-700 text-white -m-6 mb-8 px-6 py-10">
        <h1 className="text-2xl font-semibold">Plantation overview</h1>
        <p className="text-emerald-50 mt-2 max-w-xl">
          A risk-aware view across all four components. Status shown is sample data for now
          &mdash; it will connect to real predictions once the models are live.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {components.map((component) => (
          <ComponentCard key={component.to} {...component} />
        ))}
      </div>
    </div>
  )
}