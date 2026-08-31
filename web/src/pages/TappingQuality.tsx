import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Verdict = 'acceptable' | 'correction' | 'damaging' | 'retake'

const verdictStyles: Record<Verdict, { label: string; classes: string }> = {
  acceptable: { label: 'Acceptable tapping', classes: 'bg-emerald-50 text-emerald-700 border-emerald-600' },
  correction: { label: 'Correction required', classes: 'bg-amber-50 text-amber-700 border-amber-600' },
  damaging: { label: 'Potentially damaging — inspect', classes: 'bg-red-50 text-red-700 border-red-600' },
  retake: { label: 'Retake photo', classes: 'bg-stone-100 text-stone-600 border-stone-400' },
}

type Measurement = {
  label: string
  value: string
  standard: string
  withinRange: boolean
}

type AuditResult = {
  verdict: Verdict
  measurements: Measurement[]
  message: string
}

const barkHistory = [
  { session: 'Tap 1', consumption: 1.6 },
  { session: 'Tap 2', consumption: 1.7 },
  { session: 'Tap 3', consumption: 1.5 },
  { session: 'Tap 4', consumption: 1.9 },
  { session: 'Tap 5', consumption: 2.1 },
  { session: 'Tap 6', consumption: 2.4 },
]

export default function TappingQuality() {
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<AuditResult | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  function handleAudit() {
    // Placeholder result — will call the real cut-measurement model later.
    setResult({
      verdict: 'correction',
      measurements: [
        { label: 'Cut length', value: '38 cm', standard: '35–42 cm', withinRange: true },
        { label: 'Cut slope', value: '38°', standard: '30–35°', withinRange: false },
        { label: 'Bark-strip width', value: '2.4 mm', standard: '1.5–2.5 mm', withinRange: true },
        { label: 'Cutting depth', value: 'Not measurable from image', standard: '—', withinRange: false },
      ],
      message: 'Cut slope is steeper than the recommended range. Depth cannot be safely verified from a single RGB image — request physical inspection if damage is suspected.',
    })
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Tapping quality &amp; bark monitoring</h1>
        <p className="text-stone-500 mt-1 max-w-2xl">
          Audits a completed tapping cut against Sri Lankan tapping standards using a
          scale-assisted photo, and tracks bark consumption over repeated tapping sessions.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="bg-white border border-stone-200 rounded-lg p-5 h-fit">
          <h2 className="font-semibold text-stone-800 mb-4">Post-tapping photo</h2>

          <label
            htmlFor="tapping-photo"
            className="block border-2 border-dashed border-stone-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Uploaded tapping cut" className="max-h-48 mx-auto rounded" />
            ) : (
              <div className="text-stone-400 text-sm">
                <p className="font-medium text-stone-500">Click to upload a photo</p>
                <p className="mt-1">Include the scale marker in frame</p>
              </div>
            )}
          </label>
          <input
            id="tapping-photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleAudit}
            disabled={!preview}
            className="w-full mt-4 bg-emerald-700 text-white text-sm font-medium py-2 rounded hover:bg-emerald-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
          >
            Audit tapping cut
          </button>
        </section>

        <section className="space-y-6">
          {!result ? (
            <div className="border border-dashed border-stone-300 rounded-lg p-10 text-center text-stone-400">
              Upload a post-tapping photo and click "Audit tapping cut" to see measurements.
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <p className="text-lg font-semibold text-stone-800">Cut audit result</p>
                <span className={`text-sm font-medium px-3 py-1.5 rounded-full border whitespace-nowrap ${verdictStyles[result.verdict].classes}`}>
                  {verdictStyles[result.verdict].label}
                </span>
              </div>

              <table className="w-full mt-4 text-sm">
                <thead>
                  <tr className="text-left text-stone-400 border-b border-stone-100">
                    <th className="font-medium py-2">Measurement</th>
                    <th className="font-medium py-2">Value</th>
                    <th className="font-medium py-2">Standard range</th>
                    <th className="font-medium py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.measurements.map((m) => (
                    <tr key={m.label} className="border-b border-stone-50">
                      <td className="py-2 text-stone-700">{m.label}</td>
                      <td className="py-2 text-stone-600">{m.value}</td>
                      <td className="py-2 text-stone-400">{m.standard}</td>
                      <td className="py-2">
                        <span className={m.withinRange ? 'text-emerald-600' : 'text-red-600'}>
                          {m.withinRange ? 'Within range' : 'Out of range'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-sm text-stone-600 mt-4">{result.message}</p>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <p className="text-xs text-stone-400">
                  Potentially damaging cases are referred for physical inspection.
                </p>
                <button className="text-sm text-emerald-700 font-medium hover:underline whitespace-nowrap">
                  Refer to expert
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-stone-700 mb-4">
              Bark consumption &mdash; last 6 tapping sessions
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barkHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="session" stroke="#78716c" fontSize={12} />
                <YAxis stroke="#78716c" fontSize={12} unit=" mm" />
                <Tooltip />
                <Bar dataKey="consumption" fill="#047857" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}