import { Pressable, View, Text, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

type Tone = 'normal' | 'watch' | 'alert'

type Props = {
  title: string
  description: string
  status: string
  tone: Tone
  onPress: () => void
}

const toneColors: Record<Tone, { bg: string; text: string; border: string }> = {
  normal: { bg: colors.primaryLight, text: colors.primary, border: colors.primary },
  watch: { bg: colors.watchBg, text: colors.watch, border: colors.watch },
  alert: { bg: colors.alertBg, text: colors.alert, border: colors.alert },
}

export default function ComponentCard({ title, description, status, tone, onPress }: Props) {
  const toneStyle = toneColors[tone]

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: toneStyle.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.pill, { backgroundColor: toneStyle.bg }]}>
          <Text style={[styles.pillText, { color: toneStyle.text }]}>{status}</Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderLeftWidth: 4, borderRadius: 8, padding: 16, marginBottom: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  title: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontSize: 11, fontWeight: '600' },
  description: { fontSize: 13, color: colors.textMuted, marginTop: 8, lineHeight: 18 },
})