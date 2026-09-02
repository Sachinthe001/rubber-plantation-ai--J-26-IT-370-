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

type Language = 'ENG' | 'SIN'
type TPDStatus = 'NORMAL' | 'MONITOR' | 'HIGH_RISK' | 'UNABLE'
type QualityAlert = 'GOOD' | 'BLURRY' | 'TOO_DARK' | 'NOT_VISIBLE'
type LatexFlow = 'NORMAL' | 'REDUCED' | 'DRY'
type FlowDuration = 'LESS_10' | 'BETWEEN_10_30' | 'MORE_30'
type Frequency = 'd2' | 'd3' | 'd4'

type TreeScenario = {
  id: string
  treeCode: string
  block: string
  clone: string
  tpdRiskPercent: number
  dryCutPercent: number
  status: TPDStatus
  confidence: number
  latexFlow: LatexFlow
  flowDuration: FlowDuration
  frequency: Frequency
  stimulated: boolean
  restGiven: boolean
  imageUrl: string
  reasonsEng: string[]
  reasonsSin: string[]
  actionEng: string
  actionSin: string
  lastVisitDryCut: number
  history: { obs: string; dryCut: number; flow: string }[]
  expertComment?: string
}

const TREE_SCENARIOS: TreeScenario[] = [
  {
    id: 'tpd-1',
    treeCode: 'TR-4085',
    block: 'Block 4',
    clone: 'RRM 600',
    tpdRiskPercent: 84,
    dryCutPercent: 78,
    status: 'HIGH_RISK',
    confidence: 96,
    latexFlow: 'DRY',
    flowDuration: 'LESS_10',
    frequency: 'd2',
    stimulated: true,
    restGiven: false,
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
    reasonsEng: [
      'Dry-cut area increased from 40% to 78%',
      'Latex flow duration dropped below 10 minutes',
      'High tapping frequency (d2) with ethephon stimulation & no rest',
    ],
    reasonsSin: [
      'වියලි කැපුම් ප්‍රමාණය 40% සිට 78% දක්වා වැඩි වී ඇත',
      'කිරි ගැලීමේ කාලය මිනිත්තු 10ට වඩා අඩු වී ඇත',
      'අධික තට්ටු වාර ගණන (d2) සහ විවේකයක් නොමැති වීම',
    ],
    actionEng: 'STOP TAPPING THIS TREE IMMEDIATELY! Refer to Field Officer for panel rest protocol.',
    actionSin: 'මෙම ගස තට්ටු කිරීම වහාම නවත්වන්න! ක්ෂේත්‍ර නිලධාරී වෙත යොමු කරන්න.',
    lastVisitDryCut: 55,
    history: [
      { obs: 'Obs 1', dryCut: 22, flow: 'Normal' },
      { obs: 'Obs 2', dryCut: 35, flow: 'Reduced' },
      { obs: 'Obs 3', dryCut: 48, flow: 'Reduced' },
      { obs: 'Obs 4', dryCut: 55, flow: 'Dry' },
      { obs: 'Obs 5', dryCut: 78, flow: 'Dry' },
    ],
    expertComment: 'Recheck in 3 weeks. Apply bark recovery tonic B-2.',
  },
  {
    id: 'tpd-2',
    treeCode: 'TR-4083',
    block: 'Block 4',
    clone: 'PB 260',
    tpdRiskPercent: 48,
    dryCutPercent: 44,
    status: 'MONITOR',
    confidence: 88,
    latexFlow: 'REDUCED',
    flowDuration: 'BETWEEN_10_30',
    frequency: 'd3',
    stimulated: false,
    restGiven: true,
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    reasonsEng: [
      'Dry-cut percentage rising steadily (44%)',
      'Latex flow is reduced compared to last month',
    ],
    reasonsSin: ['වියලි කැපුම් ප්‍රමාණය 44% දක්වා වැඩි වෙමින් පවතී', 'පසුගිය මාසයට වඩා කිරි ගැලීම අඩු වී ඇත'],
    actionEng: 'Monitor this tree closely. Increase rest period between cuts to d4.',
    actionSin: 'මෙම ගස පිළිබඳව පරීක්ෂාවෙන් සිටින්න. තට්ටු කිරීමේ කාල පරතරය d4 දක්වා වැඩි කරන්න.',
    lastVisitDryCut: 38,
    history: [
      { obs: 'Obs 1', dryCut: 18, flow: 'Normal' },
      { obs: 'Obs 2', dryCut: 25, flow: 'Normal' },
      { obs: 'Obs 3', dryCut: 38, flow: 'Reduced' },
      { obs: 'Obs 4', dryCut: 44, flow: 'Reduced' },
    ],
  },
  {
    id: 'tpd-3',
    treeCode: 'TR-4082',
    block: 'Block 2',
    clone: 'RRM 600',
    tpdRiskPercent: 12,
    dryCutPercent: 18,
    status: 'NORMAL',
    confidence: 94,
    latexFlow: 'NORMAL',
    flowDuration: 'MORE_30',
    frequency: 'd3',
    stimulated: false,
    restGiven: true,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    reasonsEng: ['Latex flow is healthy and steady (>30 mins)', 'Dry-cut area well within safe limits (<20%)'],
    reasonsSin: ['කිරි ගැලීම සාමාන්‍ය මට්ටමේ පවතී', 'වියලි කැපුම් ප්‍රමාණය ආරක්ෂිත සීමාවේ ඇත'],
    actionEng: 'Continue normal tapping schedule (d3).',
    actionSin: 'සාමාන්‍ය පරිදි තට්ටු කිරීම සිදු කරන්න (d3).',
    lastVisitDryCut: 16,
    history: [
      { obs: 'Obs 1', dryCut: 15, flow: 'Normal' },
      { obs: 'Obs 2', dryCut: 16, flow: 'Normal' },
      { obs: 'Obs 3', dryCut: 18, flow: 'Normal' },
    ],
  },
  {
    id: 'tpd-4',
    treeCode: 'TR-4089',
    block: 'Block 2',
    clone: 'PB 260',
    tpdRiskPercent: 0,
    dryCutPercent: 0,
    status: 'UNABLE',
    confidence: 42,
    latexFlow: 'NORMAL',
    flowDuration: 'LESS_10',
    frequency: 'd2',
    stimulated: false,
    restGiven: false,
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    reasonsEng: ['Panel photo is blurry under dark canopy', 'Quality check failed — Abstaining from decision'],
    reasonsSin: ['ඡායාරූපය පැහැදිලි නැත', 'තීරණයක් දීමට ඡායාරූපය ප්‍රමාණවත් නොවේ'],
    actionEng: 'RETAKE PHOTO with scale card illuminated.',
    actionSin: 'පැහැදිලි ඡායාරූපයක් නැවත ලබා ගන්න.',
    lastVisitDryCut: 0,
    history: [],
  },
]

export default function TPDMonitoring() {
  // Accessibility & Field States
  const [lang, setLang] = useState<Language>('ENG')
  const [sunlightMode, setSunlightMode] = useState<boolean>(false)
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true)
  const [isOffline, setIsOffline] = useState<boolean>(false)

  // Selection & Search
  const [searchCode, setSearchCode] = useState<string>('')
  const [riskFilter, setRiskFilter] = useState<string>('ALL')
  const [selectedTree, setSelectedTree] = useState<TreeScenario>(TREE_SCENARIOS[0])

  // Quality Simulation
  const [qualityState, setQualityState] = useState<QualityAlert>('GOOD')
  const [customPhoto, setCustomPhoto] = useState<string | null>(null)

  // Interactive Form Preset Chips
  const [latexFlowInput, setLatexFlowInput] = useState<LatexFlow>(selectedTree.latexFlow)
  const [flowDurationInput, setFlowDurationInput] = useState<FlowDuration>(selectedTree.flowDuration)
  const [frequencyInput, setFrequencyInput] = useState<Frequency>(selectedTree.frequency)
  const [stimulatedInput, setStimulatedInput] = useState<boolean>(selectedTree.stimulated)
  const [restGivenInput, setRestGivenInput] = useState<boolean>(selectedTree.restGiven)
  const [voiceNote, setVoiceNote] = useState<string>('')
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false)

  // Modals & Referral State
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false)
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false)
  const [referralSent, setReferralSent] = useState<boolean>(false)
  const [tapperDisagreed, setTapperDisagreed] = useState<boolean>(false)
  const [detailsCollapsed, setDetailsCollapsed] = useState<boolean>(false)

  // TTS Voice Feedback Trigger
  function speakPrompt(text: string) {
    if (!voiceGuidance || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  // Handle Tree Switch
  function handleSelectTree(tree: TreeScenario) {
    setSelectedTree(tree)
    setLatexFlowInput(tree.latexFlow)
    setFlowDurationInput(tree.flowDuration)
    setFrequencyInput(tree.frequency)
    setStimulatedInput(tree.stimulated)
    setRestGivenInput(tree.restGiven)
    setCustomPhoto(null)
    setQualityState(tree.status === 'UNABLE' ? 'BLURRY' : 'GOOD')
    setReferralSent(false)
    setTapperDisagreed(false)

    if (tree.status === 'HIGH_RISK') {
      speakPrompt('High T P D risk detected on tree ' + tree.treeCode + '. Stop tapping and refer to Field Officer.')
    } else if (tree.status === 'MONITOR') {
      speakPrompt('Monitor tree ' + tree.treeCode + '. Increase rest period.')
    } else if (tree.status === 'NORMAL') {
      speakPrompt('Normal health on tree ' + tree.treeCode + '. Continue tapping.')
    }
  }

  // Handle Voice Note Recorder Simulation
  function handleToggleVoiceRecord() {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true)
      setTimeout(() => {
        setIsRecordingVoice(false)
        setVoiceNote('Panel shows early latex coagulation near spigot cut.')
      }, 2500)
    } else {
      setIsRecordingVoice(false)
    }
  }

  // Handle Retake Photo Simulation
  function handleRetakePhoto() {
    setCustomPhoto(selectedTree.imageUrl)
    setQualityState('GOOD')
    speakPrompt('Quality check passed. Photo ready for assessment.')
  }

  // Handle Referral Dispatch
  function handleDispatchReferral() {
    setReferralSent(true)
    speakPrompt('Case dispatched to Field Officer dashboard successfully.')
  }

  // Filter Trees
  const filteredTrees = TREE_SCENARIOS.filter((t) => {
    if (searchCode && !t.treeCode.toLowerCase().includes(searchCode.toLowerCase())) return false
    if (riskFilter === 'HIGH' && t.status !== 'HIGH_RISK') return false
    if (riskFilter === 'MONITOR' && t.status !== 'MONITOR') return false
    if (riskFilter === 'NORMAL' && t.status !== 'NORMAL') return false
    return true
  })

  // Block 4 High Risk Summary Counter
  const highRiskCountInBlock = TREE_SCENARIOS.filter((t) => t.block === 'Block 4' && t.status === 'HIGH_RISK').length

  return (
    <div
      className={`min-h-screen pb-16 font-sans transition-colors ${
        sunlightMode ? 'bg-black text-amber-300' : 'bg-stone-100 text-stone-900'
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* TOP FIELD ERGONOMICS CONTROL BAR */}
        <header
          className={`p-4 sm:p-6 rounded-2xl shadow-xl border flex flex-wrap items-center justify-between gap-4 ${
            sunlightMode ? 'bg-stone-900 border-amber-400' : 'bg-stone-900 text-white border-stone-800'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                SLIIT RESEARCH COMPONENT 3
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                TPD EARLY WARNING
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {lang === 'SIN' ? 'තට්ටු කිරීමේ පැනල සෞඛ්‍යය සහ TPD පූර්ව අනතුරු ඇඟවීම' : 'Tapping-Panel Health & TPD Early Warning'}
            </h1>
            <p className="text-xs text-stone-300 mt-0.5">
              {lang === 'SIN'
                ? 'රබර් තට්ටුකරුවන් සඳහා විශේෂයෙන් නිර්මාණය කරන ලද 1-ක්ලික් උපදේශන පද්ධතිය'
                : '1-Tap Field Decision Support Engine tailored for rubber tappers'}
            </p>
          </div>

          {/* Quick Ergonomics Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sunlight High Contrast Mode Toggle */}
            <button
              onClick={() => setSunlightMode(!sunlightMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer transition flex items-center gap-1.5 ${
                sunlightMode ? 'bg-amber-400 text-black border-amber-300' : 'bg-stone-800 text-amber-300 border-stone-700'
              }`}
            >
              <span>☀️ {sunlightMode ? 'Sunlight Mode ON' : 'High Contrast'}</span>
            </button>

            {/* Voice Guidance Switcher */}
            <button
              onClick={() => setVoiceGuidance(!voiceGuidance)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer transition ${
                voiceGuidance ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              🔊 {voiceGuidance ? 'Voice ON' : 'Voice OFF'}
            </button>

            {/* Bilingual Switcher */}
            <div className="flex bg-stone-800 p-1 rounded-xl border border-stone-700">
              <button
                onClick={() => setLang('ENG')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                  lang === 'ENG' ? 'bg-emerald-600 text-white' : 'text-stone-400'
                }`}
              >
                ENG
              </button>
              <button
                onClick={() => setLang('SIN')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                  lang === 'SIN' ? 'bg-emerald-600 text-white' : 'text-stone-400'
                }`}
              >
                සිංහල
              </button>
            </div>
          </div>
        </header>

        {/* Offline Mode Banner */}
        <div className="bg-white border border-stone-200 p-3 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">📶</span>
            <div>
              <p className="text-xs font-bold text-stone-800">
                {isOffline
                  ? lang === 'SIN'
                    ? '📶 නොබැඳි ක්‍රමය: දත්ත දුරකථනයේ සුරැකේ'
                    : '📶 Offline Mode: Observations saved locally to device storage'
                  : lang === 'SIN'
                  ? '🌐 සබැඳි ක්‍රමය: වලාකුළ සමඟ සමමුහුර්ත වේ'
                  : '🌐 Online Mode: Synced to Field Officer Cloud'}
              </p>
              <p className="text-[10px] text-stone-500">Auto-syncs when plantation network is restored</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isOffline}
              onChange={(e) => setIsOffline(e.target.checked)}
              className="w-4 h-4 accent-emerald-600"
            />
            <span className="text-xs font-extrabold text-stone-700">Simulate Offline</span>
          </label>
        </div>

        {/* SECTION 1: SIMPLE TREE SELECTION & BLOCK SUMMARY WIDGET */}
        <div className="space-y-4">
          {/* Block 4 Summary Banner */}
          <div className="bg-amber-500/10 border-2 border-amber-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-black text-sm text-stone-900">
                  {lang === 'SIN' ? 'Block 4 දෛනික සාරාංශය:' : 'Block 4 Daily Summary:'}
                </h3>
                <p className="text-xs text-stone-600">
                  {lang === 'SIN'
                    ? `අද දින Block 4 හි TPD අවදානම් සහිත ගස් ${highRiskCountInBlock} ක් ඇත (විවේකය අවශ්‍යයි)`
                    : `${highRiskCountInBlock} Trees flagged as High TPD Risk today requiring tapping rest.`}
                </p>
              </div>
            </div>
            <span className="bg-amber-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow">
              Block 4 Active
            </span>
          </div>

          {/* Tree Search & Quick Access Bar */}
          <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[220px] relative">
                <span className="absolute left-3 top-2.5 text-stone-400">🔍</span>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder={lang === 'SIN' ? 'ගස් අංකය / QR කේතය සොයන්න...' : 'Search Tree ID / Scan QR (e.g. TR-4085)...'}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Risk Level Filter Chips */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setRiskFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer border ${
                    riskFilter === 'ALL' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-100 text-stone-600 border-stone-300'
                  }`}
                >
                  All ({TREE_SCENARIOS.length})
                </button>
                <button
                  onClick={() => setRiskFilter('HIGH')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer border ${
                    riskFilter === 'HIGH' ? 'bg-rose-600 text-white border-rose-600' : 'bg-stone-100 text-stone-600 border-stone-300'
                  }`}
                >
                  🔴 High Risk
                </button>
                <button
                  onClick={() => setRiskFilter('MONITOR')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer border ${
                    riskFilter === 'MONITOR' ? 'bg-amber-500 text-white border-amber-500' : 'bg-stone-100 text-stone-600 border-stone-300'
                  }`}
                >
                  🟡 Monitor
                </button>
              </div>
            </div>

            {/* Quick Access Tree Chips */}
            <div className="pt-2 border-t flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap">Recent Trees:</span>
              {filteredTrees.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTree(t)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer border transition flex items-center gap-2 whitespace-nowrap ${
                    selectedTree.id === t.id
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow'
                      : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-emerald-500'
                  }`}
                >
                  <span>{t.treeCode}</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      t.status === 'HIGH_RISK'
                        ? 'bg-rose-500 animate-pulse'
                        : t.status === 'MONITOR'
                        ? 'bg-amber-400'
                        : t.status === 'NORMAL'
                        ? 'bg-emerald-400'
                        : 'bg-stone-400'
                    }`}
                  ></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN WORKSPACE: LEFT CAPTURE & ENTRY | RIGHT DECISION & TREND */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT COLUMN: CAPTURE SCREEN & QUICK DATA ENTRY */}
          <div className="space-y-6">
            {/* SECTION 2: CAPTURE SCREEN WITH QUALITY GATE OVERLAY */}
            <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-stone-900 text-base flex items-center gap-2">
                  <span>📸</span>
                  <span>{lang === 'SIN' ? '1. තට්ටු කිරීමේ පැනල ඡායාරූපය' : '1. Panel Photo & Quality Gate'}</span>
                </h2>
                <button
                  onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
                  className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  📜 {showHistoryDrawer ? 'Hide History' : 'Multi-Photo History'}
                </button>
              </div>

              {/* Camera Preview Box with Alignment Frame */}
              <div className="relative aspect-[4/3] bg-stone-950 rounded-2xl overflow-hidden border-2 border-stone-800 shadow-md">
                <img
                  src={customPhoto || selectedTree.imageUrl}
                  alt="Tapping Panel"
                  className="w-full h-full object-cover opacity-90"
                />

                {/* Tapping Panel Alignment Frame Overlay */}
                <div className="absolute inset-4 border-2 border-dashed border-cyan-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between items-center text-[10px] font-black text-cyan-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                    <span>🎴 ALIGN SPIGOT &amp; CUT LINE</span>
                    <span>SCALE MARKER CARD</span>
                  </div>
                  <div className="text-center text-[10px] font-black text-cyan-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur self-center">
                    ✂️ KEEP FULL CUT IN FRAME
                  </div>
                </div>

                {/* Real-time Quality Gate Alerts */}
                {qualityState === 'BLURRY' && (
                  <div className="absolute bottom-3 left-3 right-3 bg-rose-600/90 text-white p-2.5 rounded-xl border border-rose-400 text-xs font-bold flex items-center gap-2 backdrop-blur">
                    <span>⚠️</span>
                    <span>{lang === 'SIN' ? 'ඡායාරූපය පැහැදිලි නැත - දුරකථනය ස්ථාවරව තබන්න' : 'Blur Alert: Hold phone steady against bark panel.'}</span>
                  </div>
                )}

                {qualityState === 'GOOD' && (
                  <div className="absolute bottom-3 left-3 bg-emerald-600/90 text-white px-3 py-1 rounded-full text-xs font-black backdrop-blur border border-emerald-400 flex items-center gap-1.5">
                    <span>✅</span>
                    <span>Quality Gate Passed</span>
                  </div>
                )}
              </div>

              {/* Glove-Friendly Large Camera Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleRetakePhoto}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-base cursor-pointer active:scale-95"
                >
                  <span>📷</span>
                  <span>{lang === 'SIN' ? 'තට්ටු පැනලයේ ඡායාරූපයක් ගන්න' : 'Take Panel Photo'}</span>
                </button>
              </div>

              {/* Multi-Photo History Drawer */}
              {showHistoryDrawer && (
                <div className="bg-stone-50 p-3 rounded-xl border space-y-2">
                  <p className="text-xs font-bold text-stone-700">Previous Panel Observations for {selectedTree.treeCode}:</p>
                  <div className="flex gap-2 overflow-x-auto pt-1">
                    <img
                      src={selectedTree.imageUrl}
                      alt="Obs 1"
                      className="w-16 h-16 rounded-lg object-cover border-2 border-emerald-500 cursor-pointer"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80"
                      alt="Obs 2"
                      className="w-16 h-16 rounded-lg object-cover border border-stone-300 cursor-pointer opacity-70"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80"
                      alt="Obs 3"
                      className="w-16 h-16 rounded-lg object-cover border border-stone-300 cursor-pointer opacity-70"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: QUICK DATA ENTRY (ZERO MANDATORY TYPING) */}
            <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl space-y-4 shadow-sm">
              <h2 className="font-black text-stone-900 text-base flex items-center gap-2">
                <span>⚡</span>
                <span>{lang === 'SIN' ? '2. කිරි ගැලීම සහ තට්ටු කිරීමේ තොරතුරු' : '2. Quick Latex Flow Observation'}</span>
              </h2>

              {/* Latex Flow Chips */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {lang === 'SIN' ? 'කිරි ගැලීමේ මට්ටම (Latex Flow):' : 'Latex Flow Observation:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setLatexFlowInput('NORMAL')}
                    className={`py-3 rounded-xl text-xs font-black border cursor-pointer transition ${
                      latexFlowInput === 'NORMAL'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow'
                        : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-emerald-500'
                    }`}
                  >
                    🟢 Normal Flow
                  </button>
                  <button
                    onClick={() => setLatexFlowInput('REDUCED')}
                    className={`py-3 rounded-xl text-xs font-black border cursor-pointer transition ${
                      latexFlowInput === 'REDUCED'
                        ? 'bg-amber-600 text-white border-amber-700 shadow'
                        : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-amber-500'
                    }`}
                  >
                    🟡 Reduced Flow
                  </button>
                  <button
                    onClick={() => setLatexFlowInput('DRY')}
                    className={`py-3 rounded-xl text-xs font-black border cursor-pointer transition ${
                      latexFlowInput === 'DRY'
                        ? 'bg-rose-700 text-white border-rose-800 shadow'
                        : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-rose-500'
                    }`}
                  >
                    🔴 No Flow / Dry
                  </button>
                </div>
              </div>

              {/* Flow Duration Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {lang === 'SIN' ? 'කිරි ගැලූ කාලය (Duration):' : 'Latex Flow Duration:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFlowDurationInput('LESS_10')}
                    className={`py-2.5 rounded-xl text-xs font-black border cursor-pointer transition ${
                      flowDurationInput === 'LESS_10'
                        ? 'bg-rose-700 text-white border-rose-800'
                        : 'bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    ⏱️ &lt;10 Min
                  </button>
                  <button
                    onClick={() => setFlowDurationInput('BETWEEN_10_30')}
                    className={`py-2.5 rounded-xl text-xs font-black border cursor-pointer transition ${
                      flowDurationInput === 'BETWEEN_10_30'
                        ? 'bg-amber-600 text-white border-amber-700'
                        : 'bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    ⏱️ 10–30 Min
                  </button>
                  <button
                    onClick={() => setFlowDurationInput('MORE_30')}
                    className={`py-2.5 rounded-xl text-xs font-black border cursor-pointer transition ${
                      flowDurationInput === 'MORE_30'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    ⏱️ &gt;30 Min
                  </button>
                </div>
              </div>

              {/* Tapping Details Presets */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Frequency:</label>
                  <select
                    value={frequencyInput}
                    onChange={(e) => setFrequencyInput(e.target.value as Frequency)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold text-stone-900"
                  >
                    <option value="d2">d2 (Every 2 days)</option>
                    <option value="d3">d3 (Every 3 days)</option>
                    <option value="d4">d4 (Every 4 days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Stimulated (ET)?</label>
                  <button
                    onClick={() => setStimulatedInput(!stimulatedInput)}
                    className={`w-full py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      stimulatedInput ? 'bg-amber-500 text-white border-amber-600' : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`}
                  >
                    {stimulatedInput ? '🧪 Yes' : 'No'}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Rest Period Given?</label>
                  <button
                    onClick={() => setRestGivenInput(!restGivenInput)}
                    className={`w-full py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      restGivenInput ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {restGivenInput ? '💤 Yes' : 'No Rest'}
                  </button>
                </div>
              </div>

              {/* Voice-to-Text Memo Input */}
              <div className="pt-2 border-t space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>🎙️ Voice Note / Optional Observation:</span>
                  <button
                    onClick={handleToggleVoiceRecord}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                      isRecordingVoice ? 'bg-rose-600 text-white animate-pulse' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {isRecordingVoice ? '🔴 Recording Voice...' : '🎤 Record Voice'}
                  </button>
                </label>
                <input
                  type="text"
                  value={voiceNote}
                  onChange={(e) => setVoiceNote(e.target.value)}
                  placeholder="Voice note transcript will appear here..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SINGLE ACTION DECISION CARD & LONGITUDINAL TREND */}
          <div className="space-y-6">
            {/* SECTION 4: RESULT SCREEN (SINGLE MAIN ACTION DECISION CARD) */}
            <div className="space-y-4">
              <h2 className="font-black text-stone-900 text-base flex items-center gap-2">
                <span>🎯</span>
                <span>{lang === 'SIN' ? '3. නියමිත පියවර (1-Action Decision)' : '3. Immediate Action Decision'}</span>
              </h2>

              {/* HIGH TPD RISK (RED) */}
              {selectedTree.status === 'HIGH_RISK' && (
                <div className="bg-rose-50 border-4 border-rose-600 p-6 rounded-3xl space-y-4 shadow-xl text-center">
                  <div className="w-16 h-16 bg-rose-600 text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    🔴
                  </div>
                  <div>
                    <span className="bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      HIGH TPD RISK DETECTED
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-2">
                      {lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}
                    </h3>
                  </div>

                  {/* Collapsible Key Reasons */}
                  <div className="bg-white/80 border border-rose-300 p-4 rounded-2xl text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-rose-900">
                        TPD Risk Probability: <span className="text-rose-600 font-black">{selectedTree.tpdRiskPercent}%</span>
                      </span>
                      <button
                        onClick={() => setDetailsCollapsed(!detailsCollapsed)}
                        className="text-[11px] font-bold text-rose-700 underline cursor-pointer"
                      >
                        {detailsCollapsed ? 'Show Reasons' : 'Hide Details'}
                      </button>
                    </div>

                    {!detailsCollapsed && (
                      <ul className="text-xs text-stone-800 space-y-1 pt-1 list-disc pl-4 font-medium">
                        {(lang === 'SIN' ? selectedTree.reasonsSin : selectedTree.reasonsEng).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* 1-Tap Expert Referral Button */}
                  {referralSent ? (
                    <div className="bg-emerald-700 text-white font-extrabold p-3 rounded-2xl text-xs text-center shadow">
                      ✅ Case Referred to Field Officer Dashboard!
                    </div>
                  ) : (
                    <button
                      onClick={handleDispatchReferral}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm py-4 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>🚨</span>
                      <span>{lang === 'SIN' ? 'ක්ෂේත්‍ර නිලධාරී වෙත යොමු කරන්න' : 'Send Case to Field Officer'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* MONITOR (YELLOW) */}
              {selectedTree.status === 'MONITOR' && (
                <div className="bg-amber-50 border-4 border-amber-500 p-6 rounded-3xl space-y-4 shadow-xl text-center">
                  <div className="w-16 h-16 bg-amber-500 text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto shadow-lg">
                    🟡
                  </div>
                  <div>
                    <span className="bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      MONITOR CLOSELY
                    </span>
                    <h3 className="text-xl font-black text-amber-950 mt-2">
                      {lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}
                    </h3>
                  </div>

                  <div className="bg-white/80 border border-amber-300 p-4 rounded-2xl text-left space-y-2">
                    <span className="text-xs font-black text-amber-900">
                      TPD Risk Probability: <span className="text-amber-600 font-black">{selectedTree.tpdRiskPercent}%</span>
                    </span>
                    <ul className="text-xs text-stone-800 space-y-1 list-disc pl-4 font-medium">
                      {(lang === 'SIN' ? selectedTree.reasonsSin : selectedTree.reasonsEng).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* NORMAL (GREEN) */}
              {selectedTree.status === 'NORMAL' && (
                <div className="bg-emerald-50 border-4 border-emerald-600 p-6 rounded-3xl space-y-4 shadow-xl text-center">
                  <div className="w-16 h-16 bg-emerald-600 text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto shadow-lg">
                    🟢
                  </div>
                  <div>
                    <span className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      HEALTHY PANEL
                    </span>
                    <h3 className="text-xl font-black text-emerald-950 mt-2">
                      {lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}
                    </h3>
                  </div>
                </div>
              )}

              {/* UNABLE TO ASSESS (GREY ABSTENTION NOVELTY) */}
              {selectedTree.status === 'UNABLE' && (
                <div className="bg-stone-100 border-4 border-stone-400 p-6 rounded-3xl space-y-4 shadow-xl text-center">
                  <div className="w-16 h-16 bg-stone-500 text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto shadow-lg">
                    ⚪
                  </div>
                  <div>
                    <span className="bg-stone-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      UNABLE TO ASSESS (QUALITY ABSTENTION)
                    </span>
                    <h3 className="text-xl font-black text-stone-900 mt-2">
                      {lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}
                    </h3>
                  </div>
                  <button
                    onClick={handleRetakePhoto}
                    className="w-full bg-stone-900 text-white font-black py-3 rounded-2xl shadow transition cursor-pointer"
                  >
                    📷 Retake Clear Photo
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 5 & 9: TREE HISTORY GRAPH & SIDE-BY-SIDE COMPARISON */}
            <div className="bg-white border-2 border-stone-200 p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-stone-900 text-sm flex items-center gap-2">
                  <span>📈</span>
                  <span>Dry-Cut % Progression ({selectedTree.treeCode})</span>
                </h3>
                <button
                  onClick={() => setShowComparisonModal(true)}
                  className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] px-3 py-1 rounded-xl cursor-pointer hover:bg-emerald-200"
                >
                  🔍 Compare Visits
                </button>
              </div>

              {/* Recharts Dry-Cut Line Chart */}
              {selectedTree.history.length > 0 ? (
                <div className="h-44 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedTree.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="obs" stroke="#78716c" fontSize={10} fontWeight={700} />
                      <YAxis stroke="#78716c" fontSize={10} domain={[0, 100]} unit="%" />
                      <Tooltip />
                      <ReferenceLine
                        y={70}
                        stroke="#dc2626"
                        strokeDasharray="4 4"
                        label={{ value: '70% High Risk', fill: '#dc2626', fontSize: 10 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="dryCut"
                        stroke="#059669"
                        strokeWidth={3.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-stone-400 text-center py-6">No historical observations logged yet.</p>
              )}

              {/* Last Expert Comment */}
              {selectedTree.expertComment && (
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-950 font-semibold">
                  <p className="font-black text-emerald-900">👨‍🌾 Last Field Officer Note:</p>
                  <p className="mt-0.5">"{selectedTree.expertComment}"</p>
                </div>
              )}
            </div>

            {/* SECTION 8: SAFETY DISCLAIMER & TAPPER OVERRIDE */}
            <div className="bg-stone-50 border border-stone-300 p-4 rounded-2xl space-y-2 text-xs">
              <p className="font-extrabold text-stone-800 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Safety &amp; Advisory Disclaimer:</span>
              </p>
              <p className="text-stone-600 text-[11px]">
                This system provides predictive advisory support only. Final decisions remain with plantation field experts.
              </p>
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setTapperDisagreed(!tapperDisagreed)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border cursor-pointer ${
                    tapperDisagreed ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  {tapperDisagreed ? '✓ Logged "I Disagree"' : '✋ I Disagree with AI'}
                </button>
                <span className="text-[10px] text-stone-500 font-mono">Abstention Respected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE COMPARISON MODAL (SECTION 9) */}
      {showComparisonModal && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl border-4 border-stone-300">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="text-lg font-black text-stone-900">
                  What Changed Since Last Visit? ({selectedTree.treeCode})
                </h3>
                <p className="text-xs text-stone-500">Side-by-side comparative panel observation</p>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold p-2 rounded-full text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-extrabold text-xs text-stone-500 uppercase">Previous Observation</p>
                <p className="text-2xl font-black text-amber-600">{selectedTree.lastVisitDryCut}% Dry Cut</p>
                <p className="text-xs text-stone-700">Flow Duration: 10–30 min</p>
                <p className="text-xs text-stone-700">Status: Monitor</p>
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-300 space-y-2">
                <p className="font-extrabold text-xs text-rose-700 uppercase">Current Observation Today</p>
                <p className="text-2xl font-black text-rose-600">{selectedTree.dryCutPercent}% Dry Cut (+{selectedTree.dryCutPercent - selectedTree.lastVisitDryCut}%)</p>
                <p className="text-xs text-stone-700">Flow Duration: &lt;10 min</p>
                <p className="text-xs font-bold text-rose-700">Status: High TPD Risk 🔴</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="bg-stone-900 text-white text-xs font-bold py-2 px-5 rounded-xl cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}