import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { userService } from "@/services/userService"

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("current-user") || "null"),
  users: [], 
  isLoading: false, 
  error: null, 
}

export const fetchUsersAsync = createAsyncThunk(
  "user/fetchUsers", 
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getUsers()
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch users")
    }
  },
)

export const createUserAsync = createAsyncThunk(
  "user/createUser", 
  async (userData, { rejectWithValue }) => {
    try {
      
      return await userService.createUser(userData)
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create user")
    }
  },
)

export const updateUserAsync = createAsyncThunk(
  "user/updateUser", 
  async (userData, { rejectWithValue }) => {
    try {
      return await userService.updateUser(userData)
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update user")
    }
  },
)

export const userSlice = createSlice({
  name: "user", 
  initialState, 
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload // User object hoặc null
      if (action.payload) {
        localStorage.setItem("current-user", JSON.stringify(action.payload))
      } else {
        localStorage.removeItem("current-user")
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  // Extra reducers để handle async thunks
  extraReducers: (builder) => {
    builder
      // Handle fetch users async thunk
      .addCase(fetchUsersAsync.pending, (state) => {
        // Khi đang fetch users
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        // Khi fetch users thành công
        state.isLoading = false
        state.users = action.payload // Danh sách users từ API
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        // Khi fetch users thất bại
        state.isLoading = false
        state.error = action.payload // Error message
      })
      // Handle create user async thunk
      .addCase(createUserAsync.fulfilled, (state, action) => {
        // Khi tạo user thành công, thêm vào danh sách users
        state.users.push(action.payload)
      })
      // Handle update user async thunk
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        // Khi update user thành công
        // Tìm index của user trong danh sách
        const index = state.users.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          // Nếu tìm thấy, update user trong danh sách
          state.users[index] = action.payload
        }
        // Nếu user được update là current user, cập nhật current user
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload
          localStorage.setItem("current-user", JSON.stringify(action.payload))
        }
      })
  },
})

export const { setCurrentUser, clearError } = userSlice.actions
