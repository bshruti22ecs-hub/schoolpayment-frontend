import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  iconColor = 'text-primary-600',
  className = '' 
}) => {
  const getChangeConfig = (type) => {
    switch (type) {
      case 'positive':
        return {
          icon: TrendingUp,
          color: 'text-success-600',
          bgColor: 'bg-success-50 dark:bg-success-900/20'
        }
      case 'negative':
        return {
          icon: TrendingDown,
          color: 'text-error-600',
          bgColor: 'bg-error-50 dark:bg-error-900/20'
        }
      default:
        return {
          icon: Minus,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-800'
        }
    }
  }

  const changeConfig = getChangeConfig(changeType)
  const ChangeIcon = changeConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeInOut' }
      }}
      className={`
        card p-6 cursor-pointer group
        hover:shadow-lg hover:shadow-primary-500/10
        transition-all duration-200 ease-in-out
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <motion.p 
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {value}
          </motion.p>
          {change && (
            <motion.div 
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${changeConfig.bgColor}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ChangeIcon size={12} className={`mr-1 ${changeConfig.color}`} />
              <span className={changeConfig.color}>{change}</span>
            </motion.div>
          )}
        </div>
        {Icon && (
          <motion.div 
            className={`p-3 rounded-lg ${iconColor} bg-primary-50 dark:bg-primary-900/20`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 200 }}
            whileHover={{ rotate: 5 }}
          >
            <Icon size={24} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default KPICard



