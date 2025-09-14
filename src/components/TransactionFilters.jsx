import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { debounce } from '../utils/helpers'

const TransactionFilters = ({ 
  filters, 
  onFiltersChange, 
  schools = [],
  isLoading = false 
}) => {
  const [localSearch, setLocalSearch] = React.useState(filters.search || '')

  // Debounced search
  const debouncedSearch = React.useCallback(
    debounce((value) => {
      onFiltersChange({ ...filters, search: value, page: 1 })
    }, 500),
    [filters, onFiltersChange]
  )

  const handleSearchChange = (e) => {
    const value = e.target.value
    setLocalSearch(value)
    debouncedSearch(value)
  }

  const handleStatusChange = (status) => {
    const currentStatuses = filters.status || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    
    onFiltersChange({ ...filters, status: newStatuses, page: 1 })
  }

  const handleSchoolChange = (schoolId) => {
    const currentSchools = filters.school_id || []
    const newSchools = currentSchools.includes(schoolId)
      ? currentSchools.filter(id => id !== schoolId)
      : [...currentSchools, schoolId]
    
    onFiltersChange({ ...filters, school_id: newSchools, page: 1 })
  }

  const handleDateChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value, page: 1 })
  }

  const clearFilters = () => {
    setLocalSearch('')
    onFiltersChange({
      search: '',
      status: [],
      school_id: [],
      start_date: '',
      end_date: '',
      page: 1
    })
  }

  const hasActiveFilters = 
    filters.search || 
    (filters.status && filters.status.length > 0) ||
    (filters.school_id && filters.school_id.length > 0) ||
    filters.start_date ||
    filters.end_date

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Filter size={20} className="mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center"
          >
            <X size={16} className="mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by ID or amount..."
              value={localSearch}
              onChange={handleSearchChange}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <div className="space-y-2">
            {['Success', 'Pending', 'Failed'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status) || false}
                  onChange={() => handleStatusChange(status)}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* School Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Schools
          </label>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {schools.map((school) => (
              <label key={school.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.school_id?.includes(school.id) || false}
                  onChange={() => handleSchoolChange(school.id)}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {school.name || `School ${school.id}`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              placeholder="Start date"
              value={filters.start_date || ''}
              onChange={(e) => handleDateChange('start_date', e.target.value)}
              className="input"
            />
            <input
              type="date"
              placeholder="End date"
              value={filters.end_date || ''}
              onChange={(e) => handleDateChange('end_date', e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      )}
    </div>
  )
}

export default TransactionFilters



