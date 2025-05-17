import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ResultsScreen = ({ navigation, route }) => {
  const { 
    photoUri, 
    licensePlate, 
    hasValidPermit, 
    apiError 
  } = route.params || {};
  
  const statusColor = hasValidPermit ? '#4CAF50' : '#FF3B30';
  const statusText = hasValidPermit ? 'VALID PERMIT' : 'NO VALID PERMIT';
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Results</Text>
      </View>
      
      <View style={styles.licenseContainer}>
        <Text style={styles.licenseLabel}>LICENSE PLATE</Text>
        <Text style={styles.licenseText}>
          {licensePlate || 'N/A'}
        </Text>
      </View>
      
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Ionicons 
          name={hasValidPermit ? 'checkmark-circle' : 'close-circle'} 
          size={24} 
          color="white" 
        />
        <Text style={styles.statusText}>
          {statusText}
        </Text>
      </View>
      
      {photoUri && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: photoUri }} 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.replace('Scan')}
        >
          <Ionicons name="camera" size={20} color="white" />
          <Text style={styles.buttonText}>SCAN AGAIN</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.popToTop()}
        >
          <Ionicons name="home" size={20} color="#1a1a1a" />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>HOME</Text>
        </TouchableOpacity>
      </View>
      
      {/* Error Message */}
      {apiError && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={20} color="#FF3B30" />
          <Text style={styles.errorText}>Error: {apiError}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  licenseContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  licenseLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  licenseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 30,
    alignSelf: 'center',
    minWidth: 200,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 6,
    backgroundColor: '#1a1a1a',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: '#1a1a1a',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorText: {
    color: '#FF3B30',
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
});

export default ResultsScreen;
