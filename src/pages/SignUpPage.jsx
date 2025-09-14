import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, School, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'
import toast from 'react-hot-toast'

const SignUpPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    schoolName: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.schoolName) newErrors.schoolName = 'School name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        schoolName: formData.schoolName
      })

      if (result.access_token) {
        toast.success('Account created successfully!')
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      } else {
        toast.error(result.error || 'Failed to create account')
      }
    } catch (error) {
      toast.error(
        (error && error.response && error.response.data && error.response.data.message)
        || error.message
        || 'Failed to create account'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="large" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join SchoolPay to manage your school payments</p>
        </div>

        <div className="card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`input pl-10 ${errors.firstName ? 'border-error-500 focus:ring-error-500' : ''}`} placeholder="John" />
                </div>
                {errors.firstName && <p className="mt-1 text-sm text-error-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`input pl-10 ${errors.lastName ? 'border-error-500 focus:ring-error-500' : ''}`} placeholder="Doe" />
                </div>
                {errors.lastName && <p className="mt-1 text-sm text-error-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Name</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" name="schoolName" value={formData.schoolName} onChange={handleInputChange} className={`input pl-10 ${errors.schoolName ? 'border-error-500 focus:ring-error-500' : ''}`} placeholder="ABC High School" />
              </div>
              {errors.schoolName && <p className="mt-1 text-sm text-error-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.schoolName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`input pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`} placeholder="john@example.com" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-error-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className={`input pl-10 pr-10 ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`} placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-error-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`input pl-10 ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500' : ''}`} placeholder="Confirm your password" />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-error-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn btn-primary flex items-center justify-center space-x-2">
              {isLoading ? <span>Creating Account...</span> : <span>Create Account</span>}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Already have an account? <Link to="/signin" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">Sign in</Link></p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUpPage
