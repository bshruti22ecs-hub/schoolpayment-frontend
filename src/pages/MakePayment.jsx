import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, School, User, DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { schoolService, transactionService } from '../services/api'
import toast from 'react-hot-toast'

const MakePayment = () => {
  const [formData, setFormData] = useState({
    schoolId: '',
    studentName: '',
    studentId: '',
    studentEmail: '',
    amount: '',
    description: '',
    paymentMethod: 'upi'
  })
  const [schools, setSchools] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      console.log('Fetching schools...')
      const response = await schoolService.getSchools()
      console.log('Schools response:', response)
      if (response.success) {
        setSchools(response.data || [])
        console.log('Schools set:', response.data)
      } else {
        console.error('Error fetching schools:', response.message)
        toast.error('Failed to load schools')
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
      toast.error('Failed to load schools')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.schoolId) newErrors.schoolId = 'Please select a school'
    if (!formData.studentName) newErrors.studentName = 'Student name is required'
    if (!formData.studentId) newErrors.studentId = 'Student ID is required'
    if (!formData.studentEmail) newErrors.studentEmail = 'Student email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) newErrors.studentEmail = 'Email is invalid'
    if (!formData.amount) newErrors.amount = 'Amount is required'
    else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) newErrors.amount = 'Please enter a valid amount'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await transactionService.createTransaction(formData)
      
      if (response.success) {
        toast.success(`Payment initiated successfully! Order ID: ${response.data.customOrderId}`)
        
        // Reset form
        setFormData({
          schoolId: '',
          studentName: '',
          studentId: '',
          studentEmail: '',
          amount: '',
          description: '',
          paymentMethod: 'upi'
        })
      } else {
        toast.error(response.message || 'Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedSchool = schools.find(school => school.id === formData.schoolId)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Make Payment
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Process school payments securely and efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <CreditCard className="mr-2" size={20} />
            Payment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* School Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                School
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleInputChange}
                  className={`input pl-10 ${errors.schoolId ? 'border-error-500 focus:ring-error-500' : ''}`}
                >
                  <option value="">Select a school</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.schoolId && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" /> {errors.schoolId}
                </p>
              )}
            </div>

            {/* Student Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.studentName ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.studentName && (
                  <p className="mt-1 text-sm text-error-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {errors.studentName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className={`input ${errors.studentId ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="STU001"
                />
                {errors.studentId && (
                  <p className="mt-1 text-sm text-error-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {errors.studentId}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student Email
              </label>
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleInputChange}
                className={`input ${errors.studentEmail ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="john.doe@example.com"
              />
              {errors.studentEmail && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" /> {errors.studentEmail}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`input pl-10 ${errors.amount ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" /> {errors.amount}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input"
                rows={3}
                placeholder="Payment for tuition fees, books, etc."
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="input"
              >
                <option value="upi">UPI</option>
                <option value="card">Credit/Debit Card</option>
                <option value="netbanking">Net Banking</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  <span>Process Payment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Payment Summary */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Payment Summary
          </h2>

          {selectedSchool ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">School Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSchool.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSchool.address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSchool.contact}</p>
              </div>

              {formData.amount && (
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Payment Details</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-semibold text-primary-600">₹{formData.amount}</span>
                  </div>
                  {formData.description && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{formData.description}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Security Features</h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• SSL encrypted transactions</li>
                  <li>• PCI DSS compliant</li>
                  <li>• Real-time fraud detection</li>
                  <li>• Instant payment confirmation</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <School size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a School</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose a school to see payment summary</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MakePayment
