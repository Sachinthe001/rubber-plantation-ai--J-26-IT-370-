import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import { colors } from '../theme/colors'

export default function ProfileScreen() {
  const { currentUser, logout, updateProfile } = useAuth()
  const isOfficer = currentUser?.role === 'field_officer'

  const [offlineSync, setOfflineSync] = useState(true)
  const [voiceGuidance, setVoiceGuidance] = useState(true)
  const [langSin, setLangSin] = useState(currentUser?.language === 'SIN')

  function toggleLanguage(value: boolean) {
    setLangSin(value)
    updateProfile({ language: value ? 'SIN' : 'ENG' })
  }

  function handleHotline() {
    Alert.alert(
      '📞 Estate Manager Hotline',
      'Calling Kegalle Estate Manager HQ: +94 (35) 222-4091',
      [{ text: 'Close', style: 'cancel' }]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Card Header */}
        <View style={[styles.headerCard, isOfficer ? styles.headerOfficer : styles.headerTapper]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>{isOfficer ? '👔' : '👨‍🌾'}</Text>
          </View>
          
          <View style={styles.headerInfo}>
            <View style={styles.badgeRow}>
              <Text style={styles.roleBadge}>
                {isOfficer ? 'FIELD OFFICER' : 'RUBBER TAPPER'}
              </Text>
              <Text style={styles.usernameText}>{currentUser?.username || 'TAP-4102'}</Text>
            </View>
            <Text style={styles.nameText}>{currentUser?.name || 'K. G. Sunanda'}</Text>
            <Text style={styles.estateText}>{currentUser?.estate || 'Kegalle Estate - Block A12'}</Text>
          </View>
        </View>

        {/* Role Performance Metrics Grid */}
        {isOfficer ? (
          <View style={styles.grid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>SUPERVISED BLOCKS</Text>
              <Text style={styles.metricValue}>14 Blocks</Text>
              <Text style={styles.metricSub}>1,420 Trees Monitored</Text>
            </View>
            <View style={styles.metricCardCyan}>
              <Text style={styles.metricLabel}>AI OVERRIDE ACCURACY</Text>
              <Text style={styles.metricValueCyan}>96.4%</Text>
              <Text style={styles.metricSubCyan}>High Model Agreement</Text>
            </View>
          </View>
        ) : (
          <View style={styles.grid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>ASSIGNED BLOCK</Text>
              <Text style={styles.metricValue}>Block A12</Text>
              <Text style={styles.metricSub}>Division 1 · Kegalle</Text>
            </View>
            <View style={styles.metricCardEmerald}>
              <Text style={styles.metricLabel}>WORKMANSHIP GRADE</Text>
              <Text style={styles.metricValueEmerald}>4.9 ⭐</Text>
              <Text style={styles.metricSubEmerald}>Grade A Acceptable Cut</Text>
            </View>
          </View>
        )}

        {/* Settings & Preferences Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚙️ APP PREFERENCES &amp; OFFLINE MODE</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>📶 Offline Storage Sync</Text>
              <Text style={styles.settingSub}>Auto-save field photos when offline</Text>
            </View>
            <Switch
              value={offlineSync}
              onValueChange={setOfflineSync}
              trackColor={{ false: '#d6d3d1', true: '#10b981' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>🔊 Voice Guidance (TTS)</Text>
              <Text style={styles.settingSub}>Spoken alerts for blurry photos</Text>
            </View>
            <Switch
              value={voiceGuidance}
              onValueChange={setVoiceGuidance}
              trackColor={{ false: '#d6d3d1', true: '#10b981' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>🗣️ Sinhala Voice Mode (සිංහල)</Text>
              <Text style={styles.settingSub}>Switch audio alerts to Sinhala</Text>
            </View>
            <Switch
              value={langSin}
              onValueChange={toggleLanguage}
              trackColor={{ false: '#d6d3d1', true: '#10b981' }}
            />
          </View>
        </View>

        {/* Emergency Hotline Button */}
        <TouchableOpacity style={styles.hotlineBtn} onPress={handleHotline}>
          <Text style={styles.hotlineText}>📞 CALL ESTATE MANAGER HOTLINE</Text>
        </TouchableOpacity>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>LOG OUT ACCOUNT 🚪</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  headerTapper: {
    backgroundColor: '#064e3b',
  },
  headerOfficer: {
    backgroundColor: '#083344',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarIcon: {
    fontSize: 28,
  },
  headerInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  usernameText: {
    color: '#a7f3d0',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  nameText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  estateText: {
    color: '#d1d5db',
    fontSize: 11,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#78716c',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1c1917',
    marginTop: 4,
  },
  metricSub: {
    fontSize: 10,
    color: '#a8a29e',
    marginTop: 2,
  },
  metricCardEmerald: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  metricValueEmerald: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857',
    marginTop: 4,
  },
  metricSubEmerald: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065f46',
    marginTop: 2,
  },
  metricCardCyan: {
    flex: 1,
    backgroundColor: '#ecfeff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#a5f3fc',
  },
  metricValueCyan: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0891b2',
    marginTop: 4,
  },
  metricSubCyan: {
    fontSize: 10,
    fontWeight: '800',
    color: '#155e75',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#292524',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4',
  },
  settingTextCol: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1c1917',
  },
  settingSub: {
    fontSize: 11,
    color: '#78716c',
    marginTop: 2,
  },
  hotlineBtn: {
    backgroundColor: '#fef3c7',
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  hotlineText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '900',
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#991b1b',
    fontSize: 12,
    fontWeight: '900',
  },
})
