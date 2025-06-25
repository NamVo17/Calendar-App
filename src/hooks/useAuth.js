// Directive cho Next.js (không cần thiết trong React thuần)
"use client"

// Import useEffect để chạy side effects
import { useEffect } from "react"
// Import useSelector để đọc state từ Redux store
// Import useDispatch để dispatch actions
import { useSelector, useDispatch } from "react-redux"
// Import actions từ các slices
import { setCurrentUser } from "@/store/slices/userSlice"
import { setAuthenticated } from "@/store/slices/authSlice"

// Custom hook để quản lý authentication logic
export const useAuth = () => {
  const dispatch = useDispatch() // Hook để dispatch actions

  // Lấy auth state từ Redux store
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth)
  // Lấy current user từ Redux store
  const { currentUser } = useSelector((state) => state.user)

  // useEffect chạy khi component mount để kiểm tra authentication từ localStorage
  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("auth-token")
    // Lấy saved user data từ localStorage
    const savedUser = localStorage.getItem("current-user")

    // Nếu có cả token và user data
    if (token && savedUser) {
      try {
        // Parse user data từ JSON string
        const user = JSON.parse(savedUser)
        // Dispatch action để set current user vào Redux store
        dispatch(setCurrentUser(user))
        // Dispatch action để set authenticated status
        dispatch(setAuthenticated(true))
      } catch (error) {
        // Nếu có lỗi khi parse JSON, log error và clear localStorage
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("auth-token")
        localStorage.removeItem("current-user")
      }
    }
  }, [dispatch]) // Dependency array chỉ có dispatch

  // Return các values cần thiết cho components sử dụng hook này
  return {
    isAuthenticated, // Boolean: user đã login chưa
    isLoading, // Boolean: đang loading authentication
    error, // String: error message nếu có
    currentUser, // Object: thông tin user hiện tại
  }
}
