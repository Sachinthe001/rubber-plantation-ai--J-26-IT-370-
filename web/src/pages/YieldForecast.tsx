import { useState } from 'react'

type Language = 'ENG' | 'SIN'
type TappingStatus = 'TAP' | 'CHECK' | 'DO_NOT_TAP' | 'UNABLE'
type NotifPriority = 'urgent' | 'info' | 'system'

type Notification = {
  id: string
  priority: NotifPriority
  title: string
  titleSin: string
  body: string
  bodySin: string
  time: string
  read: boolean
  expired?: boolean
}

type BlockForecast = {
  id: string
  blockCode: string
  status: TappingStatus
  yieldRangeLow: number
  yieldRangeHigh: number
  yieldLabel: string
  normalYieldKg: number
  diffPercent: number
  category: 'High' | 'Normal' | 'Low' | 'Very Low'
  confidence: number
  rainProb: number
  tempC: number
  humidityPct: number
  rainfall3dayMm: number
  rainfall7dayMm: number
  suitableWindow: string
  weatherSummary: string
  weatherWarning?: string
  reasons: { type: 'positive' | 'negative'; textEng: string; textSin: string }[]
  treesCount: number
  clone: string
  treeAgeyears: number
  lastTapped: string
  daysSinceLastTap: number
  tappingHistory: { day: string; tapped: boolean; reason?: string }[]
  decisionReasonEng: string
  decisionReasonSin: string
  isScheduledToday: boolean
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    priority: 'urgent',
    title: '🔴 Decision Overridden — Block C02',
    titleSin: '🔴 තීරණය වෙනස් කරන ලදී — C02 කොටස',
    body: 'Officer Aruna reversed "Do Not Tap" for Block C02. Reason: Manual inspection passed.',
    bodySin: 'නිලධාරී අරුණ C02 "නොකළ" තීරණය ආපසු ගත්තේය. කාරණය: අතින් පරීක්ෂාව සිදු කෙරිණ.',
    time: '06:12 AM today',
    read: false,
  },
  {
    id: 'n2',
    priority: 'info',
    title: '🟡 Forecast Updated — Block A12',
    titleSin: '🟡 අනාවැකිය යාවත්කාලීනයි — A12 කොටස',
    body: "Tomorrow's forecast for Block A12 changed from TAP to CHECK. Rain probability now 48%.",
    bodySin: 'A12 හෙට අනාවැකිය TAP සිට CHECK දක්වා වෙනස් විය. වර්ෂා සම්භාවිතාව 48%.',
    time: '04:30 AM today',
    read: false,
  },
  {
    id: 'n3',
    priority: 'info',
    title: '🟡 Block Reassignment',
    titleSin: '🟡 කොටස නැවත පැවරීම',
    body: 'Block D08 has been reassigned to Division 2. Your records are still intact.',
    bodySin: 'D08 කොටස 2 වන කොට්ඨාසයට නැවත පවරා ඇත.',
    time: 'Yesterday 3:00 PM',
    read: true,
  },
  {
    id: 'n4',
    priority: 'system',
    title: '⚪ Sync Completed',
    titleSin: '⚪ සමමුහුර්ත කිරීම සම්පූර්ණයි',
    body: '14 records synced to cloud at 3:50 AM.',
    bodySin: 'සිදුවීම් 14 ක් පෙ.ව. 3:50ට cloud වෙත sync විය.',
    time: '03:50 AM today',
    read: true,
  },
]

const BLOCK_FORECASTS: BlockForecast[] = [
  {
    id: 'block-a12',
    blockCode: 'Block A12',
    status: 'TAP',
    yieldRangeLow: 1.10,
    yieldRangeHigh: 1.42,
    yieldLabel: '1.10 – 1.42 kg/tree',
    normalYieldKg: 1.11,
    diffPercent: 12,
    category: 'High',
    confidence: 94,
    rainProb: 20,
    tempC: 27,
    humidityPct: 74,
    rainfall3dayMm: 8,
    rainfall7dayMm: 22,
    suitableWindow: '5:30 AM – 8:00 AM',
    weatherSummary: '🌤️ Morning forecast: Clear with low rain probability',
    reasons: [
      { type: 'positive', textEng: 'Low rain probability during tapping window', textSin: 'තට්ටු කාලය තුළ අඩු වර්ෂා සම්භාවිතාවක් ඇත' },
      { type: 'positive', textEng: 'Suitable 3-day tapping interval (d3)', textSin: 'සුදුසු දින 3ක තට්ටු පරතරය' },
      { type: 'positive', textEng: 'Recent yield history is strong', textSin: 'මෑත කාලීන කිරි අස්වැන්න ඉහළය' },
    ],
    treesCount: 140,
    clone: 'RRM 600',
    treeAgeyears: 9,
    lastTapped: '2 days ago',
    daysSinceLastTap: 2,
    tappingHistory: [
      { day: 'Mon', tapped: true },
      { day: 'Tue', tapped: false, reason: 'Rest day' },
      { day: 'Wed', tapped: true },
      { day: 'Thu', tapped: false, reason: 'Heavy rain' },
      { day: 'Fri', tapped: true },
      { day: 'Sat', tapped: true },
      { day: 'Sun', tapped: false, reason: 'Day off' },
    ],
    decisionReasonEng: 'Low rain & strong yield expected — good window this morning.',
    decisionReasonSin: 'අඩු වර්ෂාව හා ඉහළ අස්වැන්නක් අපේක්ෂිතය — අද උදෑසන ශ්‍රේෂ්ඨ කාලයකි.',
    isScheduledToday: true,
  },
  {
    id: 'block-b04',
    blockCode: 'Block B04',
    status: 'CHECK',
    yieldRangeLow: 0.80,
    yieldRangeHigh: 1.15,
    yieldLabel: '0.80 – 1.15 kg/tree',
    normalYieldKg: 1.10,
    diffPercent: -13,
    category: 'Normal',
    confidence: 62,
    rainProb: 45,
    tempC: 25,
    humidityPct: 82,
    rainfall3dayMm: 28,
    rainfall7dayMm: 55,
    suitableWindow: '6:00 AM – 7:30 AM',
    weatherSummary: '☁️ Cloud cover with rain risk near 7:30 AM',
    weatherWarning: '🌧️ Rain expected ~7:30 AM. Check field before cut.',
    reasons: [
      { type: 'negative', textEng: 'Rainfall forecast is uncertain near 7:30 AM', textSin: 'පෙ.ව. 7:30ට වර්ෂාව අවිනිශ්චිතය' },
      { type: 'positive', textEng: 'Bark and tree health are normal', textSin: 'පොතු සෞඛ්‍යය සාමාන්‍යයි' },
      { type: 'negative', textEng: 'Model confidence is moderate (62%)', textSin: 'මාදිලි විශ්වාසය මධ්‍යස්ථය' },
    ],
    treesCount: 120,
    clone: 'PB 260',
    treeAgeyears: 7,
    lastTapped: '3 days ago',
    daysSinceLastTap: 3,
    tappingHistory: [
      { day: 'Mon', tapped: true },
      { day: 'Tue', tapped: false, reason: 'Rain' },
      { day: 'Wed', tapped: false, reason: 'Rain' },
      { day: 'Thu', tapped: true },
      { day: 'Fri', tapped: false, reason: 'Check required' },
      { day: 'Sat', tapped: true },
      { day: 'Sun', tapped: false, reason: 'Day off' },
    ],
    decisionReasonEng: 'Recent rainfall of 28mm in 3 days reduces expected yield.',
    decisionReasonSin: 'දින 3 තුළ 28mm වර්ෂාව නිසා අස්වැන්න ප්‍රතිශතය අඩු වේ.',
    isScheduledToday: false,
  },
  {
    id: 'block-c02',
    blockCode: 'Block C02',
    status: 'DO_NOT_TAP',
    yieldRangeLow: 0.30,
    yieldRangeHigh: 0.60,
    yieldLabel: '0.30 – 0.60 kg/tree',
    normalYieldKg: 1.05,
    diffPercent: -57,
    category: 'Very Low',
    confidence: 91,
    rainProb: 85,
    tempC: 22,
    humidityPct: 95,
    rainfall3dayMm: 45,
    rainfall7dayMm: 89,
    suitableWindow: 'Not Suitable Today',
    weatherSummary: '🌧️ Heavy morning rain — not suitable for tapping',
    weatherWarning: '🚨 Heavy Rain Warning: 85% rain probability. Latex washoff likely.',
    reasons: [
      { type: 'negative', textEng: 'Heavy rain during tapping hours', textSin: 'අධික වර්ෂාව' },
      { type: 'negative', textEng: 'Expected yield is very low (<0.60 kg)', textSin: 'අස්වැන්නේ ප්‍රතිශතය ඉතා අඩුය' },
      { type: 'negative', textEng: 'High risk of latex washoff and bark damage', textSin: 'කිරි සෝදා යාමේ ඉහළ අවදානමකි' },
    ],
    treesCount: 150,
    clone: 'RRIC 100',
    treeAgeyears: 11,
    lastTapped: '1 day ago',
    daysSinceLastTap: 1,
    tappingHistory: [
      { day: 'Mon', tapped: true },
      { day: 'Tue', tapped: true },
      { day: 'Wed', tapped: false, reason: 'Rain' },
      { day: 'Thu', tapped: true },
      { day: 'Fri', tapped: true },
      { day: 'Sat', tapped: false, reason: 'Rain' },
      { day: 'Sun', tapped: false, reason: 'Day off' },
    ],
    decisionReasonEng: '80% rain expected this morning. Latex washoff risk is high.',
    decisionReasonSin: 'අද උදෑසන 80% වර්ෂා සම්භාවිතාවක් ඇත. කිරි සෝදා යාමේ අවදානම ඉහළය.',
    isScheduledToday: false,
  },
  {
    id: 'block-d08',
    blockCode: 'Block D08',
    status: 'UNABLE',
    yieldRangeLow: 0,
    yieldRangeHigh: 0,
    yieldLabel: 'Uncertain',
    normalYieldKg: 1.15,
    diffPercent: 0,
    category: 'Normal',
    confidence: 35,
    rainProb: 60,
    tempC: 24,
    humidityPct: 88,
    rainfall3dayMm: 33,
    rainfall7dayMm: 61,
    suitableWindow: 'Inspect Field First',
    weatherSummary: '🌫️ Weather station data offline — high uncertainty',
    reasons: [
      { type: 'negative', textEng: 'Missing micro-climate humidity sensor data', textSin: 'ක්ෂුද්‍ර දේශගුණ ආර්ද්‍රතා දත්ත නොමැත' },
      { type: 'negative', textEng: 'Abstaining to prevent yield-loss decisions', textSin: 'ශ්‍රේෂ්ඨ නිගමනයක් ලෙස ස්වයංක්‍රීය අනාවැකිය ප්‍රතිකෝෂ කරයි' },
    ],
    treesCount: 110,
    clone: 'PB 260',
    treeAgeyears: 8,
    lastTapped: '4 days ago',
    daysSinceLastTap: 4,
    tappingHistory: [
      { day: 'Mon', tapped: false, reason: 'Sensor offline' },
      { day: 'Tue', tapped: true },
      { day: 'Wed', tapped: false, reason: 'Sensor offline' },
      { day: 'Thu', tapped: true },
      { day: 'Fri', tapped: false, reason: 'Unknown' },
      { day: 'Sat', tapped: true },
      { day: 'Sun', tapped: false, reason: 'Day off' },
    ],
    decisionReasonEng: 'Sensor data missing. Field inspection required before tapping.',
    decisionReasonSin: 'සංවේදක දත්ත නොමැත. තට්ටු කිරීමට පෙර ක්ෂේත්‍ර පරීක්ෂාව අවශ්‍යයි.',
    isScheduledToday: false,
  },
]

const CALENDAR_FORECAST = [
  { day: 'Mon', date: 'Sep 1', status: 'TAP', yieldLabel: 'Expected: 38–52 kg', icon: '🟢' },
  { day: 'Tue', date: 'Sep 2', status: 'TAP', yieldLabel: 'Expected: 34–48 kg', icon: '🟢' },
  { day: 'Wed', date: 'Sep 3', status: 'DO_NOT_TAP', yieldLabel: 'Expected: Normal', icon: '🔴' },
  { day: 'Thu', date: 'Sep 4', status: 'CHECK', yieldLabel: 'Expected: 28–42 kg', icon: '🟡' },
  { day: 'Fri', date: 'Sep 5', status: 'TAP', yieldLabel: 'Expected: 40–56 kg', icon: '🟢' },
]

export default function YieldForecast() {
  const [lang, setLang] = useState<Language>('ENG')
  const [selectedBlock, setSelectedBlock] = useState<BlockForecast>(BLOCK_FORECASTS[0])
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'record'>('today')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS)
  const [showBlockDetail, setShowBlockDetail] = useState(false)

  // Check-First Workflow
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false)
  const [selectedCheckReason, setSelectedCheckReason] = useState<string>('Tree condition looks good')

  // Post-Tapping Feedback
  const [feedbackMode, setFeedbackMode] = useState<'idle' | 'tapped' | 'skipped' | 'done'>('idle')
  const [skipReason, setSkipReason] = useState<string>('rain')
  const [actualYield, setActualYield] = useState<string>('')
  const [recordedSuccess, setRecordedSuccess] = useState<boolean>(false)
  const [actualYieldInput, setActualYieldInput] = useState<string>('1.18')
  const [tappingTimeInput, setTappingTimeInput] = useState<string>('06:15 AM')

  function handleRecordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setRecordedSuccess(true)
    setTimeout(() => setRecordedSuccess(false), 4000)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const statusConfig = {
    TAP: { bg: 'bg-emerald-50', border: 'border-emerald-500', badge: 'bg-emerald-600', text: 'text-emerald-900', icon: '🟢' },
    CHECK: { bg: 'bg-amber-50', border: 'border-amber-400', badge: 'bg-amber-500', text: 'text-amber-900', icon: '🟡' },
    DO_NOT_TAP: { bg: 'bg-rose-50', border: 'border-rose-500', badge: 'bg-rose-600', text: 'text-rose-900', icon: '🔴' },
    UNABLE: { bg: 'bg-stone-100', border: 'border-stone-400', badge: 'bg-stone-500', text: 'text-stone-700', icon: '⚪' },
  }

  const cfg = statusConfig[selectedBlock.status]

  return (
    <div className="space-y-5 font-sans text-stone-900 pb-16 relative">

      {/* ─── TOP BAR ─── */}
      <header className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white p-5 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                SLIIT Component 1
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                {lang === 'SIN' ? 'කිරි අස්වැන්න අනාවැකිය' : 'Yield & Tapping Forecast'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {lang === 'SIN' ? 'අද තට්ටු කිරීමේ තීරණය' : "Today's Tapping Decision Support"}
            </h1>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sync indicator */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition ${
                isOffline
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              }`}
            >
              {isOffline ? '⏳ Pending Sync' : '✓ Synced'}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-stone-700 hover:bg-stone-600 border border-stone-600 p-2.5 rounded-xl cursor-pointer transition"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-stone-700">
                    <span className="text-xs font-black text-white uppercase">
                      {lang === 'SIN' ? 'දැනුම්දීම්' : 'Notifications'}
                    </span>
                    <button onClick={markAllRead} className="text-[10px] text-emerald-400 hover:underline cursor-pointer font-bold">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-800">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 flex gap-2 ${n.read ? 'opacity-60' : 'bg-stone-800/60'}`}
                        onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                      >
                        <span className="text-lg mt-0.5">
                          {n.priority === 'urgent' ? '🔴' : n.priority === 'info' ? '🟡' : '⚪'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white leading-tight">
                            {lang === 'SIN' ? n.titleSin : n.title}
                          </p>
                          <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">
                            {lang === 'SIN' ? n.bodySin : n.body}
                          </p>
                          <p className="text-[9px] text-stone-500 mt-1">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language toggle */}
            <div className="flex bg-stone-800 p-1 rounded-xl border border-stone-700">
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
        </div>
      </header>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
      )}

      {/* ─── BLOCK SELECTOR ─── */}
      <div className="bg-white border-2 border-stone-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-stone-500 uppercase tracking-wide mr-1">
            {lang === 'SIN' ? '📍 කොටස:' : '📍 Select Block:'}
          </span>
          {BLOCK_FORECASTS.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBlock(b)
                setCheckCompleted(false)
                setFeedbackMode('idle')
                setShowBlockDetail(false)
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold border-2 transition cursor-pointer ${
                selectedBlock.id === b.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {statusConfig[b.status].icon} {b.blockCode}
              {b.isScheduledToday && (
                <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full ml-0.5">TODAY</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── SUB-TABS ─── */}
      {/* 'Record Yield' tab is disabled when the block was not supposed to be tapped */}
      <div className="flex border-b border-stone-200 gap-1 pb-1">
        {[
          { key: 'today', icon: '🟢', eng: "Today's Plan", sin: 'අද දින සැලැස්ම' },
          { key: 'calendar', icon: '📅', eng: '5-Day Calendar', sin: 'දින 5 සැලැස්ම' },
          { key: 'record', icon: '📝', eng: 'Record Yield', sin: 'අස්වැන්න සටහන' },
        ].map((tab) => {
          const isRecordDisabled =
            tab.key === 'record' &&
            (selectedBlock.status === 'DO_NOT_TAP' || selectedBlock.status === 'UNABLE')
          return (
            <button
              key={tab.key}
              onClick={() => {
                if (!isRecordDisabled) setActiveTab(tab.key as typeof activeTab)
              }}
              title={
                isRecordDisabled
                  ? lang === 'SIN'
                    ? 'අද තට්ටු නොකළ නිසා අවශ්‍ය නැත'
                    : 'Not applicable — block was not tapped today'
                  : undefined
              }
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                isRecordDisabled
                  ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-60'
                  : activeTab === tab.key
                  ? 'bg-stone-900 text-white shadow cursor-pointer'
                  : 'bg-white text-stone-600 border hover:bg-stone-50 cursor-pointer'
              }`}
            >
              {tab.icon} {lang === 'SIN' ? tab.sin : tab.eng}
              {isRecordDisabled && (
                <span className="ml-1 text-[9px] font-black uppercase tracking-wide">N/A</span>
              )}
            </button>
          )
        })}
      </div>

      {/* ═══ TAB 1: TODAY'S TAPPING PLAN ═══ */}
      {activeTab === 'today' && (
        <div className="space-y-5">

          {/* Overview Matrix */}
          <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
              {lang === 'SIN' ? 'අද දින ව්‍යාපෘතිය · Kegalle Block' : 'Plantation Overview · Kegalle Block 4'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: lang === 'SIN' ? '🟢 තට්ටු කරන්න' : '🟢 Tap Today', val: '8 Blocks', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                { label: lang === 'SIN' ? '🟡 පරීක්ෂා කරන්න' : '🟡 Check First', val: '3 Blocks', bg: 'bg-amber-50 border-amber-200 text-amber-800' },
                { label: lang === 'SIN' ? '🔴 නොකරන්න' : '🔴 Do Not Tap', val: '2 Blocks', bg: 'bg-rose-50 border-rose-200 text-rose-800' },
                { label: lang === 'SIN' ? '⚪ නොදන්නා' : '⚪ Unable to Assess', val: '1 Block', bg: 'bg-stone-50 border-stone-200 text-stone-700' },
              ].map((item) => (
                <div key={item.label} className={`${item.bg} border-2 p-3.5 rounded-xl`}>
                  <p className="text-[10px] font-black uppercase leading-tight">{item.label}</p>
                  <p className="text-2xl font-black mt-1">{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── HERO DECISION CARD ─── */}
          <div className={`${cfg.bg} border-4 ${cfg.border} rounded-3xl p-6 shadow-lg space-y-4`}>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <span className="text-[10px] font-black uppercase text-stone-500 tracking-widest">
                  {selectedBlock.blockCode} · {selectedBlock.clone} · {selectedBlock.treesCount} Trees
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 leading-tight">
                  {selectedBlock.status === 'TAP' && (lang === 'SIN' ? '🟢 අද තට්ටු කරන්න' : '🟢 TAP TODAY')}
                  {selectedBlock.status === 'CHECK' && (lang === 'SIN' ? '🟡 පරීක්ෂා කර තට්ටු කරන්න' : '🟡 CHECK BEFORE TAPPING')}
                  {selectedBlock.status === 'DO_NOT_TAP' && (lang === 'SIN' ? '🔴 අද නොකරන්න' : '🔴 DO NOT TAP TODAY')}
                  {selectedBlock.status === 'UNABLE' && (lang === 'SIN' ? '⚪ තීරණය කළ නොහැක' : '⚪ UNABLE TO ASSESS')}
                </h2>
                {/* One-line plain language reason */}
                <p className="text-sm font-bold text-stone-600 mt-1 italic">
                  {lang === 'SIN' ? selectedBlock.decisionReasonSin : selectedBlock.decisionReasonEng}
                </p>
              </div>
              <span className="bg-white text-stone-800 text-xs font-black px-3 py-1.5 rounded-full border shadow-sm">
                {lang === 'SIN' ? 'විශ්වාසය:' : 'Confidence:'} {selectedBlock.confidence}%
              </span>
            </div>

            {/* Weather Warning */}
            {selectedBlock.weatherWarning && (
              <div className="bg-amber-500 text-white font-extrabold text-xs p-3.5 rounded-xl shadow">
                {selectedBlock.weatherWarning}
              </div>
            )}

            {/* Yield Range Display */}
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[11px] font-black text-stone-500 uppercase tracking-wider">
                {lang === 'SIN' ? 'අපේක්ෂිත කිරි අස්වැන්න (පරාසය)' : 'Expected Latex Yield (Range)'}
              </p>
              <p className="text-3xl font-black text-stone-900 mt-1">
                {selectedBlock.status === 'UNABLE' ? (lang === 'SIN' ? 'අවිනිශ්චිතය' : 'Uncertain') : selectedBlock.yieldLabel}
              </p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="text-xs font-bold text-stone-500">
                  {lang === 'SIN' ? 'සාමාන්‍ය:' : 'Normal:'} {selectedBlock.normalYieldKg} kg
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  selectedBlock.diffPercent > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedBlock.diffPercent > 0 ? '+' : ''}{selectedBlock.diffPercent}% vs avg
                </span>
                <span className="text-[10px] text-stone-400 italic">
                  {lang === 'SIN' ? '(නිශ්චිත ඉලක්කයක් නොව — ඇස්තමේන්තු)' : '(Range estimate, not a quota)'}
                </span>
              </div>
            </div>

            {/* Action buttons — collapsed to info notice for DO_NOT_TAP / UNABLE */}
            <div className="flex gap-3 pt-1">
              {selectedBlock.status === 'DO_NOT_TAP' || selectedBlock.status === 'UNABLE' ? (
                // No tapping was expected today → nothing to record
                <div className="flex-1 flex items-center gap-3 bg-stone-100 border-2 border-stone-300 rounded-2xl px-4 py-4">
                  <span className="text-2xl">{selectedBlock.status === 'DO_NOT_TAP' ? '🔴' : '⚪'}</span>
                  <div>
                    <p className="text-xs font-black text-stone-700">
                      {lang === 'SIN' ? 'අද තට්ටු කිරීමක් නොමැත' : 'No tapping today — nothing to record'}
                    </p>
                    <p className="text-[10px] text-stone-500 font-bold mt-0.5">
                      {lang === 'SIN'
                        ? 'නිර්දේශය අනුව, අද මෙම කොටස තට්ටු නොකළ යුතුය.'
                        : selectedBlock.status === 'DO_NOT_TAP'
                        ? 'Per the model recommendation, this block should not be tapped today.'
                        : 'Insufficient data — please inspect the field manually.'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setFeedbackMode('tapped')}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base py-4 rounded-2xl shadow cursor-pointer transition"
                  >
                    {lang === 'SIN' ? '✅ දැන් තට්ටු කළේය' : '✅ Tapped ✓'}
                  </button>
                  <button
                    onClick={() => setFeedbackMode('skipped')}
                    className="flex-1 bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm py-4 rounded-2xl cursor-pointer transition"
                  >
                    {lang === 'SIN' ? '✗ තට්ටු කළ නොහැකිය' : '✗ Could Not Tap'}
                  </button>
                </>
              )}
              <button
                onClick={() => setShowBlockDetail(!showBlockDetail)}
                className="px-4 py-4 bg-white border-2 border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-2xl cursor-pointer transition"
              >
                {showBlockDetail ? (lang === 'SIN' ? '▲ හකුළන්න' : '▲ Less') : (lang === 'SIN' ? '▼ විස්තර' : '▼ Details')}
              </button>
            </div>
          </div>

          {/* ─── CONFIRMATION FEEDBACK ─── */}
          {feedbackMode === 'tapped' && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 space-y-3">
              <h4 className="font-black text-emerald-900 text-sm">
                ✅ {lang === 'SIN' ? 'තට්ටු කිරීම සටහන් කරන්න' : 'Record Tapping Result'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-800 mb-1 block">
                    {lang === 'SIN' ? 'ලබා ගත් ප්‍රමාණය (kg)' : 'Quantity collected (kg)'}
                  </label>
                  <input
                    type="number" step="0.1" placeholder="e.g. 1.20"
                    value={actualYield}
                    onChange={(e) => setActualYield(e.target.value)}
                    className="w-full border border-emerald-300 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-800 mb-1 block">
                    {lang === 'SIN' ? 'ඔරලෝසු වේලාව' : 'Time'}
                  </label>
                  <input
                    type="text" placeholder="e.g. 06:30 AM"
                    className="w-full border border-emerald-300 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
              <button
                onClick={() => setFeedbackMode('done')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl cursor-pointer text-sm transition"
              >
                💾 {lang === 'SIN' ? 'දත්ත සටහන් කරන්න' : 'Submit Record'}
              </button>
            </div>
          )}

          {feedbackMode === 'skipped' && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 space-y-3">
              <h4 className="font-black text-rose-900 text-sm">
                ✗ {lang === 'SIN' ? 'නොකළ හේතුව සටහන් කරන්න' : 'Record — Could Not Tap'}
              </h4>
              <div>
                <label className="text-xs font-bold text-rose-800 mb-1 block">{lang === 'SIN' ? 'හේතුව:' : 'Reason:'}</label>
                <select
                  value={skipReason}
                  onChange={(e) => setSkipReason(e.target.value)}
                  className="w-full border border-rose-300 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-900 focus:outline-none"
                >
                  <option value="rain">{lang === 'SIN' ? 'වර්ෂාව' : 'Rain'}</option>
                  <option value="sick">{lang === 'SIN' ? 'ලෙඩ' : 'Illness'}</option>
                  <option value="other">{lang === 'SIN' ? 'වෙනත්' : 'Other'}</option>
                </select>
              </div>
              <button
                onClick={() => setFeedbackMode('done')}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl cursor-pointer text-sm transition"
              >
                📝 {lang === 'SIN' ? 'සටහන් කරන්න' : 'Log Skipped Day'}
              </button>
            </div>
          )}

          {feedbackMode === 'done' && (
            <div className="bg-emerald-600 text-white text-center p-4 rounded-2xl font-black text-sm">
              ✅ {lang === 'SIN' ? 'සාර්ථකව සටහන් විය! මාදිලි නවීකරණය සිදු වේ.' : 'Logged successfully! Model data updated.'}
            </div>
          )}

          {/* ─── BLOCK DETAIL VIEW (Expanded) ─── */}
          {showBlockDetail && (
            <div className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between">
                <h4 className="font-black text-sm">
                  📊 {selectedBlock.blockCode} — {lang === 'SIN' ? 'සවිස්තරාත්මක දත්ත' : 'Block Detail View'}
                </h4>
                <button onClick={() => setShowBlockDetail(false)} className="text-stone-400 hover:text-white text-xs cursor-pointer">✕</button>
              </div>
              <div className="p-5 space-y-5">
                {/* Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: lang === 'SIN' ? 'ශාකවර්ගය' : 'Clone', val: selectedBlock.clone },
                    { label: lang === 'SIN' ? 'ශාක වයස' : 'Tree Age', val: `${selectedBlock.treeAgeyears} yrs` },
                    { label: lang === 'SIN' ? 'ශාක ගණන' : 'Trees', val: `${selectedBlock.treesCount}` },
                    { label: lang === 'SIN' ? 'අවසන් තට්ටු කිරීම' : 'Last Tapped', val: selectedBlock.lastTapped },
                  ].map((item) => (
                    <div key={item.label} className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                      <p className="font-bold text-stone-400 uppercase text-[10px]">{item.label}</p>
                      <p className="font-extrabold text-stone-900 mt-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>

                {/* 7-Day Tapping History */}
                <div>
                  <p className="text-xs font-black text-stone-500 uppercase mb-2">
                    {lang === 'SIN' ? 'දින 7 තට්ටු ඉතිහාසය' : 'Last 7-Day Tapping History'}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedBlock.tappingHistory.map((h, i) => (
                      <div key={i} className={`flex flex-col items-center p-2 rounded-xl border ${h.tapped ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-200'}`}>
                        <span className="text-[10px] font-black text-stone-500">{h.day}</span>
                        <span className="text-lg mt-0.5">{h.tapped ? '✅' : '✗'}</span>
                        {!h.tapped && h.reason && <span className="text-[8px] text-rose-600 font-bold mt-0.5">{h.reason}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contributing Factors (simplified SHAP) */}
                <div>
                  <p className="text-xs font-black text-stone-500 uppercase mb-2">
                    {lang === 'SIN' ? 'නිගමනයට හේතු' : 'Contributing Factors (Plain Language)'}
                  </p>
                  <ul className="space-y-1.5 text-xs font-semibold">
                    {selectedBlock.reasons.map((r, i) => (
                      <li key={i} className={`p-2.5 rounded-xl border flex gap-2 items-start ${
                        r.type === 'positive' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                      }`}>
                        <span>{r.type === 'positive' ? '✓' : '⚠️'}</span>
                        <span>{lang === 'SIN' ? r.textSin : r.textEng}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ─── WEATHER PANEL ─── */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl space-y-3 shadow-sm">
              <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                🌦️ {lang === 'SIN' ? 'කාලගුණ තොරතුරු' : 'Weather Panel'}
              </h4>
              <p className="text-xs font-extrabold text-stone-700">{selectedBlock.weatherSummary}</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: lang === 'SIN' ? '🌧️ වර්ෂා සම්භාවිතාව' : '🌧️ Rain Probability', val: `${selectedBlock.rainProb}%`, color: selectedBlock.rainProb > 60 ? 'text-rose-700' : 'text-stone-800' },
                  { label: lang === 'SIN' ? '🌡️ උෂ්ණත්වය' : '🌡️ Temperature', val: `${selectedBlock.tempC}°C`, color: 'text-stone-800' },
                  { label: lang === 'SIN' ? '💧 ආර්ද්‍රතාව' : '💧 Humidity', val: `${selectedBlock.humidityPct}%`, color: 'text-stone-800' },
                  { label: lang === 'SIN' ? '⏰ සුදුසු කාලය' : '⏰ Suitable Hours', val: selectedBlock.suitableWindow, color: 'text-emerald-700' },
                ].map((row) => (
                  <div key={row.label} className="bg-stone-50 rounded-xl p-2.5 border border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400">{row.label}</p>
                    <p className={`font-extrabold mt-0.5 ${row.color}`}>{row.val}</p>
                  </div>
                ))}
              </div>
              {/* Multi-day accumulation */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs space-y-1">
                <p className="font-black text-blue-900 text-[10px] uppercase">
                  {lang === 'SIN' ? 'සමුච්චිත වර්ෂාව' : 'Cumulative Rainfall (Soil Moisture Context)'}
                </p>
                <div className="flex justify-between font-bold text-blue-800">
                  <span>{lang === 'SIN' ? 'දින 3:' : 'Last 3 days:'} <span className="font-black">{selectedBlock.rainfall3dayMm} mm</span></span>
                  <span>{lang === 'SIN' ? 'දින 7:' : 'Last 7 days:'} <span className="font-black">{selectedBlock.rainfall7dayMm} mm</span></span>
                </div>
              </div>
            </div>

            {/* Check-First Workflow (for CHECK status) */}
            <div className="space-y-4">
              {selectedBlock.status === 'CHECK' && (
                <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                    🟡 {lang === 'SIN' ? 'ක්ෂේත්‍ර පරීක්ෂාව' : 'Field Check Required'}
                  </h4>
                  <p className="text-xs text-amber-900">
                    {lang === 'SIN' ? 'ඇස්තමේන්තු පරාසය:' : 'Expected Range:'} <span className="font-extrabold">{selectedBlock.yieldLabel}</span>
                  </p>
                  {!checkCompleted ? (
                    <div className="space-y-2">
                      <select
                        value={selectedCheckReason}
                        onChange={(e) => setSelectedCheckReason(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs font-bold text-stone-900"
                      >
                        <option>Tree condition looks good</option>
                        <option>Bark condition wet/unsuitable</option>
                        <option>Excessive canopy rain</option>
                        <option>Tree recently tapped</option>
                      </select>
                      <button
                        onClick={() => setCheckCompleted(true)}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer shadow"
                      >
                        ✅ {lang === 'SIN' ? 'ක්ෂේත්‍ර පරීක්ෂාව සම්පූර්ණයි' : 'FIELD CHECK COMPLETED'}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-700 text-white p-3 rounded-xl text-xs font-extrabold text-center">
                      ✅ {lang === 'SIN' ? `"${selectedCheckReason}" — තට්ටු කළ හැකිය.` : `Logged: "${selectedCheckReason}" — Ready to Tap.`}
                    </div>
                  )}
                </div>
              )}

              {/* Explain Why card */}
              <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl space-y-3 shadow-sm">
                <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                  💡 {selectedBlock.status === 'DO_NOT_TAP'
                    ? (lang === 'SIN' ? 'නොකළ යුත්තේ ඇයි?' : 'Why NOT to Tap?')
                    : (lang === 'SIN' ? 'නිර්දේශිත ඇයි?' : 'Why Recommended?')}
                </h4>
                <ul className="space-y-1.5 text-xs font-semibold">
                  {selectedBlock.reasons.map((r, i) => (
                    <li key={i} className={`p-2.5 rounded-xl border flex gap-2 items-start ${
                      r.type === 'positive' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                    }`}>
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

      {/* ═══ TAB 2: 5-DAY CALENDAR ═══ */}
      {activeTab === 'calendar' && (
        <div className="bg-white border-2 border-stone-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
            📅 {lang === 'SIN' ? 'දින 5 තට්ටු කාලසටහන' : '5-Day Tapping Opportunity Calendar'}
          </h2>
          <p className="text-xs text-stone-500">
            {lang === 'SIN' ? 'ඉදිරි දින 5 සඳහා කාලගුණ-පදනම් අස්වැන්න අවස්ථා.' : 'Short-term weather & yield opportunity forecast.'}
          </p>
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-900 text-stone-200 font-black uppercase text-[11px]">
                  <th className="p-3.5">{lang === 'SIN' ? 'දිනය' : 'Day / Date'}</th>
                  <th className="p-3.5 text-center">{lang === 'SIN' ? 'නිර්දේශය' : 'Recommendation'}</th>
                  <th className="p-3.5 text-center">{lang === 'SIN' ? 'අස්වැන්න (ඇස්තමේන්තු)' : 'Expected Yield (Range)'}</th>
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
                    <td className="p-3.5 text-center font-black text-emerald-700">{item.yieldLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: RECORD ACTUAL YIELD ═══ */}
      {activeTab === 'record' && (
        <div className="max-w-xl space-y-4">
          {/* Guard: block was not supposed to be tapped → no yield form */}
          {selectedBlock.status === 'DO_NOT_TAP' || selectedBlock.status === 'UNABLE' ? (
            <div className="bg-stone-100 border-2 border-stone-300 rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
              <span className="text-5xl">{selectedBlock.status === 'DO_NOT_TAP' ? '🔴' : '⚪'}</span>
              <h3 className="font-black text-stone-700 text-base">
                {lang === 'SIN' ? 'අද අස්වැන්නක් නොමැත' : 'No Yield to Record Today'}
              </h3>
              <p className="text-xs text-stone-500 font-bold max-w-xs">
                {lang === 'SIN'
                  ? `${selectedBlock.blockCode} — අද "${selectedBlock.status === 'DO_NOT_TAP' ? 'නොකරන්න' : 'නොදන්නා'}" ලෙස සටහන් කෙරිණ. කිරි ලැබිය නොහැකිය.`
                  : `${selectedBlock.blockCode} is marked "${selectedBlock.status === 'DO_NOT_TAP' ? 'Do Not Tap' : 'Unable to Assess'}" today. No tapping was expected, so there is no latex yield to submit.`}
              </p>
              <p className="text-[11px] text-stone-400">
                {lang === 'SIN'
                  ? 'AI ලොගය ස්වයංක්‍රීයව "නොකළ දිනය" ලෙස සටහන් කරයි.'
                  : 'The model automatically logs this as a non-tapping day — no action needed.'}
              </p>
            </div>
          ) : (
            <div className="bg-white border-2 border-stone-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                📝 {lang === 'SIN' ? 'සැබෑ කිරි අස්වැන්න සටහන' : 'Record Actual Tapping Result'}
              </h2>
              <p className="text-xs text-stone-500">
                {lang === 'SIN'
                  ? 'ලබා ගත් ප්‍රමාණය ඇතුළු කිරීමෙන් AI මාදිලිය නිවැරදි කෙරේ.'
                  : 'Submit actual latex collected to calibrate model accuracy.'}
              </p>
              <form onSubmit={handleRecordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{lang === 'SIN' ? 'කොටස:' : 'Block Tapped:'}</label>
                  <select className="w-full border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-stone-900">
                    <option>Block A12 (RRM 600)</option>
                    <option>Block B04 (PB 260)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'SIN' ? 'ලබා ගත් ප්‍රමාණය (kg/tree):' : 'Actual Latex (kg/tree):'}
                    </label>
                    <input
                      type="number" step="0.01"
                      value={actualYieldInput}
                      onChange={(e) => setActualYieldInput(e.target.value)}
                      className="w-full border border-stone-300 rounded-xl p-2.5 text-xs font-extrabold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'SIN' ? 'ආරම්භ කළ වේලාව:' : 'Tapping Time:'}
                    </label>
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
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow cursor-pointer transition"
                >
                  💾 {lang === 'SIN' ? 'ඉදිරිපත් කරන්න' : 'SUBMIT ACTUAL YIELD'}
                </button>
                {recordedSuccess && (
                  <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 p-3 rounded-xl text-xs font-black text-center">
                    ✅ {lang === 'SIN' ? `${actualYieldInput} kg/tree ලෙස සටහන් විය!` : `Yield Logged (${actualYieldInput} kg/tree)! Synced to model registry.`}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}