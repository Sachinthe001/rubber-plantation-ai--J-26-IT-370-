import { useState } from 'react'
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { colors } from '../theme/colors'

type Verdict = 'result' | 'retake' | 'refer'

type DiagnosisResult = {
  verdict: Verdict
  disease: string
  severity: string
  confidence: number
  message: string
}

const verdictColors: Record<Verdict, { bg: string; text: string; border: string }> = {
  result: { bg: colors.primaryLight, text: colors.primary, border: colors.primary },
  retake: { bg: colors.watchBg, text: colors.watch, border: colors.watch },
  refer: { bg: colors.alertBg, text: colors.alert, border: colors.alert },
}

export default function DiseaseDetectionScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Photo access is required to upload a leaf image.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
      setDiagnosis(null)
    }
  }

  function handleAnalyze() {
    // Placeholder result — will call the real disease-classification model later.
    setDiagnosis({
      verdict: 'result',
      disease: 'Corynespora leaf fall',
      severity: 'Moderate (18% leaf area affected)',
      confidence: 0.87,
      message: 'Lesion pattern matches Corynespora with high confidence.',
    })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Disease detection & severity</Text>
      <Text style={styles.subheading}>
        Upload a leaf photo to classify disease and estimate severity. Unclear images are flagged for a pathologist.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leaf photo</Text>

        <Pressable style={styles.dropzone} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <>
              <Text style={styles.dropzoneTitle}>Tap to choose a photo</Text>
              <Text style={styles.dropzoneSubtitle}>Clear single-leaf shot</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, !imageUri && styles.buttonDisabled]}
          onPress={handleAnalyze}
          disabled={!imageUri}
        >
          <Text style={styles.buttonText}>Analyze photo</Text>
        </Pressable>
      </View>

      {!diagnosis ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Upload a leaf photo and tap "Analyze photo" to see a diagnosis.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.resultHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultLabel}>Diagnosis</Text>
              <Text style={styles.resultDisease}>{diagnosis.disease}</Text>
              <Text style={styles.resultSeverity}>{diagnosis.severity}</Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: verdictColors[diagnosis.verdict].bg, borderColor: verdictColors[diagnosis.verdict].border },
              ]}
            >
              <Text style={[styles.badgeText, { color: verdictColors[diagnosis.verdict].text }]}>
                {Math.round(diagnosis.confidence * 100)}% confidence
              </Text>
            </View>
          </View>

          <Text style={styles.message}>{diagnosis.message}</Text>
          <Text style={styles.footNote}>
            Low-confidence or unsupported cases are automatically referred to a plant pathologist.
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
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  dropzoneTitle: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  dropzoneSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  preview: { width: '100%', height: 160, borderRadius: 6, resizeMode: 'cover' },
  button: { backgroundColor: colors.primary, borderRadius: 6, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  buttonDisabled: { backgroundColor: colors.border },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  placeholder: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 8, padding: 32, alignItems: 'center' },
  placeholderText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  resultLabel: { fontSize: 13, color: colors.textMuted },
  resultDisease: { fontSize: 17, fontWeight: '600', color: colors.text, marginTop: 2 },
  resultSeverity: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  message: { fontSize: 13, color: colors.text, marginTop: 12, lineHeight: 18 },
  footNote: { fontSize: 12, color: colors.textMuted, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
})