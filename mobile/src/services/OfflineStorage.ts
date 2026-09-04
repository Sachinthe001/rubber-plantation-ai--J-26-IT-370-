import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from './TappingQualityModel';

export interface ScanRecord extends AnalysisResult {
  treeId: string;
  timestamp: string;
  syncStatus: 'synced' | 'pending';
}

const STORAGE_KEY = '@tapping_scans';

export const saveScan = async (scan: ScanRecord): Promise<void> => {
  try {
    const existing = await getScans();
    const updated = [scan, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving scan', e);
  }
};

export const getScans = async (): Promise<ScanRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error fetching scans', e);
    return [];
  }
};
