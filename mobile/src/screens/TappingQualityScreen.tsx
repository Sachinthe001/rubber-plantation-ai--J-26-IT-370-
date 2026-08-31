import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

export default function TappingQualityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tapping quality & bark monitoring</Text>
      <Text style={styles.subtitle}>Component 4 UI goes here.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 22, fontWeight: '600', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 8 },
})