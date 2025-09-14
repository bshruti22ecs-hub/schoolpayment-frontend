import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/signin'   // ✅ changed from /login to /signin
    }
    return Promise.reject(error)
  }
)

// Authentication service
export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // ✅ FIXED: Get current user (backend has /auth/profile not /auth/me)
  getCurrentUser: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    return response.data
  }
}

// Transaction service
export const transactionService = {
  // Get all transactions with pagination and filters
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params })
    return response.data
  },

  // Get transactions by school ID
  getTransactionsBySchool: async (schoolId, params = {}) => {
    const response = await api.get(`/transactions/school/${schoolId}`, { params })
    return response.data
  },

  // Get transaction status by custom order ID
  getTransactionStatus: async (customOrderId) => {
    const response = await api.get(`/transactions/status/${customOrderId}`)
    return response.data
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions/create', transactionData)
    return response.data
  },

  // Update transaction
  updateTransaction: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData)
    return response.data
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  }
}

// School service
export const schoolService = {
  // Get all schools
  getSchools: async () => {
    const response = await api.get('/schools')
    return response.data
  },

  // Get school by ID
  getSchool: async (id) => {
    const response = await api.get(`/schools/${id}`)
    return response.data
  },

  // Create school
  createSchool: async (schoolData) => {
    const response = await api.post('/schools', schoolData)
    return response.data
  },

  // Update school
  updateSchool: async (id, schoolData) => {
    const response = await api.put(`/schools/${id}`, schoolData)
    return response.data
  }
}

// Dashboard service
export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  // Get recent transactions
  getRecentTransactions: async (limit = 5) => {
    const response = await api.get(`/dashboard/recent-transactions?limit=${limit}`)
    return response.data
  }
}

export default api
