import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import AppLayout from './components/layout/AppLayout'
import ScrollToTop from './components/utils/ScrollToTop'
import StartupLoader from './components/common/StartupLoader'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import InterviewSetup from './pages/InterviewSetup'
import InterviewPage from './pages/InterviewPage'
import ResultsPage from './pages/ResultsPage'
import ProfilePage from './pages/ProfilePage'
import HistoryPage from './pages/HistoryPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import HelpPage from './pages/HelpPage'

export default function App() {
  const fetchUser = useAuthStore(s => s.fetchUser)
  const [isServerReady, setIsServerReady] = useState(false)

  useEffect(() => {
    if (isServerReady) {
      fetchUser()
    }
  }, [fetchUser, isServerReady])

  if (!isServerReady) {
    return <StartupLoader onReady={() => setIsServerReady(true)} />
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/help"      element={<HelpPage />} />

        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy"  element={<PrivacyPage />} />
        <Route path="/terms"    element={<TermsPage />} />

        <Route path="/interview/:id"         element={<InterviewPage />} />
        <Route path="/interview/:id/results" element={<AppLayout><ResultsPage /></AppLayout>} />

        <Route path="/dashboard"      element={<AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/interview/setup" element={<AppLayout><InterviewSetup /></AppLayout>} />
        <Route path="/profile"        element={<AppLayout><ProfilePage /></AppLayout>} />
        <Route path="/history"        element={<AppLayout><HistoryPage /></AppLayout>} />
      </Routes>
    </>
  )
}
