import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/parkd.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.subtitle}>Permit Verification Made Easy</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.buttonText}>SCAN LICENSE PLATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60, // Add some padding at the bottom
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 280,
    height: 280,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 280,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    maxWidth: 280,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
