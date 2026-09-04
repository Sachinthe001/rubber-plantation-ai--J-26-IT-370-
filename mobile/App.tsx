import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { colors } from './src/theme/colors'

import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import DashboardScreen from './src/screens/DashboardScreen'
import YieldForecastScreen from './src/screens/YieldForecastScreen'
import DiseaseDetectionScreen from './src/screens/DiseaseDetectionScreen'
import TPDMonitoringScreen from './src/screens/TPDMonitoringScreen'
import TappingQualityScreen from './src/screens/TappingQualityScreen'
import ProfileScreen from './src/screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const tabIcons: { [key: string]: any } = {
  Dashboard: 'grid-outline',
  Yield: 'leaf-outline',
  Disease: 'bug-outline',
  TPD: 'water-outline',
  Tapping: 'cut-outline',
  Profile: 'person-outline',
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Yield"
        component={YieldForecastScreen}
        options={{ title: 'Yield Forecast' }}
      />
      <Tab.Screen
        name="Disease"
        component={DiseaseDetectionScreen}
        options={{ title: 'Disease Detection' }}
      />
      <Tab.Screen
        name="TPD"
        component={TPDMonitoringScreen}
        options={{ title: 'TPD Monitoring' }}
      />
      <Tab.Screen
        name="Tapping"
        component={TappingQualityScreen}
        options={{ title: 'Tapping Quality' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </Tab.Navigator>
  )
}

function AuthFlow() {
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login')

  const navigation = {
    navigate: (screenName: string) => {
      if (screenName === 'Register') setAuthScreen('register')
      else setAuthScreen('login')
    },
  }

  if (authScreen === 'register') {
    return <RegisterScreen navigation={navigation} />
  }

  return <LoginScreen navigation={navigation} />
}

function AppContent() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <AuthFlow />
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}