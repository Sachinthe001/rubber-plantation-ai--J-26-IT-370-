import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ComponentCard from '../components/ComponentCard'
import { colors } from '../theme/colors'

const components = [
  {
    title: 'Yield & Tapping-Opportunity Forecasting',
    description: 'Short-horizon latex yield forecast with a tap, do-not-tap, or inspect recommendation.',
    status: 'Tap today',
    tone: 'normal' as const,
    screen: 'Yield',
  },
  {
    title: 'Disease Detection & Severity',
    description: 'Classifies leaf disease, estimates severity, and flags cases for a plant pathologist.',
    status: '2 pending review',
    tone: 'watch' as const,
    screen: 'Disease',
  },
  {
    title: 'Tapping-Panel Health & TPD Early Warning',
    description: 'Tracks dry-cut progression over time to warn of Tapping Panel Dryness before it happens.',
    status: '1 high risk',
    tone: 'alert' as const,
    screen: 'TPD',
  },
  {
    title: 'Tapping Quality & Bark Monitoring',
    description: 'Audits completed tapping cuts and tracks bark consumption over time.',
    status: 'Normal',
    tone: 'normal' as const,
    screen: 'Tapping',
  },
]

export default function DashboardScreen() {
  const navigation = useNavigation<any>()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Plantation overview</Text>
        <Text style={styles.heroSubtitle}>
          A risk-aware view across all four components. Tap a card for details.
        </Text>
      </View>

      {components.map((component) => (
        <ComponentCard
          key={component.screen}
          title={component.title}
          description={component.description}
          status={component.status}
          tone={component.tone}
          onPress={() => navigation.navigate(component.screen)}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  hero: { backgroundColor: colors.primary, borderRadius: 8, padding: 20, marginBottom: 16 },
  heroTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
  heroSubtitle: { fontSize: 13, color: colors.primaryLight, marginTop: 8, lineHeight: 18 },
})