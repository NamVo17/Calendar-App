// Import useSelector để đọc state từ Redux store
// Import useDispatch để dispatch actions
import { useSelector, useDispatch } from "react-redux"
// Import tất cả calendar actions từ calendarSlice
import {
  setCurrentView,
  setCurrentDate,
  setSelectedWeekStart,
  goToToday,
  goToPreviousWeek,
  goToNextWeek,
  goToPreviousMonth,
  goToNextMonth,
} from "@/store/slices/calendarSlice"

// Custom hook để quản lý calendar logic
export const useCalendar = () => {
  const dispatch = useDispatch() // Hook để dispatch actions

  // Lấy calendar state từ Redux store
  const { currentView, currentDate, selectedWeekStart, isLoading } = useSelector((state) => state.calendar)

  // Wrapper function để dispatch setCurrentView action
  const handleSetCurrentView = (view) => {
    dispatch(setCurrentView(view)) // view: "day", "week", hoặc "month"
  }

  // Wrapper function để dispatch setCurrentDate action
  const handleSetCurrentDate = (date) => {
    dispatch(setCurrentDate(date)) // date: Date object
  }

  // Wrapper function để dispatch setSelectedWeekStart action
  const handleSetSelectedWeekStart = (date) => {
    dispatch(setSelectedWeekStart(date)) // date: Date object
  }

  // Wrapper function để dispatch goToToday action
  const handleGoToToday = () => {
    dispatch(goToToday())
  }

  // Wrapper function để dispatch goToPreviousWeek action
  const handleGoToPreviousWeek = () => {
    dispatch(goToPreviousWeek())
  }

  // Wrapper function để dispatch goToNextWeek action
  const handleGoToNextWeek = () => {
    dispatch(goToNextWeek())
  }

  // Wrapper function để dispatch goToPreviousMonth action
  const handleGoToPreviousMonth = () => {
    dispatch(goToPreviousMonth())
  }

  // Wrapper function để dispatch goToNextMonth action
  const handleGoToNextMonth = () => {
    dispatch(goToNextMonth())
  }

  // Return tất cả state values và action handlers
  return {
    // State values
    currentView, // String: view hiện tại
    currentDate, // Date: ngày hiện tại
    selectedWeekStart, // Date: ngày bắt đầu tuần được chọn
    isLoading, // Boolean: trạng thái loading

    // Action handlers
    setCurrentView: handleSetCurrentView,
    setCurrentDate: handleSetCurrentDate,
    setSelectedWeekStart: handleSetSelectedWeekStart,
    goToToday: handleGoToToday,
    goToPreviousWeek: handleGoToPreviousWeek,
    goToNextWeek: handleGoToNextWeek,
    goToPreviousMonth: handleGoToPreviousMonth,
    goToNextMonth: handleGoToNextMonth,
  }
}
