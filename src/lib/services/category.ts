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

export interface Category {
  _id: string
  name: string
  description?: string
  user_id: string
  budget: number
  color: string
  icon: string
  created_at: string
  updated_at: string
}

interface CategoryCreate {
  name: string
  description?: string
  budget: number
  color: string
  icon: string
}

interface CategoryUpdate {
  name?: string
  description?: string
  budget?: number
  color?: string
  icon?: string
}

export const categoryService = {
  getCategories: async () => {
    const response = await axios.get(
      `${API_URL}/categories`,
      getAuthHeader()
    )
    return response.data.categories as Category[]
  },

  getCategory: async (id: string) => {
    const response = await axios.get(
      `${API_URL}/categories/${id}`,
      getAuthHeader()
    )
    return response.data as Category
  },

  createCategory: async (data: CategoryCreate) => {
    const response = await axios.post(
      `${API_URL}/categories`,
      data,
      getAuthHeader()
    )
    return response.data
  },

  updateCategory: async (id: string, data: CategoryUpdate) => {
    const response = await axios.put(
      `${API_URL}/categories/${id}`,
      data,
      getAuthHeader()
    )
    return response.data
  },

  deleteCategory: async (id: string) => {
    const response = await axios.delete(
      `${API_URL}/categories/${id}`,
      getAuthHeader()
    )
    return response.data
  }
}