import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, School } from 'lucide-react'
import Table from '../components/Table'
import Pagination from '../components/Pagination'
import { transactionService, schoolService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const TransactionsBySchool = () => {
  const { isAuthenticated } = useAuth()
  const [selectedSchool, setSelectedSchool] = useState('')
  const [schools, setSchools] = useState([])
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 25

  useEffect(() => {
    if (isAuthenticated) fetchSchools()
  }, [isAuthenticated])

  useEffect(() => {
    if (selectedSchool && isAuthenticated) fetchTransactionsBySchool()
  }, [selectedSchool, currentPage, searchTerm, isAuthenticated])

  const fetchSchools = async () => {
    try {
      console.log('Fetching schools in TransactionsBySchool...')
      const response = await schoolService.getSchools()
      console.log('Schools response in TransactionsBySchool:', response)
      if (response.success) {
        setSchools(response.data || [])
        console.log('Schools set in TransactionsBySchool:', response.data)
      } else {
        console.error('Error fetching schools:', response.message)
        toast.error('Failed to load schools')
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
      toast.error('Failed to load schools')
    }
  }

  const fetchTransactionsBySchool = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching transactions for school:', selectedSchool)
      const response = await transactionService.getTransactionsBySchool(selectedSchool, {
        page: currentPage,
        limit: itemsPerPage,
        sort: 'created_at',
        order: 'desc',
        ...(searchTerm && { search: searchTerm })
      })
      console.log('Transactions response:', response)
      if (response.success) {
        setTransactions(response.data || [])
        setTotalItems(response.total || 0)
        setTotalPages(response.totalPages || 0)
        console.log('Transactions set:', response.data)
      } else {
        console.error('Error fetching transactions:', response.message)
        toast.error('Failed to load transactions')
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to load transactions')
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSchoolSelect = (schoolId) => {
    setSelectedSchool(schoolId)
    setCurrentPage(1)
    setIsDropdownOpen(false)
  }

  const handlePageChange = (page) => setCurrentPage(page)
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const filteredSchools = schools.filter(school =>
    school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.id?.toString().includes(searchTerm)
  )

  const selectedSchoolData = schools.find(school => school.id === selectedSchool)

  const tableColumns = [
    { key: 'collect_id', label: 'Collect ID', sortable: true },
    { key: 'gateway', label: 'Gateway', sortable: true },
    { key: 'order_amount', label: 'Order Amount', sortable: true },
    { key: 'transaction_amount', label: 'Transaction Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'custom_order_id', label: 'Custom Order ID', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true },
  ]

  return (
    <motion.div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Transactions by School
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        View transactions for a specific school
      </p>

      {/* School Selection */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <School size={24} className="text-primary-600" />
          <div className="flex-1 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <span>
                {selectedSchoolData ? selectedSchoolData.name || `School ${selectedSchoolData.id}` : 'Choose a school...'}
              </span>
              <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search schools..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  {filteredSchools.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => handleSchoolSelect(school.id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">{school.name || `School ${school.id}`}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {school.id}</div>
                    </button>
                  ))}
                  {filteredSchools.length === 0 && (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">No schools found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {selectedSchool && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Transactions for {selectedSchoolData?.name || `School ${selectedSchool}`}
          </h2>
          <Table data={transactions} columns={tableColumns} isLoading={isLoading} />
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={totalItems} itemsPerPage={itemsPerPage} />
          )}
        </div>
      )}

      {!selectedSchool && (
        <div className="text-center py-12">
          <School size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a School</h3>
          <p className="text-gray-600 dark:text-gray-400">Choose a school from the dropdown above to view its transactions</p>
        </div>
      )}
    </motion.div>
  )
}

export default TransactionsBySchool
