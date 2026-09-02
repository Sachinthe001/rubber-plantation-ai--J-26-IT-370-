import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TappingQualityStackParamList } from '../../navigation/TappingQualityStack';
import { colors } from '../../theme/colors';

export default function TreeSelectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<TappingQualityStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Tree Tag (QR)</Text>
      <View style={styles.mockQrScanner}>
        <Text style={styles.qrText}>[ CAMERA PREVIEW MOCKUP ]</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('CameraCapture', { treeId: 'TR-1045' })}
      >
        <Text style={styles.buttonText}>Simulate Scan (TR-1045)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: colors.text },
  mockQrScanner: { height: 300, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginBottom: 24 },
  qrText: { color: 'white', fontWeight: 'bold' },
  button: { backgroundColor: colors.primary, height: 64, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
