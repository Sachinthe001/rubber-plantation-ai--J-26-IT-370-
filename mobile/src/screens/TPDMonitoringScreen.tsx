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
import { LineChart } from 'react-native-gifted-charts'
import { colors } from '../theme/colors'

type Language = 'ENG' | 'SIN'
type TPDStatus = 'NORMAL' | 'MONITOR' | 'HIGH_RISK' | 'UNABLE'
type QualityAlert = 'GOOD' | 'BLURRY' | 'TOO_DARK' | 'NOT_VISIBLE'
type LatexFlow = 'NORMAL' | 'REDUCED' | 'DRY'

type TreeScenario = {
  id: string
  treeCode: string
  block: string
  tpdRiskPercent: number
  dryCutPercent: number
  status: TPDStatus
  confidence: number
  latexFlow: LatexFlow
  flowDuration: string
  frequency: string
  stimulated: boolean
  restGiven: boolean
  imageUrl: string
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
    dryCutPercent: 78,
    status: 'HIGH_RISK',
    confidence: 96,
    latexFlow: 'DRY',
    flowDuration: '<10 Min',
    frequency: 'd2',
    stimulated: true,
    restGiven: false,
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    actionEng: 'STOP TAPPING IMMEDIATELY! Refer to Field Officer.',
    actionSin: 'තට්ටු කිරීම වහාම නවත්වන්න! ක්ෂේත්‍ර නිලධාරී වෙත යොමු කරන්න.',
    history: [
      { value: 22, label: 'Wk 1' },
      { value: 35, label: 'Wk 2' },
      { value: 48, label: 'Wk 3' },
      { value: 55, label: 'Wk 4' },
      { value: 78, label: 'Wk 5' },
    ],
  },
  {
    id: 'm-tpd-2',
    treeCode: 'TR-4083',
    block: 'Block 4',
    tpdRiskPercent: 48,
    dryCutPercent: 44,
    status: 'MONITOR',
    confidence: 88,
    latexFlow: 'REDUCED',
    flowDuration: '10-30 Min',
    frequency: 'd3',
    stimulated: false,
    restGiven: true,
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    actionEng: 'Monitor closely. Increase rest period to d4.',
    actionSin: 'නිරීක්ෂණය කරන්න. තට්ටු කිරීමේ කාලය d4 දක්වා වැඩි කරන්න.',
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
    dryCutPercent: 18,
    status: 'NORMAL',
    confidence: 94,
    latexFlow: 'NORMAL',
    flowDuration: '>30 Min',
    frequency: 'd3',
    stimulated: false,
    restGiven: true,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    actionEng: 'Continue normal tapping schedule (d3).',
    actionSin: 'සාමාන්‍ය පරිදි තට්ටු කිරීම සිදු කරන්න.',
    history: [
      { value: 15, label: 'Wk 1' },
      { value: 16, label: 'Wk 2' },
      { value: 18, label: 'Wk 3' },
    ],
  },
]

export default function TPDMonitoringScreen() {
  const [lang, setLang] = useState<Language>('ENG')
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [selectedTree, setSelectedTree] = useState<TreeScenario>(TREE_SCENARIOS[0])
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [qualityOverride, setQualityOverride] = useState<QualityAlert | null>(null)
  const [referralSent, setReferralSent] = useState<boolean>(false)

  // Interactive Flow Chip States
  const [latexFlowInput, setLatexFlowInput] = useState<LatexFlow>(selectedTree.latexFlow)

  const activeQuality = qualityOverride || (selectedTree.status === 'UNABLE' ? 'BLURRY' : 'GOOD')
  const activeImage = photoUri || selectedTree.imageUrl

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required to take panel photos.')
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.appBadge}>SLIIT COMPONENT 3</Text>
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

      {/* Offline Mode Switch */}
      <View style={styles.offlineRow}>
        <Text style={styles.offlineText}>
          {isOffline ? '📶 Offline: Saved to phone storage' : '🌐 Online: Synced to Cloud'}
        </Text>
        <Switch value={isOffline} onValueChange={setIsOffline} trackColor={{ true: colors.watch }} />
      </View>

      {/* Quick Access Tree Chips */}
      <View style={styles.treeRow}>
        {TREE_SCENARIOS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.treeChip, selectedTree.id === t.id && !photoUri && styles.treeChipActive]}
            onPress={() => {
              setSelectedTree(t)
              setLatexFlowInput(t.latexFlow)
              setPhotoUri(null)
              setQualityOverride(null)
              setReferralSent(false)
            }}
          >
            <Text style={[styles.treeChipText, selectedTree.id === t.id && !photoUri && styles.treeChipTextActive]}>
              {t.treeCode} ({t.status === 'HIGH_RISK' ? '🔴' : t.status === 'MONITOR' ? '🟡' : '🟢'})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section 1: Capture Screen & Quality Gate Overlay */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📸 {lang === 'SIN' ? '1. පැනල ඡායාරූපය සහ පරීක්ෂාව' : '1. Panel Photo & Quality Gate'}
        </Text>

        <View style={styles.guideContainer}>
          <Image source={{ uri: activeImage }} style={styles.previewImage} />

          {/* Panel Outline Target Box */}
          <View style={styles.targetFrame}>
            <Text style={styles.targetText}>🎴 ALIGN SPIGOT &amp; CUT LINE</Text>
          </View>
        </View>

        {activeQuality === 'GOOD' ? (
          <View style={[styles.qualityAlert, { backgroundColor: '#dcfce7', borderColor: '#22c55e' }]}>
            <Text style={styles.alertIcon}>✅</Text>
            <Text style={[styles.alertTitle, { color: '#14532d' }]}>
              {lang === 'SIN' ? 'ඡායාරූප පරීක්ෂාව සාර්ථකයි' : 'Quality Gate Passed'}
            </Text>
          </View>
        ) : (
          <View style={[styles.qualityAlert, { backgroundColor: '#ffe4e6', borderColor: '#e11d48' }]}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertTitle}>
              {lang === 'SIN' ? 'ඡායාරූපය පැහැදිලි නැත' : 'Photo Quality Warning'}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.largeCameraButton} onPress={pickPhoto}>
          <Text style={styles.largeCameraText}>
            📷 {lang === 'SIN' ? 'පැනලයේ ඡායාරූපයක් ගන්න' : 'Capture Tapping Panel Photo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Quick Data Entry Chips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          ⚡ {lang === 'SIN' ? '2. කිරි ගැලීමේ මට්ටම (Latex Flow)' : '2. Latex Flow Observation'}
        </Text>

        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.flowChip, latexFlowInput === 'NORMAL' && { backgroundColor: '#16a34a' }]}
            onPress={() => setLatexFlowInput('NORMAL')}
          >
            <Text style={[styles.flowChipText, latexFlowInput === 'NORMAL' && { color: '#ffffff' }]}>🟢 Normal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flowChip, latexFlowInput === 'REDUCED' && { backgroundColor: '#f59e0b' }]}
            onPress={() => setLatexFlowInput('REDUCED')}
          >
            <Text style={[styles.flowChipText, latexFlowInput === 'REDUCED' && { color: '#ffffff' }]}>🟡 Reduced</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flowChip, latexFlowInput === 'DRY' && { backgroundColor: '#e11d48' }]}
            onPress={() => setLatexFlowInput('DRY')}
          >
            <Text style={[styles.flowChipText, latexFlowInput === 'DRY' && { color: '#ffffff' }]}>🔴 Dry</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 3: 1-Action Decision Screen (Novelty) */}
      <Text style={styles.sectionHeader}>
        🎯 {lang === 'SIN' ? '3. නියමිත පියවර (1-Action Decision)' : '3. Immediate Action Decision'}
      </Text>

      {selectedTree.status === 'HIGH_RISK' ? (
        <View style={[styles.decisionCard, { backgroundColor: '#fff1f2', borderColor: '#e11d48' }]}>
          <Text style={styles.decisionIcon}>🔴</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}
          </Text>
          <Text style={styles.riskPercentText}>TPD Risk: {selectedTree.tpdRiskPercent}% | Dry Cut: {selectedTree.dryCutPercent}%</Text>

          {referralSent ? (
            <View style={styles.sentBox}>
              <Text style={styles.sentText}>✅ Referred to Field Officer!</Text>
            </View>
          ) : (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e11d48' }]} onPress={handleReferral}>
              <Text style={styles.actionBtnText}>🚨 Dispatch Case to Field Officer</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : selectedTree.status === 'MONITOR' ? (
        <View style={[styles.decisionCard, { backgroundColor: '#fffbeb', borderColor: '#f59e0b' }]}>
          <Text style={styles.decisionIcon}>🟡</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}
          </Text>
          <Text style={styles.riskPercentText}>TPD Risk: {selectedTree.tpdRiskPercent}% | Dry Cut: {selectedTree.dryCutPercent}%</Text>
        </View>
      ) : (
        <View style={[styles.decisionCard, { backgroundColor: '#f0fdf4', borderColor: '#16a34a' }]}>
          <Text style={styles.decisionIcon}>🟢</Text>
          <Text style={styles.decisionTitle}>
            {lang === 'SIN' ? selectedTree.actionSin : selectedTree.actionEng}
          </Text>
        </View>
      )}

      {/* Section 4: Dry-Cut Trend Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📈 {lang === 'SIN' ? 'වියලි කැපුම් ප්‍රගතිය (%)' : `Dry-Cut % Progression (${selectedTree.treeCode})`}
        </Text>
        <LineChart
          data={selectedTree.history}
          height={160}
          color={colors.primary}
          thickness={3}
          dataPointsColor={colors.primary}
          yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 10 }}
          maxValue={100}
          noOfSections={4}
          rulesColor={colors.border}
          yAxisColor={colors.border}
          xAxisColor={colors.border}
        />
        <View style={styles.thresholdRow}>
          <View style={styles.thresholdDot} />
          <Text style={styles.thresholdText}>70% High TPD Risk Threshold Line</Text>
        </View>
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
  offlineRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#ffffff', padding: 10, borderRadius: 10, marginBottom: 12,
    borderWidth: 1, borderColor: '#e7e5e4',
  },
  offlineText: { fontSize: 13, fontWeight: '700', color: '#44403c' },
  treeRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  treeChip: { backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#d6d3d1' },
  treeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  treeChipText: { fontSize: 12, fontWeight: '800', color: '#44403c' },
  treeChipTextActive: { color: '#ffffff' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e7e5e4' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 12 },
  guideContainer: { height: 190, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: '#0c0a09', marginBottom: 12 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.9 },
  targetFrame: {
    position: 'absolute', inset: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: '#38bdf8',
    justifyContent: 'center', alignItems: 'center', borderRadius: 8,
  },
  targetText: { color: '#38bdf8', fontSize: 10, fontWeight: '900', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  qualityAlert: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1.5, marginBottom: 12, gap: 8 },
  alertIcon: { fontSize: 16 },
  alertTitle: { fontSize: 13, fontWeight: '800', color: '#881337' },
  largeCameraButton: { backgroundColor: colors.primary, height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  largeCameraText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  chipRow: { flexDirection: 'row', gap: 6 },
  flowChip: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f5f5f4', borderWidth: 1, borderColor: '#d6d3d1', alignItems: 'center' },
  flowChipText: { fontSize: 12, fontWeight: '800', color: '#44403c' },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 8 },
  decisionCard: { borderWidth: 3, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 16 },
  decisionIcon: { fontSize: 32, marginBottom: 6 },
  decisionTitle: { fontSize: 15, fontWeight: '900', color: '#1c1917', textAlign: 'center', marginBottom: 4 },
  riskPercentText: { fontSize: 12, fontWeight: '700', color: '#e11d48', marginBottom: 10 },
  actionBtn: { width: '100%', height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  sentBox: { backgroundColor: '#15803d', padding: 10, borderRadius: 8, width: '100%', alignItems: 'center' },
  sentText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 },
  thresholdDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e11d48' },
  thresholdText: { fontSize: 11, color: '#78716c', fontWeight: '600' },
})