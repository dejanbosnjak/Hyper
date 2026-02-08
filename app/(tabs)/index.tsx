import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, ScanLine } from 'lucide-react-native';
import { useResponsiveDimensions } from '@/hooks/useResponsiveDimensions';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { isDesktop, platformSelect } from '@/utils/platform';
import WindowsCompatibleCamera from '@/components/WindowsCompatibleCamera';

export default function ScannerTab() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const { width, height, isDesktop: isDesktopScreen } = useResponsiveDimensions();

  // Keyboard shortcuts for desktop
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      callback: () => {
        if (!isScanning && !scanResult) {
          simulateScan();
        }
      },
    },
    {
      key: 'n',
      ctrlKey: true,
      callback: () => {
        if (scanResult) {
          setScanResult(null);
        }
      },
    },
    {
      key: 'Escape',
      callback: () => {
        if (scanResult) {
          setScanResult(null);
        }
      },
    },
  ]);

  const simulateScan = async () => {
    setIsScanning(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setScanResult({
        componentsFound: 47,
        faultsDetected: 2,
        confidence: 94.7,
        processingTime: 2.3,
        pcbType: 'Arduino Uno R3',
        functionalBlocks: ['Power Supply', 'Microcontroller', 'USB Interface', 'I/O Pins'],
        timestamp: new Date().toISOString(),
      });
      setIsScanning(false);
    }, 3000);
  };

  const handleScanComplete = (result: any) => {
    // Handle both camera scan and file upload results
    setScanResult({
      ...result,
      componentsFound: 47,
      faultsDetected: 2,
      confidence: 94.7,
      processingTime: 2.3,
      pcbType: 'Arduino Uno R3',
      functionalBlocks: ['Power Supply', 'Microcontroller', 'USB Interface', 'I/O Pins'],
    });
  };

  const renderScanResult = () => {
    if (!scanResult) return null;

    return (
      <View style={styles.resultContainer}>
        <ScrollView style={styles.resultScroll}>
          <View style={styles.resultHeader}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.resultTitle}>Scan Complete</Text>
            {isDesktop && (
              <Text style={styles.keyboardHint}>Press Ctrl+N for new scan</Text>
            )}
          </View>
          
          <View style={styles.resultGrid}>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{scanResult.componentsFound}</Text>
              <Text style={styles.resultLabel}>Components</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={[styles.resultValue, { color: scanResult.faultsDetected > 0 ? '#EF4444' : '#10B981' }]}>
                {scanResult.faultsDetected}
              </Text>
              <Text style={styles.resultLabel}>Faults</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{scanResult.confidence}%</Text>
              <Text style={styles.resultLabel}>Confidence</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{scanResult.processingTime}s</Text>
              <Text style={styles.resultLabel}>Time</Text>
            </View>
          </View>

          <View style={styles.pcbInfo}>
            <Text style={styles.pcbType}>{scanResult.pcbType}</Text>
            <Text style={styles.functionalBlocksTitle}>Functional Blocks Detected:</Text>
            {scanResult.functionalBlocks.map((block: string, index: number) => (
              <View key={index} style={styles.functionalBlock}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.functionalBlockText}>{block}</Text>
              </View>
            ))}
          </View>

          {scanResult.faultsDetected > 0 && (
            <View style={styles.faultAlert}>
              <AlertTriangle size={20} color="#EF4444" />
              <Text style={styles.faultText}>
                {scanResult.faultsDetected} potential faults detected. Tap to view details.
              </Text>
            </View>
          )}

          {scanResult.type === 'upload' && (
            <View style={styles.uploadInfo}>
              <Text style={styles.uploadInfoTitle}>Upload Details:</Text>
              <Text style={styles.uploadInfoText}>File: {scanResult.fileName}</Text>
              <Text style={styles.uploadInfoText}>Size: {(scanResult.size / 1024).toFixed(1)} KB</Text>
              <Text style={styles.uploadInfoText}>Uploaded: {new Date(scanResult.timestamp).toLocaleString()}</Text>
            </View>
          )}
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.newScanButton}
          onPress={() => setScanResult(null)}
        >
          <Text style={styles.newScanButtonText}>New Scan</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const cameraHeight = platformSelect({
    desktop: Math.min(height * 0.6, 500),
    mobile: height * 0.5,
    default: height * 0.5,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#0066CC', '#0052A3']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>PCB Scanner</Text>
          <Text style={styles.headerSubtitle}>
            AI-Powered Component Analysis
            {isDesktop && ' • Ctrl+S to scan'}
          </Text>
        </LinearGradient>
      </View>

      {scanResult ? (
        renderScanResult()
      ) : (
        <>
          <View style={[styles.cameraContainer, { height: cameraHeight }]}>
            <WindowsCompatibleCamera
              onScanComplete={handleScanComplete}
              style={styles.camera}
            />
          </View>

          <View style={styles.scanButtonContainer}>
            <TouchableOpacity
              style={[styles.scanButton, isScanning && styles.scanButtonScanning]}
              onPress={simulateScan}
              disabled={isScanning}
            >
              <LinearGradient
                colors={isScanning ? ['#F59E0B', '#D97706'] : ['#0066CC', '#10B981']}
                style={styles.scanButtonGradient}
              >
                <ScanLine size={32} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Analyzing...' : 'Scan PCB'}
            </Text>
            {isDesktop && !isScanning && (
              <Text style={styles.keyboardShortcut}>Ctrl+S</Text>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 80,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 2,
    textAlign: 'center',
  },
  cameraContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  camera: {
    flex: 1,
  },
  scanButtonContainer: {
    alignItems: 'center',
    padding: 24,
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  scanButtonGradient: {
    flex: 1,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonScanning: {
    transform: [{ scale: 0.95 }],
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  keyboardShortcut: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultScroll: {
    flex: 1,
    padding: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  keyboardHint: {
    fontSize: 12,
    color: '#6B7280',
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  resultItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  resultLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  pcbInfo: {
    marginBottom: 20,
  },
  pcbType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  functionalBlocksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  functionalBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  functionalBlockText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  faultAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    marginBottom: 20,
  },
  faultText: {
    fontSize: 14,
    color: '#991B1B',
    marginLeft: 8,
    flex: 1,
  },
  uploadInfo: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  uploadInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  uploadInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  newScanButton: {
    backgroundColor: '#0066CC',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  newScanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});