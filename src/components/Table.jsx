import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import SortableHeader from './SortableHeader'
import StatusPill from './StatusPill'
import { formatCurrency, formatDate } from '../utils/helpers'

const Table = ({ 
  data = [], 
  columns = [], 
  sortConfig, 
  onSort, 
  isLoading = false,
  className = '' 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  }

  const renderCellContent = (column, row) => {
    switch (column.key) {
      case 'status':
        return <StatusPill status={row[column.key]} />
      case 'order_amount':
      case 'transaction_amount':
        const amount = parseFloat(row[column.key]) || 0
        return formatCurrency(amount)
      case 'created_at':
      case 'updated_at':
        return formatDate(row[column.key])
      default:
        return row[column.key] || '-'
    }
  }

  if (isLoading) {
    return (
      <div className={`card overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-3">
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-3 w-20 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-24 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className={`card overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                column.sortable ? (
                  <SortableHeader
                    key={column.key}
                    sortKey={column.key}
                    currentSort={sortConfig}
                    onSort={onSort}
                  >
                    {column.label}
                  </SortableHeader>
                ) : (
                  <th 
                    key={column.key} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
                  >
                    {column.label}
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {data.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  variants={rowVariants}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  whileHover={{ 
                    scale: 1.01,
                    transition: { duration: 0.1 }
                  }}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                      {renderCellContent(column, row)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && !isLoading && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Table



