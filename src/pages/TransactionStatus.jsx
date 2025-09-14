import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import StatusPill from '../components/StatusPill'
import { useAuth } from '../contexts/AuthContext'
import { transactionService } from '../services/api'
import toast from 'react-hot-toast'
import ViteLogo from '../assets/vite.svg';

function App() {
  return (
    <div>
      <img src={ViteLogo} alt="Vite Logo" />
    </div>
  );
}

const TransactionStatus = () => {
  const { isAuthenticated } = useAuth()
  const [customOrderId, setCustomOrderId] = useState('')
  const [transactionData, setTransactionData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customOrderId.trim()) {
      toast.error('Please enter a Custom Order ID')
      return
    }

    if (!isAuthenticated) {
      toast.error('Please login to check transactions')
      return
    }

    try {
      setIsLoading(true)
      setHasSearched(true)

      // Fetch transaction status from backend
      const response = await transactionService.getTransactionStatus(customOrderId.trim())
      
      // Backend response may vary: adjust for success/error
      if (response?.success && response?.data) {
        setTransactionData(response.data)
        toast.success('Transaction status retrieved successfully')
      } else {
        setTransactionData(null)
        toast.error('Transaction not found')
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error)
      setTransactionData(null)
      toast.error('Failed to retrieve transaction status')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return CheckCircle
      case 'pending':
        return Clock
      case 'failed':
      case 'error':
        return XCircle
      default:
        return AlertCircle
    }
  }

  return (
    <motion.div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Transaction Status Check
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Enter the Custom Order ID to check the status of a transaction
        </p>
      </div>

      {/* Search Form */}
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Order ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter your order ID"
                value={customOrderId}
                onChange={(e) => setCustomOrderId(e.target.value)}
                className="input pl-12"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Checking Status...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Check Status</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Status Response */}
      {hasSearched && (
        <div className="card p-8">
          {transactionData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {React.createElement(getStatusIcon(transactionData.status), { size: 32, className: 'text-primary-600' })}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Transaction Found
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Custom Order ID: {transactionData.custom_order_id || '-'}
                    </p>
                  </div>
                </div>
                <StatusPill status={transactionData.status} />
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">
                      {transactionData.transaction_id || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      ${transactionData.transaction_amount || transactionData.order_amount || '0.00'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gateway</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{transactionData.gateway || '-'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {transactionData.created_at
                        ? new Date(transactionData.created_at).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Updated At</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {transactionData.updated_at
                        ? new Date(transactionData.updated_at).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">School ID</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{transactionData.school_id || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Gateway Response */}
              {transactionData.gateway_response && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gateway Response</label>
                  <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(transactionData.gateway_response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <XCircle size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Transaction Not Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No transaction found with the provided Custom Order ID
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default TransactionStatus
