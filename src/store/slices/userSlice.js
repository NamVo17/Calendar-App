// Import createSlice và createAsyncThunk từ Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// Import userService để gọi API user-related
import { userService } from "@/services/userService"

// Định nghĩa initial state cho user slice
const initialState = {
  // Lấy current user từ localStorage nếu có, nếu không thì null
  currentUser: JSON.parse(localStorage.getItem("current-user") || "null"),
  users: [], // Danh sách tất cả users
  isLoading: false, // Trạng thái loading
  error: null, // Error message nếu có lỗi
}

// Async thunk để fetch danh sách users
export const fetchUsersAsync = createAsyncThunk(
  "user/fetchUsers", // Action type prefix
  async (_, { rejectWithValue }) => {
    // Không cần parameters
    try {
      // Gọi userService để lấy danh sách users
      return await userService.getUsers()
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Failed to fetch users")
    }
  },
)

// Async thunk để tạo user mới
export const createUserAsync = createAsyncThunk(
  "user/createUser", // Action type prefix
  async (userData, { rejectWithValue }) => {
    // userData: thông tin user mới
    try {
      // Gọi userService để tạo user mới
      return await userService.createUser(userData)
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Failed to create user")
    }
  },
)

// Async thunk để update user
export const updateUserAsync = createAsyncThunk(
  "user/updateUser", // Action type prefix
  async (userData, { rejectWithValue }) => {
    // userData: thông tin user cần update
    try {
      // Gọi userService để update user
      return await userService.updateUser(userData)
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Failed to update user")
    }
  },
)

// Tạo user slice với createSlice
export const userSlice = createSlice({
  name: "user", // Tên của slice
  initialState, // Initial state đã định nghĩa ở trên
  // Synchronous reducers
  reducers: {
    // Action để set current user
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload // User object hoặc null
      if (action.payload) {
        // Nếu có user, lưu vào localStorage
        localStorage.setItem("current-user", JSON.stringify(action.payload))
      } else {
        // Nếu null, xóa khỏi localStorage
        localStorage.removeItem("current-user")
      }
    },
    // Action để clear error message
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

// Export các action creators
export const { setCurrentUser, clearError } = userSlice.actions
