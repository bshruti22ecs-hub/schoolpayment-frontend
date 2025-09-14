// Utility functions for the application

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format date for input
export const formatDateForInput = (dateString) => {
  return new Date(dateString).toISOString().split('T')[0]
}

// Get status badge class
export const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
      return 'status-badge status-success'
    case 'pending':
      return 'status-badge status-pending'
    case 'failed':
    case 'error':
      return 'status-badge status-failed'
    default:
      return 'status-badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Parse URL parameters
export const parseUrlParams = (searchParams) => {
  const params = {}
  for (const [key, value] of searchParams.entries()) {
    if (value === 'true') params[key] = true
    else if (value === 'false') params[key] = false
    else if (!isNaN(value) && value !== '') params[key] = Number(value)
    else if (value !== '') params[key] = value
  }
  return params
}

// Build URL parameters
export const buildUrlParams = (params) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item))
      } else {
        searchParams.set(key, value)
      }
    }
  })
  return searchParams.toString()
}

// Generate pagination array
export const generatePagination = (currentPage, totalPages, maxVisible = 5) => {
  const pages = []
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}



