import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TappingQualityStackParamList } from '../../navigation/TappingQualityStack';
import { colors } from '../../theme/colors';

export default function CameraCaptureScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<TappingQualityStackParamList>>();
  const route = useRoute<any>();
  const [warning, setWarning] = useState<string | null>('Too Dark');

  // Simulate real-time mock warnings
  React.useEffect(() => {
    const timer = setTimeout(() => setWarning(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCapture = () => {
    navigation.replace('Processing', { treeId: route.params?.treeId || 'Unknown' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Align Cut and Marker</Text>
      
      <View style={styles.cameraFrame}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600' }} 
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Guides */}
        <View style={styles.markerGuide}>
          <Text style={styles.guideText}>Marker</Text>
        </View>
        <View style={styles.cutGuide}>
          <Text style={styles.guideText}>Cut Area</Text>
        </View>

        {warning && (
          <View style={styles.warningChip}>
            <Text style={styles.warningText}>⚠️ {warning}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.captureButton, warning ? styles.captureDisabled : null]}
        onPress={handleCapture}
      >
        <Text style={styles.captureText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: colors.text },
  cameraFrame: { flex: 1, backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative', marginBottom: 24 },
  markerGuide: { position: 'absolute', top: 20, left: 20, width: 60, height: 60, borderWidth: 2, borderColor: colors.watch, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  cutGuide: { position: 'absolute', top: 100, left: 40, right: 40, height: 200, borderWidth: 2, borderColor: colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  guideText: { color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: 4 },
  warningChip: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: colors.alert, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  warningText: { color: 'white', fontWeight: 'bold' },
  captureButton: { backgroundColor: colors.primary, height: 80, width: 80, borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
  captureDisabled: { opacity: 0.5 },
  captureText: { color: 'white', fontWeight: 'bold' }
});
