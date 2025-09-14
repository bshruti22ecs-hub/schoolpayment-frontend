import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

const StatusPill = ({ status, className = '' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return {
          icon: CheckCircle,
          bgColor: 'bg-success-100 dark:bg-success-900/30',
          textColor: 'text-success-800 dark:text-success-200',
          borderColor: 'border-success-200 dark:border-success-700',
          iconColor: 'text-success-600 dark:text-success-400'
        }
      case 'pending':
        return {
          icon: Clock,
          bgColor: 'bg-warning-100 dark:bg-warning-900/30',
          textColor: 'text-warning-800 dark:text-warning-200',
          borderColor: 'border-warning-200 dark:border-warning-700',
          iconColor: 'text-warning-600 dark:text-warning-400'
        }
      case 'failed':
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-error-100 dark:bg-error-900/30',
          textColor: 'text-error-800 dark:text-error-200',
          borderColor: 'border-error-200 dark:border-error-700',
          iconColor: 'text-error-600 dark:text-error-400'
        }
      default:
        return {
          icon: AlertCircle,
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200',
          borderColor: 'border-gray-200 dark:border-gray-700',
          iconColor: 'text-gray-600 dark:text-gray-400'
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        transition-all duration-200 ease-in-out
        ${className}
      `}
    >
      <Icon 
        size={12} 
        className={`mr-1 ${config.iconColor}`}
      />
      {status}
    </motion.span>
  )
}

export default StatusPill



