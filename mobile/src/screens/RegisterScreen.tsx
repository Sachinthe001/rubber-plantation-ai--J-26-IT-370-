import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { useAuth, Role } from '../context/AuthContext'

export default function RegisterScreen({ navigation }: any) {
  const { registerAs } = useAuth()
  const [role, setRole] = useState<Role>('tapper')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [estate, setEstate] = useState('')

  function handleRegister() {
    registerAs(role, name, phone, estate)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.badge}>NEW WORKER REGISTRATION</Text>
          <Text style={styles.title}>Join RubberSentry Network</Text>
          <Text style={styles.subtitle}>Register your field worker profile</Text>
        </View>

        <View style={styles.card}>

          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. K. G. Sunanda"
            placeholderTextColor="#a8a29e"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Phone Number (SMS Task Alerts) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 0771234567"
            placeholderTextColor="#a8a29e"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.inputLabel}>Assigned Estate / Block Code *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kegalle Estate - Block A12"
            placeholderTextColor="#a8a29e"
            value={estate}
            onChangeText={setEstate}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
            <Text style={styles.submitBtnText}>Create Worker Account ➔</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkBtnText}>Already have an account? Sign In</Text>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
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
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#a7f3d0',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#78716c',
    marginBottom: 8,
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
  roleActiveTapper: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  roleActiveOfficer: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#44403c',
  },
  roleTextActive: {
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
  linkBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkBtnText: {
    color: '#a7f3d0',
    fontSize: 12,
    fontWeight: '800',
  },
})
