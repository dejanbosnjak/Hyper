import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, RotateCcw, Slash as FlashIcon, Grid3x3 as Grid3X3, ScanLine, Upload, Image as ImageIcon } from 'lucide-react-native';
import { isDesktop, isWindows } from '@/utils/platform';

interface WindowsCompatibleCameraProps {
  onScanComplete?: (result: any) => void;
  style?: any;
}

export default function WindowsCompatibleCamera({ onScanComplete, style }: WindowsCompatibleCameraProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  const handleFileUpload = () => {
    if (isDesktop) {
      // For desktop platforms (Windows/Web), show file upload option
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          // Simulate scan result for uploaded image
          const mockResult = {
            type: 'upload',
            fileName: file.name,
            size: file.size,
            timestamp: new Date().toISOString(),
          };
          onScanComplete?.(mockResult);
        }
      };
      input.click();
    }
  };

  if (isDesktop && !permission?.granted) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <View style={styles.fallbackContent}>
          <ImageIcon size={64} color="#0066CC" />
          <Text style={styles.fallbackTitle}>
            {isWindows ? 'Windows Camera Access' : 'Desktop Camera Access'}
          </Text>
          <Text style={styles.fallbackText}>
            {isWindows 
              ? 'Camera access may be limited on Windows. You can upload an image instead.'
              : 'Camera access may be limited on desktop. You can upload an image instead.'
            }
          </Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
            <Upload size={20} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Upload PCB Image</Text>
          </TouchableOpacity>
          
          {permission && (
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Camera size={20} color="#0066CC" />
              <Text style={styles.permissionButtonText}>Try Camera Access</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <Camera size={48} color="#0066CC" />
        <Text style={styles.loadingText}>Loading Camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, style]}>
        <Camera size={64} color="#0066CC" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          To scan and analyze PCBs, we need access to your camera
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        
        {isDesktop && (
          <>
            <Text style={styles.orText}>or</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Upload Image Instead</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(!flashMode);
  };

  const toggleGrid = () => {
    setGridEnabled(!gridEnabled);
  };

  return (
    <View style={[styles.container, style]}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flashMode ? 'on' : 'off'}
      >
        {gridEnabled && (
          <View style={styles.gridContainer}>
            <View style={styles.gridLine} />
            <View style={[styles.gridLine, styles.gridLineVertical]} />
            <View style={[styles.gridLine, styles.gridLineHorizontal2]} />
            <View style={[styles.gridLine, styles.gridLineVertical2]} />
          </View>
        )}
        
        <View style={styles.frameCorners}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </CameraView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, gridEnabled && styles.controlButtonActive]}
          onPress={toggleGrid}
        >
          <Grid3X3 size={24} color={gridEnabled ? '#FFFFFF' : '#0066CC'} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, flashMode && styles.controlButtonActive]}
          onPress={toggleFlash}
        >
          <FlashIcon size={24} color={flashMode ? '#FFFFFF' : '#0066CC'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <RotateCcw size={24} color="#0066CC" />
        </TouchableOpacity>
        
        {isDesktop && (
          <TouchableOpacity style={styles.controlButton} onPress={handleFileUpload}>
            <Upload size={24} color="#0066CC" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
    left: '33.33%',
  },
  gridLineVertical2: {
    width: 1,
    height: '100%',
    left: '66.66%',
  },
  gridLineHorizontal2: {
    width: '100%',
    height: 1,
    top: '66.66%',
  },
  frameCorners: {
    ...StyleSheet.absoluteFillObject,
    margin: 32,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#0066CC',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  controlButtonActive: {
    backgroundColor: '#0066CC',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  fallbackContent: {
    alignItems: 'center',
    padding: 32,
    maxWidth: 400,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  fallbackText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8FAFC',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  permissionButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 16,
  },
});