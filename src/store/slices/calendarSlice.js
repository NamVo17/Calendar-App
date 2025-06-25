// Import createSlice từ Redux Toolkit (không cần async thunk vì chỉ có sync actions)
import { createSlice } from "@reduxjs/toolkit"

// Định nghĩa initial state cho calendar slice
const initialState = {
  currentView: "week", // View hiện tại: "day", "week", hoặc "month"
  currentDate: new Date(2025, 5, 22), // Ngày hiện tại (June 22, 2025) - tháng 5 = June vì tháng bắt đầu từ 0
  selectedWeekStart: new Date(2025, 5, 22), // Ngày bắt đầu của tuần đang được chọn
  isLoading: false, // Trạng thái loading (hiện tại không sử dụng)
}

// Tạo calendar slice với createSlice
export const calendarSlice = createSlice({
  name: "calendar", // Tên của slice
  initialState, // Initial state đã định nghĩa ở trên
  // Tất cả reducers đều là synchronous
  reducers: {
    // Action để set current view (day/week/month)
    setCurrentView: (state, action) => {
      state.currentView = action.payload // "day", "week", hoặc "month"
    },
    // Action để set current date
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload // Date object
    },
    // Action để set selected week start date
    setSelectedWeekStart: (state, action) => {
      state.selectedWeekStart = action.payload // Date object
    },
    // Action để chuyển về hôm nay
    goToToday: (state) => {
      const today = new Date(2025, 5, 22) // Set về June 22, 2025 (demo date)
      state.currentDate = today
      // Tính toán ngày bắt đầu tuần (Chủ nhật)
      const weekStart = new Date(today)
      const day = weekStart.getDay() // 0 = Chủ nhật, 1 = Thứ 2, ...
      weekStart.setDate(today.getDate() - day) // Trừ đi số ngày để về Chủ nhật
      state.selectedWeekStart = weekStart
    },
    // Action để chuyển về tuần trước
    goToPreviousWeek: (state) => {
      const newStart = new Date(state.selectedWeekStart)
      newStart.setDate(newStart.getDate() - 7) // Trừ 7 ngày
      state.selectedWeekStart = newStart
    },
    // Action để chuyển tới tuần sau
    goToNextWeek: (state) => {
      const newStart = new Date(state.selectedWeekStart)
      newStart.setDate(newStart.getDate() + 7) // Cộng 7 ngày
      state.selectedWeekStart = newStart
    },
    // Action để chuyển về tháng trước
    goToPreviousMonth: (state) => {
      const newDate = new Date(state.currentDate)
      newDate.setMonth(newDate.getMonth() - 1) // Trừ 1 tháng
      state.currentDate = newDate
    },
    // Action để chuyển tới tháng sau
    goToNextMonth: (state) => {
      const newDate = new Date(state.currentDate)
      newDate.setMonth(newDate.getMonth() + 1) // Cộng 1 tháng
      state.currentDate = newDate
    },
  },
})

// Export tất cả action creators
export const {
  setCurrentView,
  setCurrentDate,
  setSelectedWeekStart,
  goToToday,
  goToPreviousWeek,
  goToNextWeek,
  goToPreviousMonth,
  goToNextMonth,
} = calendarSlice.actions
