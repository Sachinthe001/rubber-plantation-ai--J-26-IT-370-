import { useState, useRef, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Language = 'ENG' | 'SIN'

type QualityAlert =
  | 'GOOD'
  | 'BLUR'
  | 'TOO_DARK'
  | 'NO_SCALE_MARKER'
  | 'CUT_NOT_VISIBLE'

type WorkmanshipGrade = 'ACCEPTABLE' | 'CORRECTION' | 'DAMAGING' | 'RETAKE'

type CutMeasurement = {
  cutLengthCm: number
  cutSlopeDeg: number
  barkStripWidthCm: number
  woundDetected: boolean
  confidence: number
}

type SampleCutScenario = {
  id: string
  nameEng: string
  nameSin: string
  treeId: string
  panelId: string
  imageUrl: string
  quality: QualityAlert
  measurements: CutMeasurement
  grade: WorkmanshipGrade
  gradeTextEng: string
  gradeTextSin: string
  adviceEng: string
  adviceSin: string
  cutPath: { x1: number; y1: number; x2: number; y2: number }
  barkPoly: { x: number; y: number }[]
  woundCoords?: { x: number; y: number; r: number }
}

type HistoryRecord = {
  id: string
  date: string
  treeId: string
  grade: WorkmanshipGrade
  barkStripWidthCm: number
  cutLengthCm: number
  slopeDeg: number
  wound: boolean
}

const SAMPLE_SCENARIOS: SampleCutScenario[] = [
  {
    id: 'cut-1',
    nameEng: 'Cut Scenario 1: Standard Tapping (Acceptable)',
    nameSin: 'කැපුම් සාම්පලය 1: නියමිත කැපීම (සාර්ථකයි)',
    treeId: 'TR-4082',
    panelId: 'BO-1',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    quality: 'GOOD',
    measurements: {
      cutLengthCm: 42,
      cutSlopeDeg: 28,
      barkStripWidthCm: 1.4,
      woundDetected: false,
      confidence: 93,
    },
    grade: 'ACCEPTABLE',
    gradeTextEng: 'Acceptable Tapping — Good workmanship. Continue as usual.',
    gradeTextSin: 'නියමිත තට්ටු කිරීම — විශිෂ්ට කැපීමක්. සාමාන්‍ය පරිදි ඉදිරියට යන්න.',
    adviceEng: 'Cut slope (28°) and bark consumption (1.4cm) are strictly within Sri Lankan Rubber Research Institute (RRISL) guidelines.',
    adviceSin: 'කැපුම් කෝණය (28°) සහ පොතු පරිභෝජනය (1.4cm) පර්යේෂණායතන මාර්ගෝපදේශ අනුව නිවැරදිය.',
    cutPath: { x1: 20, y1: 30, x2: 80, y2: 65 },
    barkPoly: [
      { x: 20, y: 30 },
      { x: 80, y: 65 },
      { x: 80, y: 72 },
      { x: 20, y: 37 },
    ],
  },
  {
    id: 'cut-2',
    nameEng: 'Cut Scenario 2: Steep Slope (Correction Required)',
    nameSin: 'කැපුම් සාම්පලය 2: අධික කෝණය (සංශෝධනයක් අවශ්‍යයි)',
    treeId: 'TR-4083',
    panelId: 'BO-1',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    quality: 'GOOD',
    measurements: {
      cutLengthCm: 46,
      cutSlopeDeg: 38,
      barkStripWidthCm: 2.2,
      woundDetected: false,
      confidence: 89,
    },
    grade: 'CORRECTION',
    gradeTextEng: 'Correction Required — Adjust slope on next tap.',
    gradeTextSin: 'සංශෝධනයක් අවශ්‍යයි — ඊළඟ කැපුමේදී කෝණය අඩු කරන්න.',
    adviceEng: 'Cut slope (38°) exceeds standard range (25°–30°). Reduce slope angle slightly to prevent excess latex channel spilling.',
    adviceSin: 'කැපුම් කෝණය (38°) වැඩි වී ඇත. කිරි ගැලීම නිසි පරිදි සිදුවීමට කෝණය සකස් කරන්න.',
    cutPath: { x1: 15, y1: 20, x2: 85, y2: 80 },
    barkPoly: [
      { x: 15, y: 20 },
      { x: 85, y: 80 },
      { x: 85, y: 90 },
      { x: 15, y: 30 },
    ],
  },
  {
    id: 'cut-3',
    nameEng: 'Cut Scenario 3: Cambium Wound (Potentially Damaging)',
    nameSin: 'කැපුම් සාම්පලය 3: ශාකයට හානි සිදුකිරීම (දරුණු)',
    treeId: 'TR-4085',
    panelId: 'BI-2',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
    quality: 'GOOD',
    measurements: {
      cutLengthCm: 39,
      cutSlopeDeg: 27,
      barkStripWidthCm: 2.8,
      woundDetected: true,
      confidence: 95,
    },
    grade: 'DAMAGING',
    gradeTextEng: 'Potentially Damaging — Visible Cambium Wound Detected!',
    gradeTextSin: 'හානිකර තට්ටු කිරීමක් — පොත්තට අභ්‍යන්තර හානියක් සිදු වී ඇත!',
    adviceEng: 'Excessive depth hit active cambium layer. Case automatically flagged for Field Officer inspection to apply wound paste.',
    adviceSin: 'ශාකයේ ජීවී සෛල ස්ථරයට හානි සිදු වී ඇත. ක්ෂේත්‍ර නිලධාරී පරීක්ෂාව සඳහා යොමු කරන ලදී.',
    cutPath: { x1: 25, y1: 35, x2: 75, y2: 60 },
    barkPoly: [
      { x: 25, y: 35 },
      { x: 75, y: 60 },
      { x: 75, y: 75 },
      { x: 25, y: 50 },
    ],
    woundCoords: { x: 50, y: 48, r: 22 },
  },
  {
    id: 'cut-4',
    nameEng: 'Cut Scenario 4: Scale Marker Not Detected',
    nameSin: 'කැපුම් සාම්පලය 4: මිනුම් කාඩ්පත හඳුනානොගන්නා ලදී',
    treeId: 'TR-4089',
    panelId: 'BO-1',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    quality: 'NO_SCALE_MARKER',
    measurements: {
      cutLengthCm: 0,
      cutSlopeDeg: 0,
      barkStripWidthCm: 0,
      woundDetected: false,
      confidence: 38,
    },
    grade: 'RETAKE',
    gradeTextEng: 'Unable to Assess — Reference scale marker card missing.',
    gradeTextSin: 'මැනිය නොහැක — පරිමාන කාඩ්පත ඡායාරූපයට ඇතුළත් කරන්න.',
    adviceEng: 'Place reference scale card flat on bark panel right next to cut line and retake photo.',
    adviceSin: 'පරිමාන මිනුම් කාඩ්පත පත්‍රය අසලින් තබා නැවත ඡායාරූපයක් ගන්න.',
    cutPath: { x1: 0, y1: 0, x2: 0, y2: 0 },
    barkPoly: [],
  },
]

// Longitudinal Bark Consumption Data over recent weeks (mm per session)
const BARK_TREND_DATA = [
  { tapSession: 'Tap 1', barkWidthMm: 1.3, limitMm: 1.5 },
  { tapSession: 'Tap 2', barkWidthMm: 1.4, limitMm: 1.5 },
  { tapSession: 'Tap 3', barkWidthMm: 1.2, limitMm: 1.5 },
  { tapSession: 'Tap 4', barkWidthMm: 1.4, limitMm: 1.5 },
  { tapSession: 'Tap 5', barkWidthMm: 1.8, limitMm: 1.5 },
  { tapSession: 'Tap 6', barkWidthMm: 1.4, limitMm: 1.5 },
]

const INITIAL_TAP_HISTORY: HistoryRecord[] = [
  {
    id: 'th-101',
    date: '2026-09-01 08:15 AM',
    treeId: 'TR-4082',
    grade: 'ACCEPTABLE',
    barkStripWidthCm: 1.4,
    cutLengthCm: 42,
    slopeDeg: 28,
    wound: false,
  },
  {
    id: 'th-102',
    date: '2026-08-30 07:45 AM',
    treeId: 'TR-4083',
    grade: 'CORRECTION',
    barkStripWidthCm: 2.2,
    cutLengthCm: 46,
    slopeDeg: 38,
    wound: false,
  },
]

export default function TappingQuality() {
  const [lang, setLang] = useState<Language>('ENG')
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true)
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [selectedScenario, setSelectedScenario] = useState<SampleCutScenario>(SAMPLE_SCENARIOS[0])
  const [customPhoto, setCustomPhoto] = useState<string | null>(null)
  const [scannedTreeId, setScannedTreeId] = useState<string>('TR-4082 (Panel BO-1)')
  const [qualityOverride, setQualityOverride] = useState<QualityAlert | null>(null)
  const [showOverlay, setShowOverlay] = useState<boolean>(true)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [referralSent, setReferralSent] = useState<boolean>(false)
  const [history, setHistory] = useState<HistoryRecord[]>(INITIAL_TAP_HISTORY)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const activeQuality = qualityOverride || selectedScenario.quality

  // Voice Prompt TTS Assistant
  const speakPrompt = (textEng: string, textSin: string) => {
    if (!voiceEnabled) return
    const textToSpeak = lang === 'SIN' ? textSin : textEng
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = 0.9
      utterance.lang = lang === 'SIN' ? 'si-LK' : 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  // Draw Cut Line & Bark Polygon Overlay on Canvas
  useEffect(() => {
    if (!showOverlay || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (activeQuality !== 'GOOD') return

    // Draw Bark Strip Polygon
    if (selectedScenario.barkPoly.length > 0) {
      ctx.beginPath()
      selectedScenario.barkPoly.forEach((pt, i) => {
        const px = (pt.x / 100) * canvas.width
        const py = (pt.y / 100) * canvas.height
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.closePath()
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)'
      ctx.fill()
      ctx.strokeStyle = '#059669'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw Detected Cut Line
    const cut = selectedScenario.cutPath
    if (cut.x1 !== 0) {
      const x1 = (cut.x1 / 100) * canvas.width
      const y1 = (cut.y1 / 100) * canvas.height
      const x2 = (cut.x2 / 100) * canvas.width
      const y2 = (cut.y2 / 100) * canvas.height

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = '#06b6d4'
      ctx.lineWidth = 4
      ctx.stroke()

      // Endpoint crosshairs
      ctx.fillStyle = '#0891b2'
      ctx.beginPath()
      ctx.arc(x1, y1, 6, 0, Math.PI * 2)
      ctx.arc(x2, y2, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw Wound Circle if Present
    if (selectedScenario.woundCoords) {
      const w = selectedScenario.woundCoords
      const wx = (w.x / 100) * canvas.width
      const wy = (w.y / 100) * canvas.height

      ctx.beginPath()
      ctx.arc(wx, wy, w.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(225, 29, 72, 0.45)'
      ctx.fill()
      ctx.strokeStyle = '#e11d48'
      ctx.lineWidth = 3
      ctx.stroke()
    }
  }, [showOverlay, selectedScenario, activeQuality])

  // Handle Photo Pick
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCustomPhoto(url)
    setReferralSent(false)
    speakPrompt(
      'Post-tapping photo uploaded. Checking scale marker and cut alignment...',
      'ඡායාරූපය ඇතුළත් විය. පරිමාන කාඩ්පත පරීක්ෂා කෙරේ...'
    )
  }

  // Trigger Analysis Simulation
  function runCutAudit(scenario: SampleCutScenario) {
    setIsAnalyzing(true)
    setReferralSent(false)
    speakPrompt(
      'Auditing cut length, slope, and bark-strip consumption...',
      'කැපුම් දිග, කෝණය සහ පොතු භාවිතය පරීක්ෂා කෙරේ...'
    )

    setTimeout(() => {
      setIsAnalyzing(false)

      if (scenario.grade === 'ACCEPTABLE') {
        speakPrompt('Cut audit passed! Acceptable workmanship.', 'කැපීම නියමිත පරිදි සිදු කර ඇත.')
      } else if (scenario.grade === 'CORRECTION') {
        speakPrompt('Correction required. Please adjust cut slope angle.', 'සංශෝධනයක් අවශ්‍යයි. කෝණය සකස් කරන්න.')
      } else if (scenario.grade === 'DAMAGING') {
        speakPrompt('Cambium wound detected! Referring case to Field Officer.', 'හානිකර තට්ටු කිරීමක්. නිලධාරියා වෙත යොමු කෙරේ.')
      } else {
        speakPrompt('Scale marker missing. Please retake photo.', 'පරිමාන කාඩ්පත හඳුනාගත නොහැක. නැවත ගන්න.')
      }

      // Append to history log
      const newHistory: HistoryRecord = {
        id: `th-${Date.now()}`,
        date: new Date().toLocaleString(),
        treeId: scenario.treeId,
        grade: scenario.grade,
        barkStripWidthCm: scenario.measurements.barkStripWidthCm,
        cutLengthCm: scenario.measurements.cutLengthCm,
        slopeDeg: scenario.measurements.cutSlopeDeg,
        wound: scenario.measurements.woundDetected,
      }
      setHistory((prev) => [newHistory, ...prev])
    }, 800)
  }

  function handleSelectScenario(scen: SampleCutScenario) {
    setSelectedScenario(scen)
    setCustomPhoto(null)
    setQualityOverride(null)
    setScannedTreeId(`${scen.treeId} (Panel ${scen.panelId})`)
    runCutAudit(scen)
  }

  // Simulate Tree Tag QR Scanner
  function handleScanQR() {
    const treeIds = ['TR-4082 (Panel BO-1)', 'TR-4085 (Panel BI-2)', 'TR-4090 (Panel BO-2)']
    const nextTree = treeIds[Math.floor(Math.random() * treeIds.length)]
    setScannedTreeId(nextTree)
    speakPrompt(`Scanned Tree Tag: ${nextTree}`, `ගස හඳුනාගන්නා ලදී: ${nextTree}`)
  }

  const activePhoto = customPhoto || selectedScenario.imageUrl

  // Quality Alert Badge Component
  const renderQualityAlert = () => {
    switch (activeQuality) {
      case 'BLUR':
        return (
          <div className="bg-amber-50 border-2 border-amber-500 text-amber-900 p-3.5 rounded-xl flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">
                {lang === 'SIN' ? 'ඡායාරූපය බොඳ වී ඇත (Blur Alert)' : 'Quality Alert: Photo is Blurry'}
              </p>
              <p className="text-xs text-amber-800">
                {lang === 'SIN' ? 'කැමරාව නොසෙල්වා රඳවාගන්න.' : 'Hold phone steady right against tapping cut.'}
              </p>
            </div>
          </div>
        )
      case 'NO_SCALE_MARKER':
        return (
          <div className="bg-rose-50 border-2 border-rose-500 text-rose-950 p-3.5 rounded-xl flex items-center gap-3">
            <span className="text-2xl">📏</span>
            <div>
              <p className="font-bold text-sm">
                {lang === 'SIN' ? 'පරිමාන කාඩ්පත හඳුනාගත නොහැක (Scale Marker Missing)' : 'Quality Alert: Scale Marker Card Not Detected'}
              </p>
              <p className="text-xs text-rose-800">
                {lang === 'SIN'
                  ? 'නිවැරදි මිනුම් ලබාගැනීමට පරිමාන කාඩ්පත කැපුම අසලින් තබන්න.'
                  : 'Place reference scale card flat on bark panel right next to cut line.'}
              </p>
            </div>
          </div>
        )
      case 'CUT_NOT_VISIBLE':
        return (
          <div className="bg-amber-50 border-2 border-amber-500 text-amber-900 p-3.5 rounded-xl flex items-center gap-3">
            <span className="text-2xl">📐</span>
            <div>
              <p className="font-bold text-sm">
                {lang === 'SIN' ? 'කැපුම සම්පූර්ණයෙන්ම නොපෙනේ' : 'Quality Alert: Cut Line Incompletely Visible'}
              </p>
              <p className="text-xs text-amber-800">
                {lang === 'SIN' ? 'කැපුමේ මුල සිට අග දක්වා කොටුව තුළ රඳවන්න.' : 'Capture full cut from starting point to latex spigot.'}
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-3 rounded-xl flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="font-bold text-xs">
              {lang === 'SIN'
                ? 'ඡායාරූප පරීක්ෂාව සාර්ථකයි — පරිමාන කාඩ්පත හඳුනාගන්නා ලදී'
                : 'Real-time Quality Gate Passed: Scale card detected & cut illuminated.'}
            </p>
          </div>
        )
    }
  }

  // 1-Action Decision Button Render (SLIIT Novelty Framework - Component 4)
  const renderActionDecision = () => {
    if (activeQuality !== 'GOOD' || selectedScenario.grade === 'RETAKE') {
      return (
        <div className="bg-stone-100 border-4 border-stone-400 rounded-2xl p-6 text-center shadow-md">
          <div className="w-16 h-16 bg-stone-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            ⚪
          </div>
          <span className="inline-block bg-stone-700 text-white font-extrabold px-4 py-1 rounded-full text-xs uppercase mb-2">
            {lang === 'SIN' ? 'නැවත ලබාගන්න' : 'RETAKE / UNABLE TO ASSESS'}
          </span>
          <h3 className="text-2xl font-black text-stone-900 mb-2">
            {lang === 'SIN' ? 'පරිමාන කාඩ්පත පැහැදිලි නැත — නැවත ගන්න' : 'Scale Marker Not Clear: Retake Photo'}
          </h3>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-4">
            {lang === 'SIN'
              ? 'නිවැරදි මිනුම් ලබාගැනීමට පරිමාන මිනුම් කාඩ්පත කැපුම අසලින් තබා නැවත ඡායාරූපයක් ගන්න.'
              : 'The computer vision model requires the scale marker card to measure centimeters accurately.'}
          </p>
          <button
            onClick={() => setQualityOverride('GOOD')}
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-8 rounded-xl cursor-pointer"
          >
            {lang === 'SIN' ? 'නැවත ඡායාරූපයක් ගන්න' : 'Retake Tapping Photo'}
          </button>
        </div>
      )
    }

    if (selectedScenario.grade === 'ACCEPTABLE') {
      return (
        <div className="bg-emerald-500/10 border-4 border-emerald-600 rounded-2xl p-6 text-center shadow-lg">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            🟢
          </div>
          <span className="inline-block bg-emerald-600 text-white font-extrabold px-4 py-1 rounded-full text-xs uppercase mb-2">
            {lang === 'SIN' ? 'නියමිත තට්ටු කිරීම' : 'ACCEPTABLE WORKMANSHIP'}
          </span>
          <h3 className="text-2xl font-black text-emerald-950 mb-2">
            {lang === 'SIN' ? 'විශිෂ්ට කැපීමක් — සාමාන්‍ය පරිදි ඉදිරියට යන්න' : 'Good Workmanship: Continue As Usual'}
          </h3>
          <p className="text-stone-700 text-sm max-w-md mx-auto mb-4">
            {lang === 'SIN' ? selectedScenario.adviceSin : selectedScenario.adviceEng}
          </p>
          <div className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center gap-2">
            <span>✅</span>
            <span>{lang === 'SIN' ? 'තට්ටු කිරීම අනුමත විය' : 'Tapping Approved for Tree Tag'}</span>
          </div>
        </div>
      )
    }

    if (selectedScenario.grade === 'CORRECTION') {
      return (
        <div className="bg-amber-500/10 border-4 border-amber-500 rounded-2xl p-6 text-center shadow-lg">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            🟡
          </div>
          <span className="inline-block bg-amber-500 text-white font-extrabold px-4 py-1 rounded-full text-xs uppercase mb-2">
            {lang === 'SIN' ? 'සංශෝධනයක් අවශ්‍යයි' : 'CORRECTION REQUIRED'}
          </span>
          <h3 className="text-2xl font-black text-amber-950 mb-2">
            {lang === 'SIN' ? 'ඊළඟ කැපුමේදී කෝණය සකසන්න' : 'Adjust Slope / Position on Next Tap'}
          </h3>
          <p className="text-stone-700 text-sm max-w-md mx-auto mb-4">
            {lang === 'SIN' ? selectedScenario.adviceSin : selectedScenario.adviceEng}
          </p>
          <div className="bg-amber-600 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center gap-2">
            <span>💡</span>
            <span>{lang === 'SIN' ? 'උපදෙස්: කෝණය 28° දක්වා අඩු කරන්න' : 'Tip: Reduce slope to 28° next time'}</span>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-rose-500/10 border-4 border-rose-600 rounded-2xl p-6 text-center shadow-lg">
        <div className="w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3 animate-bounce">
          🔴
        </div>
        <span className="inline-block bg-rose-600 text-white font-extrabold px-4 py-1 rounded-full text-xs uppercase mb-2">
          {lang === 'SIN' ? 'හානිකර තට්ටු කිරීමක්' : 'POTENTIALLY DAMAGING (WOUND DETECTED)'}
        </span>
        <h3 className="text-2xl font-black text-rose-950 mb-2">
          {lang === 'SIN' ? 'ක්ෂේත්‍ර නිලධාරී වෙත යොමු කරන්න' : 'Send Case to Field Officer'}
        </h3>
        <p className="text-stone-700 text-sm max-w-md mx-auto mb-5">
          {lang === 'SIN' ? selectedScenario.adviceSin : selectedScenario.adviceEng}
        </p>

        {referralSent ? (
          <div className="bg-emerald-700 text-white font-bold p-4 rounded-xl flex items-center justify-center gap-2">
            <span>✅</span>
            <span>
              {lang === 'SIN'
                ? 'ක්ෂේත්‍ර නිලධාරී පරීක්ෂාව සඳහා යොමු කරන ලදී!'
                : 'Case Successfully Sent to Field Officer Queue!'}
            </span>
          </div>
        ) : (
          <button
            onClick={() => setReferralSent(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-black py-4 px-8 rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>🚨</span>
            <span>
              {lang === 'SIN' ? 'නිලධාරියා වෙත යවන්න' : 'Dispatch Inspection Case to Field Officer'}
            </span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 font-sans text-stone-900">
      {/* Top Controls Header */}
      <header className="bg-stone-900 text-white p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
            Component 4: SLIIT Project J 26-IT-370
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {lang === 'SIN' ? 'තට්ටු කිරීමේ තත්ත්වය සහ පොතු භාවිතය' : 'Tapping Quality & Bark Audit AI'}
          </h1>
          <p className="text-stone-300 text-sm mt-0.5">
            {lang === 'SIN'
              ? 'කැපුම් දිග, කෝණය සහ පොතු පරිභෝජනය මැනීම (W.G.S.D. Minthake)'
              : 'Reference-assisted smartphone auditing of human workmanship & longitudinal bark use'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tree Tag QR Scanner Simulator */}
          <button
            onClick={handleScanQR}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl border border-emerald-600 shadow cursor-pointer flex items-center gap-2"
          >
            <span>📲 QR Tag: {scannedTreeId}</span>
          </button>

          {/* Voice Guidance Toggle */}
          <button
            onClick={() => {
              const next = !voiceEnabled
              setVoiceEnabled(next)
              if (next) speakPrompt('Voice guidance enabled', 'ශ්‍රව්‍ය මාර්ගෝපදේශය සක්‍රියයි')
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border cursor-pointer transition-all ${
              voiceEnabled
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            <span>{voiceEnabled ? '🔊' : '🔇'}</span>
            <span>{lang === 'SIN' ? 'ශ්‍රව්‍ය මාර්ගෝපදේශය' : 'Voice Guidance'}</span>
          </button>

          {/* Offline Sync Switch */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
              isOffline ? 'bg-amber-600 border-amber-500 text-white' : 'bg-stone-800 border-stone-700 text-emerald-400'
            }`}
          >
            <span>{isOffline ? '📶 Offline' : '🌐 Online'}</span>
          </button>

          {/* SIN / ENG Switcher */}
          <div className="bg-stone-800 p-1 rounded-xl border border-stone-700 flex items-center">
            <button
              onClick={() => setLang('ENG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === 'ENG' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              ENG
            </button>
            <button
              onClick={() => setLang('SIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === 'SIN' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              සිංහල
            </button>
          </div>
        </div>
      </header>

      {/* Voice Prompt Banner */}
      {voiceEnabled && (
        <div className="bg-emerald-900/90 text-emerald-100 border border-emerald-700/60 p-3.5 rounded-xl flex items-center gap-3 shadow">
          <span className="text-xl animate-pulse">📢</span>
          <p className="text-sm font-semibold">
            {lang === 'SIN'
              ? 'ශ්‍රව්‍ය උපදෙස්: පරිමාන මිනුම් කාඩ්පත පත්‍රය අසලින් තබා සම්පූර්ණ කැපුම ඡායාරූපගත කරන්න.'
              : 'Voice Prompt: Place reference scale card on bark panel, then capture full tapping cut.'}
          </p>
        </div>
      )}

      {/* Test Scenario Selector */}
      <section className="bg-stone-100 border border-stone-300 p-4 rounded-2xl">
        <p className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
          🧪 {lang === 'SIN' ? 'ආදර්ශ තට්ටු කිරීම් තෝරන්න (Research Evaluation Scenarios)' : 'Select Test Tapping Cut (SLIIT Component 4 Evaluation)'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => handleSelectScenario(scen)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                selectedScenario.id === scen.id && !customPhoto
                  ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-500 shadow'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-400'
              }`}
            >
              <p className="font-extrabold text-xs truncate">
                {lang === 'SIN' ? scen.nameSin : scen.nameEng}
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${selectedScenario.id === scen.id && !customPhoto ? 'text-emerald-200' : 'text-stone-500'}`}>
                Slope: {scen.measurements.cutSlopeDeg}° · Bark: {scen.measurements.barkStripWidthCm}cm
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid: Left Camera & Guide Overlay | Right Audit Results & Novelty Decision */}
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        {/* Left Column: Glove-Friendly Camera & Target Frame Overlay */}
        <section className="space-y-5">
          <div className="bg-white border-2 border-stone-300 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                <span>📸</span>
                <span>{lang === 'SIN' ? '1. ඡායාරූපය සහ මිනුම් රාමුව' : '1. Image Capture & Scale Guide'}</span>
              </h2>
              <span className="text-xs bg-stone-100 text-stone-700 font-bold px-2.5 py-1 rounded-full border">
                Glove Friendly
              </span>
            </div>

            {/* Target Alignment Overlay Container */}
            <div className="relative border-4 border-dashed border-emerald-600/60 rounded-2xl overflow-hidden bg-stone-950 aspect-square shadow-inner flex items-center justify-center">
              <img src={activePhoto} alt="Tapping Cut View" className="w-full h-full object-cover opacity-90" />

              {/* Canvas Overlay for Cut Line & Bark Polygon */}
              {showOverlay && activeQuality === 'GOOD' && (
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              )}

              {/* Scale Marker Outline Target Guide */}
              <div className="absolute top-4 left-4 border-2 border-dashed border-amber-400 bg-amber-500/20 rounded-lg p-2 pointer-events-none text-[10px] font-black text-amber-300">
                🎴 {lang === 'SIN' ? 'පරිමාන කාඩ්පත මෙහි තබන්න' : 'PLACE SCALE CARD HERE'}
              </div>

              {/* Cut Alignment Frame Overlay */}
              <div className="absolute inset-6 border-2 border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="text-center bg-black/60 backdrop-blur text-emerald-300 font-extrabold text-xs py-1 px-3 rounded-full border border-emerald-400/40">
                  ✂️ {lang === 'SIN' ? 'කැපීමේ මුල සහ අග කොටුව තුළ පෙනෙන සේ තබන්න' : 'ALIGN CUT START & END POINT'}
                </div>
              </div>

              {/* Loader */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-stone-900/80 backdrop-blur flex flex-col items-center justify-center text-white space-y-3 z-20">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-bold text-sm">
                    {lang === 'SIN' ? 'කැපුම් කෝණය සහ දිග මනිමින්...' : 'Extracting Cut Line & Measuring Bark Strip...'}
                  </p>
                </div>
              )}
            </div>

            {/* Quality Override Simulator Controls */}
            <div className="pt-2">
              <p className="text-xs font-bold text-stone-500 mb-2">
                ⚡ {lang === 'SIN' ? 'තත්‍ය කාලීන පරීක්ෂණ සිමියුලේටරය:' : 'Test Quality Gate Alerts:'}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setQualityOverride('GOOD')}
                  className={`text-[11px] font-bold py-2 rounded-lg border cursor-pointer ${
                    activeQuality === 'GOOD' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  ✅ Good
                </button>
                <button
                  onClick={() => setQualityOverride('BLUR')}
                  className={`text-[11px] font-bold py-2 rounded-lg border cursor-pointer ${
                    activeQuality === 'BLUR' ? 'bg-amber-600 text-white border-amber-700' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  ⚠️ Blur
                </button>
                <button
                  onClick={() => setQualityOverride('NO_SCALE_MARKER')}
                  className={`text-[11px] font-bold py-2 rounded-lg border cursor-pointer ${
                    activeQuality === 'NO_SCALE_MARKER' ? 'bg-rose-600 text-white border-rose-700' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  📏 Scale Card
                </button>
                <button
                  onClick={() => setQualityOverride('CUT_NOT_VISIBLE')}
                  className={`text-[11px] font-bold py-2 rounded-lg border cursor-pointer ${
                    activeQuality === 'CUT_NOT_VISIBLE' ? 'bg-slate-800 text-white border-slate-900' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  ✂️ Incomplete
                </button>
              </div>
            </div>

            {/* Big Glove-Friendly Camera Button */}
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <div className="w-full h-16 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-lg active:scale-98 transition">
                <span className="text-2xl">📷</span>
                <span>
                  {lang === 'SIN' ? 'කැපූ පසුව ඡායාරූපය ගන්න' : 'Capture Completed Cut Photo'}
                </span>
              </div>
            </label>
          </div>

          {/* Quality Alert Banner Display */}
          {renderQualityAlert()}
        </section>

        {/* Right Column: Measured Values, Workmanship Grade, Wound Flag & Novelty Decision */}
        <section className="space-y-6">
          {/* Result Card */}
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  {lang === 'SIN' ? '2. මිනුම් සහ පරීක්ෂණ ප්‍රතිඵලය' : '2. Measurement Results'}
                </span>
                <h2 className="text-2xl font-black text-stone-900 mt-2">
                  {scannedTreeId}
                </h2>
              </div>

              <div className="text-right bg-stone-900 text-white px-4 py-2 rounded-xl shadow">
                <p className="text-[10px] uppercase font-bold text-stone-400">
                  {lang === 'SIN' ? 'විශ්වාසනීයත්වය' : 'Model Confidence'}
                </p>
                <p className="text-xl font-extrabold text-emerald-400">
                  {activeQuality === 'GOOD' ? `${selectedScenario.measurements.confidence}%` : 'Low'}
                </p>
              </div>
            </div>

            {/* Measured Values Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
                <p className="text-[11px] font-bold text-stone-500 uppercase">
                  {lang === 'SIN' ? 'කැපුම් දිග' : 'Cut Length'}
                </p>
                <p className="text-2xl font-black text-stone-900 mt-1">
                  {activeQuality === 'GOOD' ? `${selectedScenario.measurements.cutLengthCm} cm` : '—'}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">Standard: 35–42 cm</p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
                <p className="text-[11px] font-bold text-stone-500 uppercase">
                  {lang === 'SIN' ? 'කැපුම් කෝණය' : 'Cut Slope Angle'}
                </p>
                <p className="text-2xl font-black text-stone-900 mt-1">
                  {activeQuality === 'GOOD' ? `${selectedScenario.measurements.cutSlopeDeg}°` : '—'}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">Standard: 25–30°</p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
                <p className="text-[11px] font-bold text-stone-500 uppercase">
                  {lang === 'SIN' ? 'පොතු පරිභෝජනය' : 'Bark-Strip Width'}
                </p>
                <p className="text-2xl font-black text-stone-900 mt-1">
                  {activeQuality === 'GOOD' ? `${selectedScenario.measurements.barkStripWidthCm} cm` : '—'}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">Standard: 1.2–1.5 cm</p>
              </div>
            </div>

            {/* Cambium Wound Flag Badge */}
            {selectedScenario.measurements.woundDetected && activeQuality === 'GOOD' && (
              <div className="bg-rose-600 text-white font-extrabold p-3.5 rounded-xl flex items-center justify-between shadow">
                <span className="flex items-center gap-2 text-sm">
                  <span>🚨</span>
                  <span>{lang === 'SIN' ? 'ශාක ශරීරයට හානි සිදු වී ඇත (Visible Wound Detected)' : 'Wound Flag: Visible Cambium Wound Detected'}</span>
                </span>
                <span className="text-xs bg-black/30 px-3 py-1 rounded-full uppercase">Flagged</span>
              </div>
            )}

            {/* Cut Segmentation Overlay Canvas Toggle */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-stone-800">
                  {lang === 'SIN' ? 'කැපුම් රේඛාවේ මිනුම් සිතියම (Cut Line Overlay)' : 'Tapping Cut Line & Bark Boundary Overlay'}
                </p>
                <p className="text-xs text-stone-500">
                  {lang === 'SIN' ? 'කැපුමේ සීමාවන් සිතියම්ගත කරයි' : 'Highlights extracted cut vector and bark strip area'}
                </p>
              </div>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition ${
                  showOverlay ? 'bg-emerald-700 text-white border-emerald-800 shadow' : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                {showOverlay ? 'Overlay ON' : 'Overlay OFF'}
              </button>
            </div>
          </div>

          {/* Section 3: Action Decision (Novelty) */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
              <span>🎯</span>
              <span>{lang === 'SIN' ? '3. නියමිත තීරණය (SLIIT Component 4 Decision)' : '3. Action Decision (Novelty Framework)'}</span>
            </h3>

            {renderActionDecision()}
          </div>
        </section>
      </div>

      {/* Section 4: Longitudinal Bark Consumption Tracker & Tapping History */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Longitudinal Bark Consumption Graph */}
        <section className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
              <span>📈</span>
              <span>{lang === 'SIN' ? 'පොතු පරිභෝජනය මැනීම (Bark Consumption Tracker)' : 'Bark Consumption Tracker (Longitudinal Audit)'}</span>
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              {scannedTreeId}
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BARK_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="tapSession" stroke="#78716c" fontSize={11} fontWeight={700} />
                <YAxis stroke="#78716c" fontSize={11} fontWeight={700} unit=" mm" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="barkWidthMm"
                  name="Bark Consumed (mm)"
                  stroke="#047857"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="limitMm"
                  name="Standard Limit (1.5mm)"
                  stroke="#dc2626"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Tapping History List */}
        <section className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
              <span>📜</span>
              <span>{lang === 'SIN' ? 'පෙර තට්ටුකිරීම් වාර්තා' : 'Tapping History Log'}</span>
            </h3>
            <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full border">
              {history.length} Saved Cuts
            </span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {history.map((item) => (
              <div key={item.id} className="border border-stone-200 rounded-xl p-3 bg-stone-50 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-sm text-stone-900">{item.treeId}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Cut Length: {item.cutLengthCm}cm · Slope: {item.slopeDeg}° · Bark: {item.barkStripWidthCm}cm
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{item.date}</p>
                </div>

                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${
                    item.grade === 'ACCEPTABLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.grade === 'CORRECTION'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.grade}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}