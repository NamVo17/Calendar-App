// Directive cho Next.js (không cần thiết trong React thuần)
"use client"

// Import React hooks
import { useEffect } from "react"
// Import Redux hooks
import { useDispatch } from "react-redux"
// Import Redux action
import { fetchUsersAsync } from "@/store/slices/userSlice"

// Custom hook để load dữ liệu ban đầu từ database.json
export const useInitialData = () => {
  const dispatch = useDispatch() // Hook để dispatch Redux actions

  // useEffect chạy một lần khi component mount
  useEffect(() => {
    // Async function để load initial data
    const loadInitialData = async () => {
      try {
        // Kiểm tra xem dữ liệu đã tồn tại trong localStorage chưa
        const savedData = localStorage.getItem("calendar-data")

        if (!savedData) {
          // Nếu chưa có dữ liệu trong localStorage, load từ database.json
          const response = await fetch("/database.json")
          if (response.ok) {
            // Parse JSON data từ response
            const data = await response.json()
            // Lưu vào localStorage để sử dụng cho các lần sau
            localStorage.setItem("calendar-data", JSON.stringify(data))
            console.log("Initial data loaded from database.json")
          }
        }

        // Load users vào Redux store (bất kể có dữ liệu trong localStorage hay không)
        dispatch(fetchUsersAsync())
      } catch (error) {
        // Log error nếu có vấn đề khi load data
        console.error("Error loading initial data:", error)
      }
    }

    // Gọi function load data
    loadInitialData()
  }, [dispatch]) // Dependency array chỉ có dispatch

  // Hook này không return gì cả, chỉ thực hiện side effect
}
