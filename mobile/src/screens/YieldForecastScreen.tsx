import { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native'
import { colors } from '../theme/colors'

type Language = 'ENG' | 'SIN'
type TappingStatus = 'TAP' | 'CHECK' | 'DO_NOT_TAP' | 'UNABLE'

type BlockForecast = {
  id: string
  blockCode: string
  status: TappingStatus
  expectedYieldKg: number
  normalYieldKg: number
  diffPercent: number
  category: 'High' | 'Normal' | 'Low' | 'Very Low'
  confidence: number
  rainProb: number
  suitableWindow: string
  weatherSummary: string
  weatherWarning?: string
  reasons: { type: 'positive' | 'negative'; textEng: string; textSin: string }[]
  uncertaintyRange?: string
  treesCount: number
  clone: string
}

const BLOCK_FORECASTS: BlockForecast[] = [
  {
    id: 'block-a12',
    blockCode: 'Block A12',
    status: 'TAP',
    expectedYieldKg: 1.25,
    normalYieldKg: 1.11,
    diffPercent: 12,
    category: 'High',
    confidence: 94,
    rainProb: 20,
    suitableWindow: '5:30 AM – 8:00 AM',
    weatherSummary: '🌦️ Morning forecast: Low rain probability',
    reasons: [
      { type: 'positive', textEng: 'Low rain expected during tapping window', textSin: 'තට්ටු කිරීමේ කාලය තුළ අඩු වර්ෂාපතනයක් අපේක්ෂා කෙරේ' },
      { type: 'positive', textEng: 'Suitable 3-day tapping interval (d3)', textSin: 'සුදුසු දින 3ක තට්ටු කිරීමේ පරතරය' },
      { type: 'positive', textEng: 'Recent yield history has been consistently strong', textSin: 'මෑත කාලීන කිරි අස්වැන්න ඉහළ මට්ටමක පවතී' },
    ],
    treesCount: 140,
    clone: 'RRM 600',
  },
  {
    id: 'block-b04',
    blockCode: 'Block B04',
    status: 'CHECK',
    expectedYieldKg: 0.95,
    normalYieldKg: 1.1,
    diffPercent: -13,
    category: 'Normal',
    confidence: 62,
    rainProb: 45,
    suitableWindow: '6:00 AM – 7:30 AM',
    weatherSummary: '☁️ Cloud cover & rain risk near 7:30 AM',
    weatherWarning: '🌧️ Tapping Caution: Rain expected around 7:30 AM. Check field before cut.',
    uncertaintyRange: '0.80 – 1.15 kg/tree',
    reasons: [
      { type: 'negative', textEng: 'Rainfall forecast is uncertain near 7:30 AM', textSin: 'පෙරවරු 7:30ට වර්ෂාපතනය අවිනිශ්චිතය' },
      { type: 'positive', textEng: 'Bark consumption and tree health are normal', textSin: 'පොත්ත පරිභෝජනය සාමාන්‍ය මට්ටමක පවතී' },
    ],
    treesCount: 120,
    clone: 'PB 260',
  },
  {
    id: 'block-c02',
    blockCode: 'Block C02',
    status: 'DO_NOT_TAP',
    expectedYieldKg: 0.45,
    normalYieldKg: 1.05,
    diffPercent: -57,
    category: 'Very Low',
    confidence: 91,
    rainProb: 85,
    suitableWindow: 'Not Suitable',
    weatherSummary: '🌧️ Heavy morning rain expected',
    weatherWarning: '🚨 Heavy Rain Warning: Rain likelihood 85%. Latex runoff will occur.',
    reasons: [
      { type: 'negative', textEng: 'Heavy rain expected during morning tapping hours', textSin: 'උදෑසන අධික වර්ෂාවක් අපේක්ෂා කෙරේ' },
      { type: 'negative', textEng: 'Expected yield is very low (<0.50 kg)', textSin: 'අපේක්ෂිත අස්වැන්න ඉතා අඩුය' },
    ],
    treesCount: 150,
    clone: 'RRIC 100',
  },
]

export default function YieldForecastScreen() {
  const [lang, setLang] = useState<Language>('ENG')
  const [isOffline, setIsOffline] = useState<boolean>(false)
  const [selectedBlock, setSelectedBlock] = useState<BlockForecast>(BLOCK_FORECASTS[0])
  const [checkDone, setCheckDone] = useState<boolean>(false)
  const [actualYieldInput, setActualYieldInput] = useState<string>('1.18')
  const [recordSaved, setRecordSaved] = useState<boolean>(false)

  function handleRecordSubmit() {
    setRecordSaved(true)
    Alert.alert(
      lang === 'SIN' ? 'සාර්ථකව සුරකින ලදී' : 'Yield Saved',
      lang === 'SIN'
        ? `සැබෑ අස්වැන්න ${actualYieldInput} kg/tree සාර්ථකව සටහන් විය.`
        : `Actual yield ${actualYieldInput} kg/tree saved to phone storage.`
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.appBadge}>SLIIT COMPONENT 1</Text>
          <Text style={styles.heading}>
            {lang === 'SIN' ? 'අද තට්ටු කිරීමේ තීරණය' : "Today's Tapping Decision"}
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

      {/* Section 1: Summary Status Matrix Bar */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📊 {lang === 'SIN' ? 'අද දින සැලැස්ම (Kegalle Block 4)' : "Today's Tapping Matrix"}
        </Text>
        <View style={styles.matrixRow}>
          <View style={[styles.matrixBadge, { backgroundColor: '#dcfce7', borderColor: '#22c55e' }]}>
            <Text style={[styles.matrixText, { color: '#15803d' }]}>🟢 Tap: 8</Text>
          </View>
          <View style={[styles.matrixBadge, { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }]}>
            <Text style={[styles.matrixText, { color: '#b45309' }]}>🟡 Check: 3</Text>
          </View>
          <View style={[styles.matrixBadge, { backgroundColor: '#ffe4e6', borderColor: '#e11d48' }]}>
            <Text style={[styles.matrixText, { color: '#be123c' }]}>🔴 Avoid: 2</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startBtnText}>
            🚀 {lang === 'SIN' ? 'අද තට්ටු කිරීම ආරම්භ කරන්න' : "START TODAY'S TAPPING"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Block Selector Chips */}
      <View style={styles.chipRow}>
        {BLOCK_FORECASTS.map((b) => (
          <TouchableOpacity
            key={b.id}
            style={[styles.blockChip, selectedBlock.id === b.id && styles.blockChipActive]}
            onPress={() => {
              setSelectedBlock(b)
              setCheckDone(false)
            }}
          >
            <Text style={[styles.blockChipText, selectedBlock.id === b.id && styles.blockChipTextActive]}>
              {b.blockCode} ({b.status === 'TAP' ? '🟢' : b.status === 'CHECK' ? '🟡' : '🔴'})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section 2: Recommendation Card */}
      <View
        style={[
          styles.card,
          styles.decisionBorder,
          selectedBlock.status === 'TAP'
            ? { borderColor: '#22c55e', backgroundColor: '#f0fdf4' }
            : selectedBlock.status === 'CHECK'
            ? { borderColor: '#f59e0b', backgroundColor: '#fffbeb' }
            : { borderColor: '#e11d48', backgroundColor: '#fff1f2' },
        ]}
      >
        <Text style={styles.blockHeader}>
          {selectedBlock.blockCode} · {selectedBlock.clone} ({selectedBlock.treesCount} Trees)
        </Text>
        <Text style={styles.decisionTitle}>
          {selectedBlock.status === 'TAP' && (lang === 'SIN' ? '🟢 අද තට්ටු කරන්න' : '🟢 RECOMMENDED TO TAP TODAY')}
          {selectedBlock.status === 'CHECK' && (lang === 'SIN' ? '🟡 පරීක්ෂා කර තට්ටු කරන්න' : '🟡 CHECK BEFORE TAPPING')}
          {selectedBlock.status === 'DO_NOT_TAP' && (lang === 'SIN' ? '🔴 තට්ටු නොකරන්න' : '🔴 DO NOT TAP TODAY')}
        </Text>

        {selectedBlock.weatherWarning && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>{selectedBlock.weatherWarning}</Text>
          </View>
        )}

        {/* Expected Yield Display */}
        <View style={styles.yieldBox}>
          <View>
            <Text style={styles.yieldLabel}>Expected Latex Yield Today</Text>
            <Text style={styles.yieldVal}>{selectedBlock.expectedYieldKg} kg / tree</Text>
            <Text style={styles.yieldDiff}>
              {selectedBlock.diffPercent > 0 ? `+${selectedBlock.diffPercent}%` : `${selectedBlock.diffPercent}%`} vs normal
            </Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{selectedBlock.category} Yield</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.tapNowBtn}>
          <Text style={styles.tapNowBtnText}>{lang === 'SIN' ? 'දැන් තට්ටු කරන්න' : 'TAP NOW'}</Text>
        </TouchableOpacity>
      </View>

      {/* Section 8: Check First Workflow */}
      {selectedBlock.status === 'CHECK' && (
        <View style={styles.checkCard}>
          <Text style={styles.checkTitle}>
            🟡 {lang === 'SIN' ? 'තට්ටු කිරීමට පෙර පරීක්ෂා කරන්න' : 'Uncertain: Check Field First'}
          </Text>
          <Text style={styles.checkSub}>Expected Range: {selectedBlock.uncertaintyRange}</Text>

          {!checkDone ? (
            <TouchableOpacity style={styles.checkBtn} onPress={() => setCheckDone(true)}>
              <Text style={styles.checkBtnText}>✅ FIELD CHECK COMPLETED</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.doneBox}>
              <Text style={styles.doneText}>✅ Field Check Logged - Ready to Tap</Text>
            </View>
          )}
        </View>
      )}

      {/* Section 7: Explain Why */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          💡 {selectedBlock.status === 'DO_NOT_TAP' ? 'Why Should You NOT Tap?' : 'Why Is This Recommended?'}
        </Text>
        {selectedBlock.reasons.map((r, idx) => (
          <View
            key={idx}
            style={[
              styles.reasonRow,
              r.type === 'positive' ? { backgroundColor: '#f0fdf4' } : { backgroundColor: '#fff1f2' },
            ]}
          >
            <Text style={styles.reasonIcon}>{r.type === 'positive' ? '✓' : '⚠️'}</Text>
            <Text style={styles.reasonText}>{lang === 'SIN' ? r.textSin : r.textEng}</Text>
          </View>
        ))}
      </View>

      {/* Section 9: Record Actual Result */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📝 {lang === 'SIN' ? 'සැබෑ කිරි අස්වැන්න සටහන් කරන්න' : 'Record Actual Yield'}
        </Text>
        <Text style={styles.label}>Actual Latex Collected (kg/tree):</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          value={actualYieldInput}
          onChangeText={setActualYieldInput}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleRecordSubmit}>
          <Text style={styles.submitBtnText}>💾 SUBMIT RESULT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f4' },
  content: { padding: 16, paddingBottom: 40 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  appBadge: { fontSize: 10, fontWeight: '800', color: colors.primary, letterSpacing: 0.5 },
  heading: { fontSize: 18, fontWeight: '900', color: '#1c1917', marginTop: 2 },
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
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e7e5e4' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1c1917', marginBottom: 12 },
  matrixRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  matrixBadge: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  matrixText: { fontSize: 11, fontWeight: '800' },
  startBtn: { backgroundColor: colors.primary, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  startBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
  chipRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  blockChip: { backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#d6d3d1' },
  blockChipActive: { backgroundColor: '#1c1917', borderColor: '#1c1917' },
  blockChipText: { fontSize: 12, fontWeight: '800', color: '#44403c' },
  blockChipTextActive: { color: '#ffffff' },
  decisionBorder: { borderWidth: 3 },
  blockHeader: { fontSize: 11, fontWeight: '800', color: '#78716c', textTransform: 'uppercase' },
  decisionTitle: { fontSize: 18, fontWeight: '900', color: '#1c1917', marginTop: 4, marginBottom: 10 },
  warningBox: { backgroundColor: '#f59e0b', padding: 10, borderRadius: 8, marginBottom: 10 },
  warningText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  yieldBox: { backgroundColor: '#ffffff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e7e5e4', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  yieldLabel: { fontSize: 10, fontWeight: '700', color: '#78716c' },
  yieldVal: { fontSize: 22, fontWeight: '900', color: '#1c1917', marginTop: 2 },
  yieldDiff: { fontSize: 11, fontWeight: '800', color: '#15803d', marginTop: 2 },
  categoryBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  categoryText: { fontSize: 10, fontWeight: '900', color: '#15803d' },
  tapNowBtn: { backgroundColor: colors.primary, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  tapNowBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 14 },
  checkCard: { backgroundColor: '#fef3c7', padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#f59e0b', marginBottom: 16 },
  checkTitle: { fontSize: 14, fontWeight: '900', color: '#78350f' },
  checkSub: { fontSize: 12, color: '#92400e', marginTop: 2, marginBottom: 10 },
  checkBtn: { backgroundColor: '#d97706', height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  checkBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
  doneBox: { backgroundColor: '#15803d', padding: 10, borderRadius: 8, alignItems: 'center' },
  doneText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8, marginBottom: 6 },
  reasonIcon: { fontSize: 14 },
  reasonText: { fontSize: 12, fontWeight: '700', color: '#1c1917', flex: 1 },
  label: { fontSize: 12, fontWeight: '700', color: '#44403c', marginBottom: 4 },
  textInput: { backgroundColor: '#f5f5f4', borderWidth: 1, borderColor: '#d6d3d1', borderRadius: 8, padding: 10, fontSize: 14, fontWeight: '800', marginBottom: 10 },
  submitBtn: { backgroundColor: colors.primary, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },
})