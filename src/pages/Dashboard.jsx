import React, { useState, useEffect } from 'react'
import { DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react'
import KPICard from '../components/KPICard'
import Table from '../components/Table'
import { StaggeredContainer, StaggeredItem, FadeInUp } from '../components/PageTransition'
import { dashboardService, transactionService } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    totalPayments: { value: '$0', change: '0%', changeType: 'neutral' },
    pendingPayments: { value: '$0', change: '0%', changeType: 'neutral' },
    overduePayments: { value: '$0', change: '0%', changeType: 'neutral' },
    successRate: { value: '0%', change: '0%', changeType: 'neutral' }
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch dashboard stats and recent transactions in parallel
      const [statsResponse, recentTransactionsResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentTransactions(5)
      ])
      
      // Set KPIs from backend stats
      if (statsResponse.success) {
        const stats = statsResponse.data
        setKpis({
          totalPayments: { 
            value: `₹${(stats.totalPayments || 0).toLocaleString()}`, 
            change: stats.totalPaymentsChange || '+0%', 
            changeType: stats.totalPaymentsChange?.startsWith('+') ? 'positive' : 'negative'
          },
          pendingPayments: { 
            value: `₹${(stats.pendingPayments || 0).toLocaleString()}`, 
            change: stats.pendingPaymentsChange || '+0%', 
            changeType: stats.pendingPaymentsChange?.startsWith('+') ? 'negative' : 'positive'
          },
          overduePayments: { 
            value: `₹${(stats.failedPayments || 0).toLocaleString()}`, 
            change: stats.overduePaymentsChange || '+0%', 
            changeType: stats.overduePaymentsChange?.startsWith('+') ? 'negative' : 'positive'
          },
          successRate: { 
            value: `${stats.successRate?.toFixed(1) || '0'}%`, 
            change: stats.successRateChange || '+0%', 
            changeType: stats.successRateChange?.startsWith('+') ? 'positive' : 'negative'
          }
        })
      }
      
      // Set recent transactions
      if (recentTransactionsResponse.success) {
        setRecentTransactions(recentTransactionsResponse.data || [])
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
      
      // Fallback to mock data if backend is not available
      setKpis({
        totalPayments: { value: '₹0', change: '0%', changeType: 'neutral' },
        pendingPayments: { value: '₹0', change: '0%', changeType: 'neutral' },
        overduePayments: { value: '₹0', change: '0%', changeType: 'neutral' },
        successRate: { value: '0%', change: '0%', changeType: 'neutral' }
      })
      setRecentTransactions([])
    } finally {
      setIsLoading(false)
    }
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

  return (
    <StaggeredContainer className="space-y-8">
      {/* Header */}
      <StaggeredItem>
        <FadeInUp>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of your school payment transactions
          </p>
        </FadeInUp>
      </StaggeredItem>

      {/* KPI Cards */}
      <StaggeredItem>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Payments"
            value={kpis.totalPayments.value}
            change={kpis.totalPayments.change}
            changeType={kpis.totalPayments.changeType}
            icon={DollarSign}
            iconColor="text-primary-600"
          />
          <KPICard
            title="Pending Payments"
            value={kpis.pendingPayments.value}
            change={kpis.pendingPayments.change}
            changeType={kpis.pendingPayments.changeType}
            icon={Clock}
            iconColor="text-warning-600"
          />
          <KPICard
            title="Overdue Payments"
            value={kpis.overduePayments.value}
            change={kpis.overduePayments.change}
            changeType={kpis.overduePayments.changeType}
            icon={AlertTriangle}
            iconColor="text-error-600"
          />
          <KPICard
            title="Success Rate"
            value={kpis.successRate.value}
            change={kpis.successRate.change}
            changeType={kpis.successRate.changeType}
            icon={TrendingUp}
            iconColor="text-success-600"
          />
        </div>
      </StaggeredItem>

      {/* Recent Transactions */}
      <StaggeredItem>
        <FadeInUp delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Transactions
            </h2>
          </div>
          
          <Table
            data={recentTransactions}
            columns={tableColumns}
            isLoading={isLoading}
          />
        </FadeInUp>
      </StaggeredItem>
    </StaggeredContainer>
  )
}

export default Dashboard


