import { createSlice } from "@reduxjs/toolkit"

const today = new Date();
const initialState = {
  currentView: "week", 
  currentDate: today, 
  selectedWeekStart: (() => {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    return weekStart;
  })(),
  isLoading: false, 
}

// Tạo calendar slice với createSlice
export const calendarSlice = createSlice({
  name: "calendar", 
  initialState, 
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
      const today = new Date(); // <-- ngày thực tế
      state.currentDate = today;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      state.selectedWeekStart = weekStart;
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
