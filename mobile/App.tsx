import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { colors } from './src/theme/colors'
import DashboardScreen from './src/screens/DashboardScreen'
import YieldForecastScreen from './src/screens/YieldForecastScreen'
import DiseaseDetectionScreen from './src/screens/DiseaseDetectionScreen'
import TPDMonitoringScreen from './src/screens/TPDMonitoringScreen'
import TappingQualityScreen from './src/screens/TappingQualityScreen'

const Tab = createBottomTabNavigator()

const tabIcons: { [key: string]: any } = {
  Dashboard: 'grid-outline',
  Yield: 'leaf-outline',
  Disease: 'bug-outline',
  TPD: 'water-outline',
  Tapping: 'cut-outline',
}

export default function App() {
  return (
    <NavigationContainer>
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
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Yield" component={YieldForecastScreen} options={{ title: 'Yield Forecast' }} />
        <Tab.Screen name="Disease" component={DiseaseDetectionScreen} options={{ title: 'Disease Detection' }} />
        <Tab.Screen name="TPD" component={TPDMonitoringScreen} options={{ title: 'TPD Monitoring' }} />
        <Tab.Screen name="Tapping" component={TappingQualityScreen} options={{ title: 'Tapping Quality' }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}