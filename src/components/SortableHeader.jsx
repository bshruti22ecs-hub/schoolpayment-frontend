import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

const SortableHeader = ({ 
  children, 
  sortKey, 
  currentSort = {}, // default empty object
  onSort, 
  className = '' 
}) => {
  const isActive = currentSort?.key === sortKey
  const isAsc = isActive && currentSort?.direction === 'asc'
  const isDesc = isActive && currentSort?.direction === 'desc'

  const handleClick = () => {
    if (isActive) {
      // Toggle direction
      onSort(sortKey, isAsc ? 'desc' : 'asc')
    } else {
      // Set new sort key with default direction
      onSort(sortKey, 'asc')
    }
  }

  return (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUp 
            size={12} 
            className={`transition-colors ${isAsc ? 'text-primary-600' : 'text-gray-400'}`} 
          />
          <ChevronDown 
            size={12} 
            className={`transition-colors -mt-1 ${isDesc ? 'text-primary-600' : 'text-gray-400'}`} 
          />
        </div>
      </div>
    </th>
  )
}

export default SortableHeader
