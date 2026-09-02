import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import YieldForecast from './pages/YieldForecast'
import DiseaseDetection from './pages/DiseaseDetection'
import TPDMonitoring from './pages/TPDMonitoring'
import TappingQuality from './pages/TappingQuality'
import AdminDashboard from './pages/AdminDashboard'
import AppLayout from './components/AppLayout'

// Placeholders for auxiliary routes
const RegistryPlaceholder = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-200"><h2 className="text-xl font-bold">Trees & Blocks Registry</h2><p className="text-stone-500 mt-2">Central database for all entities.</p></div>
const MapPlaceholder = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-200"><h2 className="text-xl font-bold">Plantation Map</h2><p className="text-stone-500 mt-2">Geospatial overlays of all component data.</p></div>
const AnalyticsPlaceholder = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-200"><h2 className="text-xl font-bold">Cross-Component Analytics</h2><p className="text-stone-500 mt-2">Aggregate reporting and correlations.</p></div>
const ModelHealthPlaceholder = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-200"><h2 className="text-xl font-bold">Model Health</h2><p className="text-stone-500 mt-2">Accuracy, calibration, and drift monitoring.</p></div>
const SettingsPlaceholder = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-200"><h2 className="text-xl font-bold">Platform Settings</h2><p className="text-stone-500 mt-2">Thresholds, user roles, and assignments.</p></div>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/yield" element={<YieldForecast />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/tpd" element={<TPDMonitoring />} />
          <Route path="/tapping" element={<TappingQuality />} />

          {/* Auxiliary views */}
          <Route path="/registry" element={<RegistryPlaceholder />} />
          <Route path="/map" element={<MapPlaceholder />} />
          <Route path="/analytics" element={<AnalyticsPlaceholder />} />
          <Route path="/model-health" element={<ModelHealthPlaceholder />} />
          <Route path="/settings" element={<SettingsPlaceholder />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App