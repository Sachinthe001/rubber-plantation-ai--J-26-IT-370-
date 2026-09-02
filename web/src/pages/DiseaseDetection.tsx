import { useState, useRef, useEffect } from 'react'

type Language = 'ENG' | 'SIN'

type QualityAlert = 'GOOD' | 'BLUR' | 'TOO_DARK' | 'GLARE'

type ActionDecision = 'MONITOR' | 'RETAKE' | 'REFER'

type SampleLeaf = {
  id: string
  nameEng: string
  nameSin: string
  imageUrl: string
  quality: QualityAlert
  diseaseEng: string
  diseaseSin: string
  severityPercent: number
  severityLabelEng: string
  severityLabelSin: string
  confidence: number
  decision: ActionDecision
  decisionTextEng: string
  decisionTextSin: string
  lesionCoords: { x: number; y: number; r: number }[]
}

type ScanRecord = {
  id: string
  date: string
  diseaseEng: string
  diseaseSin: string
  severityPercent: number
  decision: ActionDecision
  decisionTextEng: string
  decisionTextSin: string
  imageUrl: string
  synced: boolean
}

const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-1',
    nameEng: 'Leaf Sample 1: Corynespora',
    nameSin: 'පත්‍ර සාම්පලය 1: කොරිනෙස්පෝරා',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    quality: 'GOOD',
    diseaseEng: 'Corynespora Leaf Spot (Target Spot)',
    diseaseSin: 'කොරිනෙස්පෝරා පත්‍ර ලප රෝගය',
    severityPercent: 50,
    severityLabelEng: 'Moderate Severity (50%)',
    severityLabelSin: 'මධ්‍යස්ථ බරපතලකම (50%)',
    confidence: 94,
    decision: 'REFER',
    decisionTextEng: 'Refer to Pathologist — High disease risk detected',
    decisionTextSin: 'ශාක ව්‍යාධිවේදී / ක්ෂේත්‍ර නිලධාරී වෙත යොමු කරන්න',
    lesionCoords: [
      { x: 35, y: 40, r: 25 },
      { x: 55, y: 60, r: 20 },
      { x: 42, y: 72, r: 18 },
    ],
  },
  {
    id: 'sample-2',
    nameEng: 'Leaf Sample 2: Mild Powdery Mildew',
    nameSin: 'පත්‍ර සාම්පලය 2: ගොමු රෝගය (සුළු)',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    quality: 'GOOD',
    diseaseEng: 'Powdery Mildew (Oidium heveae)',
    diseaseSin: 'ගොමු රෝගය (Oidium)',
    severityPercent: 20,
    severityLabelEng: 'Mild Severity (20%)',
    severityLabelSin: 'සුළු බරපතලකම (20%)',
    confidence: 89,
    decision: 'MONITOR',
    decisionTextEng: 'Monitor — Re-check leaf condition in 7 days',
    decisionTextSin: 'නිරීක්ෂණය කරන්න — දින 7කින් නැවත පරීක්ෂා කරන්න',
    lesionCoords: [{ x: 50, y: 45, r: 18 }],
  },
  {
    id: 'sample-3',
    nameEng: 'Leaf Sample 3: Low Quality (Blurry)',
    nameSin: 'පත්‍ර සාම්පලය 3: අපැහැදිලි ඡායාරූපය',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    quality: 'BLUR',
    diseaseEng: 'Uncertain — Low Image Sharpness',
    diseaseSin: 'අවිනිශ්චිතයි — ඡායාරූපය බොඳ වී ඇත',
    severityPercent: 0,
    severityLabelEng: 'Unable to measure severity accurately',
    severityLabelSin: 'බරපතලකම මැනිය නොහැක',
    confidence: 42,
    decision: 'RETAKE',
    decisionTextEng: 'Retake — Image blurry, hold camera steady',
    decisionTextSin: 'නැවත ඡායාරූපයක් ගන්න — කැමරාව නොසෙල්වා තබන්න',
    lesionCoords: [],
  },
  {
    id: 'sample-4',
    nameEng: 'Leaf Sample 4: Severe Colletotrichum',
    nameSin: 'පත්‍ර සාම්පලය 4: කොලෙටෝට්‍රිකම් (දරුණු)',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
    quality: 'GOOD',
    diseaseEng: 'Colletotrichum Leaf Fall',
    diseaseSin: 'කොලෙටෝට්‍රිකම් පත්‍ර හැලීමේ රෝගය',
    severityPercent: 80,
    severityLabelEng: 'Severe Defoliation Risk (80%)',
    severityLabelSin: 'දරුණු පත්‍ර හැලීමේ අවදානම (80%)',
    confidence: 96,
    decision: 'REFER',
    decisionTextEng: 'Refer to Pathologist — Immediate chemical treatment required',
    decisionTextSin: 'ශාක ව්‍යාධිවේදී වෙත යොමු කරන්න — වහාම උපදෙස් ලබාගන්න',
    lesionCoords: [
      { x: 30, y: 30, r: 30 },
      { x: 60, y: 40, r: 28 },
      { x: 45, y: 70, r: 35 },
    ],
  },
]

const INITIAL_HISTORY: ScanRecord[] = [
  {
    id: 'hist-101',
    date: '2026-09-01 08:30 AM',
    diseaseEng: 'Corynespora Leaf Spot',
    diseaseSin: 'කොරිනෙස්පෝරා පත්‍ර රෝගය',
    severityPercent: 50,
    decision: 'REFER',
    decisionTextEng: 'Refer to Field Officer',
    decisionTextSin: 'ක්ෂේත්‍ර නිලධාරී වෙත යොමු කරන ලදී',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=300&q=80',
    synced: true,
  },
  {
    id: 'hist-102',
    date: '2026-08-30 02:15 PM',
    diseaseEng: 'Powdery Mildew',
    diseaseSin: 'ගොමු රෝගය',
    severityPercent: 20,
    decision: 'MONITOR',
    decisionTextEng: 'Monitor in 7 days',
    decisionTextSin: 'දින 7කින් නිරීක්ෂණයට',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
    synced: true,
  },
]

export default function DiseaseDetection() {
  const [lang, setLang] = useState<Language>('ENG')
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true)
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [selectedLeaf, setSelectedLeaf] = useState<SampleLeaf>(SAMPLE_LEAVES[0])
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [qualityOverride, setQualityOverride] = useState<QualityAlert | null>(null)
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [referralSent, setReferralSent] = useState<boolean>(false)
  const [history, setHistory] = useState<ScanRecord[]>(INITIAL_HISTORY)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<ScanRecord | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const activeQuality = qualityOverride || selectedLeaf.quality

  // Voice Guidance helper
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

  // Draw Lesion Heatmap on HTML Canvas
  useEffect(() => {
    if (!showHeatmap || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (activeQuality !== 'GOOD') return

    // Draw simulated heatmap spots
    selectedLeaf.lesionCoords.forEach((spot) => {
      const cx = (spot.x / 100) * canvas.width
      const cy = (spot.y / 100) * canvas.height
      const radius = spot.r

      const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius)
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.85)')
      gradient.addColorStop(0.6, 'rgba(245, 158, 11, 0.6)')
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)')

      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Contour border
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2)
      ctx.strokeStyle = '#dc2626'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.stroke()
      ctx.setLineDash([])
    })
  }, [showHeatmap, selectedLeaf, activeQuality])

  // Handle image pick/change
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCustomImage(url)
    setReferralSent(false)

    // Trigger auto quality check simulation
    speakPrompt('Leaf image loaded. Analyzing quality...', 'පත්‍ර ඡායාරූපය ඇතුළත් විය. පරීක්ෂා කරමින් පවතී...')
  }

  // Handle Analysis trigger
  function runAnalysis(leaf: SampleLeaf) {
    setIsAnalyzing(true)
    setReferralSent(false)
    speakPrompt('Analyzing leaf disease and severity...', 'රෝගය සහ බරපතලකම විශ්ලේෂණය කෙරේ...')

    setTimeout(() => {
      setIsAnalyzing(false)
      if (leaf.decision === 'MONITOR') {
        speakPrompt('Analysis complete. Decision: Monitor in 7 days.', 'විශ්ලේෂණය අවසන්. තීරණය: දින 7කින් නිරීක්ෂණය කරන්න.')
      } else if (leaf.decision === 'RETAKE') {
        speakPrompt('Quality check failed. Please retake photo.', 'ඡායාරූපය අපැහැදිලියි. නැවත ඡායාරූපයක් ගන්න.')
      } else {
        speakPrompt('High severity disease. Refer to Plant Pathologist.', 'දරුණු රෝගී තත්ත්වයක්. ශාක ව්‍යාධිවේදී වෙත යොමු කරන්න.')
      }

      // Add to local history
      const newRecord: ScanRecord = {
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleString(),
        diseaseEng: leaf.diseaseEng,
        diseaseSin: leaf.diseaseSin,
        severityPercent: leaf.severityPercent,
        decision: leaf.decision,
        decisionTextEng: leaf.decisionTextEng,
        decisionTextSin: leaf.decisionTextSin,
        imageUrl: customImage || leaf.imageUrl,
        synced: !isOffline,
      }
      setHistory((prev) => [newRecord, ...prev])
    }, 800)
  }

  function handleSelectSample(leaf: SampleLeaf) {
    setSelectedLeaf(leaf)
    setCustomImage(null)
    setQualityOverride(null)
    runAnalysis(leaf)
  }

  function handleReferralSubmit() {
    setReferralSent(true)
    speakPrompt(
      'Case referred to Field Officer and Plant Pathologist successfully.',
      'තොරතුරු ක්ෂේත්‍ර නිලධාරී සහ ශාක ව්‍යාධිවේදී වෙත සාර්ථකව යොමු කරන ලදී.'
    )
  }

  // Render Quality Badge
  const renderQualityBadge = () => {
    switch (activeQuality) {
      case 'BLUR':
        return (
          <div className="bg-amber-50 border-2 border-amber-500 text-amber-900 rounded-xl p-3.5 flex items-start gap-3 shadow-sm">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-base">
                {lang === 'SIN' ? 'ඡායාරූපය බොඳ වී ඇත (Blur Alert)' : 'Quality Alert: Photo is Blurry'}
              </p>
              <p className="text-sm mt-0.5 text-amber-800">
                {lang === 'SIN'
                  ? 'කැමරාව නොසෙල්වා පත්‍රය පැහැදිලිව ඡායාරූපගත කරන්න.'
                  : 'Hold phone steady with both hands and tap focus on leaf surface.'}
              </p>
            </div>
          </div>
        )
      case 'TOO_DARK':
        return (
          <div className="bg-slate-900 border-2 border-slate-700 text-slate-100 rounded-xl p-3.5 flex items-start gap-3 shadow-sm">
            <span className="text-2xl">🌙</span>
            <div>
              <p className="font-bold text-base">
                {lang === 'SIN' ? 'ආලෝකය ප්‍රමාණවත් නැත (Too Dark)' : 'Quality Alert: Insufficient Light'}
              </p>
              <p className="text-sm mt-0.5 text-slate-300">
                {lang === 'SIN'
                  ? 'පොළොවේ සෙවනැලි මඟහැර පත්‍රය හිරු එලියට අල්ලා ඡායාරූපය ගන්න.'
                  : 'Move leaf out of deep canopy shade or turn on camera flash light.'}
              </p>
            </div>
          </div>
        )
      case 'GLARE':
        return (
          <div className="bg-yellow-50 border-2 border-yellow-600 text-yellow-900 rounded-xl p-3.5 flex items-start gap-3 shadow-sm">
            <span className="text-2xl">☀️</span>
            <div>
              <p className="font-bold text-base">
                {lang === 'SIN' ? 'අධික ආලෝක පරාවර්තනය (Glare Alert)' : 'Quality Alert: Sunlight Glare'}
              </p>
              <p className="text-sm mt-0.5 text-yellow-800">
                {lang === 'SIN'
                  ? 'පත්‍රය කෙලින්ම හිරු එලියට නොඅල්ලා සුළු කෝණයකින් තබන්න.'
                  : 'Direct reflection detected. Tilt leaf slightly away from direct beam.'}
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <span className="text-xl">✅</span>
            <p className="font-semibold text-sm">
              {lang === 'SIN'
                ? 'ඡායාරූපයේ පැහැදිලි බව විශිෂ්ටයි (Quality Check Passed)'
                : 'Real-time Quality Gate Passed: Image sharp & illuminated.'}
            </p>
          </div>
        )
    }
  }

  // Render Action Decision Card (Novelty)
  const renderActionDecision = () => {
    if (activeQuality !== 'GOOD' || selectedLeaf.decision === 'RETAKE') {
      return (
        <div className="bg-amber-500/10 border-4 border-amber-500 rounded-2xl p-6 text-center shadow-lg">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            🟡
          </div>
          <span className="inline-block bg-amber-500 text-white font-extrabold px-4 py-1 rounded-full text-xs tracking-wider uppercase mb-2">
            {lang === 'SIN' ? 'නැවත ලබාගන්න' : 'RETAKE ACTION REQUIRED'}
          </span>
          <h3 className="text-2xl font-black text-amber-950 mb-2">
            {lang === 'SIN' ? 'ඡායාරූපය අපැහැදිලියි — නැවත ගන්න' : 'Photo Unclear: Please Retake'}
          </h3>
          <p className="text-stone-700 text-base max-w-md mx-auto mb-5">
            {lang === 'SIN'
              ? 'ආකෘතියේ නිවැරදි තීරණය ලබාගැනීමට පත්‍රය කොටුව තුළ පැහැදිලිව තබා නැවත ඡායාරූපයක් ගන්න.'
              : 'The image quality gate rejected this photo. Place leaf steady inside the green guide box.'}
          </p>
          <button
            onClick={() => {
              setQualityOverride('GOOD')
              speakPrompt('Ready to retake photo.', 'නැවත ඡායාරූපයක් ගැනීමට සූදානම්.')
            }}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
          >
            <span>📷</span>
            <span>{lang === 'SIN' ? 'නැවත ඡායාරූපයක් ගන්න (Retake)' : 'Tap to Retake Photo'}</span>
          </button>
        </div>
      )
    }

    if (selectedLeaf.decision === 'MONITOR') {
      return (
        <div className="bg-emerald-500/10 border-4 border-emerald-600 rounded-2xl p-6 text-center shadow-lg">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            🟢
          </div>
          <span className="inline-block bg-emerald-600 text-white font-extrabold px-4 py-1 rounded-full text-xs tracking-wider uppercase mb-2">
            {lang === 'SIN' ? 'නිරීක්ෂණය' : 'MONITORING RECOMMENDATION'}
          </span>
          <h3 className="text-2xl font-black text-emerald-950 mb-2">
            {lang === 'SIN' ? 'දින 7කට පසු නැවත පරීක්ෂා කරන්න' : 'Check Again After 7 Days'}
          </h3>
          <p className="text-stone-700 text-base max-w-md mx-auto mb-5">
            {lang === 'SIN'
              ? 'රෝග ලක්ෂණ සුළු මට්ටමක පවතී. දැනට රසායනික ප්‍රතිකාර අවශ්‍ය නොවේ. දින 7කින් නැවත පරීක්ෂා කරන්න.'
              : 'Lesion spread is under 20% threshold. Routine field monitoring recommended.'}
          </p>
          <div className="bg-emerald-600 text-white text-base font-bold py-3.5 px-6 rounded-xl shadow inline-flex items-center gap-2">
            <span>📅</span>
            <span>{lang === 'SIN' ? 'මීළඟ පරීක්ෂාව: දින 7කින්' : 'Scheduled Re-inspection: 7 Days'}</span>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-rose-500/10 border-4 border-rose-600 rounded-2xl p-6 text-center shadow-lg">
        <div className="w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3 animate-pulse">
          🔴
        </div>
        <span className="inline-block bg-rose-600 text-white font-extrabold px-4 py-1 rounded-full text-xs tracking-wider uppercase mb-2">
          {lang === 'SIN' ? 'ව්‍යාධිවේදී යොමුකිරීම' : 'REFERRAL REQUIRED (SLIIT NOVELTY)'}
        </span>
        <h3 className="text-2xl font-black text-rose-950 mb-2">
          {lang === 'SIN' ? 'ක්ෂේත්‍ර නිලධාරී / ව්‍යාධිවේදී වෙත යොමු කරන්න' : 'Send Case to Field Officer'}
        </h3>
        <p className="text-stone-700 text-base max-w-md mx-auto mb-5">
          {lang === 'SIN'
            ? 'රෝගයේ බරපතලකම 50% ඉක්මවයි. ක්ෂණික රසායනික සත්කාර සඳහා ශාක ව්‍යාධිවේදී වෙත මෙම නඩුව යොමු කරන්න.'
            : 'High lesion coverage detected. Decision support engine triggers mandatory expert referral.'}
        </p>

        {referralSent ? (
          <div className="bg-emerald-700 text-white font-bold p-4 rounded-xl flex items-center justify-center gap-2 shadow-md">
            <span>✅</span>
            <span>
              {lang === 'SIN'
                ? 'තොරතුරු ක්ෂේත්‍ර නිලධාරී වෙත සාර්ථකව යවන ලදී!'
                : 'Case Successfully Sent to Field Officer Dashboard!'}
            </span>
          </div>
        ) : (
          <button
            onClick={handleReferralSubmit}
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white text-lg font-extrabold py-4 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
          >
            <span>🚨</span>
            <span>
              {lang === 'SIN'
                ? 'නිලධාරියා වෙත යවන්න (Refer to Pathologist)'
                : 'Dispatch Case to Field Officer'}
            </span>
          </button>
        )}
      </div>
    )
  }

  const activeImage = customImage || selectedLeaf.imageUrl

  return (
    <div className="space-y-8 pb-12 font-sans text-stone-900">
      {/* Top Controls Header: Language, Voice, Offline */}
      <header className="bg-stone-900 text-white p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            SLIIT IT4010 Research Project J 26-IT-370
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {lang === 'SIN' ? 'පත්‍ර රෝග සහ බරපතලකම හඳුනාගැනීම' : 'Rubber Leaf Disease & Severity AI'}
          </h1>
          <p className="text-stone-300 text-sm mt-0.5">
            {lang === 'SIN'
              ? 'රෝග තත්ත්ව විශ්ලේෂණය, හානි සිතියම්කරණය සහ නියමිත තීරණ පද්ධතිය (Component 2)'
              : 'Field-robust vision framework for disease classification, lesion segmentation & decision support'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Voice Prompt Toggle */}
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

          {/* Offline Sync Toggle */}
          <button
            onClick={() => {
              const next = !isOffline
              setIsOffline(next)
              speakPrompt(
                next ? 'Offline mode active. Scans saved locally.' : 'Online mode active. Database synced.',
                next ? 'නොබැඳි මාදිලිය සක්‍රියයි.' : 'සංවාද මාදිලිය සක්‍රියයි.'
              )
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border cursor-pointer transition-all ${
              isOffline
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'bg-stone-800 border-stone-700 text-emerald-400'
            }`}
          >
            <span>{isOffline ? '📶 Offline' : '🌐 Online'}</span>
          </button>

          {/* SIN / ENG Language Switcher */}
          <div className="bg-stone-800 p-1 rounded-xl border border-stone-700 flex items-center">
            <button
              onClick={() => {
                setLang('ENG')
                speakPrompt('Language set to English', 'English language selected')
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === 'ENG' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              ENG
            </button>
            <button
              onClick={() => {
                setLang('SIN')
                speakPrompt('සිංහල භාෂාව තෝරා ගන්නා ලදී', 'සිංහල මාදිලිය සක්‍රියයි')
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === 'SIN' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              සිංහල
            </button>
          </div>
        </div>
      </header>

      {/* Offline Status Alert Banner */}
      {isOffline && (
        <div className="bg-amber-100 border-l-4 border-amber-600 text-amber-900 p-4 rounded-xl flex items-center justify-between gap-4 shadow">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💾</span>
            <div>
              <p className="font-bold text-sm">
                {lang === 'SIN'
                  ? 'නොබැඳි මාදිලිය — දේශීයව සුරැකේ (Saved locally)'
                  : 'Offline Mode Active — Scans are stored locally'}
              </p>
              <p className="text-xs text-amber-800">
                {lang === 'SIN'
                  ? 'අන්තර්ජාල සම්බන්ධතාවය ලැබුණු වහාම දත්ත පද්ධතියට එක් වේ.'
                  : 'Saved. Will automatically sync when internet connection is available.'}
              </p>
            </div>
          </div>
          <span className="text-xs bg-amber-200 text-amber-900 font-extrabold px-3 py-1 rounded-full">
            {lang === 'SIN' ? 'පසුව සංක්‍රමණය වේ' : 'Auto-Sync Pending'}
          </span>
        </div>
      )}

      {/* Voice Banner Prompt */}
      {voiceEnabled && (
        <div className="bg-emerald-900/90 text-emerald-100 border border-emerald-700/60 p-3.5 rounded-xl flex items-center gap-3 shadow">
          <span className="text-xl animate-pulse">📢</span>
          <p className="text-sm font-semibold">
            {lang === 'SIN'
              ? 'ශ්‍රව්‍ය මාර්ගෝපදේශය: පත්‍රය නිවැරදිව පෙනෙන පරිදි පත්‍ර රේඛා කොටුව තුළ තබන්න.'
              : 'Voice Prompt: Place leaf inside the green guide box for automatic scan.'}
          </p>
        </div>
      )}

      {/* Sample Selectors for Easy Demo Testing */}
      <section className="bg-stone-100 border border-stone-300 p-4 rounded-2xl">
        <p className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
          🧪 {lang === 'SIN' ? 'ආදර්ශ පත්‍ර තෝරන්න (Research Demo Controls)' : 'Select Test Leaf Scenario (SLIIT Evaluation)'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_LEAVES.map((leaf) => (
            <button
              key={leaf.id}
              onClick={() => handleSelectSample(leaf)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedLeaf.id === leaf.id && !customImage
                  ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-500 shadow-md'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-400'
              }`}
            >
              <p className="font-extrabold text-xs truncate">
                {lang === 'SIN' ? leaf.nameSin : leaf.nameEng}
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${selectedLeaf.id === leaf.id && !customImage ? 'text-emerald-200' : 'text-stone-500'}`}>
                {leaf.quality === 'GOOD' ? `Severity: ${leaf.severityPercent}%` : 'Quality Alert'}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid: Left Camera/Guide Box | Right Results & Action Decision */}
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        {/* Left Column: Tapper Image Capture & Quality Gate */}
        <section className="space-y-5">
          <div className="bg-white border-2 border-stone-300 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                <span>📸</span>
                <span>{lang === 'SIN' ? '1. ඡායාරූපය ලබාගැනීම' : '1. Image Capture & Guide'}</span>
              </h2>
              <span className="text-xs bg-stone-100 text-stone-600 font-bold px-2.5 py-1 rounded-full border border-stone-300">
                {lang === 'SIN' ? 'තට්ටු කිරීමට පහසුයි' : 'Glove Friendly'}
              </span>
            </div>

            {/* Leaf Guide Box Overlay Container */}
            <div className="relative border-4 border-dashed border-emerald-600/60 rounded-2xl overflow-hidden bg-stone-950 aspect-square shadow-inner flex items-center justify-center group">
              <img
                src={activeImage}
                alt="Leaf View"
                className="w-full h-full object-cover opacity-90"
              />

              {/* Lesion Canvas Overlay (Heatmap) */}
              {showHeatmap && activeQuality === 'GOOD' && (
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              )}

              {/* Guide Frame Corners (Target Overlay) */}
              <div className="absolute inset-6 border-2 border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400"></div>
                  <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400"></div>
                </div>
                <div className="text-center bg-black/60 backdrop-blur text-emerald-300 font-extrabold text-xs py-1.5 px-3 rounded-full border border-emerald-400/40 shadow">
                  🎯 {lang === 'SIN' ? 'පත්‍රය කොටුව තුළ තබන්න' : 'LEAF GUIDE BOX'}
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-4 border-l-4 border-emerald-400"></div>
                  <div className="w-6 h-6 border-b-4 border-r-4 border-emerald-400"></div>
                </div>
              </div>

              {/* Analyzing Loader Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-stone-900/80 backdrop-blur flex flex-col items-center justify-center text-white space-y-3 z-20">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-bold text-sm">
                    {lang === 'SIN' ? 'රෝගය විශ්ලේෂණය කරමින්...' : 'Running Disease Segmentation AI...'}
                  </p>
                </div>
              )}
            </div>

            {/* Quality Override Simulator Controls for Demo */}
            <div className="pt-2">
              <p className="text-xs font-bold text-stone-500 mb-2">
                ⚡ {lang === 'SIN' ? 'තත්‍ය කාලීන ඡායාරූප පරීක්ෂාව (Quality Check Alert Simulator):' : 'Test Quality Check Alerts:'}
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
                  onClick={() => setQualityOverride('TOO_DARK')}
                  className={`text-[11px] font-bold py-2 rounded-lg border cursor-pointer ${
                    activeQuality === 'TOO_DARK' ? 'bg-slate-800 text-white border-slate-900' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  🌙 Dark
                </button>
                <button
                  onClick={() => setQualityOverride('GLARE')}
                  className={`text-[11px] font-bold py-2 rounded-lg border cursor-pointer ${
                    activeQuality === 'GLARE' ? 'bg-yellow-600 text-white border-yellow-700' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  ☀️ Glare
                </button>
              </div>
            </div>

            {/* Large Glove-Friendly Camera Button */}
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <div className="w-full h-16 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-lg active:scale-98 transition-all">
                <span className="text-2xl">📷</span>
                <span>
                  {lang === 'SIN' ? 'ඡායාරූපයක් ගන්න / තෝරන්න' : 'Capture Leaf Photo'}
                </span>
              </div>
            </label>
          </div>

          {/* Quality Alert Banner Display */}
          {renderQualityBadge()}
        </section>

        {/* Right Column: AI Results, Severity Meter, Heatmap Toggle & Novelty Action Decision */}
        <section className="space-y-6">
          {/* Result Card */}
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  {lang === 'SIN' ? '2. රෝග විනිශ්චය සහ බරපතලකම' : '2. Result & Diagnosis'}
                </span>
                <h2 className="text-2xl font-black text-stone-900 mt-2">
                  {lang === 'SIN' ? selectedLeaf.diseaseSin : selectedLeaf.diseaseEng}
                </h2>
              </div>

              {/* Confidence Score Badge */}
              <div className="text-right bg-stone-900 text-white px-4 py-2 rounded-xl shadow">
                <p className="text-[10px] uppercase font-bold text-stone-400">
                  {lang === 'SIN' ? 'විශ්වාසනීයත්වය' : 'AI Confidence'}
                </p>
                <p className="text-xl font-extrabold text-emerald-400">
                  {activeQuality === 'GOOD' ? `${selectedLeaf.confidence}%` : 'Low'}
                </p>
              </div>
            </div>

            {/* Severity Meter (Progress Bar with %: Mild 20% / Moderate 50% / Severe 80%) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                  <span>📊</span>
                  <span>{lang === 'SIN' ? 'බරපතලකම මීටරය (Severity Meter)' : 'Severity Meter (% Lesion Coverage)'}</span>
                </span>
                <span className="text-base font-black text-emerald-800">
                  {lang === 'SIN' ? selectedLeaf.severityLabelSin : selectedLeaf.severityLabelEng}
                </span>
              </div>

              <div className="h-6 w-full bg-stone-200 rounded-full overflow-hidden p-1 flex gap-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedLeaf.severityPercent >= 80
                      ? 'bg-rose-600'
                      : selectedLeaf.severityPercent >= 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${activeQuality === 'GOOD' ? selectedLeaf.severityPercent : 10}%` }}
                ></div>
              </div>

              {/* Severity Threshold Markers */}
              <div className="flex justify-between text-[11px] font-extrabold text-stone-500 mt-2">
                <span className={selectedLeaf.severityPercent <= 20 ? 'text-emerald-700 font-black' : ''}>
                  🟢 {lang === 'SIN' ? 'සුළු (Mild 20%)' : 'Mild (20%)'}
                </span>
                <span className={selectedLeaf.severityPercent === 50 ? 'text-amber-700 font-black' : ''}>
                  🟡 {lang === 'SIN' ? 'මධ්‍යස්ථ (Moderate 50%)' : 'Moderate (50%)'}
                </span>
                <span className={selectedLeaf.severityPercent >= 80 ? 'text-rose-700 font-black' : ''}>
                  🔴 {lang === 'SIN' ? 'දරුණු (Severe 80%)' : 'Severe (80%)'}
                </span>
              </div>
            </div>

            {/* Lesion Heatmap Toggle */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-stone-800">
                  {lang === 'SIN' ? 'හානි වූ ප්‍රදේශයේ රතු සිතියම (Lesion Heatmap Overlay)' : 'Lesion Segmentation Heatmap'}
                </p>
                <p className="text-xs text-stone-500">
                  {lang === 'SIN'
                    ? 'පත්‍රයේ රෝගී ලප රතු පැහැයෙන් සිතියම්ගත කරයි (Component 2 Segmentation)'
                    : 'Highlights infected leaf lesion regions in red overlay'}
                </p>
              </div>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  showHeatmap
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                {showHeatmap
                  ? lang === 'SIN'
                    ? 'සඟවන්න'
                    : 'Heatmap ON'
                  : lang === 'SIN'
                  ? 'පෙන්වන්න'
                  : 'Heatmap OFF'}
              </button>
            </div>
          </div>

          {/* Section 3: Action Decision (Novelty) */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
              <span>🎯</span>
              <span>{lang === 'SIN' ? '3. නියමිත තීරණය (SLIIT Novelty Decision)' : '3. Action Decision (Novelty Framework)'}</span>
            </h3>

            {renderActionDecision()}
          </div>
        </section>
      </div>

      {/* Section 4: Offline Scan History */}
      <section className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <span>📜</span>
            <span>{lang === 'SIN' ? '4. පෙර පරීක්ෂණ වාර්තා (Scan History)' : '4. Offline & Scan History'}</span>
          </h2>
          <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full border">
            {history.length} {lang === 'SIN' ? 'සටහන්' : 'Records Saved'}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedHistoryItem(item)}
              className="border-2 border-stone-200 hover:border-emerald-500 rounded-xl p-3 flex gap-3 items-center bg-stone-50 cursor-pointer transition-all hover:shadow"
            >
              <img src={item.imageUrl} alt="Leaf" className="w-16 h-16 rounded-lg object-cover border" />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm text-stone-900 truncate">
                  {lang === 'SIN' ? item.diseaseSin : item.diseaseEng}
                </p>
                <p className="text-xs font-semibold text-stone-500 mt-0.5">
                  Severity: {item.severityPercent}%
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.decision === 'REFER'
                        ? 'bg-rose-100 text-rose-800'
                        : item.decision === 'MONITOR'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.decision}
                  </span>
                  <span className="text-[10px] text-stone-400">{item.date.split(',')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* History Record Detail Modal */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border-2 border-stone-300">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-lg text-stone-900">
                {lang === 'SIN' ? 'පෙර පරීක්ෂණ විස්තරය' : 'Scan Detail Log'}
              </h3>
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-4 items-center bg-stone-50 p-3 rounded-xl border">
              <img src={selectedHistoryItem.imageUrl} alt="Leaf" className="w-24 h-24 rounded-lg object-cover border" />
              <div>
                <p className="font-black text-base text-stone-900">
                  {lang === 'SIN' ? selectedHistoryItem.diseaseSin : selectedHistoryItem.diseaseEng}
                </p>
                <p className="text-xs text-stone-500 mt-1">Date: {selectedHistoryItem.date}</p>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">
                  Severity: {selectedHistoryItem.severityPercent}%
                </p>
                <span className="inline-block mt-2 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-stone-900 text-white">
                  Decision: {selectedHistoryItem.decision}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 bg-stone-100 p-3 rounded-lg border">
              {lang === 'SIN' ? selectedHistoryItem.decisionTextSin : selectedHistoryItem.decisionTextEng}
            </p>

            <button
              onClick={() => setSelectedHistoryItem(null)}
              className="w-full bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-stone-800 transition cursor-pointer"
            >
              {lang === 'SIN' ? 'වසා දමන්න' : 'Close Details'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}