import { useState, useRef, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

type MainComponent = 'C1_YIELD' | 'C3_TPD' | 'C4_TAPPING' | 'C2_DISEASE'
type CaseStatus = 'Pending Review' | 'Validated' | 'Overridden' | 'Resolved'
type YieldGrade = 'TAP' | 'CHECK' | 'DO_NOT_TAP' | 'UNABLE'
type TPDGrade = 'HIGH_RISK' | 'MONITOR' | 'NORMAL' | 'UNABLE'
type WorkmanshipGrade = 'ACCEPTABLE' | 'CORRECTION' | 'DAMAGING' | 'RETAKE'

// Component 1 Yield Forecast Schema
type YieldBlockCase = {
  id: string
  blockCode: string
  division: string
  estate: string
  clone: string
  status: YieldGrade
  reviewStatus: CaseStatus
  expectedYieldKg: number
  rangeLowKg: number
  rangeHighKg: number
  actualYieldKg?: number
  errorPercent?: number
  confidence: number
  weatherSuitability: 'High' | 'Medium' | 'Low'
  assignedTapper: string
  treesCount: number
  reasons: string[]
  impactFactors: { factor: string; impact: string }[]
  history: { obs: string; predicted: number; actual: number; error: number }[]
  auditTrail: { timestamp: string; user: string; action: string }[]
}

// Component 3 TPD Field Officer Schema
type TPDCase = {
  id: string
  treeCode: string
  block: string
  clone: string
  tapperName: string
  tapperId: string
  tpdRiskPercent: number
  dryCutPercent: number
  status: TPDGrade
  reviewStatus: CaseStatus
  confidence: number
  latexFlow: string
  flowDuration: string
  frequency: string
  stimulated: boolean
  restGiven: boolean
  lastObsDate: string
  gps: { lat: number; lng: number }
  imageUrl: string
  reasons: string[]
  expertNotes?: string
  overrideReason?: string
  assignedTapperId?: string
  tapperTaskSent?: boolean
  followUpDate?: string
  history: { obs: string; dryCut: number }[]
  auditTrail: { timestamp: string; user: string; action: string }[]
}

// Component 2 Disease Case Schema
type DiseaseCase = {
  id: string
  date: string
  tapperName: string
  tapperId: string
  plantation: string
  gps: { lat: number; lng: number }
  diseaseEng: string
  diseaseSin: string
  severityPercent: number
  confidence: number
  tapperActionEng: string
  status: CaseStatus
  imageUrl: string
  lesionCoords: { x: number; y: number; r: number }[]
  expertNotes?: string
  aiCorrect?: boolean
  groundTruthSeverity?: number
}

// Component 4 Tapping Quality Case Schema
type TappingCase = {
  id: string
  date: string
  tapperName: string
  tapperId: string
  plantation: string
  treeId: string
  panelId: string
  gps: { lat: number; lng: number }
  cutLengthCm: number
  cutSlopeDeg: number
  barkStripWidthCm: number
  woundDetected: boolean
  confidence: number
  grade: WorkmanshipGrade
  tapperActionEng: string
  status: CaseStatus
  imageUrl: string
  cutPath: { x1: number; y1: number; x2: number; y2: number }
  barkPoly: { x: number; y: number }[]
  woundCoords?: { x: number; y: number; r: number }
  manualDepthMm?: number
  expertNotes?: string
  aiCorrect?: boolean
  caliperLengthCm?: number
  caliperSlopeDeg?: number
  caliperBarkWidthMm?: number
  barkHistory: { session: string; barkWidthMm: number; limitMm: number }[]
}

const INITIAL_YIELD_CASES: YieldBlockCase[] = [
  {
    id: 'YLD-101',
    blockCode: 'Block A12',
    division: 'Division 1',
    estate: 'Kegalle Estate',
    clone: 'RRM 600',
    status: 'TAP',
    reviewStatus: 'Validated',
    expectedYieldKg: 1.25,
    rangeLowKg: 1.1,
    rangeHighKg: 1.38,
    actualYieldKg: 1.18,
    errorPercent: -5.6,
    confidence: 94,
    weatherSuitability: 'High',
    assignedTapper: 'K. G. Sunanda',
    treesCount: 140,
    reasons: [
      'Low rain expected during morning tapping window',
      'Suitable 3-day tapping interval (d3)',
      'Recent yield history consistently strong',
    ],
    impactFactors: [
      { factor: 'Weather Suitability', impact: 'High (+42%)' },
      { factor: 'Recent Yield Trend', impact: 'Medium (+28%)' },
      { factor: 'Tapping Interval', impact: 'Medium (+18%)' },
      { factor: 'Clone Characteristics', impact: 'Low (+12%)' },
    ],
    history: [
      { obs: 'Day 1', predicted: 1.2, actual: 1.15, error: -4.1 },
      { obs: 'Day 2', predicted: 1.22, actual: 1.19, error: -2.4 },
      { obs: 'Day 3', predicted: 1.25, actual: 1.18, error: -5.6 },
    ],
    auditTrail: [
      { timestamp: '2026-09-01 05:30 AM', user: 'AI Engine', action: 'Generated forecast (1.25 kg/tree)' },
      { timestamp: '2026-09-01 06:00 AM', user: 'Field Officer (You)', action: 'Confirmed TAP recommendation' },
      { timestamp: '2026-09-01 11:30 AM', user: 'Sunanda (Tapper)', action: 'Logged actual yield (1.18 kg/tree)' },
    ],
  },
  {
    id: 'YLD-102',
    blockCode: 'Block B04',
    division: 'Division 2',
    estate: 'Kegalle Estate',
    clone: 'PB 260',
    status: 'CHECK',
    reviewStatus: 'Pending Review',
    expectedYieldKg: 0.95,
    rangeLowKg: 0.8,
    rangeHighKg: 1.15,
    actualYieldKg: 0.72,
    errorPercent: -24.2,
    confidence: 62,
    weatherSuitability: 'Medium',
    assignedTapper: 'S. Bandara',
    treesCount: 120,
    reasons: ['Cloud cover & rain risk near 7:30 AM', 'Moderate prediction uncertainty interval'],
    impactFactors: [
      { factor: 'Weather Risk', impact: 'High (-35%)' },
      { factor: 'Model Uncertainty', impact: 'High (-30%)' },
    ],
    history: [
      { obs: 'Day 1', predicted: 1.05, actual: 1.02, error: -2.8 },
      { obs: 'Day 2', predicted: 0.95, actual: 0.72, error: -24.2 },
    ],
    auditTrail: [
      { timestamp: '2026-09-01 05:30 AM', user: 'AI Engine', action: 'Flagged CHECK BEFORE TAPPING (Uncertain)' },
    ],
  },
]

const INITIAL_TPD_CASES: TPDCase[] = [
  {
    id: 'TPD-901',
    treeCode: 'TR-4085',
    block: 'Block 4',
    clone: 'RRM 600',
    tapperName: 'K. G. Sunanda',
    tapperId: 'TAP-4102',
    tpdRiskPercent: 84,
    dryCutPercent: 78,
    status: 'HIGH_RISK',
    reviewStatus: 'Pending Review',
    confidence: 96,
    latexFlow: 'Dry / No Flow',
    flowDuration: '<10 minutes',
    frequency: 'd2 (Every 2 days)',
    stimulated: true,
    restGiven: false,
    lastObsDate: '2026-09-01 08:15 AM',
    gps: { lat: 7.2144, lng: 80.3308 },
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
    reasons: [
      'Dry-cut area increased from 40% to 78%',
      'Latex flow duration dropped below 10 minutes',
      'High tapping frequency (d2) with ethephon stimulation & no rest period',
    ],
    history: [
      { obs: 'Obs 1', dryCut: 22 },
      { obs: 'Obs 2', dryCut: 35 },
      { obs: 'Obs 3', dryCut: 48 },
      { obs: 'Obs 4', dryCut: 55 },
      { obs: 'Obs 5', dryCut: 78 },
    ],
    auditTrail: [
      { timestamp: '2026-09-01 08:15 AM', user: 'Sunanda (Tapper)', action: 'Logged dry-cut observation (78%)' },
      { timestamp: '2026-09-01 08:16 AM', user: 'AI Engine', action: 'Flagged High TPD Risk (84% probability)' },
    ],
  },
  {
    id: 'TPD-902',
    treeCode: 'TR-4083',
    block: 'Block 4',
    clone: 'PB 260',
    tapperName: 'S. Bandara',
    tapperId: 'TAP-2091',
    tpdRiskPercent: 48,
    dryCutPercent: 44,
    status: 'MONITOR',
    reviewStatus: 'Pending Review',
    confidence: 88,
    latexFlow: 'Reduced Flow',
    flowDuration: '10–30 minutes',
    frequency: 'd3 (Every 3 days)',
    stimulated: false,
    restGiven: true,
    lastObsDate: '2026-09-01 07:45 AM',
    gps: { lat: 6.5854, lng: 79.9607 },
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    reasons: ['Dry-cut percentage rising steadily (44%)', 'Latex flow reduced compared to last month'],
    history: [
      { obs: 'Obs 1', dryCut: 18 },
      { obs: 'Obs 2', dryCut: 25 },
      { obs: 'Obs 3', dryCut: 38 },
      { obs: 'Obs 4', dryCut: 44 },
    ],
    auditTrail: [
      { timestamp: '2026-09-01 07:45 AM', user: 'Bandara (Tapper)', action: 'Logged reduced flow observation' },
    ],
  },
  {
    id: 'TPD-903',
    treeCode: 'TR-4082',
    block: 'Block 2',
    clone: 'RRM 600',
    tapperName: 'R. M. Pathirana',
    tapperId: 'TAP-1184',
    tpdRiskPercent: 12,
    dryCutPercent: 18,
    status: 'NORMAL',
    reviewStatus: 'Validated',
    confidence: 94,
    latexFlow: 'Normal Flow',
    flowDuration: '>30 minutes',
    frequency: 'd3 (Every 3 days)',
    stimulated: false,
    restGiven: true,
    lastObsDate: '2026-08-31 08:00 AM',
    gps: { lat: 6.6828, lng: 80.3992 },
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    reasons: ['Latex flow is healthy and steady', 'Dry-cut area well within safe limits (<20%)'],
    history: [
      { obs: 'Obs 1', dryCut: 15 },
      { obs: 'Obs 2', dryCut: 16 },
      { obs: 'Obs 3', dryCut: 18 },
    ],
    auditTrail: [
      { timestamp: '2026-08-31 08:00 AM', user: 'Pathirana (Tapper)', action: 'Logged normal observation' },
      { timestamp: '2026-08-31 09:30 AM', user: 'Field Officer', action: 'Validated normal status' },
    ],
  },
  {
    id: 'TPD-904',
    treeCode: 'TR-4089',
    block: 'Block 2',
    clone: 'PB 260',
    tapperName: 'M. Jayasinghe',
    tapperId: 'TAP-5892',
    tpdRiskPercent: 0,
    dryCutPercent: 0,
    status: 'UNABLE',
    reviewStatus: 'Pending Review',
    confidence: 42,
    latexFlow: 'Uncertain',
    flowDuration: '<10 minutes',
    frequency: 'd2 (Every 2 days)',
    stimulated: false,
    restGiven: false,
    lastObsDate: '2026-08-30 11:20 AM',
    gps: { lat: 7.2189, lng: 80.3341 },
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    reasons: ['Photo blurry under canopy', 'Quality check failed — Abstaining from automated prediction'],
    history: [],
    auditTrail: [
      { timestamp: '2026-08-30 11:20 AM', user: 'Jayasinghe (Tapper)', action: 'Uploaded low-light photo' },
      { timestamp: '2026-08-30 11:21 AM', user: 'AI Engine', action: 'Abstained from decision (Unable to Assess)' },
    ],
  },
]

const INITIAL_DISEASE_CASES: DiseaseCase[] = [
  {
    id: 'CASE-701',
    date: '2026-09-01 08:30 AM',
    tapperName: 'K. G. Sunanda',
    tapperId: 'TAP-4102',
    plantation: 'Kegalle Estate - Block 4',
    gps: { lat: 7.2144, lng: 80.3308 },
    diseaseEng: 'Corynespora Leaf Spot',
    diseaseSin: 'කොරිනෙස්පෝරා පත්‍ර රෝගය',
    severityPercent: 78,
    confidence: 94,
    tapperActionEng: 'System told tapper: Refer to Field Officer',
    status: 'Pending Review',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    lesionCoords: [{ x: 35, y: 40, r: 28 }],
  },
]

const INITIAL_TAPPING_CASES: TappingCase[] = [
  {
    id: 'TAP-801',
    date: '2026-09-01 08:15 AM',
    tapperName: 'K. G. Sunanda',
    tapperId: 'TAP-4102',
    plantation: 'Kegalle Estate - Block 4',
    treeId: 'TR-4085',
    panelId: 'BI-2',
    gps: { lat: 7.2144, lng: 80.3308 },
    cutLengthCm: 39,
    cutSlopeDeg: 27,
    barkStripWidthCm: 2.8,
    woundDetected: true,
    confidence: 95,
    grade: 'DAMAGING',
    tapperActionEng: 'System told tapper: Potentially Damaging — Sent to Officer',
    status: 'Pending Review',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
    cutPath: { x1: 25, y1: 35, x2: 75, y2: 60 },
    barkPoly: [
      { x: 25, y: 35 },
      { x: 75, y: 60 },
      { x: 75, y: 75 },
      { x: 25, y: 50 },
    ],
    barkHistory: [
      { session: 'Tap 1', barkWidthMm: 1.3, limitMm: 1.5 },
      { session: 'Tap 2', barkWidthMm: 1.4, limitMm: 1.5 },
      { session: 'Tap 3', barkWidthMm: 1.2, limitMm: 1.5 },
      { session: 'Tap 4', barkWidthMm: 2.1, limitMm: 1.5 },
      { session: 'Tap 5', barkWidthMm: 2.8, limitMm: 1.5 },
    ],
  },
]

export default function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState<MainComponent>('C1_YIELD')
  const [activeTab, setActiveTab] = useState<'inbox' | 'analytics'>('inbox')

  // Component 1 Yield Forecast States
  const [yieldCases, setYieldCases] = useState<YieldBlockCase[]>(INITIAL_YIELD_CASES)
  const [selectedYieldCase, setSelectedYieldCase] = useState<YieldBlockCase | null>(null)
  const [yieldStatusFilter, setYieldStatusFilter] = useState<string>('ALL')
  const [overrideReasonYield, setOverrideReasonYield] = useState<string>('ACTUAL_WEATHER_BETTER')

  // Component 3 TPD States
  const [tpdCases, setTpdCases] = useState<TPDCase[]>(INITIAL_TPD_CASES)
  const [selectedTpdCase, setSelectedTpdCase] = useState<TPDCase | null>(null)
  const [selectedTreeIdsC3, setSelectedTreeIdsC3] = useState<string[]>([])
  const [tpdRiskFilter, setTpdRiskFilter] = useState<string>('ALL')
  const [tpdBlockFilter, setTpdBlockFilter] = useState<string>('ALL')
  const [prioritySortC3, setPrioritySortC3] = useState<boolean>(true)
  const [viewModeC3, setViewModeC3] = useState<'table' | 'map'>('table')

  // Component 3 Form States (Modal)
  const [expertNoteInputC3, setExpertNoteInputC3] = useState<string>('')
  const [overrideReasonInputC3, setOverrideReasonInputC3] = useState<string>('PHYSICAL_INSPECTION_NORMAL')
  const [smsAlertC3, setSmsAlertC3] = useState<boolean>(false)

  // Component 2 & 4 States
  const [diseaseCases] = useState<DiseaseCase[]>(INITIAL_DISEASE_CASES)
  const [selectedDiseaseCase, setSelectedDiseaseCase] = useState<DiseaseCase | null>(null)
  const [tappingCases, setTappingCases] = useState<TappingCase[]>(INITIAL_TAPPING_CASES)
  const [selectedTappingCase, setSelectedTappingCase] = useState<TappingCase | null>(null)

  const canvasRefC4 = useRef<HTMLCanvasElement | null>(null)

  // Draw Cut Vector & Bark Polygon for Component 4
  useEffect(() => {
    if (!selectedTappingCase || !canvasRefC4.current) return
    const canvas = canvasRefC4.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (selectedTappingCase.barkPoly.length > 0) {
      ctx.beginPath()
      selectedTappingCase.barkPoly.forEach((pt, i) => {
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
  }, [selectedTappingCase])

  // Open Component 3 TPD Modal
  function handleOpenTpdCase(item: TPDCase) {
    setSelectedTpdCase(item)
    setExpertNoteInputC3(item.expertNotes || 'Assign 3-week tapping panel rest. Apply bark recovery tonic B-2.')
    setOverrideReasonInputC3(item.overrideReason || 'PHYSICAL_INSPECTION_NORMAL')
    setSmsAlertC3(false)
  }

  // Handle Component 1 Yield Decision Actions
  function handleYieldAction(actionType: 'CONFIRM' | 'OVERRIDE' | 'INSPECT', newStatus?: YieldGrade) {
    if (!selectedYieldCase) return

    const now = new Date().toLocaleString()
    let actionLog = ''
    let updatedStatus = selectedYieldCase.status

    if (actionType === 'CONFIRM') {
      actionLog = 'Confirmed AI Yield Forecast & Recommendation'
    } else if (actionType === 'OVERRIDE') {
      updatedStatus = newStatus || 'TAP'
      actionLog = `Overrode decision to ${updatedStatus} (Reason: ${overrideReasonYield})`
    } else if (actionType === 'INSPECT') {
      actionLog = 'Dispatched Field Officer for physical canopy inspection'
    }

    const newAudit = [
      ...selectedYieldCase.auditTrail,
      { timestamp: now, user: 'Field Officer (You)', action: actionLog },
    ]

    const updated = yieldCases.map((c) =>
      c.id === selectedYieldCase.id
        ? { ...c, status: updatedStatus, reviewStatus: 'Validated' as CaseStatus, auditTrail: newAudit }
        : c
    )
    setYieldCases(updated)
    setSelectedYieldCase({ ...selectedYieldCase, status: updatedStatus, reviewStatus: 'Validated', auditTrail: newAudit })
  }

  function handleExportYieldReport() {
    const reportText = `SLIIT IT4010 Research Project J 26-IT-370
Field Officer Yield & Tapping-Opportunity Forecasting Summary Report (Component 1)
Date: ${new Date().toLocaleDateString()}
Total Plantation Blocks: ${yieldCases.length}
Recommended to Tap (🟢): ${yieldCases.filter((c) => c.status === 'TAP').length}
Check Required (🟡): ${yieldCases.filter((c) => c.status === 'CHECK').length}
Do Not Tap (🔴): ${yieldCases.filter((c) => c.status === 'DO_NOT_TAP').length}
Unable to Assess (⚪): ${yieldCases.filter((c) => c.status === 'UNABLE').length}
-------------------------------------------------------
${yieldCases.map((c) => `${c.id} | Block: ${c.blockCode} | Status: ${c.status} | Exp Yield: ${c.expectedYieldKg} kg/tree | Actual: ${c.actualYieldKg || 'N/A'} kg | Error: ${c.errorPercent || 0}% | Tapper: ${c.assignedTapper}`).join('\n')}
`
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Yield_Forecast_Officer_Report_${Date.now()}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle TPD Decision Actions
  function handleTpdAction(actionType: 'CONFIRM' | 'OVERRIDE' | 'REFER' | 'RETAKE', newStatus?: TPDGrade) {
    if (!selectedTpdCase) return

    const now = new Date().toLocaleString()
    let actionLog = ''
    let updatedStatus = selectedTpdCase.status
    let updatedReview: CaseStatus = 'Validated'

    if (actionType === 'CONFIRM') {
      actionLog = 'Confirmed AI TPD Recommendation'
      updatedReview = 'Validated'
    } else if (actionType === 'OVERRIDE') {
      updatedStatus = newStatus || 'MONITOR'
      actionLog = `Overrode decision to ${updatedStatus} (Reason: ${overrideReasonInputC3})`
      updatedReview = 'Overridden'
    } else if (actionType === 'REFER') {
      actionLog = 'Referred case to Senior Rubber Pathologist Specialist'
      updatedReview = 'Pending Review'
    } else if (actionType === 'RETAKE') {
      updatedStatus = 'UNABLE'
      actionLog = 'Issued Retake Photo Request to Tapper'
      updatedReview = 'Pending Review'
    }

    const newAudit = [
      ...selectedTpdCase.auditTrail,
      { timestamp: now, user: 'Field Officer (You)', action: actionLog },
    ]

    const updated = tpdCases.map((c) => {
      if (c.id === selectedTpdCase.id) {
        return {
          ...c,
          status: updatedStatus,
          reviewStatus: updatedReview,
          expertNotes: expertNoteInputC3,
          overrideReason: overrideReasonInputC3,
          auditTrail: newAudit,
        }
      }
      return c
    })

    setTpdCases(updated)
    setSelectedTpdCase({
      ...selectedTpdCase,
      status: updatedStatus,
      reviewStatus: updatedReview,
      expertNotes: expertNoteInputC3,
      overrideReason: overrideReasonInputC3,
      auditTrail: newAudit,
    })
  }

  // Filter & Sort Computations
  const filteredTpdCases = tpdCases.filter((c) => {
    if (tpdRiskFilter !== 'ALL' && c.status !== tpdRiskFilter) return false
    if (tpdBlockFilter !== 'ALL' && c.block !== tpdBlockFilter) return false
    return true
  })

  const sortedTpdCases = [...filteredTpdCases].sort((a, b) => {
    if (prioritySortC3) {
      if (a.status === 'HIGH_RISK' && b.status !== 'HIGH_RISK') return -1
      if (b.status === 'HIGH_RISK' && a.status !== 'HIGH_RISK') return 1
      return b.tpdRiskPercent - a.tpdRiskPercent
    }
    return 0
  })

  const filteredYieldCases = yieldCases.filter((c) =>
    yieldStatusFilter !== 'ALL' ? c.status === yieldStatusFilter : true
  )

  // Send Task SMS to Tapper
  function handleSendTaskSMSTpd() {
    if (!selectedTpdCase) return
    setSmsAlertC3(true)
    const updated = tpdCases.map((c) => (c.id === selectedTpdCase.id ? { ...c, tapperTaskSent: true } : c))
    setTpdCases(updated)
    setTimeout(() => setSmsAlertC3(false), 3500)
  }

  // Bulk Selection Actions
  function handleToggleSelectAllC3() {
    if (selectedTreeIdsC3.length === sortedTpdCases.length) {
      setSelectedTreeIdsC3([])
    } else {
      setSelectedTreeIdsC3(sortedTpdCases.map((c) => c.id))
    }
  }

  function handleBulkActionC3(bulkType: 'REST' | 'RETAKE') {
    const updated = tpdCases.map((c) => {
      if (selectedTreeIdsC3.includes(c.id)) {
        return {
          ...c,
          status: bulkType === 'REST' ? ('MONITOR' as TPDGrade) : ('UNABLE' as TPDGrade),
          reviewStatus: 'Validated' as CaseStatus,
        }
      }
      return c
    })
    setTpdCases(updated)
    setSelectedTreeIdsC3([])
  }

  // Export Summary Report
  function handleExportReportC3() {
    const reportText = `SLIIT IT4010 Research Project J 26-IT-370
Field Officer TPD Early Warning & Tapping-Panel Health Summary Report (Component 3)
Date: ${new Date().toLocaleDateString()}
Total Monitored Trees: ${tpdCases.length}
High TPD Risk Trees (🔴): ${tpdCases.filter((c) => c.status === 'HIGH_RISK').length}
Monitor Trees (🟡): ${tpdCases.filter((c) => c.status === 'MONITOR').length}
-------------------------------------------------------
${tpdCases.map((c) => `${c.id} | Tree: ${c.treeCode} | ${c.block} | Clone: ${c.clone} | TPD Risk: ${c.tpdRiskPercent}% | Status: ${c.status} | Tapper: ${c.tapperName}`).join('\n')}
`
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `TPD_Field_Officer_Report_${Date.now()}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 pb-12 font-sans text-stone-900">
      <header className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                SLIIT Research J 26-IT-370
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                Field Officer Command Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              RubberSentry Field Officer Decision Support Platform
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-stone-800 p-1.5 rounded-xl border border-stone-700">
            <button
              onClick={() => setActiveComponent('C1_YIELD')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeComponent === 'C1_YIELD' ? 'bg-cyan-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              📈 Component 1: Yield Forecast
            </button>
            <button
              onClick={() => setActiveComponent('C3_TPD')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeComponent === 'C3_TPD' ? 'bg-amber-500 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              🩺 Component 3: TPD Early Warning
            </button>
            <button
              onClick={() => setActiveComponent('C4_TAPPING')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeComponent === 'C4_TAPPING' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              ✂️ Component 4: Tapping Audit
            </button>
            <button
              onClick={() => setActiveComponent('C2_DISEASE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeComponent === 'C2_DISEASE' ? 'bg-rose-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              🌿 Component 2: Disease Referral
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'inbox' ? 'bg-stone-100 text-stone-900' : 'text-stone-400 hover:text-white'
              }`}
            >
              📋 Priority Action Queue
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'analytics' ? 'bg-stone-100 text-stone-900' : 'text-stone-400 hover:text-white'
              }`}
            >
              📈 Model Accuracy &amp; Reports
            </button>
          </div>
        </div>
      </header>

      {/* COMPONENT 1: YIELD FORECAST WORKSPACE */}
      {activeComponent === 'C1_YIELD' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="bg-white border-2 border-stone-200 p-3.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-stone-500 uppercase">Total Blocks</p>
              <p className="text-2xl font-black text-stone-900 mt-0.5">14 Blocks</p>
              <p className="text-[10px] text-stone-400 font-semibold mt-0.5">1,420 Trees Planned</p>
            </div>
            <div className="bg-white border-2 border-emerald-200 p-3.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-stone-500 uppercase">🟢 Recommended</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">68%</p>
              <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Suitable for cut</p>
            </div>
            <div className="bg-white border-2 border-amber-200 p-3.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-stone-500 uppercase">🟡 Check Required</p>
              <p className="text-2xl font-black text-amber-600 mt-0.5">15%</p>
              <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Uncertain range</p>
            </div>
            <div className="bg-white border-2 border-rose-200 p-3.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-stone-500 uppercase">🔴 Do Not Tap</p>
              <p className="text-2xl font-black text-rose-600 mt-0.5">12%</p>
              <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Heavy rain risk</p>
            </div>
            <div className="bg-white border-2 border-stone-200 p-3.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-stone-500 uppercase">⚪ Unable / Retake</p>
              <p className="text-2xl font-black text-stone-600 mt-0.5">5%</p>
              <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Abstained</p>
            </div>
            <div className="bg-white border-2 border-cyan-200 p-3.5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-stone-500 uppercase">Expected Avg Yield</p>
              <p className="text-2xl font-black text-cyan-600 mt-0.5">1.18 kg</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Actual: 1.14 kg (-3.4%)</p>
            </div>
          </div>

          {activeTab === 'inbox' && (
            <div className="space-y-6">
              {/* Controls & Filters */}
              <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase text-stone-500">🔍 Filter Yield Cases:</span>
                  <select
                    value={yieldStatusFilter}
                    onChange={(e) => setYieldStatusFilter(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="TAP">🟢 Recommended TAP</option>
                    <option value="CHECK">🟡 Check Required</option>
                    <option value="DO_NOT_TAP">🔴 Do Not Tap</option>
                    <option value="UNABLE">⚪ Unable / Abstained</option>
                  </select>
                </div>
                <button
                  onClick={handleExportYieldReport}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow"
                >
                  📄 Export Yield Forecast Report (TXT)
                </button>
              </div>

              {/* Priority Queue Table */}
              <div className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-stone-50 flex items-center justify-between">
                  <h2 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                    <span>🚨</span>
                    <span>Component 1 Plantation Yield &amp; Tapping Priority Queue</span>
                  </h2>
                  <span className="text-xs text-stone-500 font-semibold">Click row for ML explanation &amp; override</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-900 text-stone-200 uppercase font-black tracking-wider text-[11px]">
                        <th className="py-3.5 px-4">Block / Estate</th>
                        <th className="py-3.5 px-4">Assigned Tapper</th>
                        <th className="py-3.5 px-4 text-center">Expected Yield</th>
                        <th className="py-3.5 px-4 text-center">Actual Yield</th>
                        <th className="py-3.5 px-4 text-center">Error %</th>
                        <th className="py-3.5 px-4 text-center">Recommendation</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 font-medium">
                      {filteredYieldCases.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedYieldCase(item)}
                          className="hover:bg-cyan-50/60 transition cursor-pointer bg-white"
                        >
                          <td className="py-3.5 px-4">
                            <p className="font-black text-stone-900">{item.blockCode}</p>
                            <p className="text-[10px] text-stone-500">{item.estate} · {item.clone}</p>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-stone-800">{item.assignedTapper}</td>
                          <td className="py-3.5 px-4 text-center font-black text-stone-900">
                            {item.status === 'UNABLE' ? 'Uncertain' : `${item.expectedYieldKg} kg`}
                          </td>
                          <td className="py-3.5 px-4 text-center font-extrabold text-emerald-700">
                            {item.actualYieldKg ? `${item.actualYieldKg} kg` : 'Pending'}
                          </td>
                          <td className="py-3.5 px-4 text-center font-extrabold text-stone-700">
                            {item.errorPercent ? `${item.errorPercent}%` : 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
                                item.status === 'TAP'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'CHECK'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.status === 'DO_NOT_TAP'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-stone-100 text-stone-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button className="bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm">
                              Inspect ML ➔
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                  <span>📈</span>
                  <span>Predicted vs Actual Yield Trend &amp; Error Analysis (Last 30 Days)</span>
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { day: 'Day 1', predicted: 1.20, actual: 1.15, error: -4.1 },
                        { day: 'Day 2', predicted: 1.22, actual: 1.19, error: -2.4 },
                        { day: 'Day 3', predicted: 1.25, actual: 1.18, error: -5.6 },
                        { day: 'Day 4', predicted: 1.10, actual: 1.08, error: -1.8 },
                        { day: 'Day 5', predicted: 1.28, actual: 1.24, error: -3.1 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="day" stroke="#78716c" fontSize={11} fontWeight={700} />
                      <YAxis stroke="#78716c" fontSize={11} domain={[0, 2]} unit=" kg" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="predicted" stroke="#0891b2" strokeWidth={3} name="Predicted Yield (kg)" />
                      <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Yield (kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMPONENT 3 WORKSPACE */}
      {activeComponent === 'C3_TPD' && (
        <div className="space-y-6">
          {/* Sub-module 1: Top Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm">
              <p className="text-[11px] font-bold text-stone-500 uppercase">Monitored Trees</p>
              <p className="text-3xl font-black text-stone-900 mt-1">142</p>
            </div>
            <div className="bg-white border-2 border-rose-200 p-4 rounded-2xl shadow-sm">
              <p className="text-[11px] font-bold text-stone-500 uppercase">🔴 High TPD Risk</p>
              <p className="text-3xl font-black text-rose-600 mt-1">
                {tpdCases.filter((c) => c.status === 'HIGH_RISK').length}
              </p>
            </div>
            <div className="bg-white border-2 border-amber-200 p-4 rounded-2xl shadow-sm">
              <p className="text-[11px] font-bold text-stone-500 uppercase">🟡 Monitor Trees</p>
              <p className="text-3xl font-black text-amber-600 mt-1">
                {tpdCases.filter((c) => c.status === 'MONITOR').length}
              </p>
            </div>
            <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm">
              <p className="text-[11px] font-bold text-stone-500 uppercase">⚪ Unable / Retake</p>
              <p className="text-3xl font-black text-stone-600 mt-1">
                {tpdCases.filter((c) => c.status === 'UNABLE').length}
              </p>
            </div>
            <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl shadow-sm">
              <p className="text-[11px] font-bold text-stone-500 uppercase">👨‍🌾 Expert Referrals</p>
              <p className="text-3xl font-black text-purple-600 mt-1">
                {tpdCases.filter((c) => c.reviewStatus === 'Pending Review').length}
              </p>
            </div>
          </div>

          {activeTab === 'inbox' && (
            <div className="space-y-6">
              {/* Sub-module 1 & 6: Controls, Filters & Bulk Tools */}
              <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase text-stone-500">🔍 Filter TPD Cases:</span>

                  {/* Risk Filter */}
                  <select
                    value={tpdRiskFilter}
                    onChange={(e) => setTpdRiskFilter(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800"
                  >
                    <option value="ALL">All Risk Levels</option>
                    <option value="HIGH_RISK">🔴 High TPD Risk</option>
                    <option value="MONITOR">🟡 Monitor</option>
                    <option value="NORMAL">🟢 Normal</option>
                    <option value="UNABLE">⚪ Unable / Retake</option>
                  </select>

                  {/* Block Filter */}
                  <select
                    value={tpdBlockFilter}
                    onChange={(e) => setTpdBlockFilter(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800"
                  >
                    <option value="ALL">All Plantation Blocks</option>
                    <option value="Block 4">Block 4</option>
                    <option value="Block 2">Block 2</option>
                  </select>

                  {/* View Mode Switcher */}
                  <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
                    <button
                      onClick={() => setViewModeC3('table')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        viewModeC3 === 'table' ? 'bg-stone-900 text-white' : 'text-stone-600'
                      }`}
                    >
                      📋 Table View
                    </button>
                    <button
                      onClick={() => setViewModeC3('map')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        viewModeC3 === 'map' ? 'bg-stone-900 text-white' : 'text-stone-600'
                      }`}
                    >
                      🗺️ Tree Map Pins
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedTreeIdsC3.length > 0 && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 p-1.5 rounded-xl">
                    <span className="text-xs font-bold text-amber-900 px-2">
                      {selectedTreeIdsC3.length} Selected:
                    </span>
                    <button
                      onClick={() => handleBulkActionC3('REST')}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      Bulk Assign Rest
                    </button>
                    <button
                      onClick={() => handleBulkActionC3('RETAKE')}
                      className="bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      Bulk Request Retake
                    </button>
                  </div>
                )}

                {/* Priority Sort Switch */}
                <button
                  onClick={() => setPrioritySortC3(!prioritySortC3)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center gap-2 ${
                    prioritySortC3
                      ? 'bg-rose-700 text-white border-rose-800 shadow'
                      : 'bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  <span>🚨 Sort: 🔴 High TPD Risk First</span>
                </button>
              </div>

              {/* MAP VIEW SWITCH */}
              {viewModeC3 === 'map' ? (
                <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
                      <span>🗺️</span>
                      <span>Plantation Block GPS Map Pin Matrix</span>
                    </h3>
                    <span className="text-xs text-stone-400">Click any pin to inspect tree details</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {sortedTpdCases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleOpenTpdCase(c)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                          c.status === 'HIGH_RISK'
                            ? 'bg-rose-950/80 border-rose-500 hover:bg-rose-900'
                            : c.status === 'MONITOR'
                            ? 'bg-amber-950/80 border-amber-500 hover:bg-amber-900'
                            : 'bg-stone-800 border-stone-600 hover:bg-stone-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-black text-sm">{c.treeCode}</span>
                          <span className="text-xs font-mono text-stone-400">{c.block}</span>
                        </div>
                        <p className="text-xs text-stone-300 mt-1">TPD Risk: {c.tpdRiskPercent}%</p>
                        <p className="text-[10px] text-stone-400 mt-2 font-mono">
                          📍 {c.gps.lat}°N, {c.gps.lng}°E
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* TABLE VIEW: Sub-module 2 - Priority Action List Table */
                <div className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b bg-stone-50 flex items-center justify-between">
                    <h2 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                      <span>🚨</span>
                      <span>Trees Needing Urgent Action Today (Component 3 TPD)</span>
                    </h2>
                    <button
                      onClick={handleExportReportC3}
                      className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer shadow"
                    >
                      📄 Export List (TXT)
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-900 text-stone-200 uppercase font-black tracking-wider text-[11px]">
                          <th className="py-3.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedTreeIdsC3.length === sortedTpdCases.length}
                              onChange={handleToggleSelectAllC3}
                              className="accent-amber-500"
                            />
                          </th>
                          <th className="py-3.5 px-4">Tree Code / Block</th>
                          <th className="py-3.5 px-4">Tapper Name</th>
                          <th className="py-3.5 px-4 text-center">TPD Risk %</th>
                          <th className="py-3.5 px-4 text-center">Dry Cut %</th>
                          <th className="py-3.5 px-4 text-center">Status</th>
                          <th className="py-3.5 px-4 text-center">Review</th>
                          <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 font-medium">
                        {sortedTpdCases.map((item) => (
                          <tr
                            key={item.id}
                            className={`hover:bg-amber-50/60 transition cursor-pointer ${
                              item.status === 'HIGH_RISK' ? 'bg-rose-50/40' : 'bg-white'
                            }`}
                          >
                            <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedTreeIdsC3.includes(item.id)}
                                onChange={() => {
                                  if (selectedTreeIdsC3.includes(item.id)) {
                                    setSelectedTreeIdsC3(selectedTreeIdsC3.filter((i) => i !== item.id))
                                  } else {
                                    setSelectedTreeIdsC3([...selectedTreeIdsC3, item.id])
                                  }
                                }}
                                className="accent-amber-500"
                              />
                            </td>
                            <td className="py-3.5 px-4" onClick={() => handleOpenTpdCase(item)}>
                              <p className="font-black text-stone-900">{item.treeCode}</p>
                              <p className="text-[10px] text-stone-500">{item.block} · {item.clone}</p>
                            </td>
                            <td className="py-3.5 px-4" onClick={() => handleOpenTpdCase(item)}>
                              <p className="font-bold text-stone-800">{item.tapperName}</p>
                              <p className="text-[10px] text-stone-500">{item.tapperId}</p>
                            </td>
                            <td className="py-3.5 px-4 text-center font-black" onClick={() => handleOpenTpdCase(item)}>
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs ${
                                  item.tpdRiskPercent >= 70
                                    ? 'bg-rose-600 text-white animate-pulse'
                                    : item.tpdRiskPercent >= 30
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-emerald-600 text-white'
                                }`}
                              >
                                {item.tpdRiskPercent}%
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-stone-800" onClick={() => handleOpenTpdCase(item)}>
                              {item.dryCutPercent}%
                            </td>
                            <td className="py-3.5 px-4 text-center" onClick={() => handleOpenTpdCase(item)}>
                              <span
                                className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
                                  item.status === 'HIGH_RISK'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : item.status === 'MONITOR'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center" onClick={() => handleOpenTpdCase(item)}>
                              <span className="font-semibold text-[11px] text-stone-600">{item.reviewStatus}</span>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={() => handleOpenTpdCase(item)}>
                              <button className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition shadow-sm cursor-pointer">
                                Inspect &amp; Action ➔
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-module 5: Analytics & Reports Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                  <span>📈</span>
                  <span>Longitudinal Dry-Cut Progression &amp; TPD Onset Horizon</span>
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { obs: 'Wk 1', Block4Avg: 18, Block2Avg: 15 },
                        { obs: 'Wk 2', Block4Avg: 26, Block2Avg: 16 },
                        { obs: 'Wk 3', Block4Avg: 38, Block2Avg: 17 },
                        { obs: 'Wk 4', Block4Avg: 52, Block2Avg: 18 },
                        { obs: 'Wk 5', Block4Avg: 68, Block2Avg: 19 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="obs" stroke="#78716c" fontSize={11} fontWeight={700} />
                      <YAxis stroke="#78716c" fontSize={11} domain={[0, 100]} unit="%" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Block4Avg" stroke="#dc2626" strokeWidth={3} name="Block 4 Dry Cut Avg (%)" />
                      <Line type="monotone" dataKey="Block2Avg" stroke="#059669" strokeWidth={2} name="Block 2 Dry Cut Avg (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMPONENT 4 WORKSPACE */}
      {activeComponent === 'C4_TAPPING' && (
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-stone-900">
            ✂️ Component 4 Tapping Audit &amp; Bark Consumption Portal
          </h2>
          <p className="text-xs text-stone-500">
            Audits cut angle, slope, bark strip width, and cambium wound flag.
          </p>
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900 text-stone-200">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Tapper Name</th>
                  <th className="p-3">Tree ID</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Bark Strip</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tappingCases.map((c) => (
                  <tr key={c.id} className="hover:bg-emerald-50 cursor-pointer" onClick={() => setSelectedTappingCase(c)}>
                    <td className="p-3 font-bold">{c.id}</td>
                    <td className="p-3">{c.tapperName}</td>
                    <td className="p-3 font-bold">{c.treeId}</td>
                    <td className="p-3 text-center font-bold text-rose-600">{c.grade}</td>
                    <td className="p-3 text-center font-extrabold">{c.barkStripWidthCm} cm</td>
                    <td className="p-3 text-center">
                      <button className="bg-emerald-700 text-white font-bold px-2 py-1 rounded text-[10px]">Inspect ➔</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPONENT 2 WORKSPACE */}
      {activeComponent === 'C2_DISEASE' && (
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-stone-900">
            🌿 Component 2 Rubber Leaf Disease Referral Inbox
          </h2>
          <p className="text-xs text-stone-500">Ingests Corynespora, Powdery Mildew, and Colletotrichum referrals.</p>
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900 text-stone-200">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Tapper</th>
                  <th className="p-3">Disease</th>
                  <th className="p-3 text-center">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {diseaseCases.map((c) => (
                  <tr key={c.id} className="hover:bg-rose-50 cursor-pointer" onClick={() => setSelectedDiseaseCase(c)}>
                    <td className="p-3 font-bold">{c.id}</td>
                    <td className="p-3">{c.tapperName}</td>
                    <td className="p-3 font-bold">{c.diseaseEng}</td>
                    <td className="p-3 text-center font-bold text-rose-600">{c.severityPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPONENT 1 YIELD DETAIL & OVERRIDE MODAL */}
      {selectedYieldCase && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-4 border-stone-300 my-8">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase">
                    {selectedYieldCase.id}
                  </span>
                  <span className="text-xs font-bold text-stone-500">{selectedYieldCase.division}</span>
                </div>
                <h2 className="text-2xl font-black text-stone-900 mt-1">
                  Yield Forecast Review: {selectedYieldCase.blockCode} ({selectedYieldCase.estate})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Clone: <span className="font-bold text-stone-800">{selectedYieldCase.clone}</span> · Assigned Tapper:{' '}
                  <span className="font-bold text-stone-800">{selectedYieldCase.assignedTapper}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedYieldCase(null)}
                className="bg-stone-100 text-stone-700 font-bold p-2.5 rounded-full text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="bg-stone-900 text-white p-5 rounded-2xl space-y-3 shadow-md">
                  <p className="text-[10px] uppercase font-bold text-cyan-300">Component 1 ML Forecast Output</p>
                  <h3 className="text-2xl font-black">{selectedYieldCase.status}</h3>
                  <p className="text-xs text-stone-300">
                    Expected Yield: <span className="font-bold text-white">{selectedYieldCase.expectedYieldKg} kg / tree</span> (Range: {selectedYieldCase.rangeLowKg}–{selectedYieldCase.rangeHighKg} kg)
                  </p>
                </div>

                {/* Factor Impact Attribution */}
                <div className="bg-stone-50 border-2 border-stone-200 p-4 rounded-2xl space-y-2">
                  <p className="font-extrabold text-xs text-stone-800">Factor Impact Attribution:</p>
                  <div className="space-y-1.5">
                    {selectedYieldCase.impactFactors.map((f, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border flex justify-between text-xs font-bold">
                        <span>{f.factor}</span>
                        <span className="text-cyan-700">{f.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Decision Override Studio */}
                <div className="bg-stone-50 border-2 border-stone-200 p-4 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-sm text-stone-900">⚖️ Officer Decision Actions &amp; Override</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleYieldAction('CONFIRM')}
                      className="bg-emerald-700 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer"
                    >
                      ✅ Confirm AI
                    </button>
                    <button
                      onClick={() => handleYieldAction('OVERRIDE', 'TAP')}
                      className="bg-amber-600 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer"
                    >
                      🔴 Override
                    </button>
                    <button
                      onClick={() => handleYieldAction('INSPECT')}
                      className="bg-stone-900 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer"
                    >
                      🔍 Field Check
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Override Reason:</label>
                    <select
                      value={overrideReasonYield}
                      onChange={(e) => setOverrideReasonYield(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl p-2 text-xs font-extrabold text-stone-900"
                    >
                      <option value="ACTUAL_WEATHER_BETTER">Actual weather better than forecast</option>
                      <option value="LOCAL_KNOWLEDGE">Local plantation knowledge</option>
                      <option value="TREE_CONDITION_GOOD">Tree condition good despite rain</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedYieldCase(null)}
                className="bg-stone-900 text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-stone-800 cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPONENT 3 TPD TREE DETAIL & OVERRIDE MODAL (Sub-modules 3, 4, 5, 7, 8) */}
      {selectedTpdCase && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-4 border-stone-300 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase">
                    {selectedTpdCase.id}
                  </span>
                  <span className="text-xs font-bold text-stone-500">{selectedTpdCase.lastObsDate}</span>
                </div>
                <h2 className="text-2xl font-black text-stone-900 mt-1">
                  Field Officer TPD Review: {selectedTpdCase.treeCode} ({selectedTpdCase.block})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Clone: <span className="font-bold text-stone-800">{selectedTpdCase.clone}</span> · Tapper:{' '}
                  <span className="font-bold text-stone-800">{selectedTpdCase.tapperName}</span> ({selectedTpdCase.tapperId})
                </p>
              </div>
              <button
                onClick={() => setSelectedTpdCase(null)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold p-2.5 rounded-full text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Grid Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* LEFT COLUMN: Panel Photo, Dry Cut Graph, Tapping Details */}
              <div className="space-y-4">
                <div className="bg-stone-950 rounded-2xl overflow-hidden border-2 border-stone-800 relative aspect-square shadow-md">
                  <img src={selectedTpdCase.imageUrl} alt="Panel Photo" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-black/70 text-amber-300 font-extrabold text-xs px-3 py-1 rounded-full backdrop-blur border border-amber-400/40">
                    📷 Tapping Panel Photo
                  </div>
                </div>

                {/* Tapping Parameters Summary */}
                <div className="bg-stone-50 border-2 border-stone-200 p-3.5 rounded-2xl grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-[10px] text-stone-500 font-bold uppercase">Frequency</p>
                    <p className="font-extrabold text-stone-900 mt-0.5">{selectedTpdCase.frequency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 font-bold uppercase">Flow Duration</p>
                    <p className="font-extrabold text-rose-600 mt-0.5">{selectedTpdCase.flowDuration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 font-bold uppercase">Stimulated?</p>
                    <p className="font-extrabold text-amber-600 mt-0.5">{selectedTpdCase.stimulated ? '🧪 Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Dry Cut Line Graph */}
                <div className="bg-stone-50 border-2 border-stone-200 p-3.5 rounded-2xl space-y-1">
                  <p className="font-extrabold text-xs text-stone-800">Dry-Cut % Progression (Past Observations):</p>
                  <div className="h-32 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedTpdCase.history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis dataKey="obs" stroke="#78716c" fontSize={10} />
                        <YAxis stroke="#78716c" fontSize={10} domain={[0, 100]} unit="%" />
                        <Tooltip />
                        <Line type="monotone" dataKey="dryCut" stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: AI Results, Review Actions, Task Assignment, Audit Trail */}
              <div className="space-y-5">
                {/* AI Result Card */}
                <div className="bg-stone-900 text-white p-5 rounded-2xl space-y-3 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Component 3 AI Recommendation</p>
                      <h3 className="text-xl font-black mt-0.5">{selectedTpdCase.status}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-stone-400">TPD Risk Probability</p>
                      <p className="text-2xl font-black text-rose-500">{selectedTpdCase.tpdRiskPercent}%</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 italic">Horizon: 68% risk in next 45 days</p>

                  <div className="bg-stone-800 p-3 rounded-xl space-y-1 text-xs">
                    <p className="font-bold text-amber-300">Key Contributing Factors:</p>
                    <ul className="list-disc pl-4 text-stone-300 space-y-0.5">
                      {selectedTpdCase.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sub-module 4: Review & Decision Actions (Override Engine) */}
                <div className="bg-stone-50 border-2 border-stone-200 p-4 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                    <span>⚖️</span>
                    <span>4. Officer Decision Actions &amp; Override Studio</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleTpdAction('CONFIRM')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black py-2.5 px-2 rounded-xl transition cursor-pointer shadow"
                    >
                      ✅ Confirm AI
                    </button>
                    <button
                      onClick={() => handleTpdAction('OVERRIDE', 'MONITOR')}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black py-2.5 px-2 rounded-xl transition cursor-pointer shadow"
                    >
                      🔴 Override
                    </button>
                    <button
                      onClick={() => handleTpdAction('REFER')}
                      className="bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-black py-2.5 px-2 rounded-xl transition cursor-pointer shadow"
                    >
                      👨‍🌾 Refer Expert
                    </button>
                    <button
                      onClick={() => handleTpdAction('RETAKE')}
                      className="bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-black py-2.5 px-2 rounded-xl transition cursor-pointer shadow"
                    >
                      📷 Request Retake
                    </button>
                  </div>

                  {/* Mandatory Override Reason Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mandatory Override Reason (if overriding):
                    </label>
                    <select
                      value={overrideReasonInputC3}
                      onChange={(e) => setOverrideReasonInputC3(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl p-2 text-xs font-extrabold text-stone-900 outline-none"
                    >
                      <option value="PHYSICAL_INSPECTION_NORMAL">Physical Inspection Normal — Dry Cut Exaggerated</option>
                      <option value="RECENT_REST_PERIOD">Recent 2-Week Rest Period Already Executed</option>
                      <option value="FALSE_POSITIVE_BLUR">False Positive Caused by Canopy Shadow</option>
                      <option value="CLIMATE_DRY_SPELL">Transient Climate Dry Spell (Temporary)</option>
                    </select>
                  </div>

                  {/* Field Agronomic Notes & Task Assignment */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700">Add Field Agronomic Notes:</label>
                    <textarea
                      value={expertNoteInputC3}
                      onChange={(e) => setExpertNoteInputC3(e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendTaskSMSTpd}
                      className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer shadow"
                    >
                      📲 Send Retraining Task SMS to Tapper
                    </button>
                  </div>

                  {smsAlertC3 && (
                    <p className="text-xs font-extrabold text-emerald-700 bg-emerald-100 p-2 rounded-lg text-center">
                      ✅ Task Instructions Dispatched to {selectedTpdCase.tapperName}!
                    </p>
                  )}
                </div>

                {/* Sub-module 8: Audit Trail */}
                <div className="bg-stone-50 border-2 border-stone-200 p-4 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-xs text-stone-800 flex items-center gap-1">
                    <span>📜</span>
                    <span>Full Audit Trail &amp; Decision Accountability Log:</span>
                  </h4>
                  <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] text-stone-600 font-mono pr-1">
                    {selectedTpdCase.auditTrail.map((log, i) => (
                      <div key={i} className="bg-white p-1.5 rounded border border-stone-200 flex justify-between">
                        <span>{log.timestamp} - {log.user}</span>
                        <span className="font-bold text-stone-800">{log.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedTpdCase(null)}
                className="bg-stone-900 text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-stone-800 cursor-pointer"
              >
                Close Case Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPONENT 4 MODAL */}
      {selectedTappingCase && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border-4 border-stone-300">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="bg-emerald-700 text-white font-black text-xs px-2.5 py-1 rounded-full uppercase">
                  {selectedTappingCase.id}
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  Cut Audit: {selectedTappingCase.treeId}
                </h3>
              </div>
              <button onClick={() => setSelectedTappingCase(null)} className="bg-stone-100 p-2 rounded-full font-bold">✕</button>
            </div>
            <div className="bg-stone-900 text-white p-4 rounded-xl flex justify-between">
              <div>
                <p className="text-xs text-stone-400 font-bold">Grade</p>
                <p className="text-xl font-black text-emerald-400">{selectedTappingCase.grade}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400 font-bold">Bark Strip</p>
                <p className="text-xl font-black text-white">{selectedTappingCase.barkStripWidthCm} cm</p>
              </div>
            </div>
            <button
              onClick={() => {
                setTappingCases(tappingCases.map((c) => (c.id === selectedTappingCase.id ? { ...c, status: 'Validated' } : c)))
                setSelectedTappingCase(null)
              }}
              className="w-full bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              ✅ Validate Cut Audit
            </button>
          </div>
        </div>
      )}

      {/* COMPONENT 2 MODAL */}
      {selectedDiseaseCase && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border-4 border-stone-300">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-full uppercase">
                  {selectedDiseaseCase.id}
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">{selectedDiseaseCase.diseaseEng}</h3>
              </div>
              <button onClick={() => setSelectedDiseaseCase(null)} className="bg-stone-100 p-2 rounded-full font-bold">✕</button>
            </div>
            <div className="bg-stone-900 text-white p-4 rounded-xl flex justify-between">
              <div>
                <p className="text-xs text-rose-400 font-bold">Severity</p>
                <p className="text-2xl font-black text-rose-500">{selectedDiseaseCase.severityPercent}%</p>
              </div>
            </div>
            <button onClick={() => setSelectedDiseaseCase(null)} className="w-full bg-stone-900 text-white text-xs font-bold py-2.5 rounded-xl">
              Close View
            </button>
          </div>
        </div>
      )}
    </div>
  )
}