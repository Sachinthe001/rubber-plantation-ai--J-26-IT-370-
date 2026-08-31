import { Link } from 'react-router-dom'

type Tone = 'normal' | 'watch' | 'alert'

type Props = {
  title: string
  description: string
  status: string
  tone: Tone
  to: string
  accentClass: string
}

const toneStyles: Record<Tone, string> = {
  normal: 'bg-emerald-50 text-emerald-700',
  watch: 'bg-amber-50 text-amber-700',
  alert: 'bg-red-50 text-red-700',
}

export default function ComponentCard({ title, description, status, tone, to, accentClass }: Props) {
  return (
    <Link
      to={to}
      className={`block bg-white border-l-4 ${accentClass} p-5 hover:shadow-md transition-shadow rounded-r-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-stone-800">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${toneStyles[tone]}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-stone-500 mt-2">{description}</p>
    </Link>
  )
}