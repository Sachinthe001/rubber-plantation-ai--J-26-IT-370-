import { useState } from 'react'

type Decision = 'tap' | 'hold' | 'uncertain'

const decisionStyles: Record<Decision, { label: string; classes: string }> = {
  tap: { label: 'Tap today', classes: 'bg-emerald-50 text-emerald-700 border-emerald-600' },
  hold: { label: 'Do not tap', classes: 'bg-red-50 text-red-700 border-red-600' },
  uncertain: { label: 'Uncertain — inspect', classes: 'bg-amber-50 text-amber-700 border-amber-600' },
}

type ForecastResult = {
  expectedYield: number
  rangeLow: number
  rangeHigh: number
  decision: Decision
  factors: string[]
}

export default function YieldForecast() {
  const [block, setBlock] = useState('Block A')
  const [horizon, setHorizon] = useState('3')
  const [result, setResult] = useState<ForecastResult | null>(null)

  function handleForecast() {
    // Placeholder result so the UI can be built and tested now.
    // This will be replaced with a real API call to the ML model later.
    setResult({
      expectedYield: 18.4,
      rangeLow: 15.9,
      rangeHigh: 20.7,
      decision: 'uncertain',
      factors: [
        'Rainfall forecast is above the 7-day average for this block',
        'Tapping frequency has been consistent for the last 2 weeks',
        'Clone RRIC 100 has moderate sensitivity to wet-weather tapping',
      ],
    })
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Yield &amp; tapping-opportunity forecasting</h1>
        <p className="text-stone-500 mt-1 max-w-2xl">
          Short-horizon latex yield forecast, plus a tap / do-not-tap / uncertain recommendation
          based on weather, clone, and tapping history.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="bg-white border border-stone-200 rounded-lg p-5 h-fit">
          <h2 className="font-semibold text-stone-800 mb-4">Forecast inputs</h2>

          <label className="block text-sm text-stone-600 mb-1">Plantation block</label>
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm mb-4"
          >
            <option>Block A</option>
            <option>Block B</option>
            <option>Block C</option>
          </select>

          <label className="block text-sm text-stone-600 mb-1">Forecast horizon</label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm mb-4"
          >
            <option value="1">1 day</option>
            <option value="3">3 days</option>
            <option value="7">7 days</option>
          </select>

          <p className="text-xs text-stone-400 mb-4">
            Weather and clone data will be pulled automatically once connected to the backend.
          </p>

          <button
            onClick={handleForecast}
            className="w-full bg-emerald-700 text-white text-sm font-medium py-2 rounded hover:bg-emerald-800 transition-colors"
          >
            Get forecast
          </button>
        </section>

        <section>
          {!result && (
            <div className="border border-dashed border-stone-300 rounded-lg p-10 text-center text-stone-400">
              Choose a block and click "Get forecast" to see a prediction.
            </div>
          )}

          {result && (
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-stone-500">Expected yield ({block})</p>
                  <p className="text-3xl font-semibold text-stone-800 mt-1">
                    {result.expectedYield} <span className="text-base font-normal text-stone-400">kg</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Likely range: {result.rangeLow}&ndash;{result.rangeHigh} kg
                  </p>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1.5 rounded-full border ${decisionStyles[result.decision].classes}`}
                >
                  {decisionStyles[result.decision].label}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-stone-700 mb-2">Contributing factors</h3>
                <ul className="space-y-1.5">
                  {result.factors.map((factor) => (
                    <li key={factor} className="text-sm text-stone-600 flex gap-2">
                      <span className="text-stone-300">&bull;</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <p className="text-xs text-stone-400">
                  Uncertain cases should be confirmed by a field officer before acting.
                </p>
                <button className="text-sm text-emerald-700 font-medium hover:underline">
                  Override recommendation
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}