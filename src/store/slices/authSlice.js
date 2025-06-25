// Import createSlice và createAsyncThunk từ Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// Import authService để gọi API authentication
import { authService } from "@/services/authService"

// Định nghĩa initial state cho auth slice
const initialState = {
  // Kiểm tra localStorage để xác định user đã login chưa
  isAuthenticated: !!localStorage.getItem("auth-token"), // !! convert thành boolean
  isLoading: false, // Trạng thái loading khi đang xử lý auth
  error: null, // Lưu trữ error message nếu có lỗi
}

// Async thunk để xử lý login
export const loginAsync = createAsyncThunk(
  "auth/login", // Action type prefix
  async (credentials, { rejectWithValue }) => {
    // credentials: {username, password}
    try {
      // Gọi authService để thực hiện login
      const response = await authService.login(credentials)
      // Lưu token vào localStorage để persist authentication
      localStorage.setItem("auth-token", response.token)
      // Lưu user data vào localStorage
      localStorage.setItem("current-user", JSON.stringify(response.user))
      // Return user data để update state
      return response.user
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Login failed")
    }
  },
)

// Async thunk để xử lý registration
export const registerAsync = createAsyncThunk(
  "auth/register", // Action type prefix
  async (userData, { rejectWithValue }) => {
    // userData: {username, email, password, fullName}
    try {
      // Gọi authService để thực hiện registration
      const response = await authService.register(userData)
      // Lưu token vào localStorage
      localStorage.setItem("auth-token", response.token)
      // Lưu user data vào localStorage
      localStorage.setItem("current-user", JSON.stringify(response.user))
      // Return user data để update state
      return response.user
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Registration failed")
    }
  },
)

// Async thunk để xử lý logout
export const logoutAsync = createAsyncThunk(
  "auth/logout", // Action type prefix
  async (_, { rejectWithValue }) => {
    // Không cần parameters
    try {
      // Gọi authService để thực hiện logout (có thể gọi API để invalidate token)
      await authService.logout()
      // Xóa token khỏi localStorage
      localStorage.removeItem("auth-token")
      // Xóa user data khỏi localStorage
      localStorage.removeItem("current-user")
    } catch (error) {
      // Nếu có lỗi, reject với error message
      return rejectWithValue(error.message || "Logout failed")
    }
  },
)

// Tạo auth slice với createSlice
export const authSlice = createSlice({
  name: "auth", // Tên của slice
  initialState, // Initial state đã định nghĩa ở trên
  // Synchronous reducers
  reducers: {
    // Action để clear error message
    clearError: (state) => {
      state.error = null
    },
    // Action để set authentication status manually
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload // true/false
    },
  },
  // Extra reducers để handle async thunks
  extraReducers: (builder) => {
    builder
      // Handle login async thunk
      .addCase(loginAsync.pending, (state) => {
        // Khi login đang pending
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state) => {
        // Khi login thành công
        state.isLoading = false
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action) => {
        // Khi login thất bại
        state.isLoading = false
        state.isAuthenticated = false
        state.error = action.payload // Error message từ rejectWithValue
      })
      // Handle register async thunk
      .addCase(registerAsync.pending, (state) => {
        // Khi register đang pending
        state.isLoading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state) => {
        // Khi register thành công
        state.isLoading = false
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerAsync.rejected, (state, action) => {
        // Khi register thất bại
        state.isLoading = false
        state.isAuthenticated = false
        state.error = action.payload // Error message từ rejectWithValue
      })
      // Handle logout async thunk
      .addCase(logoutAsync.fulfilled, (state) => {
        // Khi logout thành công (không cần handle pending và rejected)
        state.isAuthenticated = false
        state.error = null
      })
  },
})

// Export các action creators
export const { clearError, setAuthenticated } = authSlice.actions
