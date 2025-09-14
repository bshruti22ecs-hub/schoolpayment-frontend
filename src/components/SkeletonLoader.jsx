import React from 'react'
import { motion } from 'framer-motion'

const SkeletonLoader = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${height} ${width} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export const TableSkeleton = ({ rows = 5, columns = 7 }) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <SkeletonLoader width="w-20" height="h-3" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <SkeletonLoader width="w-24" height="h-4" />
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

export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <SkeletonLoader width="w-32" height="h-4" />
        <SkeletonLoader width="w-12" height="h-12" className="rounded-lg" />
      </div>
      <SkeletonLoader width="w-20" height="h-8" className="mb-2" />
      <SkeletonLoader width="w-24" height="h-4" />
    </div>
  )
}

export const FilterSkeleton = () => {
  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <SkeletonLoader width="w-20" height="h-6" />
        <SkeletonLoader width="w-16" height="h-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <SkeletonLoader width="w-16" height="h-4" className="mb-2" />
            <SkeletonLoader width="w-full" height="h-10" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonLoader



