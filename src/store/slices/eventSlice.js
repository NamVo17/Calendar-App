import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { eventService } from "@/services/eventService"

const initialState = {
  events: [], 
  selectedEvent: null, 
  isLoading: false, 
  error: null, 
}

export const fetchEventsAsync = createAsyncThunk(
  "event/fetchEvents", 
  async (userId, { rejectWithValue }) => {
    try {
      return await eventService.getEvents(userId)
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch events")
    }
  },
)

export const createEventAsync = createAsyncThunk(
  "event/createEvent", 
  async (eventData, { rejectWithValue }) => {
    try {
      return await eventService.createEvent(eventData)
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create event")
    }
  },
)

export const updateEventAsync = createAsyncThunk(
  "event/updateEvent", 
  async (eventData, { rejectWithValue }) => {
    try {
      return await eventService.updateEvent(eventData)
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update event")
    }
  },
)

export const deleteEventAsync = createAsyncThunk(
  "event/deleteEvent", 
  async (eventId, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(eventId)
      return eventId
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete event")
    }
  },
)

export const eventSlice = createSlice({
  name: "event", 
  initialState, 
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

export const { setSelectedEvent, clearError } = eventSlice.actions
