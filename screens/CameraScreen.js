import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Dimensions, Animated, Easing } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const [type] = useState('back');
  const captureAnim = useRef(new Animated.Value(1)).current;

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No access to camera</Text>
        <TouchableOpacity style={styles.captureButton} onPress={requestPermission}>
          <Text style={styles.captureText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.popToTop()}>
          <Text style={styles.cancelText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current && !isCapturing && !isProcessing) {
      Animated.sequence([
        Animated.timing(captureAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(captureAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      setIsCapturing(true);
      setIsProcessing(true);
      
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: false });
        
        if (!photo?.uri) {
          throw new Error('No photo URI returned from camera');
        }
        
        const resized = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        
        const response = await fetch(
          'https://parkd-endpoint.vercel.app/api/detect_and_ocr',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: resized.base64 })
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        
        const responseData = await response.json();
        
        if (!Array.isArray(responseData) || responseData.length === 0 || !responseData[0]) {
          Alert.alert(
            'No License Plate Found',
            'We couldn\'t detect a license plate in the image. Please try again with a clearer photo.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsCapturing(false);
                  setIsProcessing(false);
                }
              }
            ],
            { cancelable: false }
          );
          return;
        }
        
        const plateText = responseData[0];

        try {
          const response = await fetch(
            `https://parkd-verification.vercel.app/api/verify/${encodeURIComponent(plateText)}`,
            { method: 'GET' }
          );

          if (!response.ok) {
            throw new Error('Failed to verify permit');
          }

          const result = await response.json();

          navigation.replace('Results', { 
            photoUri: photo.uri, 
            licensePlate: plateText,
            hasValidPermit: result.valid || false,
            apiDebug: JSON.stringify(responseData) 
          });

        } catch (error) {
          console.error('Verification error:', error);
          navigation.replace('Results', { 
            photoUri: photo.uri, 
            licensePlate: plateText,
            hasValidPermit: false,
            apiError: 'Failed to verify permit',
            apiDebug: JSON.stringify(responseData) 
          });
        }
        
      } catch (error) {
        console.error('Error in takePhoto:', error);
        
        if (navigation.isFocused()) {
          Alert.alert(
            'Error',
            error.message || 'Failed to process the image. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsCapturing(false);
                  setIsProcessing(false);
                }
              }
            ],
            { cancelable: false }
          );
        }
      } finally {
        if (navigation.isFocused()) {
          setIsCapturing(false);
          setIsProcessing(false);
        }
      }
    }
  };

  // Use CameraView if available, otherwise fallback to Camera
  const CameraComponent = typeof CameraView !== 'undefined' ? CameraView : Camera;

  return (
    <View style={styles.container}>
      <CameraComponent
        style={styles.camera}
        ref={cameraRef}
        type={type}
        ratio="16:9"
      />
      {(isCapturing || isProcessing) && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ color: 'white', marginTop: 10 }}>Processing...</Text>
        </View>
      )}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.popToTop()}
          disabled={isProcessing}
        >
          <Ionicons name="close" size={24} color="white" />
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        
        <View style={styles.captureButtonContainer}>
          <Animated.View 
            style={[
              styles.captureButton,
              { transform: [{ scale: captureAnim }] }
            ]}
          >
            <TouchableOpacity
              style={styles.captureButtonInner}
              onPress={takePhoto}
              disabled={isCapturing || isProcessing}
              activeOpacity={0.7}
            >
              <View style={[styles.captureButtonOuter, isProcessing && styles.captureButtonProcessing]}>
                <View style={styles.captureButtonInnerRing} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        <View style={styles.spacer} />
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  captureButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    bottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
  },
  captureButtonProcessing: {
    backgroundColor: '#ff5252',
  },
  captureButtonInnerRing: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'white',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.9)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  spacer: {
    width: 90, // Same as cancel button width to balance the layout
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default CameraScreen;
