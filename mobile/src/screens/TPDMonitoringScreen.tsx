import { useState, useEffect } from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { LineChart } from 'react-native-gifted-charts'
import NotificationBar from '../components/NotificationBar'
import { colors } from '../theme/colors'

type Language = 'ENG' | 'SIN'
type TPDStatus = 'NORMAL' | 'MONITOR' | 'HIGH_RISK' | 'UNABLE'
type QualityAlert = 'GOOD' | 'BLURRY' | 'TOO_DARK' | 'NOT_VISIBLE' | 'ALIGNMENT_OFF'
type LatexFlow = '<5 min' | '5–10 min' | '10–15 min' | '15+ min' | 'SKIP'

type TreeScenario = {
  id: string
  treeCode: string
  block: string
  tpdRiskPercent: number
  previousTpdRiskPercent: number
  dryCutPercent: number
  status: TPDStatus
  confidence: number
  latexFlow: LatexFlow
  flowDuration: string
  daysSinceLastCheck: number
  isOverdue: boolean
  imageUrl: string
  ghostImageUrl: string
  actionEng: string
  actionSin: string
  history: { value: number; label: string }[]
}

const TREE_SCENARIOS: TreeScenario[] = [
  {
    id: 'm-tpd-1',
    treeCode: 'TR-4085',
    block: 'Block 4',
    tpdRiskPercent: 84,
    previousTpdRiskPercent: 55,
    dryCutPercent: 78,
    status: 'HIGH_RISK',
    confidence: 96,
    latexFlow: '<5 min',
    flowDuration: '<5 min',
    daysSinceLastCheck: 14,
    isOverdue: true,
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    ghostImageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80&sat=-100', // grayscale for ghost
    actionEng: 'Expert inspection required — sending to Field Officer',
    actionSin: 'විශේෂඥ පරීක්ෂාවක් අවශ්‍යයි — ක්ෂේත්‍ර නිලධාරී වෙත යවයි',
    history: [
      { value: 22, label: 'Wk 1' },
      { value: 35, label: 'Wk 2' },
      { value: 48, label: 'Wk 3' },
      { value: 55, label: 'Wk 4' },
      { value: 78, label: 'Wk 6' },
    ],
  },
  {
    id: 'm-tpd-2',
    treeCode: 'TR-4083',
    block: 'Block 4',
    tpdRiskPercent: 48,
    previousTpdRiskPercent: 44,
    dryCutPercent: 44,
    status: 'MONITOR',
    confidence: 88,
    latexFlow: '5–10 min',
    flowDuration: '5-10 min',
    daysSinceLastCheck: 12,
    isOverdue: false,
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    ghostImageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80&sat=-100',
    actionEng: 'Check again in 2 weeks',
    actionSin: 'සති 2කින් නැවත පරීක්ෂා කරන්න',
    history: [
      { value: 18, label: 'Wk 1' },
      { value: 25, label: 'Wk 2' },
      { value: 38, label: 'Wk 3' },
      { value: 44, label: 'Wk 4' },
    ],
  },
  {
    id: 'm-tpd-3',
    treeCode: 'TR-4082',
    block: 'Block 2',
    tpdRiskPercent: 12,
    previousTpdRiskPercent: 12,
    dryCutPercent: 12,
    status: 'NORMAL',
    confidence: 94,
    latexFlow: '15+ min',
    flowDuration: '15+ min',
    daysSinceLastCheck: 28,
    isOverdue: false,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ghostImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80&sat=-100',
    actionEng: 'Continue as usual, next check in 4 weeks',
    actionSin: 'සාමාන්‍ය පරිදි තට්ටු කරන්න, සති 4කින් පරීක්ෂා කරන්න',
    history: [
      { value: 15, label: 'Wk 1' },
      { value: 16, label: 'Wk 2' },
      { value: 12, label: 'Wk 6' },
    ],
  },
  {
    id: 'm-tpd-4',
    treeCode: 'TR-4099',
    block: 'Block 2',
    tpdRiskPercent: 0,
    previousTpdRiskPercent: 0,
    dryCutPercent: 0,
    status: 'UNABLE',
    confidence: 0,
    latexFlow: 'SKIP',
    flowDuration: 'Unknown',
    daysSinceLastCheck: 0,
    isOverdue: false,
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    ghostImageUrl: '',
    actionEng: 'Not enough history yet to assess trend',
    actionSin: 'ප්‍රවණතාවය තක්සේරු කිරීමට ප්‍රමාණවත් ඉතිහාසයක් නොමැත',
    history: [],
  }
]

export default function TPDMonitoringScreen() {
  const [lang, setLang] = useState<Language>('ENG')
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true)
  const [selectedTree, setSelectedTree] = useState<TreeScenario>(TREE_SCENARIOS[0])
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [qualityOverride, setQualityOverride] = useState<QualityAlert | null>(null)
  const [referralSent, setReferralSent] = useState<boolean>(false)
  const [latexFlowInput, setLatexFlowInput] = useState<LatexFlow>(selectedTree.latexFlow)
  const [completedCount, setCompletedCount] = useState(5)

  // Reset states when tree changes
  useEffect(() => {
    setLatexFlowInput(selectedTree.latexFlow)
    setPhotoUri(null)
    setQualityOverride(null)
    setReferralSent(false)
  }, [selectedTree])

  const activeQuality = qualityOverride || 'GOOD'
  const activeImage = photoUri || selectedTree.imageUrl

  const qualityAlerts: { condition: boolean; icon: string; label: string; sub: string; color: string; border: string }[] = [
    {
      condition: activeQuality === 'BLURRY',
      icon: '⚠️',
      label: lang === 'SIN' ? 'ඡායාරූපය බොඳ වී ඇත' : 'Quality Alert: Photo is Blurry',
      sub: lang === 'SIN' ? 'කැමරාව නොසෙල්වා නැවත ඡායාරූපය ගන්න.' : 'Hold phone steady with both hands.',
      color: '#78350f', border: '#f59e0b',
    },
    {
      condition: activeQuality === 'ALIGNMENT_OFF',
      icon: '📐',
      label: lang === 'SIN' ? 'සමපාත නොවේ' : 'Alignment Off',
      sub: lang === 'SIN' ? 'පෙර ඡායාරූපයේ සෙවණැල්ලට කැමරාව සමපාත කරන්න.' : 'Align live view with the faded ghost image.',
      color: '#78350f', border: '#f59e0b',
    },
    {
      condition: activeQuality === 'TOO_DARK',
      icon: '🌑',
      label: lang === 'SIN' ? 'ආලෝකය මදි' : 'Too Dark',
      sub: lang === 'SIN' ? 'පැනලය පැහැදිලිව නොපෙනේ.' : 'Panel not fully visible. Move to brighter area.',
      color: '#1c1917', border: '#44403c',
    },
    {
      condition: activeQuality === 'GOOD',
      icon: '✅',
      label: lang === 'SIN' ? 'ඡායාරූප තත්ත්වය උසස්' : 'Quality Check Passed',
      sub: '',
      color: '#14532d', border: '#22c55e',
    },
  ]

  const activeAlert = qualityAlerts.find((a) => a.condition)

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required.')
      return
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })

    if (!picked.canceled) {
      setPhotoUri(picked.assets[0].uri)
      setQualityOverride('GOOD')
      setReferralSent(false)
    }
  }

  function handleReferral() {
    setReferralSent(true)
    Alert.alert(
      lang === 'SIN' ? 'සාර්ථකව යොමු කරන ලදී' : 'Referral Sent',
      lang === 'SIN'
        ? 'TPD අවදානම් සහිත ගසේ විස්තර ක්ෂේත්‍ර නිලධාරී වෙත යවන ලදී.'
        : 'High TPD Risk alert sent to Field Officer dashboard.'
    )
  }
  
  function getTrendIndicator() {
    if (selectedTree.history.length < 2) return null
    const diff = selectedTree.dryCutPercent - selectedTree.previousTpdRiskPercent
    if (diff > 5) return '↗ Increasing'
    if (diff < -5) return '↘ Decreasing'
    return '→ Stable'
  }

  function decisionColor(status: TPDStatus) {
    if (status === 'NORMAL') return '#16a34a'
    if (status === 'MONITOR') return '#d97706'
    if (status === 'HIGH_RISK') return '#e11d48'
    return '#57534e'
  }

  function decisionBg(status: TPDStatus) {
    if (status === 'NORMAL') return '#f0fdf4'
    if (status === 'MONITOR') return '#fffbeb'
    if (status === 'HIGH_RISK') return '#fff1f2'
    return '#f5f5f4'
  }

  function decisionIcon(status: TPDStatus) {
    if (status === 'NORMAL') return '🟢'
    if (status === 'MONITOR') return '🟡'
    if (status === 'HIGH_RISK') return '🔴'
    return '⚪'
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NotificationBar />
      
      {/* ── Header Row ────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.appBadge}>COMPONENT 3 · TPD AI</Text>
          <Text style={styles.heading}>
            {lang === 'SIN' ? 'TPD පූර්ව අනතුරු ඇඟවීම' : 'TPD Early Warning'}
          </Text>
        </View>
        <View style={styles.langContainer}>
          <TouchableOpacity
            style={[styles.langBtn, lang === 'ENG' && styles.langBtnActive]}
            onPress={() => setLang('ENG')}
          >
            <Text style={[styles.langBtnText, lang === 'ENG' && styles.langBtnTextActive]}>ENG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, lang === 'SIN' && styles.langBtnActive]}
            onPress={() => setLang('SIN')}
          >
            <Text style={[styles.langBtnText, lang === 'SIN' && styles.langBtnTextActive]}>සිංහල</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Voice Guidance Banner ──────────────────────── */}
      {voiceGuidance && (
        <View style={styles.voiceBanner}>
          <Text style={styles.voiceText}>
            🔊 {lang === 'SIN' ? 'ශ්‍රව්‍ය: පෙර ඡායාරූපයේ සෙවණැල්ලට කැමරාව සමපාත කරන්න.' : 'Voice: Align live view with the faded previous photo.'}
          </Text>
          <TouchableOpacity onPress={() => setVoiceGuidance(false)}>
            <Text style={styles.voiceDismiss}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Offline ─────────────────────────── */}
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Text style={styles.statusText}>
            {isOffline ? '📶 Offline' : '🌐 Online'}
          </Text>
          <Switch
            value={isOffline}
            onValueChange={setIsOffline}
            trackColor={{ true: colors.watch }}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </View>

      {/* ════════════════════════════════════════════════
          1. MONITORING SCHEDULE / DUE LIST
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.cardTitle}>
            📅 {lang === 'SIN' ? '1. අද දින පරීක්ෂණ ලැයිස්තුව' : '1. Due List / Schedule'}
          </Text>
          <Text style={styles.scheduleProgress}>{completedCount} of 12 completed</Text>
        </View>
        <Text style={styles.scheduleSubTitle}>12 trees due for monitoring today</Text>
        
        <View style={styles.treeListScroll}>
          {TREE_SCENARIOS.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.treeListItem, 
                selectedTree.id === t.id && styles.treeListItemActive,
                t.isOverdue && !photoUri && selectedTree.id !== t.id && { borderColor: '#fca5a5', borderWidth: 1 }
              ]}
              onPress={() => setSelectedTree(t)}
            >
              <View style={styles.treeListMain}>
                <Text style={[styles.treeListCode, t.isOverdue && { color: '#ef4444' }]}>{t.treeCode}</Text>
                <Text style={styles.treeListBlock}>{t.block}</Text>
              </View>
              <View style={styles.treeListRight}>
                <Text style={[styles.treeListDays, t.isOverdue && { color: '#ef4444', fontWeight: '800' }]}>
                  {t.daysSinceLastCheck} days ago
                </Text>
                <Text style={[styles.treeListStatus, { color: decisionColor(t.status) }]}>{t.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ════════════════════════════════════════════════
          2. TREE IDENTIFICATION
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          🌳 {lang === 'SIN' ? '2. ගස හඳුනාගැනීම' : '2. Tree Identification'}
        </Text>
        <View style={styles.qrRow}>
          <TouchableOpacity style={styles.qrBtn}>
             <Text style={styles.qrBtnText}>📷 {lang === 'SIN' ? 'ස්කෑන් කරන්න (QR/Tag)' : 'Scan Tag (QR)'}</Text>
          </TouchableOpacity>
          <TextInput 
            style={styles.manualInput} 
            placeholder="Manual Search..."
            value={selectedTree.treeCode}
            editable={false}
          />
        </View>
        
        {/* Previous Observation Card */}
        {selectedTree.history.length > 0 && (
          <View style={styles.prevObsCard}>
             <Text style={styles.prevObsTitle}>{lang === 'SIN' ? 'පෙර පරීක්ෂණ දත්ත:' : 'Previous Observation Summary:'}</Text>
             <Text style={styles.prevObsText}>Last check: {selectedTree.daysSinceLastCheck} days ago — Dry-cut {selectedTree.previousTpdRiskPercent}%, Latex flow {selectedTree.flowDuration}, Status: <Text style={{color: decisionColor(selectedTree.status), fontWeight:'bold'}}>{selectedTree.status}</Text></Text>
          </View>
        )}
      </View>

      {/* ════════════════════════════════════════════════
          3. PANEL IMAGE CAPTURE (Ghost Overlay)
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📸 {lang === 'SIN' ? '3. පැනල් ඡායාරූපය' : '3. Panel Image Capture'}
        </Text>
        
        {/* Ghost Overlay Container */}
        <View style={styles.ghostContainer}>
           <Image source={{ uri: activeImage }} style={styles.liveImage} />
           
           {/* Ghost Image (Simulated transparency) */}
           {!photoUri && selectedTree.ghostImageUrl && (
             <Image source={{ uri: selectedTree.ghostImageUrl }} style={styles.ghostImage} />
           )}
           
           {/* Registration Overlay Lines */}
           <View style={styles.registrationOverlay}>
              <View style={styles.markerLineH} />
              <View style={styles.markerLineV} />
              <View style={styles.targetLabelBox}>
                <Text style={styles.targetLabelText}>
                  {lang === 'SIN' ? 'පෙර සෙවණැල්ලට සමපාත කරන්න' : 'Align with ghost image'}
                </Text>
              </View>
           </View>
        </View>

        {/* Real-time Quality Alert */}
        {activeAlert && !photoUri && (
          <View style={[styles.qualityAlert, { backgroundColor: activeQuality === 'GOOD' ? '#dcfce7' : '#fef3c7', borderColor: activeAlert.border }]}>
            <Text style={styles.alertIcon}>{activeAlert.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: activeAlert.color }]}>{activeAlert.label}</Text>
              {activeAlert.sub.length > 0 && <Text style={styles.alertSub}>{activeAlert.sub}</Text>}
            </View>
          </View>
        )}
        
        {/* Simulate Quality Alerts Row */}
        <View style={styles.qualitySim}>
          <Text style={styles.qualitySimLabel}>{lang === 'SIN' ? 'Live පරීක්ෂා:' : 'Simulate alert:'}</Text>
          {(['GOOD', 'BLURRY', 'TOO_DARK', 'ALIGNMENT_OFF'] as QualityAlert[]).map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.qualSimChip, qualityOverride === q && styles.qualSimChipActive]}
              onPress={() => setQualityOverride(qualityOverride === q ? null : q)}
            >
              <Text style={[styles.qualSimText, qualityOverride === q && styles.qualSimTextActive]}>
                {q === 'GOOD' ? '✓' : q === 'BLURRY' ? 'Blur' : q === 'TOO_DARK' ? 'Dark' : 'Align'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.largeCameraButton} onPress={pickPhoto}>
          <Text style={styles.largeCameraText}>
            📷 {lang === 'SIN' ? 'ඡායාරූපය ගන්න' : 'Capture Aligned Photo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ════════════════════════════════════════════════
          4. LATEX FLOW ENTRY
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          💧 {lang === 'SIN' ? '4. කිරි ගලා යාමේ කාලය' : '4. Latex Flow Entry'}
        </Text>
        <Text style={styles.instructionText}>
          {lang === 'SIN' ? 'ගලා යාම නතර වීමට ගතවන කාලය (Quick-select):' : 'Select observed flow duration to aid early warning detection:'}
        </Text>
        <View style={styles.flowRow}>
          {(['<5 min', '5–10 min', '10–15 min', '15+ min', 'SKIP'] as LatexFlow[]).map((flow) => (
            <TouchableOpacity
              key={flow}
              style={[styles.flowChip, latexFlowInput === flow && styles.flowChipActive]}
              onPress={() => setLatexFlowInput(flow)}
            >
              <Text style={[styles.flowChipText, latexFlowInput === flow && styles.flowChipTextActive]}>{flow}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ════════════════════════════════════════════════
          5. RESULT DISPLAY (Trend indicator)
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📊 {lang === 'SIN' ? '5. ප්‍රතිඵල සහ ප්‍රවණතාව' : '5. Result Display'}
        </Text>
        
        <View style={styles.resultHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.diseaseTitle}>{selectedTree.dryCutPercent}% Dry</Text>
            {getTrendIndicator() && (
               <Text style={[styles.trendText, {color: getTrendIndicator()?.includes('Increasing') ? '#e11d48' : '#16a34a'}]}>
                 {getTrendIndicator()} (was {selectedTree.previousTpdRiskPercent}% {selectedTree.daysSinceLastCheck} days ago)
               </Text>
            )}
          </View>
          <View style={styles.confidenceBadge}>
             <Text style={styles.confidenceText}>{selectedTree.confidence > 0 ? `${selectedTree.confidence}%` : 'N/A'}</Text>
             <Text style={styles.confidenceLabel}>CONFIDENCE</Text>
          </View>
        </View>
        
        {/* Sparkline Simulation */}
        {selectedTree.history.length > 0 && (
          <View style={styles.sparklineContainer}>
             <Text style={styles.sparklineLabel}>Progression Sparkline:</Text>
             <View style={styles.chartWrapper}>
               <LineChart
                 data={selectedTree.history}
                 width={280}
                 height={60}
                 hideYAxisText
                 hideRules
                 hideDataPoints
                 color="#ef4444"
                 thickness={3}
                 curved
               />
             </View>
          </View>
        )}
      </View>

      {/* ════════════════════════════════════════════════
          6. ACTION DECISION
      ════════════════════════════════════════════════ */}
      <View style={[styles.decisionCard, { backgroundColor: decisionBg(selectedTree.status), borderColor: decisionColor(selectedTree.status) }]}>
        <Text style={styles.decisionIcon}>{decisionIcon(selectedTree.status)}</Text>
        
        {selectedTree.status === 'UNABLE' ? (
          <>
            <Text style={styles.decisionTitle}>{lang === 'SIN' ? 'ප්‍රමාණවත් ඉතිහාසයක් නැත' : 'Unable to Assess'}</Text>
            <Text style={styles.decisionSub}>{lang === 'SIN' ? 'මෙම ගස සඳහා ඉතිහාස දත්ත නොමැත.' : 'Not enough longitudinal history to assess trend. Keep monitoring on schedule.'}</Text>
            <View style={[styles.actionBtn, { backgroundColor: '#57534e' }]}>
               <Text style={styles.actionBtnText}>⚪ Continue Schedule</Text>
            </View>
          </>
        ) : selectedTree.status === 'HIGH_RISK' ? (
          <>
            <Text style={styles.decisionTitle}>{lang === 'SIN' ? 'ඉහළ TPD අවදානම' : 'High TPD Risk'}</Text>
            <Text style={styles.decisionSub}>{lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}</Text>
            {referralSent ? (
               <View style={styles.sentBox}>
                 <Text style={styles.sentText}>✅ {lang === 'SIN' ? 'යොමු කරන ලදී' : 'Referred to Field Officer'}</Text>
               </View>
            ) : (
               <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e11d48' }]} onPress={handleReferral}>
                 <Text style={styles.actionBtnText}>🚨 {lang === 'SIN' ? 'නිලධාරියා වෙත යවන්න' : 'Refer to Field Officer'}</Text>
               </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <Text style={styles.decisionTitle}>{selectedTree.status === 'NORMAL' ? 'Normal' : 'Monitor'}</Text>
            <Text style={styles.decisionSub}>{lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}</Text>
            <View style={[styles.actionBtn, { backgroundColor: decisionColor(selectedTree.status) }]}>
               <Text style={styles.actionBtnText}>{decisionIcon(selectedTree.status)} Schedule Updated</Text>
            </View>
          </>
        )}
      </View>

      {/* ════════════════════════════════════════════════
          7. TREE HISTORY VIEW
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📜 {lang === 'SIN' ? '7. ගසේ ඉතිහාසය' : '7. Tree History View'}</Text>
        
        <Text style={styles.historySub}>Longitudinal Timeline & Photos</Text>
        
        <View style={styles.historyPhotosRow}>
           <View style={styles.historyPhotoItem}>
              <Text style={styles.histDate}>Wk 1 (18%)</Text>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80' }} style={styles.histImage} />
           </View>
           <Text style={styles.histArrow}>→</Text>
           <View style={styles.historyPhotoItem}>
              <Text style={styles.histDate}>Wk 4 (44%)</Text>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&q=80' }} style={styles.histImage} />
           </View>
        </View>
        
        <View style={styles.interventionBox}>
           <Text style={styles.interventionTitle}>Interventions Record:</Text>
           <Text style={styles.interventionItem}>• Week 2: Rest period applied</Text>
           <Text style={styles.interventionItem}>• Week 4: Changed to d3 tapping</Text>
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f4' },
  content: { padding: 16, paddingBottom: 48 },

  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  appBadge: { fontSize: 9, fontWeight: '800', color: colors.primary, letterSpacing: 0.6, textTransform: 'uppercase' },
  heading: { fontSize: 20, fontWeight: '900', color: '#1c1917', marginTop: 2 },
  langContainer: { flexDirection: 'row', backgroundColor: '#e7e5e4', borderRadius: 8, padding: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  langBtnActive: { backgroundColor: colors.primary },
  langBtnText: { fontSize: 12, fontWeight: '700', color: '#78716c' },
  langBtnTextActive: { color: '#ffffff' },

  voiceBanner: { backgroundColor: '#064e3b', padding: 10, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voiceText: { color: '#ecfdf5', fontSize: 12, fontWeight: '600', flex: 1 },
  voiceDismiss: { color: '#a7f3d0', fontSize: 14, fontWeight: '800', paddingLeft: 8 },

  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8 },
  statusItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#e7e5e4', gap: 6 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#44403c' },

  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e7e5e4', elevation: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 12 },
  
  scheduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scheduleProgress: { fontSize: 11, color: '#78716c', fontWeight: 'bold' },
  scheduleSubTitle: { fontSize: 12, color: '#57534e', marginBottom: 10, fontStyle: 'italic' },
  treeListScroll: { maxHeight: 150, paddingRight: 4 },
  treeListItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f4', backgroundColor: '#fafaf9', borderRadius: 6, marginBottom: 4 },
  treeListItemActive: { backgroundColor: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1 },
  treeListMain: { flex: 1 },
  treeListCode: { fontSize: 14, fontWeight: 'bold', color: '#1c1917' },
  treeListBlock: { fontSize: 11, color: '#78716c' },
  treeListRight: { alignItems: 'flex-end' },
  treeListDays: { fontSize: 11, color: '#78716c' },
  treeListStatus: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },

  qrRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  qrBtn: { backgroundColor: '#e7e5e4', padding: 10, borderRadius: 8, justifyContent: 'center', flex: 1 },
  qrBtnText: { fontWeight: 'bold', color: '#44403c', textAlign: 'center' },
  manualInput: { flex: 1, borderWidth: 1, borderColor: '#d6d3d1', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#f5f5f4', color: '#78716c' },
  
  prevObsCard: { backgroundColor: '#f0fdf4', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#bbf7d0' },
  prevObsTitle: { fontSize: 11, fontWeight: 'bold', color: '#166534', marginBottom: 4 },
  prevObsText: { fontSize: 12, color: '#14532d', lineHeight: 18 },

  ghostContainer: { height: 220, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: '#000', marginBottom: 10 },
  liveImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  ghostImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.4 },
  registrationOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  markerLineH: { position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(74, 222, 128, 0.5)' },
  markerLineV: { position: 'absolute', width: 1, height: '100%', backgroundColor: 'rgba(74, 222, 128, 0.5)' },
  targetLabelBox: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 150 },
  targetLabelText: { color: '#4ade80', fontSize: 10, fontWeight: 'bold' },

  qualityAlert: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1.5, marginBottom: 10, gap: 8 },
  alertIcon: { fontSize: 18 },
  alertTitle: { fontSize: 13, fontWeight: '800' },
  alertSub: { fontSize: 11, color: '#92400e', marginTop: 2 },

  qualitySim: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10, flexWrap: 'wrap' },
  qualitySimLabel: { fontSize: 10, fontWeight: '700', color: '#78716c' },
  qualSimChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#d6d3d1', backgroundColor: '#fafaf9' },
  qualSimChipActive: { backgroundColor: '#1c1917', borderColor: '#1c1917' },
  qualSimText: { fontSize: 10, fontWeight: '700', color: '#44403c' },
  qualSimTextActive: { color: '#ffffff' },

  largeCameraButton: { backgroundColor: colors.primary, height: 58, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  largeCameraText: { color: '#ffffff', fontSize: 16, fontWeight: '900' },

  instructionText: { fontSize: 12, color: '#57534e', marginBottom: 8 },
  flowRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  flowChip: { backgroundColor: '#f5f5f4', borderWidth: 1, borderColor: '#d6d3d1', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  flowChipActive: { backgroundColor: '#0ea5e9', borderColor: '#0284c7' },
  flowChipText: { fontSize: 12, fontWeight: 'bold', color: '#44403c' },
  flowChipTextActive: { color: '#fff' },

  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  diseaseTitle: { fontSize: 24, fontWeight: '900', color: '#1c1917' },
  trendText: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  confidenceBadge: { backgroundColor: '#1c1917', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: 'center' },
  confidenceText: { color: '#4ade80', fontSize: 15, fontWeight: '900' },
  confidenceLabel: { color: '#a7f3d0', fontSize: 8, fontWeight: '800' },
  sparklineContainer: { marginTop: 10, backgroundColor: '#fafaf9', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#f5f5f4' },
  sparklineLabel: { fontSize: 11, fontWeight: 'bold', color: '#78716c', marginBottom: 4 },
  chartWrapper: { alignItems: 'center' },

  decisionCard: { borderWidth: 3, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 16 },
  decisionIcon: { fontSize: 34, marginBottom: 6 },
  decisionTitle: { fontSize: 17, fontWeight: '900', color: '#1c1917', textAlign: 'center', marginBottom: 4 },
  decisionSub: { fontSize: 13, color: '#44403c', textAlign: 'center', marginBottom: 12, lineHeight: 18 },
  actionBtn: { width: '100%', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '900' },
  sentBox: { backgroundColor: '#15803d', padding: 12, borderRadius: 10, width: '100%', alignItems: 'center' },
  sentText: { color: '#ffffff', fontWeight: '900', fontSize: 13, textAlign: 'center' },

  historySub: { fontSize: 12, color: '#78716c', marginBottom: 10 },
  historyPhotosRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  historyPhotoItem: { flex: 1, alignItems: 'center' },
  histDate: { fontSize: 11, fontWeight: 'bold', color: '#44403c', marginBottom: 4 },
  histImage: { width: 100, height: 100, borderRadius: 8, borderWidth: 1, borderColor: '#d6d3d1' },
  histArrow: { fontSize: 24, color: '#a8a29e', marginHorizontal: 10 },
  
  interventionBox: { backgroundColor: '#fefce8', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#fef08a' },
  interventionTitle: { fontSize: 11, fontWeight: 'bold', color: '#a16207', marginBottom: 4 },
  interventionItem: { fontSize: 11, color: '#854d0e', marginBottom: 2 },
})