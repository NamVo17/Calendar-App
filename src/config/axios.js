// Import axios library để tạo HTTP client
import axios from "axios"
// Import environment configuration
import { ENV } from "./env"

// Tạo axios instance với cấu hình mặc định
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL, // Base URL cho tất cả requests
  timeout: 10000, // Timeout 10 giây
  headers: {
    "Content-Type": "application/json", // Default content type
  },
})

// Request interceptor - chạy trước mỗi request
apiClient.interceptors.request.use(
  (config) => {
    // Lấy auth token từ localStorage
    const token = localStorage.getItem("auth-token")
    if (token) {
      // Nếu có token, thêm vào Authorization header
      config.headers.Authorization = `Bearer ${token}`
    }
    return config // Return config để request tiếp tục
  },
  (error) => {
    // Nếu có lỗi trong request interceptor
    return Promise.reject(error)
  },
)

// Response interceptor - chạy sau mỗi response
apiClient.interceptors.response.use(
  (response) => response, // Nếu response thành công, return response
  (error) => {
    // Nếu response có lỗi
    if (error.response?.status === 401) {
      // Nếu status code là 401 (Unauthorized)
      // Xóa token và user data khỏi localStorage
      localStorage.removeItem("auth-token")
      localStorage.removeItem("current-user")
      // Redirect về login page
      window.location.href = "/login"
    }
    return Promise.reject(error) // Reject promise để caller có thể handle error
  },
)
