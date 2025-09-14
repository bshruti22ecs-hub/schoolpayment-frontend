import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      validateToken()
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateToken = async () => {
    try {
      const response = await api.get('/auth/profile')
      setUser(response.data)
    } catch {
      localStorage.removeItem('authToken')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const data = response.data

      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`

        // Fetch profile after login
        const profile = await api.get('/auth/profile')
        setUser(profile.data)
        return { success: true }
      }

      return { success: false, error: 'Unexpected login response' }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      return { success: false, error: msg }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const data = response.data

      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`

        // Fetch profile after signup
        const profile = await api.get('/auth/profile')
        setUser(profile.data)
      }

      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account'
      return { success: false, error: msg }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}
