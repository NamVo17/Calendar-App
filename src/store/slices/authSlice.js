import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authService } from "@/services/authService"

const initialState = {
  isAuthenticated: !!localStorage.getItem("auth-token"), 
  isLoading: false, 
  error: null, 
}

export const loginAsync = createAsyncThunk(
  "auth/login", 
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem("auth-token", response.token)
      localStorage.setItem("current-user", JSON.stringify(response.user))
      return response.user
    } catch (error) {
      return rejectWithValue(error.message || "Login failed")
    }
  },
)

export const registerAsync = createAsyncThunk(
  "auth/register", 
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      localStorage.setItem("auth-token", response.token)
      localStorage.setItem("current-user", JSON.stringify(response.user))
      return response.user
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed")
    }
  },
)

export const logoutAsync = createAsyncThunk(
  "auth/logout", 
  async (_, { rejectWithValue }) => {
    
    try {
      await authService.logout()
      localStorage.removeItem("auth-token")
      localStorage.removeItem("current-user")
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed")
    }
  },
)

export const authSlice = createSlice({
  name: "auth", 
  initialState, 
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload // true/false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.error = action.payload 
      })
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.error = action.payload 
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, setAuthenticated } = authSlice.actions
