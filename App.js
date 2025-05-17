import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import ResultsScreen from './screens/ResultsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Scan" 
          component={CameraScreen} 
          options={{ 
            title: 'Scan License Plate',
            headerLeft: () => null, // Hide back button
            headerBackVisible: false,
            gestureEnabled: false // Disable swipe back gesture
          }} 
        />
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen} 
          options={{ 
            title: 'Verification Results',
            headerLeft: () => null, // Hide back button
            headerBackVisible: false,
            gestureEnabled: false // Disable swipe back gesture
          }} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Styles moved to individual screen components
});
