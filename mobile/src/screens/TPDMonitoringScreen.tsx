import { useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { LineChart } from 'react-native-gifted-charts'
import { colors } from '../theme/colors'

const treeOptions = ['Tree-014', 'Tree-027', 'Tree-041'] as const
type TreeId = (typeof treeOptions)[number]
type Status = 'normal' | 'watch' | 'alert'

const statusStyles: Record<Status, { label: string; bg: string; text: string; border: string }> = {
  normal: { label: 'Normal', bg: colors.primaryLight, text: colors.primary, border: colors.primary },
  watch: { label: 'Monitor', bg: colors.watchBg, text: colors.watch, border: colors.watch },
  alert: { label: 'High TPD risk — inspect', bg: colors.alertBg, text: colors.alert, border: colors.alert },
}

const history: Record<TreeId, { value: number; label: string }[]> = {
  'Tree-014': [
    { value: 18, label: 'Wk 1' }, { value: 20, label: 'Wk 2' }, { value: 19, label: 'Wk 3' },
    { value: 22, label: 'Wk 4' }, { value: 21, label: 'Wk 5' }, { value: 23, label: 'Wk 6' },
  ],
  'Tree-027': [
    { value: 30, label: 'Wk 1' }, { value: 35, label: 'Wk 2' }, { value: 41, label: 'Wk 3' },
    { value: 44, label: 'Wk 4' }, { value: 49, label: 'Wk 5' }, { value: 53, label: 'Wk 6' },
  ],
  'Tree-041': [
    { value: 40, label: 'Wk 1' }, { value: 48, label: 'Wk 2' }, { value: 55, label: 'Wk 3' },
    { value: 63, label: 'Wk 4' }, { value: 71, label: 'Wk 5' }, { value: 78, label: 'Wk 6' },
  ],
}

const assessments: Record<TreeId, { status: Status; message: string }> = {
  'Tree-014': { status: 'normal', message: 'Dry-cut percentage is stable and well below the risk threshold.' },
  'Tree-027': { status: 'watch', message: 'Dry-cut percentage is rising steadily. Recommend closer monitoring.' },
  'Tree-041': { status: 'alert', message: 'Dry-cut trend has crossed the high-risk threshold. Recommend inspection.' },
}

export default function TPDMonitoringScreen() {
  const [tree, setTree] = useState<TreeId>('Tree-027')
  const [assessed, setAssessed] = useState(false)

  const data = history[tree]
  const result = assessments[tree]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Tapping-panel health & TPD early warning</Text>
      <Text style={styles.subheading}>
        Tracks dry-cut percentage over repeated observations to warn of TPD before latex flow fails.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Assessment inputs</Text>
        <Text style={styles.label}>Tree ID</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tree}
            onValueChange={(value) => {
              setTree(value)
              setAssessed(false)
            }}
          >
            {treeOptions.map((id) => (
              <Picker.Item key={id} label={id} value={id} />
            ))}
          </Picker>
        </View>

        <Pressable style={styles.button} onPress={() => setAssessed(true)}>
          <Text style={styles.buttonText}>Assess TPD risk</Text>
        </Pressable>
      </View>

      {assessed ? (
        <View style={styles.card}>
          <View style={styles.resultHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultLabel}>{tree}</Text>
              <Text style={styles.resultTitle}>TPD risk assessment</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusStyles[result.status].bg, borderColor: statusStyles[result.status].border }]}>
              <Text style={[styles.badgeText, { color: statusStyles[result.status].text }]}>
                {statusStyles[result.status].label}
              </Text>
            </View>
          </View>
          <Text style={styles.message}>{result.message}</Text>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Choose a tree and tap "Assess TPD risk" for a prediction.</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dry-cut percentage — last 6 observations</Text>
        <LineChart
          data={data}
          height={180}
          color={colors.primary}
          thickness={2}
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
          <Text style={styles.thresholdText}>High-risk threshold: 70%</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  heading: { fontSize: 20, fontWeight: '600', color: colors.text },
  subheading: { fontSize: 13, color: colors.textMuted, marginTop: 6, marginBottom: 16, lineHeight: 18 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 12 },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  pickerWrapper: { borderWidth: 1, borderColor: colors.border, borderRadius: 6, marginBottom: 12, overflow: 'hidden' },
  button: { backgroundColor: colors.primary, borderRadius: 6, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  placeholder: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 8, padding: 24, alignItems: 'center', marginBottom: 16 },
  placeholderText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  resultLabel: { fontSize: 13, color: colors.textMuted },
  resultTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  message: { fontSize: 13, color: colors.text, marginTop: 12, lineHeight: 18 },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6 },
  thresholdDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.alert },
  thresholdText: { fontSize: 12, color: colors.textMuted },
})