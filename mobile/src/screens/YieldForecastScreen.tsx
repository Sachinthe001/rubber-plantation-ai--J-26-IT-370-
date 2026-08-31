import { useState } from 'react'
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { colors } from '../theme/colors'

type Decision = 'tap' | 'hold' | 'uncertain'

const decisionStyles: Record<Decision, { label: string; bg: string; text: string; border: string }> = {
  tap: { label: 'Tap today', bg: colors.primaryLight, text: colors.primary, border: colors.primary },
  hold: { label: 'Do not tap', bg: colors.alertBg, text: colors.alert, border: colors.alert },
  uncertain: { label: 'Uncertain — inspect', bg: colors.watchBg, text: colors.watch, border: colors.watch },
}

type ForecastResult = {
  expectedYield: number
  rangeLow: number
  rangeHigh: number
  decision: Decision
  factors: string[]
}

export default function YieldForecastScreen() {
  const [block, setBlock] = useState('Block A')
  const [horizon, setHorizon] = useState('3')
  const [result, setResult] = useState<ForecastResult | null>(null)

  function handleForecast() {
    // Placeholder result — will call the real ML model later.
    setResult({
      expectedYield: 18.4,
      rangeLow: 15.9,
      rangeHigh: 20.7,
      decision: 'uncertain',
      factors: [
        'Rainfall forecast is above the 7-day average for this block',
        'Tapping frequency has been consistent for the last 2 weeks',
        'Clone RRIC 100 has moderate sensitivity to wet-weather tapping',
      ],
    })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Yield & tapping-opportunity forecasting</Text>
      <Text style={styles.subheading}>
        Short-horizon latex yield forecast, plus a tap / do-not-tap / uncertain recommendation.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Forecast inputs</Text>

        <Text style={styles.label}>Plantation block</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={block} onValueChange={setBlock}>
            <Picker.Item label="Block A" value="Block A" />
            <Picker.Item label="Block B" value="Block B" />
            <Picker.Item label="Block C" value="Block C" />
          </Picker>
        </View>

        <Text style={styles.label}>Forecast horizon</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={horizon} onValueChange={setHorizon}>
            <Picker.Item label="1 day" value="1" />
            <Picker.Item label="3 days" value="3" />
            <Picker.Item label="7 days" value="7" />
          </Picker>
        </View>

        <Pressable style={styles.button} onPress={handleForecast}>
          <Text style={styles.buttonText}>Get forecast</Text>
        </Pressable>
      </View>

      {!result ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Choose a block and tap "Get forecast" to see a prediction.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.resultLabel}>Expected yield ({block})</Text>
              <Text style={styles.resultValue}>
                {result.expectedYield} <Text style={styles.resultUnit}>kg</Text>
              </Text>
              <Text style={styles.resultRange}>
                Likely range: {result.rangeLow}–{result.rangeHigh} kg
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: decisionStyles[result.decision].bg, borderColor: decisionStyles[result.decision].border },
              ]}
            >
              <Text style={[styles.badgeText, { color: decisionStyles[result.decision].text }]}>
                {decisionStyles[result.decision].label}
              </Text>
            </View>
          </View>

          <Text style={styles.factorsTitle}>Contributing factors</Text>
          {result.factors.map((factor) => (
            <Text key={factor} style={styles.factorItem}>
              • {factor}
            </Text>
          ))}

          <Text style={styles.footNote}>
            Uncertain cases should be confirmed by a field officer before acting.
          </Text>
        </View>
      )}
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
  button: { backgroundColor: colors.primary, borderRadius: 6, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  placeholder: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 8, padding: 32, alignItems: 'center' },
  placeholderText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' },
  resultLabel: { fontSize: 13, color: colors.textMuted },
  resultValue: { fontSize: 28, fontWeight: '600', color: colors.text, marginTop: 2 },
  resultUnit: { fontSize: 14, fontWeight: '400', color: colors.textMuted },
  resultRange: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 13, fontWeight: '600' },
  factorsTitle: { fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 16, marginBottom: 6 },
  factorItem: { fontSize: 13, color: colors.textMuted, marginBottom: 4, lineHeight: 18 },
  footNote: { fontSize: 12, color: colors.textMuted, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
})