import axios from 'axios'
import { FinancialFormValues } from '../validations/settings'
import { EmailFormValues, PasswordFormValues } from '../validations/settings'

const API_URL = 'https://finguard-backend.onrender.com/api/v1'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export const userService = {
  resetPassword: async (data: PasswordFormValues) => {
    const response = await axios.put(
      `${API_URL}/users/reset-password`,
      data,
      getAuthHeader()
    )
    return response.data
  },

  updateEmail: async (data: EmailFormValues) => {
    const response = await axios.put(
      `${API_URL}/users/update-email`,
      data,
      getAuthHeader()
    )
    return response.data
  },

  getFinancialInfo: async () => {
    const response = await axios.get(
      `${API_URL}/users/financial-info`,
      getAuthHeader()
    )
    return response.data
  },

  updateFinancialInfo: async (data: FinancialFormValues) => {
    const response = await axios.put(
      `${API_URL}/users/financial-info`,
      data,
      getAuthHeader()
    )
    return response.data
  },
  getWishlist: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.wishlist;
  },

  addWishlistItem: async (name: string, price: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/users/wishlist/items`,
      { name, price },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  removeWishlistItem: async (itemName: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/users/wishlist/items/${encodeURIComponent(itemName)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
}