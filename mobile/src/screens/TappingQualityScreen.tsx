import { useState } from 'react'
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { BarChart } from 'react-native-gifted-charts'
import { colors } from '../theme/colors'

type Verdict = 'acceptable' | 'correction' | 'damaging' | 'retake'

const verdictColors: Record<Verdict, { label: string; bg: string; text: string; border: string }> = {
  acceptable: { label: 'Acceptable tapping', bg: colors.primaryLight, text: colors.primary, border: colors.primary },
  correction: { label: 'Correction required', bg: colors.watchBg, text: colors.watch, border: colors.watch },
  damaging: { label: 'Potentially damaging', bg: colors.alertBg, text: colors.alert, border: colors.alert },
  retake: { label: 'Retake photo', bg: '#f5f5f4', text: colors.textMuted, border: colors.border },
}

type Measurement = { label: string; value: string; standard: string; withinRange: boolean }
type AuditResult = { verdict: Verdict; measurements: Measurement[]; message: string }

const barkHistory = [
  { value: 1.6, label: 'Tap 1' },
  { value: 1.7, label: 'Tap 2' },
  { value: 1.5, label: 'Tap 3' },
  { value: 1.9, label: 'Tap 4' },
  { value: 2.1, label: 'Tap 5' },
  { value: 2.4, label: 'Tap 6' },
]

export default function TappingQualityScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [result, setResult] = useState<AuditResult | null>(null)

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Photo access is required to upload a tapping photo.')
      return
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    })
    if (!picked.canceled) {
      setImageUri(picked.assets[0].uri)
      setResult(null)
    }
  }

  function handleAudit() {
    // Placeholder result — will call the real cut-measurement model later.
    setResult({
      verdict: 'correction',
      measurements: [
        { label: 'Cut length', value: '38 cm', standard: '35–42 cm', withinRange: true },
        { label: 'Cut slope', value: '38°', standard: '30–35°', withinRange: false },
        { label: 'Bark-strip width', value: '2.4 mm', standard: '1.5–2.5 mm', withinRange: true },
        { label: 'Cutting depth', value: 'Not measurable', standard: '—', withinRange: false },
      ],
      message: 'Cut slope is steeper than recommended. Depth cannot be verified from a single photo.',
    })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Tapping quality & bark monitoring</Text>
      <Text style={styles.subheading}>
        Audits a completed tapping cut using a scale-assisted photo, and tracks bark use over time.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Post-tapping photo</Text>
        <Pressable style={styles.dropzone} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <>
              <Text style={styles.dropzoneTitle}>Tap to choose a photo</Text>
              <Text style={styles.dropzoneSubtitle}>Include the scale marker in frame</Text>
            </>
          )}
        </Pressable>
        <Pressable
          style={[styles.button, !imageUri && styles.buttonDisabled]}
          onPress={handleAudit}
          disabled={!imageUri}
        >
          <Text style={styles.buttonText}>Audit tapping cut</Text>
        </Pressable>
      </View>

      {!result ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Upload a photo and tap "Audit tapping cut" to see measurements.</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Cut audit result</Text>
            <View style={[styles.badge, { backgroundColor: verdictColors[result.verdict].bg, borderColor: verdictColors[result.verdict].border }]}>
              <Text style={[styles.badgeText, { color: verdictColors[result.verdict].text }]}>
                {verdictColors[result.verdict].label}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1.3 }]}>Measurement</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1 }]}>Value</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1 }]}>Status</Text>
            </View>
            {result.measurements.map((m) => (
              <View key={m.label} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1.3, color: colors.text }]}>{m.label}</Text>
                <Text style={[styles.tableCell, { flex: 1, color: colors.textMuted }]}>{m.value}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 1, color: m.withinRange ? colors.primary : colors.alert, fontWeight: '600' },
                  ]}
                >
                  {m.withinRange ? 'OK' : 'Out'}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.message}>{result.message}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bark consumption — last 6 tapping sessions</Text>
        <BarChart
          data={barkHistory}
          height={180}
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  heading: { fontSize: 20, fontWeight: '600', color: colors.text },
  subheading: { fontSize: 13, color: colors.textMuted, marginTop: 6, marginBottom: 16, lineHeight: 18 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 12 },
  dropzone: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 8,
    padding: 24, alignItems: 'center', justifyContent: 'center', minHeight: 130,
  },
  dropzoneTitle: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  dropzoneSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  preview: { width: '100%', height: 150, borderRadius: 6, resizeMode: 'cover' },
  button: { backgroundColor: colors.primary, borderRadius: 6, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  buttonDisabled: { backgroundColor: colors.border },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  placeholder: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 8, padding: 24, alignItems: 'center', marginBottom: 16 },
  placeholderText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  resultTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  table: { borderTopWidth: 1, borderTopColor: colors.border },
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f4' },
  tableHeaderRow: { borderBottomColor: colors.border },
  tableCell: { fontSize: 12 },
  tableHeaderText: { color: colors.textMuted, fontWeight: '600' },
  message: { fontSize: 13, color: colors.text, marginTop: 4, lineHeight: 18 },
})