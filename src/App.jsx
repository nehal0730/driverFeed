import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { Header } from './components/Layout/Header.jsx'
import { Sidebar } from './components/Layout/Sidebar.jsx'
import { useAlertStore } from './store/alertStore.js'
import { useFeatureFlagStore } from './store/featureFlagStore.js'
import { useFeedbackStore } from './store/feedbackStore.js'
import Toast from './components/Molecules/Toast.jsx'
import { featureFlagAPI } from './api/featureFlagAPI.js'
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates.js'

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const DriverDetailPage = lazy(() => import('./pages/DriverDetailPage.jsx'))
const DriversListPage = lazy(() => import('./pages/DriversListPage.jsx'))
const ReportsPage = lazy(() => import('./pages/ReportsPage.jsx'))

// Toast Container Component
const ToastContainer = () => {
  const toasts = useAlertStore((state) => state.toasts)
  const removeToast = useAlertStore((state) => state.removeToast)

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  )
}

// Main App Layout
const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          onMenuToggle={setIsSidebarOpen}
          isMobileSidebarOpen={isSidebarOpen}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  const setFlags = useFeatureFlagStore((state) => state.setFlags)
  const setFlagsLoading = useFeatureFlagStore((state) => state.setLoading)
  const setFlagsError = useFeatureFlagStore((state) => state.setError)
  const flags = useFeatureFlagStore((state) => state.flags)

  const stores = useMemo(
    () => ({
      alert: useAlertStore,
      feedback: useFeedbackStore,
    }),
    []
  )

  const enabledTypes = useMemo(() => ['alerts', 'feedback'], [])

  useRealTimeUpdates(stores, {
    enabled: Boolean(flags.realTimeAlerts),
    enabledTypes,
  })

  // Initialize feature flags on app load
  useEffect(() => {
    let isMounted = true
    let pollerId

    const loadFlags = async () => {
      setFlagsLoading(true)
      try {
        const response = await featureFlagAPI.getFlags()
        if (!isMounted) return
        setFlags(response)
        setFlagsLoading(false)
      } catch (error) {
        if (!isMounted) return
        setFlagsError(error.message || 'Failed to load feature flags')
      }
    }

    loadFlags()

    pollerId = setInterval(() => {
      loadFlags()
    }, 30000)

    return () => {
      isMounted = false
      if (pollerId) {
        clearInterval(pollerId)
      }
    }
  }, [setFlags, setFlagsError, setFlagsLoading])

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16 text-slate-600">
              Loading page...
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              }
            />
            <Route
              path="/driver/:driverId"
              element={
                <AppLayout>
                  <DriverDetailPage />
                </AppLayout>
              }
            />
            <Route
              path="/drivers"
              element={
                <AppLayout>
                  <DriversListPage />
                </AppLayout>
              }
            />
            <Route
              path="/reports"
              element={
                <AppLayout>
                  <ReportsPage />
                </AppLayout>
              }
            />
            <Route
              path="*"
              element={
                <AppLayout>
                  <div className="text-center py-12">
                    <h1 className="text-3xl font-bold text-slate-900">404 - Page Not Found</h1>
                    <a href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                      Go back to dashboard
                    </a>
                  </div>
                </AppLayout>
              }
            />
          </Routes>
        </Suspense>

        {/* Global Toast Container */}
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App
