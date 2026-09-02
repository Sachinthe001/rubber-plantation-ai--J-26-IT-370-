import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { strings } from '../../i18n/strings';
import { getScans, ScanRecord } from '../../services/OfflineStorage';
import { TappingQualityStackParamList } from '../../navigation/TappingQualityStack';

type HomeScreenNavigationProp = NativeStackNavigationProp<TappingQualityStackParamList, 'Home'>;

export default function HomeDashboardScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [lang, setLang] = useState<'en' | 'si'>('en');
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('@app_lang').then(res => {
      if (res === 'si') setLang('si');
    });
    
    // Load recent scans
    getScans().then(res => setScans(res));
  }, []);

  const toggleLang = async () => {
    const next = lang === 'en' ? 'si' : 'en';
    setLang(next);
    await AsyncStorage.setItem('@app_lang', next);
  };

  const t = strings[lang];
  const pendingCount = scans.filter(s => s.syncStatus === 'pending').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.home}</Text>
        <View style={styles.langToggle}>
          <Text style={styles.langText}>ENG</Text>
          <Switch value={lang === 'si'} onValueChange={toggleLang} trackColor={{ true: colors.primary }} />
          <Text style={styles.langText}>SIN</Text>
        </View>
      </View>

      {/* Sync Status */}
      <View style={styles.syncCard}>
        <Text style={styles.syncText}>{pendingCount} {t.pendingSync}</Text>
      </View>

      {/* Big Action Button */}
      <TouchableOpacity 
        style={styles.bigButton} 
        onPress={() => navigation.navigate('TreeSelection')}
      >
        <Text style={styles.bigButtonText}>{t.newScan}</Text>
      </TouchableOpacity>
      
      {/* Recent Scans */}
      <Text style={styles.subtitle}>Recent Scans</Text>
      {scans.slice(0, 3).map((scan, i) => (
        <View key={i} style={styles.scanCard}>
          <Text>{scan.treeId}</Text>
          <Text>{scan.grade}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  langToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langText: { fontSize: 14, fontWeight: '600' },
  syncCard: { backgroundColor: colors.watchBg, padding: 16, borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: colors.watch },
  syncText: { color: colors.watch, fontWeight: 'bold' },
  bigButton: { backgroundColor: colors.primary, minHeight: 64, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  bigButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: colors.text },
  scanCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
});
