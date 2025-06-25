// Import configureStore từ Redux Toolkit để tạo Redux store
import { configureStore } from "@reduxjs/toolkit"
// Import các slice reducers để quản lý state
import { authSlice } from "./slices/authSlice" // Quản lý authentication state
import { userSlice } from "./slices/userSlice" // Quản lý user data
import { eventSlice } from "./slices/eventSlice" // Quản lý events data
import { calendarSlice } from "./slices/calendarSlice" // Quản lý calendar state

// Tạo và cấu hình Redux store
export const store = configureStore({
  // Định nghĩa root reducer bằng cách combine các slice reducers
  reducer: {
    auth: authSlice.reducer, // State auth sẽ được quản lý bởi authSlice
    user: userSlice.reducer, // State user sẽ được quản lý bởi userSlice
    event: eventSlice.reducer, // State event sẽ được quản lý bởi eventSlice
    calendar: calendarSlice.reducer, // State calendar sẽ được quản lý bởi calendarSlice
  },
  // Cấu hình middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Cấu hình serializableCheck để ignore một số actions và paths
      // vì Date objects không thể serialize được
      serializableCheck: {
        // Ignore các actions này khi check serializable
        ignoredActions: ["calendar/setCurrentDate", "calendar/setSelectedWeekStart"],
        // Ignore các state paths này khi check serializable
        ignoredPaths: ["calendar.currentDate", "calendar.selectedWeekStart"],
      },
    }),
})
