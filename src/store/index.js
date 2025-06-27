import { configureStore } from "@reduxjs/toolkit"
import { authSlice } from "./slices/authSlice" // Quản lý authentication state
import { userSlice } from "./slices/userSlice" // Quản lý user data
import { eventSlice } from "./slices/eventSlice" // Quản lý events data
import { calendarSlice } from "./slices/calendarSlice" // Quản lý calendar state

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, 
    user: userSlice.reducer, 
    event: eventSlice.reducer, 
    calendar: calendarSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["calendar/setCurrentDate", "calendar/setSelectedWeekStart"],
        ignoredPaths: ["calendar.currentDate", "calendar.selectedWeekStart"],
      },
    }),
})
