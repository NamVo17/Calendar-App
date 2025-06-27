import axios from "axios"
import { ENV } from "./env"

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL, 
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json", 
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config 
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("current-user")
      window.location.href = "/login"
    }
    return Promise.reject(error) 
  },
)
