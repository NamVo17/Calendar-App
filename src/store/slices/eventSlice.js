// Import createSlice và createAsyncThunk từ Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// Import eventService để gọi API event-related
import { eventService } from "@/services/eventService"

// Định nghĩa initial state cho event slice
const initialState = {
  events: [], // Danh sách events của user hiện tại
  selectedEvent: null, // Event đang được chọn để xem chi tiết
  isLoading: false, // Trạng thái loading
  error: null, // Error message nếu có lỗi
}

// Async thunk để fetch events của một user
export const fetchEventsAsync = createAsyncThunk(
  "event/fetchEvents", // Action type prefix
  async (userId, { rejectWithValue }) => {
    // userId: ID của user cần lấy events
    try {
      // Gọi eventService để lấy events của user
      return await eventService.getEvents(userId)
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Failed to fetch events")
    }
  },
)

// Async thunk để tạo event mới
export const createEventAsync = createAsyncThunk(
  "event/createEvent", // Action type prefix
  async (eventData, { rejectWithValue }) => {
    // eventData: thông tin event mới
    try {
      // Gọi eventService để tạo event mới
      return await eventService.createEvent(eventData)
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Failed to create event")
    }
  },
)

// Async thunk để update event
export const updateEventAsync = createAsyncThunk(
  "event/updateEvent", // Action type prefix
  async (eventData, { rejectWithValue }) => {
    // eventData: thông tin event cần update
    try {
      // Gọi eventService để update event
      return await eventService.updateEvent(eventData)
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Failed to update event")
    }
  },
)

// Async thunk để xóa event
export const deleteEventAsync = createAsyncThunk(
  "event/deleteEvent", // Action type prefix
  async (eventId, { rejectWithValue }) => {
    // eventId: ID của event cần xóa
    try {
      // Gọi eventService để xóa event
      await eventService.deleteEvent(eventId)
      // Return eventId để remove khỏi state
      return eventId
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Failed to delete event")
    }
  },
)

// Tạo event slice với createSlice
export const eventSlice = createSlice({
  name: "event", // Tên của slice
  initialState, // Initial state đã định nghĩa ở trên
  // Synchronous reducers
  reducers: {
    // Action để set selected event (event đang được chọn)
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload // Event object hoặc null
    },
    // Action để clear error message
    clearError: (state) => {
      state.error = null
    },
  },
  // Extra reducers để handle async thunks
  extraReducers: (builder) => {
    builder
      // Handle fetch events async thunk
      .addCase(fetchEventsAsync.pending, (state) => {
        // Khi đang fetch events
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEventsAsync.fulfilled, (state, action) => {
        // Khi fetch events thành công
        state.isLoading = false
        state.events = action.payload // Danh sách events từ API
      })
      .addCase(fetchEventsAsync.rejected, (state, action) => {
        // Khi fetch events thất bại
        state.isLoading = false
        state.error = action.payload // Error message
      })
      // Handle create event async thunk
      .addCase(createEventAsync.fulfilled, (state, action) => {
        // Khi tạo event thành công, thêm vào danh sách events
        state.events.push(action.payload)
      })
      // Handle update event async thunk
      .addCase(updateEventAsync.fulfilled, (state, action) => {
        // Khi update event thành công
        // Tìm index của event trong danh sách
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index !== -1) {
          // Nếu tìm thấy, update event trong danh sách
          state.events[index] = action.payload
        }
      })
      // Handle delete event async thunk
      .addCase(deleteEventAsync.fulfilled, (state, action) => {
        // Khi xóa event thành công
        // Lọc bỏ event đã xóa khỏi danh sách
        state.events = state.events.filter((event) => event.id !== action.payload)
        // Nếu event đã xóa là selected event, clear selection
        if (state.selectedEvent?.id === action.payload) {
          state.selectedEvent = null
        }
      })
  },
})

// Export các action creators
export const { setSelectedEvent, clearError } = eventSlice.actions
