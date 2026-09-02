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
import { colors } from '../theme/colors'

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
}

type ScanRecord = {
  id: string
  date: string
  diseaseEng: string
  diseaseSin: string
  severityPercent: number
  decision: ActionDecision
  imageUrl: string
}

const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'm-sample-1',
    nameEng: 'Corynespora Spot',
    nameSin: 'කොරිනෙස්පෝරා රෝගය',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    quality: 'GOOD',
    diseaseEng: 'Corynespora Leaf Spot',
    diseaseSin: 'කොරිනෙස්පෝරා පත්‍ර ලප රෝගය',
    severityPercent: 50,
    severityLabelEng: 'Moderate (50% affected)',
    severityLabelSin: 'මධ්‍යස්ථ (50% බලපෑම)',
    confidence: 94,
    decision: 'REFER',
    decisionTextEng: 'Refer to Pathologist',
    decisionTextSin: 'ශාක ව්‍යාධිවේදී වෙත යොමු කරන්න',
  },
  {
    id: 'm-sample-2',
    nameEng: 'Mild Powdery Mildew',
    nameSin: 'ගොමු රෝගය (සුළු)',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    quality: 'GOOD',
    diseaseEng: 'Powdery Mildew (Oidium)',
    diseaseSin: 'ගොමු රෝගය (Oidium)',
    severityPercent: 20,
    severityLabelEng: 'Mild (20% affected)',
    severityLabelSin: 'සුළු (20% බලපෑම)',
    confidence: 89,
    decision: 'MONITOR',
    decisionTextEng: 'Check again in 7 days',
    decisionTextSin: 'දින 7කින් නැවත පරීක්ෂා කරන්න',
  },
  {
    id: 'm-sample-3',
    nameEng: 'Blurry Photo',
    nameSin: 'අපැහැදිලි ඡායාරූපය',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    quality: 'BLUR',
    diseaseEng: 'Low Sharpness Alert',
    diseaseSin: 'ඡායාරූපය බොඳ වී ඇත',
    severityPercent: 0,
    severityLabelEng: 'Quality Check Failed',
    severityLabelSin: 'පරීක්ෂාව අසමත් විය',
    confidence: 42,
    decision: 'RETAKE',
    decisionTextEng: 'Photo unclear. Please retake',
    decisionTextSin: 'ඡායාරූපය අපැහැදිලියි. නැවත ගන්න',
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
  },
  {
    id: 'hist-m2',
    date: 'Yesterday 02:15 PM',
    diseaseEng: 'Powdery Mildew',
    diseaseSin: 'ගොමු රෝගය',
    severityPercent: 20,
    decision: 'MONITOR',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
  },
]

export default function DiseaseDetectionScreen() {
  const [lang, setLang] = useState<Language>('ENG')
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true)
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [selectedLeaf, setSelectedLeaf] = useState<SampleLeaf>(SAMPLE_LEAVES[0])
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [qualityOverride, setQualityOverride] = useState<QualityAlert | null>(null)
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true)
  const [referralSent, setReferralSent] = useState<boolean>(false)
  const [history, setHistory] = useState<ScanRecord[]>(INITIAL_HISTORY)

  const activeQuality = qualityOverride || selectedLeaf.quality
  const activeImage = imageUri || selectedLeaf.imageUrl

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera / Photo access is required to take leaf photos.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
      setReferralSent(false)
      setQualityOverride('GOOD')
    }
  }

  function handleReferral() {
    setReferralSent(true)
    Alert.alert(
      lang === 'SIN' ? 'සාර්ථකව යොමු කරන ලදී' : 'Referral Dispatched',
      lang === 'SIN'
        ? 'පත්‍රයේ රෝගි විස්තර ක්ෂේත්‍ර නිලධාරී වෙත යවන ලදී.'
        : 'Leaf case metadata and severity sent to Field Officer dashboard.'
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header: Language & Voice Controls */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.appBadge}>SLIIT RESEARCH J 26-IT-370</Text>
          <Text style={styles.heading}>
            {lang === 'SIN' ? 'පත්‍ර රෝග හඳුනාගැනීම' : 'Leaf Disease & Severity AI'}
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

      {/* Voice Guidance Banner */}
      {voiceGuidance && (
        <View style={styles.voiceBanner}>
          <Text style={styles.voiceText}>
            🔊 {lang === 'SIN' ? 'ශ්‍රව්‍ය උපදෙස්: පත්‍රය පෙනෙන සේ කොටුව තුළ තබන්න.' : 'Voice Prompt: Place leaf inside guide box.'}
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

      {/* Sample Scenario Picker for Prototype Evaluation */}
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
              }}
            >
              <Text style={[styles.demoChipText, selectedLeaf.id === leaf.id && !imageUri && styles.demoChipTextActive]}>
                {lang === 'SIN' ? leaf.nameSin : leaf.nameEng}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Section 1: Camera Capture & Leaf Guide Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📸 {lang === 'SIN' ? '1. ඡායාරූපය සහ පත්‍ර කොටුව (Guide Box)' : '1. Image Capture & Leaf Guide Box'}
        </Text>

        {/* Leaf Guide Box Target Overlay */}
        <View style={styles.guideBoxContainer}>
          <Image source={{ uri: activeImage }} style={styles.previewImage} />

          {/* Target Corners Overlay */}
          <View style={styles.targetFrame}>
            <View style={styles.targetRow}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
            </View>
            <View style={styles.targetLabelBox}>
              <Text style={styles.targetLabelText}>
                🎯 {lang === 'SIN' ? 'පත්‍රය කොටුව තුළ තබන්න' : 'LEAF GUIDE BOX'}
              </Text>
            </View>
            <View style={styles.targetRow}>
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Lesion Overlay Simulation */}
          {showHeatmap && activeQuality === 'GOOD' && (
            <View style={styles.lesionSpot} />
          )}
        </View>

        {/* Quality Check Alert Bar */}
        {activeQuality === 'BLUR' && (
          <View style={[styles.qualityAlert, { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }]}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>
                {lang === 'SIN' ? 'ඡායාරූපය බොඳ වී ඇත (Blur Alert)' : 'Quality Alert: Photo is Blurry'}
              </Text>
              <Text style={styles.alertSub}>
                {lang === 'SIN' ? 'කැමරාව නොසෙල්වා නැවත ඡායාරූපය ගන්න.' : 'Hold phone steady with both hands.'}
              </Text>
            </View>
          </View>
        )}

        {activeQuality === 'GOOD' && (
          <View style={[styles.qualityAlert, { backgroundColor: '#dcfce7', borderColor: '#22c55e' }]}>
            <Text style={styles.alertIcon}>✅</Text>
            <Text style={[styles.alertTitle, { color: '#14532d' }]}>
              {lang === 'SIN' ? 'ඡායාරූප තත්ත්වය උසස් (Quality Passed)' : 'Quality Check Passed'}
            </Text>
          </View>
        )}

        {/* Big Gloves-Friendly Camera Button */}
        <TouchableOpacity style={styles.largeCameraButton} onPress={pickImage}>
          <Text style={styles.largeCameraText}>
            📷 {lang === 'SIN' ? 'ඡායාරූපයක් ගන්න (Capture)' : 'Tap to Capture Leaf Photo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Result & Severity Meter */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📊 {lang === 'SIN' ? '2. රෝගය සහ බරපතලකම මීටරය' : '2. Diagnosis & Severity Meter'}
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
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {activeQuality === 'GOOD' ? `${selectedLeaf.confidence}% AI` : 'Low'}
            </Text>
          </View>
        </View>

        {/* Severity Progress Bar */}
        <View style={styles.meterTrack}>
          <View
            style={[
              styles.meterFill,
              {
                width: `${activeQuality === 'GOOD' ? selectedLeaf.severityPercent : 10}%`,
                backgroundColor:
                  selectedLeaf.severityPercent >= 80
                    ? '#e11d48'
                    : selectedLeaf.severityPercent >= 50
                    ? '#f59e0b'
                    : '#10b981',
              },
            ]}
          />
        </View>

        <View style={styles.severityLabelsRow}>
          <Text style={styles.severityLabelItem}>🟢 Mild (20%)</Text>
          <Text style={styles.severityLabelItem}>🟡 Mod (50%)</Text>
          <Text style={styles.severityLabelItem}>🔴 Sev (80%)</Text>
        </View>
      </View>

      {/* Section 3: Action Decision (Novelty) */}
      <Text style={styles.sectionHeader}>
        🎯 {lang === 'SIN' ? '3. නියමිත තීරණය (Novelty Action)' : '3. Action Decision (Novelty Logic)'}
      </Text>

      {activeQuality !== 'GOOD' || selectedLeaf.decision === 'RETAKE' ? (
        <View style={[styles.decisionCard, { backgroundColor: '#fffbeb', borderColor: '#f59e0b' }]}>
          <Text style={styles.decisionIcon}>🟡</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? 'ඡායාරූපය අපැහැදිලියි — නැවත ගන්න' : 'Photo Unclear: Please Retake'}
          </Text>
          <Text style={styles.decisionSub}>
            {lang === 'SIN'
              ? 'ඡායාරූපයේ බොඳ බව නිසා නැවත පැහැදිලි ඡායාරූපයක් ලබාගන්න.'
              : 'Quality check gate failed. Retake photo inside green box.'}
          </Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#d97706' }]}
            onPress={() => setQualityOverride('GOOD')}
          >
            <Text style={styles.actionBtnText}>
              📷 {lang === 'SIN' ? 'නැවත ඡායාරූපයක් ගන්න (Retake)' : 'Retake Photo Now'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : selectedLeaf.decision === 'MONITOR' ? (
        <View style={[styles.decisionCard, { backgroundColor: '#f0fdf4', borderColor: '#16a34a' }]}>
          <Text style={styles.decisionIcon}>🟢</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? 'දින 7කට පසු නැවත පරීක්ෂා කරන්න' : 'Check Again After 7 Days'}
          </Text>
          <Text style={styles.decisionSub}>
            {lang === 'SIN'
              ? 'රෝග මට්ටම සුළු ය. දින 7කින් නැවත පරීක්ෂා කරන්න.'
              : 'Routine field monitoring recommended.'}
          </Text>
        </View>
      ) : (
        <View style={[styles.decisionCard, { backgroundColor: '#fff1f2', borderColor: '#e11d48' }]}>
          <Text style={styles.decisionIcon}>🔴</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? 'ක්ෂේත්‍ර නිලධාරී වෙත යොමු කරන්න' : 'Send Case to Field Officer'}
          </Text>
          <Text style={styles.decisionSub}>
            {lang === 'SIN'
              ? 'රෝගයේ බරපතලකම වැඩි බැවින් ව්‍යාධිවේදී උපදෙස් ලබාගන්න.'
              : 'High lesion severity triggers expert referral.'}
          </Text>

          {referralSent ? (
            <View style={styles.sentBox}>
              <Text style={styles.sentText}>
                ✅ {lang === 'SIN' ? 'නිලධාරියා වෙත යවන ලදී' : 'Referred to Field Officer!'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#e11d48' }]}
              onPress={handleReferral}
            >
              <Text style={styles.actionBtnText}>
                🚨 {lang === 'SIN' ? 'නිලධාරියා වෙත යවන්න' : 'Dispatch Case to Officer'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Section 4: History */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📜 {lang === 'SIN' ? '4. පෙර පරීක්ෂණ වාර්තා' : '4. Scan History Log'}
        </Text>
        {history.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <Image source={{ uri: item.imageUrl }} style={styles.histThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.histTitle}>
                {lang === 'SIN' ? item.diseaseSin : item.diseaseEng}
              </Text>
              <Text style={styles.histSub}>Severity: {item.severityPercent}% • {item.date}</Text>
            </View>
            <View style={styles.histBadge}>
              <Text style={styles.histBadgeText}>{item.decision}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f4' },
  content: { padding: 16, paddingBottom: 40 },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appBadge: { fontSize: 10, fontWeight: '800', color: colors.primary, letterSpacing: 0.5 },
  heading: { fontSize: 20, fontWeight: '900', color: '#1c1917', marginTop: 2 },
  langContainer: { flexDirection: 'row', backgroundColor: '#e7e5e4', borderRadius: 8, padding: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  langBtnActive: { backgroundColor: colors.primary },
  langBtnText: { fontSize: 12, fontWeight: '700', color: '#78716c' },
  langBtnTextActive: { color: '#ffffff' },
  voiceBanner: {
    backgroundColor: '#064e3b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  voiceText: { color: '#ecfdf5', fontSize: 12, fontWeight: '600' },
  offlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  offlineText: { fontSize: 13, fontWeight: '700', color: '#44403c' },
  demoBox: { marginBottom: 12 },
  demoTitle: { fontSize: 11, fontWeight: '800', color: '#78716c', marginBottom: 6 },
  demoRow: { flexDirection: 'row', gap: 6 },
  demoChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6d3d1',
  },
  demoChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  demoChipText: { fontSize: 11, fontWeight: '700', color: '#44403c' },
  demoChipTextActive: { color: '#ffffff' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e7e5e4' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 12 },
  guideBoxContainer: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0c0a09',
    marginBottom: 12,
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.9 },
  targetFrame: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between' },
  corner: { width: 24, height: 24, borderColor: '#4ade80' },
  topLeft: { borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { borderBottomWidth: 4, borderRightWidth: 4 },
  targetLabelBox: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  targetLabelText: { color: '#4ade80', fontSize: 11, fontWeight: '800' },
  lesionSpot: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.5)',
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  qualityAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 12,
    gap: 8,
  },
  alertIcon: { fontSize: 18 },
  alertTitle: { fontSize: 13, fontWeight: '800', color: '#78350f' },
  alertSub: { fontSize: 11, color: '#92400e', marginTop: 2 },
  largeCameraButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeCameraText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  diseaseTitle: { fontSize: 17, fontWeight: '900', color: '#1c1917' },
  severityText: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 2 },
  confidenceBadge: { backgroundColor: '#1c1917', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  confidenceText: { color: '#4ade80', fontSize: 13, fontWeight: '900' },
  meterTrack: { height: 16, backgroundColor: '#e7e5e4', borderRadius: 8, overflow: 'hidden', padding: 2, marginBottom: 8 },
  meterFill: { height: '100%', borderRadius: 6 },
  severityLabelsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  severityLabelItem: { fontSize: 11, fontWeight: '800', color: '#78716c' },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 8 },
  decisionCard: {
    borderWidth: 3,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  decisionIcon: { fontSize: 32, marginBottom: 6 },
  decisionTitle: { fontSize: 18, fontWeight: '900', color: '#1c1917', textAlign: 'center', marginBottom: 4 },
  decisionSub: { fontSize: 13, color: '#44403c', textAlign: 'center', marginBottom: 12 },
  actionBtn: { width: '100%', height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  sentBox: { backgroundColor: '#15803d', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center' },
  sentText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4',
    gap: 10,
  },
  histThumb: { width: 44, height: 44, borderRadius: 6 },
  histTitle: { fontSize: 13, fontWeight: '800', color: '#1c1917' },
  histSub: { fontSize: 11, color: '#78716c', marginTop: 2 },
  histBadge: { backgroundColor: '#f5f5f4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  histBadgeText: { fontSize: 10, fontWeight: '800', color: '#44403c' },
})