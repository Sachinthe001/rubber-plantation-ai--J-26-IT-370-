import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import YieldForecast from './pages/YieldForecast'
import DiseaseDetection from './pages/DiseaseDetection'
import TPDMonitoring from './pages/TPDMonitoring'
import TappingQuality from './pages/TappingQuality'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'

function AppRoutes() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Welcome />} />
      </Routes>
    )
  }

  const isAdminSide = currentUser.role === 'field_officer'

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto w-full p-6">
        <Routes>
          <Route path="/" element={isAdminSide ? <AdminDashboard /> : <Dashboard />} />
          <Route path="/yield" element={<YieldForecast />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/tpd" element={<TPDMonitoring />} />
          <Route path="/tapping" element={<TappingQuality />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App