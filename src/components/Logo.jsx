import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

const Logo = ({ size = 'default', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const textSizes = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-lg'
  }

  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Logo Icon */}
      <motion.div
        className={`${sizeClasses[size]} bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shadow-sm border border-blue-200 dark:border-blue-800`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <BookOpen 
          size={size === 'small' ? 16 : size === 'large' ? 28 : 20} 
          className="text-blue-600 dark:text-blue-400" 
        />
      </motion.div>
      
      {/* Logo Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <span className={`font-bold text-gray-900 dark:text-gray-100 ${textSizes[size]}`}>
            SchoolPay
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Logo

