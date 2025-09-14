import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'
import MakePayment from './pages/MakePayment'
import TransactionsOverview from './pages/TransactionsOverview'
import TransactionsBySchool from './pages/TransactionsBySchool'
import TransactionStatus from './pages/TransactionStatus'

// ✅ ProtectedRoute component inside App.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Wait for auth check
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  // Redirect if not authenticated
  if (!isAuthenticated) return <Navigate to="/signin" replace />

  return children
}

function App() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/signin" replace />} />

              {/* Public Routes */}
              <Route path="/signin" element={<PageTransition><SignInPage /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><SignUpPage /></PageTransition>} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Navbar onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <PageTransition>
                        <Dashboard />
                      </PageTransition>
                    </main>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/make-payment" 
                element={
                  <ProtectedRoute>
                    <Navbar onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <PageTransition>
                        <MakePayment />
                      </PageTransition>
                    </main>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <Navbar onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <PageTransition>
                        <TransactionsOverview />
                      </PageTransition>
                    </main>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/transactions/school" 
                element={
                  <ProtectedRoute>
                    <Navbar onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <PageTransition>
                        <TransactionsBySchool />
                      </PageTransition>
                    </main>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/transaction-status" 
                element={
                  <ProtectedRoute>
                    <Navbar onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <PageTransition>
                        <TransactionStatus />
                      </PageTransition>
                    </main>
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
