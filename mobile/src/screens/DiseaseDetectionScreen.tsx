import { useState } from 'react'
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
import NotificationBar from '../components/NotificationBar'
import { colors } from '../theme/colors'

type Language = 'ENG' | 'SIN'
type QualityAlert = 'GOOD' | 'BLUR' | 'TOO_DARK' | 'GLARE' | 'TOO_FAR'
type ActionDecision = 'MONITOR' | 'RETAKE' | 'REFER' | 'UNSUPPORTED'
type CaptureAngle = 'TOP' | 'UNDERSIDE'

// ─── Types ────────────────────────────────────────────────────────────────────
type SampleLeaf = {
  id: string
  nameEng: string
  nameSin: string
  imageUrl: string
  undersideUrl: string
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
  blockId: string
  treeId: string
  gpsCoords: string
}

type ScanRecord = {
  id: string
  date: string
  diseaseEng: string
  diseaseSin: string
  severityPercent: number
  decision: ActionDecision
  imageUrl: string
  synced: boolean
  blockId: string
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'm-sample-1',
    nameEng: 'Corynespora Spot',
    nameSin: 'කොරිනෙස්පෝරා රෝගය',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    undersideUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    quality: 'GOOD',
    diseaseEng: 'Corynespora Leaf Spot',
    diseaseSin: 'කොරිනෙස්පෝරා පත්‍ර ලප රෝගය',
    severityPercent: 50,
    severityLabelEng: 'Moderate — 50% affected',
    severityLabelSin: 'මධ්‍යස්ථ — 50% බලපෑම',
    confidence: 94,
    decision: 'REFER',
    decisionTextEng: 'Refer to Pathologist',
    decisionTextSin: 'ශාක ව්‍යාධිවේදී වෙත යොමු කරන්න',
    blockId: 'Block A12',
    treeId: 'TR-4082',
    gpsCoords: '7.2553° N, 80.5914° E',
  },
  {
    id: 'm-sample-2',
    nameEng: 'Mild Powdery Mildew',
    nameSin: 'ගොමු රෝගය (සුළු)',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    undersideUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    quality: 'GOOD',
    diseaseEng: 'Powdery Mildew (Oidium)',
    diseaseSin: 'ගොමු රෝගය (Oidium)',
    severityPercent: 20,
    severityLabelEng: 'Mild — 20% affected',
    severityLabelSin: 'සුළු — 20% බලපෑම',
    confidence: 89,
    decision: 'MONITOR',
    decisionTextEng: 'Check again in 7 days',
    decisionTextSin: 'දින 7කින් නැවත පරීක්ෂා කරන්න',
    blockId: 'Block B04',
    treeId: 'TR-4083',
    gpsCoords: '7.2561° N, 80.5921° E',
  },
  {
    id: 'm-sample-3',
    nameEng: 'Blurry Photo',
    nameSin: 'අපැහැදිලි ඡායාරූපය',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    undersideUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    quality: 'BLUR',
    diseaseEng: 'Low Sharpness Detected',
    diseaseSin: 'ඡායාරූපය බොඳ වී ඇත',
    severityPercent: 0,
    severityLabelEng: 'Quality check failed — retake',
    severityLabelSin: 'පරීක්ෂාව අසමත් — නැවත ගන්න',
    confidence: 42,
    decision: 'RETAKE',
    decisionTextEng: 'Photo unclear. Please retake',
    decisionTextSin: 'ඡායාරූපය අපැහැදිලියි. නැවත ගන්න',
    blockId: 'Block C02',
    treeId: 'TR-4085',
    gpsCoords: '7.2548° N, 80.5909° E',
  },
  {
    id: 'm-sample-4',
    nameEng: 'Unknown Lesion',
    nameSin: 'නොහඳුනන රෝගය',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    undersideUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    quality: 'GOOD',
    diseaseEng: 'Outside Model Scope',
    diseaseSin: 'මෙය AI හඳුනා නොගනී',
    severityPercent: 0,
    severityLabelEng: 'Cannot classify',
    severityLabelSin: 'හඳුනාගත නොහැකිය',
    confidence: 18,
    decision: 'UNSUPPORTED',
    decisionTextEng: 'Sending to expert — outside AI scope',
    decisionTextSin: 'AI හා ගැළපෙන රෝගයක් නොපෙනේ — විශේෂඥ වෙත යවයි',
    blockId: 'Block A12',
    treeId: 'TR-4089',
    gpsCoords: '7.2555° N, 80.5918° E',
  },
]

const INITIAL_HISTORY: ScanRecord[] = [
  {
    id: 'hist-m1',
    date: 'Today 08:30 AM',
    diseaseEng: 'Corynespora Leaf Spot',
    diseaseSin: 'කොරිනෙස්පෝරා රෝගය',
    severityPercent: 50,
    decision: 'REFER',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=200&q=80',
    synced: true,
    blockId: 'Block A12',
  },
  {
    id: 'hist-m2',
    date: 'Yesterday 02:15 PM',
    diseaseEng: 'Powdery Mildew',
    diseaseSin: 'ගොමු රෝගය',
    severityPercent: 20,
    decision: 'MONITOR',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    synced: false,
    blockId: 'Block B04',
  },
  {
    id: 'hist-m3',
    date: '2 days ago 06:10 AM',
    diseaseEng: 'Outside Model Scope',
    diseaseSin: 'නොහඳුනන රෝගය',
    severityPercent: 0,
    decision: 'UNSUPPORTED',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=200&q=80',
    synced: true,
    blockId: 'Block C02',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function decisionColor(d: ActionDecision) {
  if (d === 'MONITOR') return '#16a34a'
  if (d === 'RETAKE') return '#d97706'
  if (d === 'REFER') return '#e11d48'
  return '#57534e' // UNSUPPORTED
}
function decisionBg(d: ActionDecision) {
  if (d === 'MONITOR') return '#f0fdf4'
  if (d === 'RETAKE') return '#fffbeb'
  if (d === 'REFER') return '#fff1f2'
  return '#f5f5f4'
}
function decisionIcon(d: ActionDecision) {
  if (d === 'MONITOR') return '🟢'
  if (d === 'RETAKE') return '🟡'
  if (d === 'REFER') return '🔴'
  return '⚪'
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function DiseaseDetectionScreen() {
  const [lang, setLang] = useState<Language>('ENG')
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true)
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [selectedLeaf, setSelectedLeaf] = useState<SampleLeaf>(SAMPLE_LEAVES[0])
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [qualityOverride, setQualityOverride] = useState<QualityAlert | null>(null)
  const [captureAngle, setCaptureAngle] = useState<CaptureAngle>('TOP')
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true)
  const [referralSent, setReferralSent] = useState<boolean>(false)
  const [history, setHistory] = useState<ScanRecord[]>(INITIAL_HISTORY)
  const [treeIdInput, setTreeIdInput] = useState<string>(SAMPLE_LEAVES[0].treeId)

  const activeQuality = qualityOverride || selectedLeaf.quality
  const activeImage = imageUri
    ? imageUri
    : captureAngle === 'UNDERSIDE'
    ? selectedLeaf.undersideUrl
    : selectedLeaf.imageUrl

  // Quality alerts for real-time simulation
  const qualityAlerts: { condition: boolean; icon: string; label: string; sub: string; color: string; border: string }[] = [
    {
      condition: activeQuality === 'BLUR',
      icon: '⚠️',
      label: lang === 'SIN' ? 'ඡායාරූපය බොඳ — නොසෙල්වා ඡායාරූපය ගන්න' : 'Blur Detected — Hold phone steady',
      sub: lang === 'SIN' ? 'දෙඅතින් රඳවා ගන්න' : 'Use both hands to stabilise',
      color: '#78350f', border: '#f59e0b',
    },
    {
      condition: activeQuality === 'TOO_DARK',
      icon: '🌑',
      label: lang === 'SIN' ? 'ඡායාරූපය ඝෝෂ කළ — ආලෝකය ඉහළ දැමීමට' : 'Too Dark — Move to brighter area',
      sub: lang === 'SIN' ? 'ස්වාභාවික ආලෝකය භාවිත කරන්න' : 'Natural light preferred',
      color: '#1c1917', border: '#44403c',
    },
    {
      condition: activeQuality === 'GLARE',
      icon: '☀️',
      label: lang === 'SIN' ? 'හිරු රශ්මි ඝෝෂ — ඡායා ප්‍රදේශ වෙත ගෙන යන්න' : 'Glare Detected — Shade the leaf',
      sub: lang === 'SIN' ? 'ශරීරයෙන් ෙහවනක් සාදන්න' : 'Use your body to block direct sun',
      color: '#78350f', border: '#f59e0b',
    },
    {
      condition: activeQuality === 'TOO_FAR',
      icon: '🔍',
      label: lang === 'SIN' ? 'ළඟ කරන්න — පත්‍රය හොඳින් නොපෙනේ' : 'Move Closer — Leaf too small in frame',
      sub: lang === 'SIN' ? 'කොළය රාමුව පුරා වේ සේ ගෙනාන්න' : 'Fill the guide box with the leaf',
      color: '#1e3a5f', border: '#3b82f6',
    },
    {
      condition: activeQuality === 'GOOD',
      icon: '✅',
      label: lang === 'SIN' ? 'ඡායාරූප තත්ත්වය හොඳ (Quality Gate Passed)' : 'Quality Check Passed',
      sub: '',
      color: '#14532d', border: '#22c55e',
    },
  ]

  const activeAlert = qualityAlerts.find((a) => a.condition)

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert(
        lang === 'SIN' ? 'අවසරය අවශ්‍යයි' : 'Permission Needed',
        lang === 'SIN' ? 'ඡායාරූප ලබාගැනීමට කැමරා අවසරය දෙන්න.' : 'Camera access is required to capture leaf photos.'
      )
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    })
    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
      setReferralSent(false)
      setQualityOverride('GOOD')
    }
  }

  function handleReferral() {
    setReferralSent(true)
    const newRecord: ScanRecord = {
      id: `hist-${Date.now()}`,
      date: 'Just now',
      diseaseEng: selectedLeaf.diseaseEng,
      diseaseSin: selectedLeaf.diseaseSin,
      severityPercent: selectedLeaf.severityPercent,
      decision: selectedLeaf.decision,
      imageUrl: activeImage,
      synced: !isOffline,
      blockId: selectedLeaf.blockId,
    }
    setHistory((prev) => [newRecord, ...prev])
    Alert.alert(
      lang === 'SIN' ? 'සාර්ථකව යොමු කරන ලදී' : 'Referral Dispatched',
      lang === 'SIN'
        ? `${selectedLeaf.gpsCoords} GPS දත්ත සමඟ ක්ෂේත්‍ර නිලධාරී වෙත යවන ලදී.`
        : `Case sent with GPS (${selectedLeaf.gpsCoords}) and ${selectedLeaf.blockId} block metadata.`
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NotificationBar />

      {/* ── Header Row ────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.appBadge}>COMPONENT 2 · DISEASE AI</Text>
          <Text style={styles.heading}>
            {lang === 'SIN' ? 'රෝග හඳුනාගැනීම' : 'Leaf Disease Detection'}
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
            🔊 {lang === 'SIN' ? 'ශ්‍රව්‍ය: කොළය කොටුව තුළ තබා ඡායාරූපය ගන්න.' : 'Voice: Place the leaf inside the guide box, then capture.'}
          </Text>
          <TouchableOpacity onPress={() => setVoiceGuidance(false)}>
            <Text style={styles.voiceDismiss}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Offline + GPS Row ─────────────────────────── */}
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
        <View style={styles.gpsTag}>
          <Text style={styles.gpsText}>📍 {selectedLeaf.gpsCoords}</Text>
        </View>
      </View>

      {/* ════════════════════════════════════════════════
          SECTION 1 — Image Capture & Live Quality Gate
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📸 {lang === 'SIN' ? '1. ඡායාරූපය ගැනීම' : '1. Image Capture'}
        </Text>

        {/* Angle Selector */}
        <View style={styles.anglePicker}>
          <Text style={styles.angleLabel}>{lang === 'SIN' ? 'කෝණය:' : 'Angle:'}</Text>
          {(['TOP', 'UNDERSIDE'] as CaptureAngle[]).map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.angleChip, captureAngle === a && styles.angleChipActive]}
              onPress={() => setCaptureAngle(a)}
            >
              <Text style={[styles.angleChipText, captureAngle === a && styles.angleChipTextActive]}>
                {a === 'TOP'
                  ? lang === 'SIN' ? '☀️ ඉහල' : '☀️ Top'
                  : lang === 'SIN' ? '🌿 යට' : '🌿 Underside'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaf Guide Box */}
        <View style={styles.guideBoxContainer}>
          <Image source={{ uri: activeImage }} style={styles.previewImage} />

          {/* Corner Frame Overlay */}
          <View style={styles.targetFrame}>
            <View style={styles.targetRow}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
            </View>
            <View style={styles.targetLabelBox}>
              <Text style={styles.targetLabelText}>
                🎯 {lang === 'SIN' ? 'කොළය මෙතුළ තබන්න' : 'LEAF GUIDE BOX'}
              </Text>
            </View>
            <View style={styles.targetRow}>
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Heatmap Lesion Overlay */}
          {showHeatmap && activeQuality === 'GOOD' && selectedLeaf.severityPercent > 0 && (
            <>
              <View style={[styles.lesionSpot, { top: '35%', left: '42%' }]} />
              <View style={[styles.lesionSpot, { top: '55%', left: '58%', width: 40, height: 40, borderRadius: 20 }]} />
            </>
          )}

          {/* Angle badge */}
          <View style={styles.angleBadgeOverlay}>
            <Text style={styles.angleBadgeText}>
              {captureAngle === 'TOP' ? '☀️ Top' : '🌿 Underside'}
            </Text>
          </View>
        </View>

        {/* Real-time Quality Alert */}
        {activeAlert && (
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
          {(['BLUR', 'TOO_DARK', 'GLARE', 'TOO_FAR', 'GOOD'] as QualityAlert[]).map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.qualSimChip, qualityOverride === q && styles.qualSimChipActive]}
              onPress={() => setQualityOverride(qualityOverride === q ? null : q)}
            >
              <Text style={[styles.qualSimText, qualityOverride === q && styles.qualSimTextActive]}>
                {q === 'GOOD' ? '✓' : q === 'BLUR' ? 'Blur' : q === 'TOO_DARK' ? 'Dark' : q === 'GLARE' ? 'Glare' : 'Far'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Large Capture Button */}
        <TouchableOpacity style={styles.largeCameraButton} onPress={pickImage}>
          <Text style={styles.largeCameraText}>
            📷 {lang === 'SIN' ? 'ඡායාරූපය ගන්න' : 'Capture Leaf Photo'}
          </Text>
        </TouchableOpacity>

        {/* Heatmap Toggle */}
        <TouchableOpacity
          style={styles.heatmapToggle}
          onPress={() => setShowHeatmap(!showHeatmap)}
        >
          <Text style={styles.heatmapToggleText}>
            {showHeatmap
              ? (lang === 'SIN' ? '🔴 Heatmap නිවන්න' : '🔴 Hide Lesion Heatmap')
              : (lang === 'SIN' ? '🟠 Heatmap ආලෝකමත් කරන්න' : '🟠 Show Lesion Heatmap')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ════════════════════════════════════════════════
          SECTION 1b — Select Demo Leaf (below capture)
      ════════════════════════════════════════════════ */}
      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>
          🧪 {lang === 'SIN' ? 'ආදර්ශ සාම්පල තෝරන්න:' : 'Select Demo Test Leaf:'}
        </Text>
        <View style={styles.demoRow}>
          {SAMPLE_LEAVES.map((leaf) => (
            <TouchableOpacity
              key={leaf.id}
              style={[styles.demoChip, selectedLeaf.id === leaf.id && !imageUri && styles.demoChipActive]}
              onPress={() => {
                setSelectedLeaf(leaf)
                setImageUri(null)
                setQualityOverride(null)
                setReferralSent(false)
                setTreeIdInput(leaf.treeId)
                setCaptureAngle('TOP')
              }}
            >
              <Text style={[styles.demoChipText, selectedLeaf.id === leaf.id && !imageUri && styles.demoChipTextActive]}>
                {lang === 'SIN' ? leaf.nameSin : leaf.nameEng}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ════════════════════════════════════════════════
          SECTION 2 — Result Display (Heatmap + Severity)
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📊 {lang === 'SIN' ? '2. රෝගය සහ බරපතලකම' : '2. Diagnosis & Severity'}
        </Text>

        <View style={styles.resultHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.diseaseTitle}>
              {lang === 'SIN' ? selectedLeaf.diseaseSin : selectedLeaf.diseaseEng}
            </Text>
            <Text style={styles.severityText}>
              {lang === 'SIN' ? selectedLeaf.severityLabelSin : selectedLeaf.severityLabelEng}
            </Text>
          </View>
          <View style={[styles.confidenceBadge, { backgroundColor: activeQuality === 'GOOD' && selectedLeaf.confidence > 70 ? '#1c1917' : '#78716c' }]}>
            <Text style={styles.confidenceText}>
              {activeQuality === 'GOOD' ? `${selectedLeaf.confidence}%` : 'Low'}
            </Text>
            <Text style={styles.confidenceLabel}>AI</Text>
          </View>
        </View>

        {/* Severity Bar */}
        {selectedLeaf.severityPercent > 0 && (
          <>
            <View style={styles.meterTrack}>
              <View
                style={[
                  styles.meterFill,
                  {
                    width: `${activeQuality === 'GOOD' ? selectedLeaf.severityPercent : 8}%`,
                    backgroundColor:
                      selectedLeaf.severityPercent >= 70
                        ? '#e11d48'
                        : selectedLeaf.severityPercent >= 40
                        ? '#f59e0b'
                        : '#10b981',
                  },
                ]}
              />
            </View>
            <View style={styles.severityLabelsRow}>
              <Text style={styles.severityLabelItem}>🟢 {lang === 'SIN' ? 'සුළු' : 'Mild'} &lt;40%</Text>
              <Text style={styles.severityLabelItem}>🟡 {lang === 'SIN' ? 'මධ්‍ය' : 'Mod'} 40–70%</Text>
              <Text style={styles.severityLabelItem}>🔴 {lang === 'SIN' ? 'දරුණු' : 'Severe'} &gt;70%</Text>
            </View>
          </>
        )}

        {/* Location + Block ID */}
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>📍 {lang === 'SIN' ? 'ස්ථාන විස්තර' : 'Location & Block'}</Text>
          <View style={styles.locationRow}>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>{lang === 'SIN' ? 'කොටස' : 'Block'}</Text>
              <Text style={styles.locationValue}>{selectedLeaf.blockId}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>{lang === 'SIN' ? 'ශාකය' : 'Tree ID'}</Text>
              <TextInput
                style={styles.treeIdInput}
                value={treeIdInput}
                onChangeText={setTreeIdInput}
                placeholder="TR-XXXX"
                placeholderTextColor="#a8a29e"
              />
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>GPS</Text>
              <Text style={styles.locationValueSmall}>{selectedLeaf.gpsCoords}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ════════════════════════════════════════════════
          SECTION 3 — Action Decision (4-state)
      ════════════════════════════════════════════════ */}
      <View style={[styles.decisionCard, { backgroundColor: decisionBg(selectedLeaf.decision), borderColor: decisionColor(selectedLeaf.decision) }]}>
        <Text style={styles.decisionIcon}>{decisionIcon(selectedLeaf.decision)}</Text>

        {/* UNSUPPORTED state */}
        {selectedLeaf.decision === 'UNSUPPORTED' && (
          <>
            <Text style={styles.decisionTitle}>
              {lang === 'SIN' ? 'AI හඳුනා නොගනී — විශේෂඥ වෙත' : 'Outside AI Scope — Sending to Expert'}
            </Text>
            <Text style={styles.decisionSub}>
              {lang === 'SIN'
                ? 'රෝගය AI ආදර්ශ ගොනුවට ඇතුළු නොවේ. ශාක ව්‍යාධිවේදී ජ්‍යෙෂ්ඨ නිලධාරී වෙත ස්වයංක්‍රීයව යවයි.'
                : 'This image is outside the model\'s trained classes. Escalating automatically — not because of severity, but because of the model\'s own scope limits.'}
            </Text>
            <View style={[styles.unsupportedInfo, { marginBottom: 10 }]}>
              <Text style={styles.unsupportedInfoText}>
                ℹ️ {lang === 'SIN' ? '"Refer" සහ "Unsupported" ‐ දෙකම වෙනස්ය — Refer = AI දනී, දරුණු ය. Unsupported = AI නොදනී.' : '"Refer" = AI knows the disease, it\'s serious. "Unsupported" = AI doesn\'t know — outside its scope.'}
              </Text>
            </View>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#57534e' }]} onPress={handleReferral}>
              <Text style={styles.actionBtnText}>
                ⚪ {lang === 'SIN' ? 'විශේෂඥ වෙත යවන්න' : 'Send to Expert'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* RETAKE state */}
        {selectedLeaf.decision === 'RETAKE' && (
          <>
            <Text style={styles.decisionTitle}>
              {lang === 'SIN' ? 'ඡායාරූපය නැවත ගන්න' : 'Photo Unclear: Retake Required'}
            </Text>
            <Text style={styles.decisionSub}>
              {lang === 'SIN' ? 'ගුණාත්මක පරීක්ෂාව අසමත් — AI ප්‍රතිඵල විශ්වාසදායක නැත.' : 'Quality gate failed. Retake inside the green guide box.'}
            </Text>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#d97706' }]}
              onPress={() => { setQualityOverride('GOOD'); setImageUri(null) }}
            >
              <Text style={styles.actionBtnText}>
                📷 {lang === 'SIN' ? 'නැවත ඡායාරූපයක් ගන්න' : 'Retake Photo Now'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* MONITOR state */}
        {selectedLeaf.decision === 'MONITOR' && (
          <>
            <Text style={styles.decisionTitle}>
              {lang === 'SIN' ? 'දින 7කින් නැවත පරීක්ෂා කරන්න' : 'Monitor — Check Again in 7 Days'}
            </Text>
            <Text style={styles.decisionSub}>
              {lang === 'SIN' ? 'රෝග මට්ටම සුළු ය. නිතිපතා පරීක්ෂා කරන්න.' : 'Severity is low. Routine field monitoring recommended.'}
            </Text>
            <View style={[styles.actionBtn, { backgroundColor: '#16a34a' }]}>
              <Text style={styles.actionBtnText}>
                🟢 {lang === 'SIN' ? 'ස්කෑන් සුරකින ලදී' : 'Scan Saved — Monitor Schedule Set'}
              </Text>
            </View>
          </>
        )}

        {/* REFER state */}
        {selectedLeaf.decision === 'REFER' && (
          <>
            <Text style={styles.decisionTitle}>
              {lang === 'SIN' ? 'ශාක ව්‍යාධිවේදී වෙත යොමු කරන්න' : 'Refer to Plant Pathologist'}
            </Text>
            <Text style={styles.decisionSub}>
              {lang === 'SIN' ? 'රෝගයේ බරපතලකම ඉහළය — AI විශ්වාසයෙන් හඳුනාගෙන, ව්‍යාධිවේදී ක්‍රියාමාර්ගය අවශ්‍ය.' : 'AI is confident — high severity triggers mandatory expert referral.'}
            </Text>
            {referralSent ? (
              <View style={styles.sentBox}>
                <Text style={styles.sentText}>
                  ✅ {lang === 'SIN' ? 'යොමු කිරීම සාර්ථකයි — නිලධාරී දශකෙට ලැබෙනු ඇත' : 'Referred! Officer will receive this case with GPS + severity.'}
                </Text>
                <Text style={styles.sentSubText}>
                  {isOffline ? '📶 Queued for sync when online' : '🌐 Synced to cloud'}
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e11d48' }]} onPress={handleReferral}>
                <Text style={styles.actionBtnText}>
                  🚨 {lang === 'SIN' ? 'නිලධාරියා වෙත යවන්න' : 'Dispatch to Field Officer'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* ════════════════════════════════════════════════
          SECTION 4 — Scan History
      ════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.historyHeader}>
          <Text style={styles.cardTitle}>
            📜 {lang === 'SIN' ? '3. ස්කෑන් ඉතිහාසය' : '3. Scan History'}
          </Text>
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>📶 {history.filter(h => !h.synced).length} pending</Text>
            </View>
          )}
        </View>

        {history.map((item, idx) => (
          <View key={item.id} style={[styles.historyRow, idx < history.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#f5f5f4' }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.histThumb} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.histTitle}>
                {lang === 'SIN' ? item.diseaseSin : item.diseaseEng}
              </Text>
              <Text style={styles.histSub}>
                {item.blockId} · {item.severityPercent > 0 ? `${item.severityPercent}% · ` : ''}{item.date}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <View style={[styles.histBadge, { backgroundColor: decisionBg(item.decision), borderColor: decisionColor(item.decision), borderWidth: 1 }]}>
                <Text style={[styles.histBadgeText, { color: decisionColor(item.decision) }]}>
                  {decisionIcon(item.decision)} {item.decision}
                </Text>
              </View>
              <Text style={[styles.syncDot, { color: item.synced ? '#16a34a' : '#f59e0b' }]}>
                {item.synced ? '✓ Synced' : '⏳ Pending'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f4' },
  content: { padding: 16, paddingBottom: 48 },

  // Header
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  appBadge: { fontSize: 9, fontWeight: '800', color: colors.primary, letterSpacing: 0.6, textTransform: 'uppercase' },
  heading: { fontSize: 20, fontWeight: '900', color: '#1c1917', marginTop: 2 },
  langContainer: { flexDirection: 'row', backgroundColor: '#e7e5e4', borderRadius: 8, padding: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  langBtnActive: { backgroundColor: colors.primary },
  langBtnText: { fontSize: 12, fontWeight: '700', color: '#78716c' },
  langBtnTextActive: { color: '#ffffff' },

  // Voice banner
  voiceBanner: { backgroundColor: '#064e3b', padding: 10, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voiceText: { color: '#ecfdf5', fontSize: 12, fontWeight: '600', flex: 1 },
  voiceDismiss: { color: '#a7f3d0', fontSize: 14, fontWeight: '800', paddingLeft: 8 },

  // Status row
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8 },
  statusItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#e7e5e4', gap: 6 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#44403c' },
  gpsTag: { flex: 1, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#a7f3d0' },
  gpsText: { fontSize: 10, fontWeight: '700', color: '#065f46' },

  // Card
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e7e5e4', elevation: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 12 },

  // Angle picker
  anglePicker: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  angleLabel: { fontSize: 11, fontWeight: '700', color: '#78716c' },
  angleChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#d6d3d1', backgroundColor: '#fafaf9' },
  angleChipActive: { backgroundColor: '#064e3b', borderColor: '#064e3b' },
  angleChipText: { fontSize: 12, fontWeight: '700', color: '#57534e' },
  angleChipTextActive: { color: '#ffffff' },

  // Guide box
  guideBoxContainer: { height: 220, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: '#0c0a09', marginBottom: 10 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.9 },
  targetFrame: { ...StyleSheet.absoluteFillObject, padding: 14, justifyContent: 'space-between' },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between' },
  corner: { width: 26, height: 26, borderColor: '#4ade80' },
  topLeft: { borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { borderBottomWidth: 4, borderRightWidth: 4 },
  targetLabelBox: { alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  targetLabelText: { color: '#4ade80', fontSize: 11, fontWeight: '900' },
  lesionSpot: { position: 'absolute', width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(239,68,68,0.45)', borderWidth: 2, borderColor: '#dc2626' },
  angleBadgeOverlay: { position: 'absolute', bottom: 8, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  angleBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  // Quality alert
  qualityAlert: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1.5, marginBottom: 10, gap: 8 },
  alertIcon: { fontSize: 18 },
  alertTitle: { fontSize: 13, fontWeight: '800' },
  alertSub: { fontSize: 11, color: '#92400e', marginTop: 2 },

  // Quality sim chips
  qualitySim: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10, flexWrap: 'wrap' },
  qualitySimLabel: { fontSize: 10, fontWeight: '700', color: '#78716c' },
  qualSimChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#d6d3d1', backgroundColor: '#fafaf9' },
  qualSimChipActive: { backgroundColor: '#1c1917', borderColor: '#1c1917' },
  qualSimText: { fontSize: 10, fontWeight: '700', color: '#44403c' },
  qualSimTextActive: { color: '#ffffff' },

  // Camera button
  largeCameraButton: { backgroundColor: colors.primary, height: 58, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2 },
  largeCameraText: { color: '#ffffff', fontSize: 16, fontWeight: '900' },

  // Heatmap toggle
  heatmapToggle: { backgroundColor: '#fafaf9', borderWidth: 1, borderColor: '#e7e5e4', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  heatmapToggleText: { fontSize: 12, fontWeight: '700', color: '#57534e' },

  // Demo chips
  demoBox: { marginBottom: 14 },
  demoTitle: { fontSize: 11, fontWeight: '800', color: '#78716c', marginBottom: 6 },
  demoRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  demoChip: { backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#d6d3d1' },
  demoChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  demoChipText: { fontSize: 11, fontWeight: '700', color: '#44403c' },
  demoChipTextActive: { color: '#ffffff' },

  // Result
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  diseaseTitle: { fontSize: 17, fontWeight: '900', color: '#1c1917' },
  severityText: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 2 },
  confidenceBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: 'center' },
  confidenceText: { color: '#4ade80', fontSize: 15, fontWeight: '900', lineHeight: 18 },
  confidenceLabel: { color: '#a7f3d0', fontSize: 8, fontWeight: '800' },

  // Meter
  meterTrack: { height: 18, backgroundColor: '#e7e5e4', borderRadius: 9, overflow: 'hidden', padding: 2, marginBottom: 6 },
  meterFill: { height: '100%', borderRadius: 7 },
  severityLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  severityLabelItem: { fontSize: 10, fontWeight: '800', color: '#78716c' },

  // Location
  locationCard: { backgroundColor: '#f0fdf4', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#a7f3d0', marginTop: 4 },
  locationTitle: { fontSize: 11, fontWeight: '800', color: '#065f46', marginBottom: 8 },
  locationRow: { flexDirection: 'row', gap: 8 },
  locationItem: { flex: 1 },
  locationLabel: { fontSize: 9, fontWeight: '700', color: '#16a34a', marginBottom: 2 },
  locationValue: { fontSize: 12, fontWeight: '900', color: '#1c1917' },
  locationValueSmall: { fontSize: 9, fontWeight: '700', color: '#1c1917' },
  treeIdInput: { borderWidth: 1, borderColor: '#a7f3d0', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4, fontSize: 12, fontWeight: '800', color: '#1c1917', backgroundColor: '#ffffff' },

  // Decision card
  decisionCard: { borderWidth: 3, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 16 },
  decisionIcon: { fontSize: 34, marginBottom: 6 },
  decisionTitle: { fontSize: 17, fontWeight: '900', color: '#1c1917', textAlign: 'center', marginBottom: 4 },
  decisionSub: { fontSize: 13, color: '#44403c', textAlign: 'center', marginBottom: 12, lineHeight: 18 },
  actionBtn: { width: '100%', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '900' },
  sentBox: { backgroundColor: '#15803d', padding: 12, borderRadius: 10, width: '100%', alignItems: 'center', gap: 4 },
  sentText: { color: '#ffffff', fontWeight: '900', fontSize: 13, textAlign: 'center' },
  sentSubText: { color: '#a7f3d0', fontSize: 11, fontWeight: '700' },
  unsupportedInfo: { backgroundColor: 'rgba(87,83,78,0.08)', borderRadius: 8, padding: 10, width: '100%' },
  unsupportedInfoText: { fontSize: 11, fontWeight: '600', color: '#57534e', lineHeight: 16 },

  // History
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  offlineBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  offlineBadgeText: { fontSize: 10, fontWeight: '800', color: '#92400e' },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  histThumb: { width: 46, height: 46, borderRadius: 8 },
  histTitle: { fontSize: 13, fontWeight: '800', color: '#1c1917' },
  histSub: { fontSize: 11, color: '#78716c', marginTop: 2 },
  histBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  histBadgeText: { fontSize: 10, fontWeight: '800' },
  syncDot: { fontSize: 10, fontWeight: '700' },
})