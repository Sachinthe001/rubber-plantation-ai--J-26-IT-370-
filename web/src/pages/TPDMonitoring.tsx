import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { colors } from '../theme/colors'

const treeOptions = ['Tree-014', 'Tree-027', 'Tree-041'] as const
type TreeId = (typeof treeOptions)[number]

type Status = 'normal' | 'watch' | 'alert'

const statusStyles: Record<Status, { label: string; classes: string }> = {
  normal: { label: 'Normal', classes: 'bg-emerald-50 text-emerald-700 border-emerald-600' },
  watch: { label: 'Monitor', classes: 'bg-amber-50 text-amber-700 border-amber-600' },
  alert: { label: 'High TPD risk — inspect', classes: 'bg-red-50 text-red-700 border-red-600' },
}

const history: Record<TreeId, { week: string; dryCut: number }[]> = {
  'Tree-014': [
    { week: 'Wk 1', dryCut: 18 }, { week: 'Wk 2', dryCut: 20 },
    { week: 'Wk 3', dryCut: 19 }, { week: 'Wk 4', dryCut: 22 },
    { week: 'Wk 5', dryCut: 21 }, { week: 'Wk 6', dryCut: 23 },
  ],
  'Tree-027': [
    { week: 'Wk 1', dryCut: 30 }, { week: 'Wk 2', dryCut: 35 },
    { week: 'Wk 3', dryCut: 41 }, { week: 'Wk 4', dryCut: 44 },
    { week: 'Wk 5', dryCut: 49 }, { week: 'Wk 6', dryCut: 53 },
  ],
  'Tree-041': [
    { week: 'Wk 1', dryCut: 40 }, { week: 'Wk 2', dryCut: 48 },
    { week: 'Wk 3', dryCut: 55 }, { week: 'Wk 4', dryCut: 63 },
    { week: 'Wk 5', dryCut: 71 }, { week: 'Wk 6', dryCut: 78 },
  ],
}

const assessments: Record<TreeId, { status: Status; message: string }> = {
  'Tree-014': { status: 'normal', message: 'Dry-cut percentage is stable and well below the risk threshold.' },
  'Tree-027': { status: 'watch', message: 'Dry-cut percentage is rising steadily. Recommend closer monitoring over the next 2 weeks.' },
  'Tree-041': { status: 'alert', message: 'Dry-cut trend has crossed the high-risk threshold. Recommend expert inspection before further tapping.' },
}

export default function TPDMonitoring() {
  const [tree, setTree] = useState<TreeId>('Tree-027')
  const [horizon, setHorizon] = useState('30')
  const [assessed, setAssessed] = useState(false)

  const data = history[tree]
  const result = assessments[tree]

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Tapping-panel health &amp; TPD early warning</h1>
        <p className="text-stone-500 mt-1 max-w-2xl">
          Tracks dry-cut percentage across repeated observations of the same tree to warn of
          Tapping Panel Dryness before latex flow fails.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="bg-white border border-stone-200 rounded-lg p-5 h-fit">
          <h2 className="font-semibold text-stone-800 mb-4">Assessment inputs</h2>

          <label className="block text-sm text-stone-600 mb-1">Tree ID</label>
          <select
            value={tree}
            onChange={(e) => {
              setTree(e.target.value as TreeId)
              setAssessed(false)
            }}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm mb-4"
          >
            {treeOptions.map((id) => (
              <option key={id}>{id}</option>
            ))}
          </select>

          <label className="block text-sm text-stone-600 mb-1">Prediction horizon</label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm mb-4"
          >
            <option value="30">Next 30 days</option>
            <option value="60">Next 60 days</option>
          </select>

          <button
            onClick={() => setAssessed(true)}
            className="w-full bg-emerald-700 text-white text-sm font-medium py-2 rounded hover:bg-emerald-800 transition-colors"
          >
            Assess TPD risk
          </button>
        </section>

        <section className="space-y-6">
          {assessed ? (
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-stone-500">{tree} &middot; next {horizon} days</p>
                  <p className="text-lg font-semibold text-stone-800 mt-1">TPD risk assessment</p>
                </div>
                <span className={`text-sm font-medium px-3 py-1.5 rounded-full border whitespace-nowrap ${statusStyles[result.status].classes}`}>
                  {statusStyles[result.status].label}
                </span>
              </div>
              <p className="text-sm text-stone-600 mt-4">{result.message}</p>
            </div>
          ) : (
            <div className="border border-dashed border-stone-300 rounded-lg p-8 text-center text-stone-400">
              Choose a tree and click "Assess TPD risk" for a future-risk prediction.
            </div>
          )}

          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-stone-700 mb-4">
              Dry-cut percentage &mdash; last 6 observations
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="week" stroke="#78716c" fontSize={12} />
                <YAxis stroke="#78716c" fontSize={12} domain={[0, 100]} unit="%" />
                <Tooltip />
                <ReferenceLine y={70} stroke={colors.alert} strokeDasharray="4 4" label={{ value: 'High-risk threshold', position: 'insideTopRight', fontSize: 11, fill: colors.alert }} />
                <Line type="monotone" dataKey="dryCut" stroke={colors.primary} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}