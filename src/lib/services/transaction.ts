import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export interface Transaction {
  _id: string
  description: string
  amount: number
  transaction_date: string
  category_id: string
  user_id: string
  created_at: string
  updated_at: string
}

interface TransactionCreate {
  description: string
  amount: number
  transaction_date: string
  category_id: string
}

interface TransactionUpdate {
  description?: string
  amount?: number
  transaction_date?: string
  category_id?: string
}

export const transactionService = {
  getTransactions: async (params?: {
    category_id?: string
    start_date?: Date
    end_date?: Date
    sort_by?: string
    order?: 'asc' | 'desc'
  }) => {
    const response = await axios.get(
      `${API_URL}/transactions`,
      {
        ...getAuthHeader(),
        params
      }
    )
    return response.data as Transaction[]
  },

  createTransaction: async (data: TransactionCreate) => {
    const response = await axios.post(
      `${API_URL}/transactions`,
      data,
      getAuthHeader()
    )
    return response.data
  },

  updateTransaction: async (id: string, data: TransactionUpdate) => {
    const response = await axios.put(
      `${API_URL}/transactions/${id}`,
      data,
      getAuthHeader()
    )
    return response.data
  },

  deleteTransaction: async (id: string) => {
    const response = await axios.delete(
      `${API_URL}/transactions/${id}`,
      getAuthHeader()
    )
    return response.data
  }
}