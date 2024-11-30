import axios from 'axios'

const API_URL = 'https://finguard-backend.onrender.com/api/v1'

export interface CategoryExpense {
  category_id: string
  amount: number
}

export interface Analytics {
  id: string
  user_id: string
  category_expenses: Record<string, number>
  total_expenses: number
  budget_vs_actual: {
    category: string
    budget: number
    actual: number
  }[]
  alerts: Array<{
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    timestamp?: string
  }>
}

export interface AnalyticsResponse {
  analytics: Analytics
}


const getAuthHeader = () => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
}

export const analyticsService = {
  getAnalytics: async (): Promise<Analytics> => {
    const response = await axios.get<AnalyticsResponse>(
      `${API_URL}/analytics`,
      getAuthHeader()
    )
    return response.data.analytics
  },

  getBudgetVsActual: async () => {
    const response = await axios.get(
      `${API_URL}/analytics/budget-vs-actual`,
      getAuthHeader()
    )
    return response.data
  },

  getNotifications: async () => {
    const response = await axios.get(
      `${API_URL}/notifications`,
      getAuthHeader()
    )
    return response.data.alerts
  }
}