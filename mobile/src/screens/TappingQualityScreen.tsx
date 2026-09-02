import { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { BarChart } from 'react-native-gifted-charts'
import { colors } from '../theme/colors'

type Language = 'ENG' | 'SIN'
type QualityAlert = 'GOOD' | 'BLUR' | 'TOO_DARK' | 'NO_SCALE_MARKER' | 'CUT_NOT_VISIBLE'
type WorkmanshipGrade = 'ACCEPTABLE' | 'CORRECTION' | 'DAMAGING' | 'RETAKE'

type SampleScenario = {
  id: string
  nameEng: string
  nameSin: string
  treeId: string
  imageUrl: string
  quality: QualityAlert
  cutLengthCm: number
  cutSlopeDeg: number
  barkStripWidthCm: number
  wound: boolean
  confidence: number
  grade: WorkmanshipGrade
}

const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'm-cut-1',
    nameEng: 'Standard Cut',
    nameSin: 'නියමිත කැපීම',
    treeId: 'TR-4082',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    quality: 'GOOD',
    cutLengthCm: 42,
    cutSlopeDeg: 28,
    barkStripWidthCm: 1.4,
    wound: false,
    confidence: 93,
    grade: 'ACCEPTABLE',
  },
  {
    id: 'm-cut-2',
    nameEng: 'Steep Slope (38°)',
    nameSin: 'අධික කෝණය',
    treeId: 'TR-4083',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    quality: 'GOOD',
    cutLengthCm: 46,
    cutSlopeDeg: 38,
    barkStripWidthCm: 2.2,
    wound: false,
    confidence: 89,
    grade: 'CORRECTION',
  },
  {
    id: 'm-cut-3',
    nameEng: 'Wound Detected',
    nameSin: 'හානිකර තට්ටු කිරීම',
    treeId: 'TR-4085',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    quality: 'GOOD',
    cutLengthCm: 39,
    cutSlopeDeg: 27,
    barkStripWidthCm: 2.8,
    wound: true,
    confidence: 95,
    grade: 'DAMAGING',
  },
  {
    id: 'm-cut-4',
    nameEng: 'No Scale Card',
    nameSin: 'කාඩ්පත නැත',
    treeId: 'TR-4089',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    quality: 'NO_SCALE_MARKER',
    cutLengthCm: 0,
    cutSlopeDeg: 0,
    barkStripWidthCm: 0,
    wound: false,
    confidence: 40,
    grade: 'RETAKE',
  },
]

const BARK_HISTORY_CHART = [
  { value: 1.3, label: 'Tap 1' },
  { value: 1.4, label: 'Tap 2' },
  { value: 1.2, label: 'Tap 3' },
  { value: 1.4, label: 'Tap 4' },
  { value: 1.8, label: 'Tap 5' },
  { value: 1.4, label: 'Tap 6' },
]

export default function TappingQualityScreen() {
  const [lang, setLang] = useState<Language>('ENG')
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true)
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [selectedScenario, setSelectedScenario] = useState<SampleScenario>(SAMPLE_SCENARIOS[0])
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [qualityOverride, setQualityOverride] = useState<QualityAlert | null>(null)
  const [referralSent, setReferralSent] = useState<boolean>(false)

  const activeQuality = qualityOverride || selectedScenario.quality
  const activeImage = photoUri || selectedScenario.imageUrl

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required to take post-tapping photos.')
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
        ? 'කැපුමේ හානි විස්තර ක්ෂේත්‍ර නිලධාරී වෙත යවන ලදී.'
        : 'Cambium wound audit sent to Field Officer dashboard.'
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Controls Header */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.appBadge}>SLIIT COMPONENT 4</Text>
          <Text style={styles.heading}>
            {lang === 'SIN' ? 'තට්ටු කිරීමේ තත්ත්වය' : 'Tapping Quality & Bark'}
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

      {/* Voice Prompt Banner */}
      {voiceGuidance && (
        <View style={styles.voiceBanner}>
          <Text style={styles.voiceText}>
            🔊 {lang === 'SIN' ? 'ශ්‍රව්‍ය උපදෙස්: පරිමාන කාඩ්පත අසලින් තබා ඡායාරූපය ගන්න.' : 'Voice Prompt: Place scale marker card on bark panel.'}
          </Text>
        </View>
      )}

      {/* Offline Mode Banner */}
      <View style={styles.offlineRow}>
        <Text style={styles.offlineText}>
          {isOffline ? '📶 Offline: Saved locally' : '🌐 Online: Synced to Cloud'}
        </Text>
        <Switch value={isOffline} onValueChange={setIsOffline} trackColor={{ true: colors.watch }} />
      </View>

      {/* Demo Scenario Picker */}
      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>
          🧪 {lang === 'SIN' ? 'ආදර්ශ තට්ටු කිරීම්:' : 'Select Demo Cut Scenario:'}
        </Text>
        <View style={styles.demoRow}>
          {SAMPLE_SCENARIOS.map((scen) => (
            <TouchableOpacity
              key={scen.id}
              style={[styles.demoChip, selectedScenario.id === scen.id && !photoUri && styles.demoChipActive]}
              onPress={() => {
                setSelectedScenario(scen)
                setPhotoUri(null)
                setQualityOverride(null)
                setReferralSent(false)
              }}
            >
              <Text style={[styles.demoChipText, selectedScenario.id === scen.id && !photoUri && styles.demoChipTextActive]}>
                {lang === 'SIN' ? scen.nameSin : scen.nameEng}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Section 1: Image Capture & Scale Guide Overlay */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📸 {lang === 'SIN' ? '1. ඡායාරූපය සහ පරිමාන කාඩ්පත' : '1. Photo & Scale Marker Guide'}
        </Text>

        <View style={styles.guideContainer}>
          <Image source={{ uri: activeImage }} style={styles.previewImage} />

          {/* Scale Card Outline Target Box */}
          <View style={styles.scaleCardOutline}>
            <Text style={styles.scaleCardText}>🎴 SCALE CARD</Text>
          </View>

          {/* Cut Line Alignment Frame */}
          <View style={styles.cutLineFrame}>
            <Text style={styles.cutLineText}>✂️ CUT ALIGNMENT LINE</Text>
          </View>
        </View>

        {/* Quality Alerts */}
        {activeQuality === 'NO_SCALE_MARKER' && (
          <View style={[styles.qualityAlert, { backgroundColor: '#ffe4e6', borderColor: '#e11d48' }]}>
            <Text style={styles.alertIcon}>📏</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>
                {lang === 'SIN' ? 'පරිමාන කාඩ්පත නැත' : 'Scale Marker Card Missing'}
              </Text>
              <Text style={styles.alertSub}>
                {lang === 'SIN' ? 'කාඩ්පත කැපුම අසලින් තබා නැවත ගන්න.' : 'Place reference card next to cut line.'}
              </Text>
            </View>
          </View>
        )}

        {activeQuality === 'GOOD' && (
          <View style={[styles.qualityAlert, { backgroundColor: '#dcfce7', borderColor: '#22c55e' }]}>
            <Text style={styles.alertIcon}>✅</Text>
            <Text style={[styles.alertTitle, { color: '#14532d' }]}>
              {lang === 'SIN' ? 'ඡායාරූප පරීක්ෂාව සාර්ථකයි' : 'Quality Gate Passed'}
            </Text>
          </View>
        )}

        {/* Glove-Friendly Large Camera Button */}
        <TouchableOpacity style={styles.largeCameraButton} onPress={pickPhoto}>
          <Text style={styles.largeCameraText}>
            📷 {lang === 'SIN' ? 'කැපූ පසුව ඡායාරූපය ගන්න' : 'Capture Tapping Cut Photo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Result Display & Measured Values */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📊 {lang === 'SIN' ? '2. කැපුම් මිනුම් සහ තත්ත්වය' : '2. Cut Measurements & Audit'}
        </Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{lang === 'SIN' ? 'දිග' : 'Length'}</Text>
            <Text style={styles.metricValue}>
              {activeQuality === 'GOOD' ? `${selectedScenario.cutLengthCm}cm` : '—'}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{lang === 'SIN' ? 'කෝණය' : 'Slope'}</Text>
            <Text style={styles.metricValue}>
              {activeQuality === 'GOOD' ? `${selectedScenario.cutSlopeDeg}°` : '—'}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{lang === 'SIN' ? 'පොතු' : 'Bark'}</Text>
            <Text style={styles.metricValue}>
              {activeQuality === 'GOOD' ? `${selectedScenario.barkStripWidthCm}cm` : '—'}
            </Text>
          </View>
        </View>

        {/* Wound Flag Badge */}
        {selectedScenario.wound && activeQuality === 'GOOD' && (
          <View style={styles.woundBadge}>
            <Text style={styles.woundText}>
              🚨 {lang === 'SIN' ? 'ශාකයට හානි සිදු වී ඇත (Wound Flag)' : 'Visible Cambium Wound Detected'}
            </Text>
          </View>
        )}
      </View>

      {/* Section 3: Action Decision (Novelty) */}
      <Text style={styles.sectionHeader}>
        🎯 {lang === 'SIN' ? '3. නියමිත තීරණය (Component 4 Novelty)' : '3. Action Decision (Novelty Logic)'}
      </Text>

      {activeQuality !== 'GOOD' || selectedScenario.grade === 'RETAKE' ? (
        <View style={[styles.decisionCard, { backgroundColor: '#f5f5f4', borderColor: '#78716c' }]}>
          <Text style={styles.decisionIcon}>⚪</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? 'පරිමාන කාඩ්පත පැහැදිලි නැත — නැවත ගන්න' : 'Scale Marker Missing: Retake'}
          </Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#44403c' }]}
            onPress={() => setQualityOverride('GOOD')}
          >
            <Text style={styles.actionBtnText}>
              📷 {lang === 'SIN' ? 'නැවත ඡායාරූපයක් ගන්න' : 'Retake Tapping Photo'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : selectedScenario.grade === 'ACCEPTABLE' ? (
        <View style={[styles.decisionCard, { backgroundColor: '#f0fdf4', borderColor: '#16a34a' }]}>
          <Text style={styles.decisionIcon}>🟢</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? 'විශිෂ්ට කැපීමක් — ඉදිරියට යන්න' : 'Good Workmanship: Continue'}
          </Text>
        </View>
      ) : selectedScenario.grade === 'CORRECTION' ? (
        <View style={[styles.decisionCard, { backgroundColor: '#fffbeb', borderColor: '#f59e0b' }]}>
          <Text style={styles.decisionIcon}>🟡</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? 'ඊළඟ කැපුමේදී කෝණය සකසන්න' : 'Adjust Slope Angle Next Time'}
          </Text>
        </View>
      ) : (
        <View style={[styles.decisionCard, { backgroundColor: '#fff1f2', borderColor: '#e11d48' }]}>
          <Text style={styles.decisionIcon}>🔴</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? 'ක්ෂේත්‍ර නිලධාරී වෙත යොමු කරන්න' : 'Send Case to Field Officer'}
          </Text>
          {referralSent ? (
            <View style={styles.sentBox}>
              <Text style={styles.sentText}>✅ Referred to Field Officer!</Text>
            </View>
          ) : (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e11d48' }]} onPress={handleReferral}>
              <Text style={styles.actionBtnText}>🚨 Dispatch Case to Officer</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Section 4: Bark Consumption Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📈 {lang === 'SIN' ? 'පොතු පරිභෝජනය (Bark Consumption Graph)' : 'Longitudinal Bark Consumption (mm)'}
        </Text>
        <BarChart
          data={BARK_HISTORY_CHART}
          height={160}
          frontColor={colors.primary}
          yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 10 }}
          noOfSections={4}
          rulesColor={colors.border}
          yAxisColor={colors.border}
          xAxisColor={colors.border}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f4' },
  content: { padding: 16, paddingBottom: 40 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  appBadge: { fontSize: 10, fontWeight: '800', color: colors.primary, letterSpacing: 0.5 },
  heading: { fontSize: 20, fontWeight: '900', color: '#1c1917', marginTop: 2 },
  langContainer: { flexDirection: 'row', backgroundColor: '#e7e5e4', borderRadius: 8, padding: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  langBtnActive: { backgroundColor: colors.primary },
  langBtnText: { fontSize: 12, fontWeight: '700', color: '#78716c' },
  langBtnTextActive: { color: '#ffffff' },
  voiceBanner: { backgroundColor: '#064e3b', padding: 10, borderRadius: 8, marginBottom: 12 },
  voiceText: { color: '#ecfdf5', fontSize: 12, fontWeight: '600' },
  offlineRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#ffffff', padding: 10, borderRadius: 10, marginBottom: 12,
    borderWidth: 1, borderColor: '#e7e5e4',
  },
  offlineText: { fontSize: 13, fontWeight: '700', color: '#44403c' },
  demoBox: { marginBottom: 12 },
  demoTitle: { fontSize: 11, fontWeight: '800', color: '#78716c', marginBottom: 6 },
  demoRow: { flexDirection: 'row', gap: 6 },
  demoChip: { backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#d6d3d1' },
  demoChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  demoChipText: { fontSize: 11, fontWeight: '700', color: '#44403c' },
  demoChipTextActive: { color: '#ffffff' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e7e5e4' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 12 },
  guideContainer: { height: 200, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: '#0c0a09', marginBottom: 12 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.9 },
  scaleCardOutline: {
    position: 'absolute', top: 12, left: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  scaleCardText: { color: '#fef08a', fontSize: 9, fontWeight: '900' },
  cutLineFrame: {
    position: 'absolute', bottom: 12, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
  },
  cutLineText: { color: '#38bdf8', fontSize: 10, fontWeight: '800' },
  qualityAlert: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1.5, marginBottom: 12, gap: 8 },
  alertIcon: { fontSize: 18 },
  alertTitle: { fontSize: 13, fontWeight: '800', color: '#881337' },
  alertSub: { fontSize: 11, color: '#9f1239', marginTop: 2 },
  largeCameraButton: { backgroundColor: colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  largeCameraText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  metricCard: { flex: 1, backgroundColor: '#f5f5f4', padding: 10, borderRadius: 8, alignItems: 'center' },
  metricLabel: { fontSize: 11, fontWeight: '700', color: '#78716c' },
  metricValue: { fontSize: 16, fontWeight: '900', color: '#1c1917', marginTop: 2 },
  woundBadge: { backgroundColor: '#e11d48', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  woundText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 8 },
  decisionCard: { borderWidth: 3, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 16 },
  decisionIcon: { fontSize: 32, marginBottom: 6 },
  decisionTitle: { fontSize: 16, fontWeight: '900', color: '#1c1917', textAlign: 'center', marginBottom: 8 },
  actionBtn: { width: '100%', height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  sentBox: { backgroundColor: '#15803d', padding: 10, borderRadius: 8, width: '100%', alignItems: 'center' },
  sentText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
})