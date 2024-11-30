import axios from 'axios'
import { LoginInput, SignupInput } from '../validations/auth'

const API_URL = 'https://finguard-backend.onrender.com/api/v1'


const setToken = (token: string) => {
  document.cookie = `token=${token}; path=/`
  localStorage.setItem('token', token)
}

const removeToken = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  localStorage.removeItem('token')
}

export const authService = {
  login: async (data: LoginInput) => {
    console.log("AuthService: Attempting login with:", data)
    const response = await axios.post(`${API_URL}/auth/login`, data)
    console.log("AuthService: Login response:", response.data)
    setToken(response.data.access_token)
    return response.data
  },

  signup: async (data: SignupInput) => {
    const response = await axios.post(`${API_URL}/auth/signup`, data)
    setToken(response.data.access_token)
    return response.data
  },

  me: async () => {
    const token = localStorage.getItem('token')
    if (!token) return null

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  logout: () => {
    removeToken()
  },
  // New 2FA methods
  enable2FA: async () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const response = await axios.post<{ secret: string; qr_code: string }>(
      `${API_URL}/auth/enable-2fa`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return response.data
  },

  verify2FA: async (otp_code: string) => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const response = await axios.post(
      `${API_URL}/auth/verify-2fa`,
      { otp_code },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return response.data
  },

  getOtpStatus: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/otp-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  verifyLoginOTP: async (email: string, password: string, otp_code: string) => {
    const response = await axios.post(`${API_URL}/auth/verify-login-otp`, {
      email,
      password,
      otp_code
    })
    localStorage.setItem('token', response.data.access_token)
    return response.data
  },

  disable2FA: async (otp_code: string) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    const response = await axios.post(
      `${API_URL}/auth/disable-2fa`,
      { otp_code },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  }
}