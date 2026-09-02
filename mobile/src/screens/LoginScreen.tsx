import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { useAuth, Role } from '../context/AuthContext'
import { colors } from '../theme/colors'

export default function LoginScreen({ navigation }: any) {
  const { loginAs } = useAuth()
  const [role, setRole] = useState<Role>('tapper')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [lang, setLang] = useState<'ENG' | 'SIN'>('ENG')

  function handleLogin() {
    loginAs(role, identifier || (role === 'tapper' ? 'Sunanda (Master Tapper)' : 'Aruna Pathirana (Field Officer)'))
  }

  function handleQuickDemo(demoRole: Role, demoName: string) {
    loginAs(demoRole, demoName)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#064e3b" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.badge}>SLIIT RESEARCH J 26-IT-370</Text>
          <Text style={styles.title}>🌿 RubberSentry Mobile</Text>
          <Text style={styles.subtitle}>
            {lang === 'ENG'
              ? 'Risk-Aware AI Decision Support Portal'
              : 'තැටි මට්ටමේ රබර් වගා කළමනාකරණ පද්ධතිය'}
          </Text>

          {/* Bilingual Switcher */}
          <View style={styles.langRow}>
            <TouchableOpacity
              onPress={() => setLang('ENG')}
              style={[styles.langBtn, lang === 'ENG' && styles.langBtnActive]}
            >
              <Text style={[styles.langText, lang === 'ENG' && styles.langTextActive]}>ENG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLang('SIN')}
              style={[styles.langBtn, lang === 'SIN' && styles.langBtnActive]}
            >
              <Text style={[styles.langText, lang === 'SIN' && styles.langTextActive]}>සිංහල</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 1-Tap Quick Demo Login Chips */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>⚡ 1-TAP QUICK DEMO LOGIN</Text>
          <View style={styles.demoGrid}>
            <TouchableOpacity
              style={styles.demoBtnTapper}
              onPress={() => handleQuickDemo('tapper', 'Sunanda (Master Tapper)')}
            >
              <Text style={styles.demoBtnTitle}>👨‍🌾 Sunanda (TAP-4102)</Text>
              <Text style={styles.demoBtnSub}>Master Tapper · Block A12</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtnOfficer}
              onPress={() => handleQuickDemo('field_officer', 'Aruna Pathirana (Field Officer)')}
            >
              <Text style={styles.demoBtnTitleOfficer}>👔 Aruna (OFF-108)</Text>
              <Text style={styles.demoBtnSub}>Field Officer · 14 Blocks</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Traditional Form */}
        <View style={styles.formCard}>
          <Text style={styles.label}>SELECT ACCOUNT TYPE</Text>

          {/* Role Switcher Chips */}
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleChip, role === 'tapper' && styles.roleChipActiveTapper]}
              onPress={() => setRole('tapper')}
            >
              <Text style={[styles.roleChipText, role === 'tapper' && styles.roleChipTextActive]}>
                👨‍🌾 {lang === 'ENG' ? 'Tapper' : 'රබර් කපන්නා'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleChip, role === 'field_officer' && styles.roleChipActiveOfficer]}
              onPress={() => setRole('field_officer')}
            >
              <Text style={[styles.roleChipText, role === 'field_officer' && styles.roleChipTextActive]}>
                👔 {lang === 'ENG' ? 'Field Officer' : 'නිලධාරී'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>
            {role === 'tapper' ? 'Tapper ID / Phone Number' : 'Officer ID / Email'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={role === 'tapper' ? 'e.g. TAP-4102' : 'e.g. OFF-108'}
            placeholderTextColor="#a8a29e"
            value={identifier}
            onChangeText={setIdentifier}
          />

          <Text style={styles.inputLabel}>Password / 4-Digit Field PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#a8a29e"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleLogin}>
            <Text style={styles.submitBtnText}>
              {lang === 'ENG' ? 'SIGN IN TO RUBBERSENTRY' : 'ප්‍රවේශ වන්න'} ➔
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerLinkText}>
            {lang === 'ENG' ? "Don't have an account? Register Profile" : 'නව ගිණුමක් ලියාපදිංචි වන්න'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#064e3b',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#6ee7b7',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#a7f3d0',
    marginTop: 4,
    textAlign: 'center',
  },
  langRow: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: '#022c22',
    borderRadius: 20,
    padding: 3,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
  },
  langBtnActive: {
    backgroundColor: '#10b981',
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6ee7b7',
  },
  langTextActive: {
    color: '#022c22',
  },
  demoCard: {
    backgroundColor: '#022c22',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  demoTitle: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 10,
  },
  demoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtnTapper: {
    flex: 1,
    backgroundColor: '#065f46',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  demoBtnOfficer: {
    flex: 1,
    backgroundColor: '#083344',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  demoBtnTitle: {
    color: '#a7f3d0',
    fontSize: 12,
    fontWeight: '900',
  },
  demoBtnTitleOfficer: {
    color: '#cffaff',
    fontSize: 12,
    fontWeight: '900',
  },
  demoBtnSub: {
    color: '#cbd5e1',
    fontSize: 10,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#78716c',
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d6d3d1',
    alignItems: 'center',
  },
  roleChipActiveTapper: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  roleChipActiveOfficer: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#44403c',
  },
  roleChipTextActive: {
    color: '#ffffff',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#292524',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f4',
    borderWidth: 1,
    borderColor: '#d6d3d1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1c1917',
    marginBottom: 14,
  },
  submitBtn: {
    backgroundColor: '#047857',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#a7f3d0',
    fontSize: 12,
    fontWeight: '800',
  },
})
