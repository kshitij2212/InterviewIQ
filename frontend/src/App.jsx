import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import InterviewSetup from './pages/InterviewSetup'
import InterviewPage from './pages/InterviewPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  const fetchUser = useAuthStore(s => s.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/interview/setup" element={<InterviewSetup />} />
        <Route path="/interview/:id" element={<InterviewPage />} />
        <Route path="/interview/:id/results" element={<ResultsPage />} />
      </Routes>
    </>
  )
}
