import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import YieldForecast from './pages/YieldForecast'
import DiseaseDetection from './pages/DiseaseDetection'
import TPDMonitoring from './pages/TPDMonitoring'
import TappingQuality from './pages/TappingQuality'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/yield" element={<YieldForecast />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/tpd" element={<TPDMonitoring />} />
          <Route path="/tapping" element={<TappingQuality />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App