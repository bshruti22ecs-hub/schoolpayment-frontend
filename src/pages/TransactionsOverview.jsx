import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Table from '../components/Table'
import TransactionFilters from '../components/TransactionFilters'
import Pagination from '../components/Pagination'
import { transactionService, schoolService } from '../services/api'
import { parseUrlParams, buildUrlParams } from '../utils/helpers'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const TransactionsOverview = () => {
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [transactions, setTransactions] = useState([])
  const [schools, setSchools] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // ✅ Default pagination values
  const defaultPage = 1
  const defaultLimit = 10

  const [filters, setFilters] = useState({
    search: '',
    status: [],
    school_id: [],
    start_date: '',
    end_date: '',
    page: defaultPage,
    limit: defaultLimit,
    sort: 'createdAt',
    order: 'desc',
  })

  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })

  // Initialize filters from URL params
  useEffect(() => {
    const urlParams = parseUrlParams(searchParams)
    setFilters(prev => ({ ...prev, ...urlParams }))
    if (urlParams.sort) {
      setSortConfig({ key: urlParams.sort, direction: urlParams.order || 'desc' })
    }
  }, [searchParams])

  // Fetch transactions whenever filters change
  useEffect(() => {
    if (!isAuthenticated) return
    fetchTransactions()
  }, [filters, isAuthenticated])

  // Fetch schools for filters dropdown
  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const queryParams = {
        page: filters.page || defaultPage,
        limit: filters.limit || defaultLimit,
        sort: sortConfig.key,
        order: sortConfig.direction,
        ...(filters.search && { search: filters.search }),
        ...(filters.status?.length > 0 && { status: filters.status }),
        ...(filters.school_id?.length > 0 && { school_id: filters.school_id }),
        ...(filters.start_date && { start_date: filters.start_date }),
        ...(filters.end_date && { end_date: filters.end_date }),
      }

      const response = await transactionService.getTransactions(queryParams)

      if (response.success) {
        setTransactions(response.data || [])
        setTotalItems(response.total || 0)
        setTotalPages(response.totalPages || 0)
      } else {
        setTransactions([])
        setTotalItems(0)
        setTotalPages(0)
        toast.error(response.message || 'Failed to fetch transactions')
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
      setTotalItems(0)
      setTotalPages(0)
      toast.error('Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSchools = async () => {
    try {
      const response = await schoolService.getSchools()
      if (response.success) {
        setSchools(response.data || [])
      } else {
        console.error('Error fetching schools:', response.message)
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })) // reset to page 1
    updateUrlParams({ ...filters, ...newFilters, page: 1 })
  }

  const handleSort = (key, direction) => {
    const newSortConfig = { key, direction }
    setSortConfig(newSortConfig)
    const newFilters = { ...filters, sort: key, order: direction, page: 1 }
    setFilters(newFilters)
    updateUrlParams(newFilters)
  }

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page }
    setFilters(newFilters)
    updateUrlParams(newFilters)
  }

  const updateUrlParams = (newFilters) => {
    const params = buildUrlParams(newFilters)
    setSearchParams(params)
  }

  const tableColumns = [
    { key: 'collect_id', label: 'Collect ID', sortable: true },
    { key: 'school_id', label: 'School ID', sortable: true },
    { key: 'gateway', label: 'Gateway', sortable: true },
    { key: 'order_amount', label: 'Order Amount', sortable: true },
    { key: 'transaction_amount', label: 'Transaction Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'custom_order_id', label: 'Custom Order ID', sortable: true },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transactions Overview</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and monitor all transaction data efficiently
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <TransactionFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          schools={schools}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Results Summary */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing {transactions.length} of {totalItems} transactions
            </p>
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Table
          data={transactions}
          columns={tableColumns}
          sortConfig={sortConfig}
          onSort={handleSort}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants}>
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={filters.limit}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

export default TransactionsOverview
