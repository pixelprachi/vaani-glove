import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import PersonalSigns from './pages/PersonalSigns'
import RecordSign from './pages/RecordSign'
import TestGesture from './pages/TestGesture'
import UserGuide from './pages/UserGuide'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      
      {/* Authenticated Application Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/signs" element={<PrivateRoute><PersonalSigns /></PrivateRoute>} />
      <Route path="/record" element={<PrivateRoute><RecordSign /></PrivateRoute>} />
      <Route path="/test-gesture" element={<PrivateRoute><TestGesture /></PrivateRoute>} />
      <Route path="/guide" element={<PrivateRoute><UserGuide /></PrivateRoute>} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
