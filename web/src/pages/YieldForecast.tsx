import { useState } from 'react'

type Language = 'ENG' | 'SIN'
type TappingStatus = 'TAP' | 'CHECK' | 'DO_NOT_TAP' | 'UNABLE'

type BlockForecast = {
  id: string
  blockCode: string
  status: TappingStatus
  expectedYieldKg: number
  normalYieldKg: number
  diffPercent: number
  category: 'High' | 'Normal' | 'Low' | 'Very Low'
  confidence: number
  rainProb: number
  suitableWindow: string
  weatherSummary: string
  weatherWarning?: string
  reasons: { type: 'positive' | 'negative'; textEng: string; textSin: string }[]
  uncertaintyRange?: string
  treesCount: number
  clone: string
  lastTapped: string
}

const BLOCK_FORECASTS: BlockForecast[] = [
  {
    id: 'block-a12',
    blockCode: 'Block A12',
    status: 'TAP',
    expectedYieldKg: 1.25,
    normalYieldKg: 1.11,
    diffPercent: 12,
    category: 'High',
    confidence: 94,
    rainProb: 20,
    suitableWindow: '5:30 AM – 8:00 AM',
    weatherSummary: '🌦️ Morning forecast: Low rain probability',
    reasons: [
      { type: 'positive', textEng: 'Low rain expected during tapping window', textSin: 'තට්ටු කිරීමේ කාලය තුළ අඩු වර්ෂාපතනයක් අපේක්ෂා කෙරේ' },
      { type: 'positive', textEng: 'Suitable 3-day tapping interval (d3)', textSin: 'සුදුසු දින 3ක තට්ටු කිරීමේ පරතරය' },
      { type: 'positive', textEng: 'Recent yield history has been consistently strong', textSin: 'මෑත කාලීන කිරි අස්වැන්න ඉහළ මට්ටමක පවතී' },
      { type: 'positive', textEng: 'Optimal temperature and humidity conditions', textSin: 'අනුකූල උෂ්ණත්වය සහ ආර්ද්‍රතාවය' },
    ],
    treesCount: 140,
    clone: 'RRM 600',
    lastTapped: '2 days ago',
  },
  {
    id: 'block-b04',
    blockCode: 'Block B04',
    status: 'CHECK',
    expectedYieldKg: 0.95,
    normalYieldKg: 1.1,
    diffPercent: -13,
    category: 'Normal',
    confidence: 62,
    rainProb: 45,
    suitableWindow: '6:00 AM – 7:30 AM',
    weatherSummary: '☁️ Cloud cover & rain risk near 7:30 AM',
    weatherWarning: '🌧️ Tapping Caution: Rain expected around 7:30 AM. Check field before cut.',
    uncertaintyRange: '0.80 – 1.15 kg/tree',
    reasons: [
      { type: 'negative', textEng: 'Rainfall forecast is uncertain near 7:30 AM', textSin: 'පෙරවරු 7:30ට වර්ෂාපතනය අවිනිශ්චිතය' },
      { type: 'positive', textEng: 'Bark consumption and tree health are normal', textSin: 'පොත්ත පරිභෝජනය සාමාන්‍ය මට්ටමක පවතී' },
      { type: 'negative', textEng: 'Model confidence is moderate (62%)', textSin: 'මාදිලි විශ්වාසනීයත්වය මධ්‍යස්ථය' },
    ],
    treesCount: 120,
    clone: 'PB 260',
    lastTapped: '3 days ago',
  },
  {
    id: 'block-c02',
    blockCode: 'Block C02',
    status: 'DO_NOT_TAP',
    expectedYieldKg: 0.45,
    normalYieldKg: 1.05,
    diffPercent: -57,
    category: 'Very Low',
    confidence: 91,
    rainProb: 85,
    suitableWindow: 'Not Suitable',
    weatherSummary: '🌧️ Heavy morning rain expected',
    weatherWarning: '🚨 Heavy Rain Warning: Rain likelihood 85%. Latex runoff will occur.',
    reasons: [
      { type: 'negative', textEng: 'Heavy rain expected during morning tapping hours', textSin: 'උදෑසන අධික වර්ෂාවක් අපේක්ෂා කෙරේ' },
      { type: 'negative', textEng: 'Expected yield is very low (<0.50 kg)', textSin: 'අපේක්ෂිත අස්වැන්න ඉතා අඩුය' },
      { type: 'negative', textEng: 'High risk of latex wash-off and bark damage', textSin: 'කිරි සෝදා යාමේ හානිය ඉහළය' },
    ],
    treesCount: 150,
    clone: 'RRIC 100',
    lastTapped: '1 day ago',
  },
  {
    id: 'block-d08',
    blockCode: 'Block D08',
    status: 'UNABLE',
    expectedYieldKg: 0,
    normalYieldKg: 1.15,
    diffPercent: 0,
    category: 'Normal',
    confidence: 35,
    rainProb: 60,
    suitableWindow: 'Inspect Field First',
    weatherSummary: '🌫️ Weather station data offline / High uncertainty',
    reasons: [
      { type: 'negative', textEng: 'Missing micro-climate humidity data', textSin: 'ක්ෂුද්‍ර දේශගුණ දත්ත මගහැරී ඇත' },
      { type: 'negative', textEng: 'Abstaining from automated prediction to prevent loss', textSin: 'අලාභයන් වැළැක්වීමට ස්වයංක්‍රීය අනාවැකියෙන් වැළකී සිටී' },
    ],
    treesCount: 110,
    clone: 'PB 260',
    lastTapped: '4 days ago',
  },
]

const CALENDAR_FORECAST = [
  { day: 'Mon', date: 'Sep 1', status: 'TAP', yieldCategory: 'High (1.25 kg)', icon: '🟢' },
  { day: 'Tue', date: 'Sep 2', status: 'TAP', yieldCategory: 'Good (1.18 kg)', icon: '🟢' },
  { day: 'Wed', date: 'Sep 3', status: 'DO_NOT_TAP', yieldCategory: 'Low (0.45 kg)', icon: '🔴' },
  { day: 'Thu', date: 'Sep 4', status: 'CHECK', yieldCategory: 'Normal (0.95 kg)', icon: '🟡' },
  { day: 'Fri', date: 'Sep 5', status: 'TAP', yieldCategory: 'High (1.30 kg)', icon: '🟢' },
]

export default function YieldForecast() {
  const [lang, setLang] = useState<Language>('ENG')
  const [selectedBlock, setSelectedBlock] = useState<BlockForecast>(BLOCK_FORECASTS[0])
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'record'>('today')

  // Check-First Workflow Modal / State
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false)
  const [selectedCheckReason, setSelectedCheckReason] = useState<string>('Tree condition looks good')

  // Post-Tapping Form State
  const [actualYieldInput, setActualYieldInput] = useState<string>('1.18')
  const [tappingTimeInput, setTappingTimeInput] = useState<string>('06:15 AM')
  const [recordedSuccess, setRecordedSuccess] = useState<boolean>(false)

  function handleRecordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setRecordedSuccess(true)
    setTimeout(() => setRecordedSuccess(false), 4000)
  }

  return (
    <div className="space-y-6 font-sans text-stone-900 pb-12">
      {/* Top Banner & Language Switcher */}
      <header className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              SLIIT COMPONENT 1
            </span>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              {lang === 'SIN' ? 'කිරි අස්වැන්න අනාවැකිය' : 'Yield & Tapping Forecasting'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {lang === 'SIN' ? 'අද තට්ටු කිරීමේ තීරණය' : "Today's Tapping Decision Support"}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-0.5">
            {lang === 'SIN'
              ? 'අද දින තට්ටු කළ යුතු කොටස් සහ අපේක්ෂිත කිරි අස්වැන්න'
              : 'Actionable guidance on which blocks to tap today based on weather & yield models.'}
          </p>
        </div>

        {/* Language Toggle & Offline Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-stone-800 p-1.5 rounded-xl border border-stone-700">
            <span className="text-[11px] font-bold text-stone-400 pl-2">
              {isOffline ? '📶 Offline' : '🌐 Online'}
            </span>
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                isOffline ? 'bg-amber-500 text-white' : 'bg-stone-700 text-stone-300'
              }`}
            >
              {isOffline ? 'Local Mode' : 'Cloud Synced'}
            </button>
          </div>

          <div className="flex bg-stone-800 p-1.5 rounded-xl border border-stone-700">
            <button
              onClick={() => setLang('ENG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'ENG' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              ENG
            </button>
            <button
              onClick={() => setLang('SIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'SIN' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              සිංහල
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-2 pb-1">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === 'today' ? 'bg-stone-900 text-white shadow' : 'bg-white text-stone-600 border hover:bg-stone-50'
          }`}
        >
          🟢 {lang === 'SIN' ? 'අද දින සැලැස්ම' : "Today's Tapping Plan"}
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === 'calendar' ? 'bg-stone-900 text-white shadow' : 'bg-white text-stone-600 border hover:bg-stone-50'
          }`}
        >
          📅 {lang === 'SIN' ? 'දින 5 සැලැස්ම' : '5-Day Opportunity Calendar'}
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === 'record' ? 'bg-stone-900 text-white shadow' : 'bg-white text-stone-600 border hover:bg-stone-50'
          }`}
        >
          📝 {lang === 'SIN' ? 'සැබෑ අස්වැන්න සටහන් කරන්න' : 'Record Actual Yield'}
        </button>
      </div>

      {/* TAB 1: TODAY'S TAPPING SCREEN (MOST IMPORTANT) */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          {/* Section 1: Summary Status Matrix Bar */}
          <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Plantation Overview · Kegalle Block 4</p>
                <h2 className="text-lg font-black text-stone-900">
                  {lang === 'SIN' ? 'අද දින තට්ටු කිරීමේ තත්ත්වය' : "Today's Tapping Matrix"}
                </h2>
              </div>
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition cursor-pointer">
                🚀 {lang === 'SIN' ? 'අද තට්ටු කිරීම ආරම්භ කරන්න' : "START TODAY'S TAPPING"}
              </button>
            </div>

            {/* Summary Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-emerald-50 border-2 border-emerald-200 p-3.5 rounded-xl">
                <p className="text-[11px] font-bold text-emerald-800 uppercase">🟢 Recommended to Tap</p>
                <p className="text-2xl font-black text-emerald-700 mt-0.5">8 Blocks</p>
              </div>
              <div className="bg-amber-50 border-2 border-amber-200 p-3.5 rounded-xl">
                <p className="text-[11px] font-bold text-amber-800 uppercase">🟡 Check Before Tapping</p>
                <p className="text-2xl font-black text-amber-700 mt-0.5">3 Blocks</p>
              </div>
              <div className="bg-rose-50 border-2 border-rose-200 p-3.5 rounded-xl">
                <p className="text-[11px] font-bold text-rose-800 uppercase">🔴 Do Not Tap</p>
                <p className="text-2xl font-black text-rose-700 mt-0.5">2 Blocks</p>
              </div>
              <div className="bg-stone-100 border-2 border-stone-300 p-3.5 rounded-xl">
                <p className="text-[11px] font-bold text-stone-700 uppercase">⚪ Unable to Assess</p>
                <p className="text-2xl font-black text-stone-700 mt-0.5">1 Block</p>
              </div>
            </div>
          </div>

          {/* Quick Select Block Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase mr-1">Select Block:</span>
            {BLOCK_FORECASTS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBlock(b)
                  setCheckCompleted(false)
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                  selectedBlock.id === b.id
                    ? 'bg-stone-900 text-white border-stone-900 shadow'
                    : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {b.blockCode} ({b.status === 'TAP' ? '🟢' : b.status === 'CHECK' ? '🟡' : b.status === 'DO_NOT_TAP' ? '🔴' : '⚪'})
              </button>
            ))}
          </div>

          {/* Main Card: Block Recommendation & Weather Translator */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT COLUMN: Recommendation Card & Yield Display */}
            <div className="space-y-4">
              {/* Decision Badge Card */}
              <div
                className={`p-6 rounded-2xl border-4 space-y-4 shadow-md ${
                  selectedBlock.status === 'TAP'
                    ? 'bg-emerald-50/90 border-emerald-500'
                    : selectedBlock.status === 'CHECK'
                    ? 'bg-amber-50/90 border-amber-500'
                    : selectedBlock.status === 'DO_NOT_TAP'
                    ? 'bg-rose-50/90 border-rose-500'
                    : 'bg-stone-100 border-stone-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-black uppercase text-stone-500 tracking-wider">
                      {selectedBlock.blockCode} · {selectedBlock.clone} ({selectedBlock.treesCount} Trees)
                    </span>
                    <h3 className="text-2xl font-black text-stone-900 mt-0.5">
                      {selectedBlock.status === 'TAP' && (lang === 'SIN' ? '🟢 අද තට්ටු කරන්න' : '🟢 RECOMMENDED TO TAP TODAY')}
                      {selectedBlock.status === 'CHECK' && (lang === 'SIN' ? '🟡 පරීක්ෂා කර තට්ටු කරන්න' : '🟡 CHECK BEFORE TAPPING')}
                      {selectedBlock.status === 'DO_NOT_TAP' && (lang === 'SIN' ? '🔴 තට්ටු නොකරන්න' : '🔴 DO NOT TAP TODAY')}
                      {selectedBlock.status === 'UNABLE' && (lang === 'SIN' ? '⚪ තීරණය කළ නොහැක' : '⚪ UNABLE TO ASSESS')}
                    </h3>
                  </div>
                  <span className="text-xs font-bold bg-white text-stone-800 px-3 py-1 rounded-full border shadow-sm">
                    Confidence: {selectedBlock.confidence}%
                  </span>
                </div>

                {/* Weather Alert Warning Banner if present */}
                {selectedBlock.weatherWarning && (
                  <div className="bg-amber-500 text-white font-extrabold text-xs p-3 rounded-xl shadow">
                    {selectedBlock.weatherWarning}
                  </div>
                )}

                {/* Expected Yield Summary */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-stone-500 uppercase">Expected Latex Yield Today</p>
                    <p className="text-3xl font-black text-stone-900 mt-0.5">
                      {selectedBlock.status === 'UNABLE' ? 'Uncertain' : `${selectedBlock.expectedYieldKg} kg / tree`}
                    </p>
                    <p className="text-xs font-bold text-emerald-700 mt-1">
                      {selectedBlock.diffPercent > 0 ? `+${selectedBlock.diffPercent}% vs normal average` : `${selectedBlock.diffPercent}% vs normal average`}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                        selectedBlock.category === 'High'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedBlock.category === 'Normal'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedBlock.category} Yield
                    </span>
                    <p className="text-[11px] text-stone-400 font-bold mt-2">Normal: {selectedBlock.normalYieldKg} kg</p>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm py-3.5 rounded-xl shadow cursor-pointer">
                    {lang === 'SIN' ? 'දැන් තට්ටු කරන්න' : 'TAP NOW'}
                  </button>
                  <button className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-3.5 rounded-xl cursor-pointer">
                    {lang === 'SIN' ? 'විස්තර බලන්න' : 'VIEW DETAILS'}
                  </button>
                </div>
              </div>

              {/* Section 8: Uncertainty & "Check First" Workflow (Novelty) */}
              {selectedBlock.status === 'CHECK' && (
                <div className="bg-amber-100/80 border-2 border-amber-400 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🟡</span>
                    <h4 className="font-extrabold text-amber-950 text-sm">
                      {lang === 'SIN' ? 'අවිනිශ්චිතය - තට්ටු කිරීමට පෙර පරීක්ෂා කරන්න' : 'Uncertain Prediction: Check Field First'}
                    </h4>
                  </div>
                  <p className="text-xs text-amber-900">
                    Expected Range: <span className="font-extrabold">{selectedBlock.uncertaintyRange}</span>. Please verify canopy dryness before cutting.
                  </p>

                  {!checkCompleted ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-amber-900">Field Check Observations:</label>
                      <select
                        value={selectedCheckReason}
                        onChange={(e) => setSelectedCheckReason(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl p-2 text-xs font-bold text-stone-900"
                      >
                        <option value="Tree condition looks good">Tree condition looks good</option>
                        <option value="Bark condition unsuitable">Bark condition wet/unsuitable</option>
                        <option value="Excessive rain">Excessive canopy rain</option>
                        <option value="Tree recently tapped">Tree recently tapped</option>
                      </select>
                      <button
                        onClick={() => setCheckCompleted(true)}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer shadow"
                      >
                        ✅ FIELD CHECK COMPLETED
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-700 text-white p-3 rounded-xl text-xs font-extrabold text-center">
                      ✅ Field Check Logged: "{selectedCheckReason}" - Ready to Tap.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Weather Suitability & Explain "Why?" */}
            <div className="space-y-4">
              {/* Weather Suitability Card */}
              <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl space-y-3 shadow-sm">
                <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                  <span>🌦️</span>
                  <span>{lang === 'SIN' ? 'කාලගුණික තත්ත්වය' : 'Weather-Based Tapping Suitability'}</span>
                </h4>
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2 text-xs">
                  <p className="font-extrabold text-stone-900">{selectedBlock.weatherSummary}</p>
                  <div className="grid grid-cols-2 gap-2 text-stone-600 font-bold">
                    <p>🌧️ Rain Prob: <span className="text-stone-900">{selectedBlock.rainProb}%</span></p>
                    <p>⏰ Suitable Hours: <span className="text-emerald-700">{selectedBlock.suitableWindow}</span></p>
                  </div>
                </div>
              </div>

              {/* Explain "Why?" Section */}
              <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl space-y-3 shadow-sm">
                <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                  <span>💡</span>
                  <span>
                    {selectedBlock.status === 'DO_NOT_TAP'
                      ? lang === 'SIN' ? 'තට්ටු නොකළ යුත්තේ මන්ද?' : 'Why Should You NOT Tap?'
                      : lang === 'SIN' ? 'තට්ටු කළ යුත්තේ මන්ද?' : 'Why Is This Recommended?'}
                  </span>
                </h4>

                <ul className="space-y-2 text-xs font-semibold">
                  {selectedBlock.reasons.map((r, idx) => (
                    <li
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                        r.type === 'positive'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border-rose-200'
                      }`}
                    >
                      <span>{r.type === 'positive' ? '✓' : '⚠️'}</span>
                      <span>{lang === 'SIN' ? r.textSin : r.textEng}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5-DAY OPPORTUNITY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-white border-2 border-stone-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <span>📅</span>
            <span>{lang === 'SIN' ? 'දින 5 තට්ටු කිරීමේ කාලසටහන' : '5-Day Tapping Opportunity Calendar'}</span>
          </h2>
          <p className="text-xs text-stone-500">
            Short-term weather &amp; yield opportunity forecast to plan your week ahead.
          </p>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-900 text-stone-200 font-black uppercase text-[11px]">
                  <th className="p-3.5">Day / Date</th>
                  <th className="p-3.5 text-center">Recommendation</th>
                  <th className="p-3.5 text-center">Expected Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y font-bold">
                {CALENDAR_FORECAST.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="p-3.5 text-stone-900 font-extrabold">{item.day} ({item.date})</td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full text-stone-800">
                        {item.icon} {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-black text-emerald-700">{item.yieldCategory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RECORD ACTUAL YIELD FORM */}
      {activeTab === 'record' && (
        <div className="bg-white border-2 border-stone-200 p-6 rounded-2xl space-y-4 max-w-xl shadow-sm">
          <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <span>📝</span>
            <span>{lang === 'SIN' ? 'සැබෑ කිරි අස්වැන්න සටහන් කරන්න' : 'Record Actual Tapping Result'}</span>
          </h2>
          <p className="text-xs text-stone-500">
            Submit actual latex collected to continuously calibrate model accuracy.
          </p>

          <form onSubmit={handleRecordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Block Tapped:</label>
              <select className="w-full border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-stone-900">
                <option>Block A12 (RRM 600)</option>
                <option>Block B04 (PB 260)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Actual Latex Collected (kg/tree):</label>
                <input
                  type="number"
                  step="0.01"
                  value={actualYieldInput}
                  onChange={(e) => setActualYieldInput(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl p-2.5 text-xs font-extrabold text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tapping Time:</label>
                <input
                  type="text"
                  value={tappingTimeInput}
                  onChange={(e) => setTappingTimeInput(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl p-2.5 text-xs font-extrabold text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 rounded-xl shadow cursor-pointer"
            >
              💾 SUBMIT ACTUAL YIELD RESULT
            </button>

            {recordedSuccess && (
              <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 p-3 rounded-xl text-xs font-black text-center">
                ✅ Actual Yield Logged ({actualYieldInput} kg/tree)! Synced to model registry.
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  )
}