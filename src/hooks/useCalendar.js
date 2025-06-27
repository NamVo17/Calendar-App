import { useSelector, useDispatch } from "react-redux"
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

export const useCalendar = () => {
  const dispatch = useDispatch() 

  const { currentView, currentDate, selectedWeekStart, isLoading } = useSelector((state) => state.calendar)

  const handleSetCurrentView = (view) => {
    dispatch(setCurrentView(view)) 
  }

  const handleSetCurrentDate = (date) => {
    dispatch(setCurrentDate(date)) // date: Date object
  }

  const handleSetSelectedWeekStart = (date) => {
    dispatch(setSelectedWeekStart(date)) // date: Date object
  }

  const handleGoToToday = () => {
    dispatch(goToToday())
  }

  const handleGoToPreviousWeek = () => {
    dispatch(goToPreviousWeek())
  }

  const handleGoToNextWeek = () => {
    dispatch(goToNextWeek())
  }

  const handleGoToPreviousMonth = () => {
    dispatch(goToPreviousMonth())
  }

  const handleGoToNextMonth = () => {
    dispatch(goToNextMonth())
  }

  return {
    currentView, 
    currentDate, 
    selectedWeekStart, 
    isLoading, 

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
